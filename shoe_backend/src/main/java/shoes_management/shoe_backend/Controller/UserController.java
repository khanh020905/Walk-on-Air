package shoes_management.shoe_backend.Controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import shoes_management.shoe_backend.Entity.Users;
import shoes_management.shoe_backend.Service.UserService;
import shoes_management.shoe_backend.dto.*;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ApiResponse<Users> registerUser(@RequestBody @Valid UserRequest request){
        ApiResponse<Users> response = new ApiResponse<Users>();
        Users user = userService.register(request);

        response.setCode(1000);
        response.setMessage("Success");
        response.setData(user);
        return response ;
    }

    @PostMapping("/login")
    public ApiResponse<Users> login(@RequestBody @Valid UserRequest request){
        ApiResponse<Users> response = new ApiResponse();

        Users user = userService.login(request);
        response.setCode(1000);
        response.setMessage("Success");
        response.setData(user);

        return response ;
    }

    @PostMapping("/auth/google")
    public ApiResponse<Users> googleLogin(@RequestBody @Valid GoogleRequest request){
        Users user = userService.authenticateGoogleUser(request.getToken());
        ApiResponse response = new ApiResponse<Users>();

        response.setCode(1000);
        response.setMessage("Success");
        response.setData(user);

        return response;
    }

    @PostMapping("/forgot-password")
    public ApiResponse<Users> forgotPassword(@RequestParam String email){
        ApiResponse response = new ApiResponse();
        response.setCode(1000);
        response.setMessage("OTP sent successfully!");
        userService.sendForgotPasswordOtp(email);

        return response;
    }

    @PostMapping("/verify-otp")
    public ApiResponse verifyOtp(@RequestBody VerifyOtpRequest request){
        ApiResponse response = new ApiResponse();
        response.setCode(1000);
        response.setMessage("OTP Verify!");
        userService.verifyOtp(request.getMail(), request.getOtp());
        return response;
    }


    @PostMapping("/reset-password")
    public ApiResponse<Void> resetPassword(@RequestBody @Valid PasswordReset request){
        ApiResponse<Void> response = new ApiResponse<>();

        userService.resetPassword(request.getEmail(), request.getOtp(), request.getNewPassword());

        response.setCode(1000);
        response.setMessage("Password changed successfully");
        return response;
    }
}
