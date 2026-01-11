package shoes_management.shoe_backend.Service;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.concurrent.TimeUnit;


@Service
public class OtpService {

    private final Cache<String, String> otpCache = Caffeine.newBuilder()
            .expireAfterWrite(5, TimeUnit.MINUTES)
            .maximumSize(1000)
            .build();

    public void storeOtp(String email, String otp){
        otpCache.put(email, otp);
    }

    public boolean checkOtp(String email, String inputOtp) {
        String cacheOtp = otpCache.getIfPresent(email);
        return inputOtp != null && cacheOtp != null && inputOtp.equals(cacheOtp);
    }

    public boolean validateOtp(String email, String inputOtp) {
        String cacheOtp = otpCache.getIfPresent(email);

        if (inputOtp != null && cacheOtp != null && inputOtp.equals(cacheOtp)) {
            otpCache.invalidate(email);
            return true;
        }
        return false;
    }

    public String generateOtp(){
        String numbers = "0123456789";
        SecureRandom r = new SecureRandom();
        StringBuilder  sb = new StringBuilder();

        for (int i = 0; i < 6; i++){
            int index = r.nextInt(numbers.length());
            sb.append(numbers.charAt(index));
        }
        return sb.toString();
    }
}
