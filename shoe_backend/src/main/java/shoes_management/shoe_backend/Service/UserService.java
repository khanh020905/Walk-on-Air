package shoes_management.shoe_backend.Service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import shoes_management.shoe_backend.Entity.Users;
import shoes_management.shoe_backend.Exception.AppException;
import shoes_management.shoe_backend.Exception.ErrorCode;
import shoes_management.shoe_backend.Repository.UserRepository;
import shoes_management.shoe_backend.dto.UserRequest;

import java.util.Collections;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private MailService mailService;
    @Autowired
    private OtpService otpService;
    @Value("${GOOGLE_CLIENT_ID}")
    private String GOOGLE_CLIENT_ID;

    public Users register(UserRequest userRequest) {
        boolean isExistsByUsername = userRepository.existsByUsername(userRequest.getUsername());
        boolean isExistsByEmail = userRepository.existsByEmail(userRequest.getEmail());

        if (isExistsByUsername) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        if (isExistsByEmail) {
            throw new AppException(ErrorCode.EMAIL_EXISTED);
        }

        Users user = Users.builder()
                .username(userRequest.getUsername())
                .email(userRequest.getEmail())
                .password(userRequest.getPassword())
                .role(2)
                .picture(
                        "https://res.cloudinary.com/drbm6gikx/image/upload/v1765421864/user-account-black-and-white-symbol-microsoft_ghl36j.jpg")
                .build();

        return userRepository.save(user);
    }

    public Users registerGoogleUser(String email, String username, String avt) {

        Users user = Users.builder()
                .username(username)
                .email(email)
                .password("GOOGLE_USER")
                .role(2)
                .picture(avt)
                .build();

        return userRepository.save(user);
    }

    public Users login(UserRequest userRequest) {
        Optional<Users> userOptional = Optional.empty();

        if (userRequest.getUsername() != null && !userRequest.getUsername().isEmpty()) {
            userOptional = userRepository.findByUsernameAndPassword(
                    userRequest.getUsername(),
                    userRequest.getPassword());
        }

        if (userOptional.isEmpty() && userRequest.getUsername() != null) {
            userOptional = userRepository.findByEmailAndPassword(
                    userRequest.getUsername(),
                    userRequest.getPassword());
        }

        return userOptional.orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTS));
    }

    public Users authenticateGoogleUser(String token) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(),
                    new JacksonFactory())
                    .setAudience(Collections.singletonList(GOOGLE_CLIENT_ID))
                    .build();

            GoogleIdToken idToken = verifier.verify(token);

            if (idToken == null) {
                throw new RuntimeException("Invalid Google Token");
            }

            GoogleIdToken.Payload payload = idToken.getPayload();
            String username = (String) payload.get("name");
            String email = payload.getEmail();
            String avt = (String) payload.get("picture");

            return userRepository.findByEmail(email).orElseGet(() -> registerGoogleUser(email, username, avt));

        } catch (Exception e) {
            throw new AppException(ErrorCode.GOOGLE_AUTHENTICATION_ERROR);
        }
    }

    public void sendForgotPasswordOtp(String mail) {
        Users user = userRepository.findByEmail(mail).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTS));

        String subject = "Reset Password Otp:";
        String otp = otpService.generateOtp();
        String body = "Your verification code is: " + otp;

        otpService.storeOtp(mail, otp);
        mailService.sendMail(mail, subject, body);
    }

    public void verifyOtp(String mail, String otp) {
        boolean isValid = otpService.checkOtp(mail, otp);

        if (!isValid) {
            throw new RuntimeException("Invalid or expired OTP");
        }
    }

    public void resetPassword(String email, String otp, String newPassword) {
        boolean isValid = otpService.validateOtp(email, otp);

        if (!isValid) {
            throw new RuntimeException("Invalid or Expired OTP");
        }

        Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTS));

        user.setPassword(newPassword);
        userRepository.save(user);
    }
}
