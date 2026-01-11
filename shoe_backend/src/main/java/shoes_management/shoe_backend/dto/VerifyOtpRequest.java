package shoes_management.shoe_backend.dto;

import lombok.Data;

@Data
public class VerifyOtpRequest {
    private String mail;
    private String otp;
}
