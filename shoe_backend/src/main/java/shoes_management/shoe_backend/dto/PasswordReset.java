package shoes_management.shoe_backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PasswordReset {
    private String email;
    @NotBlank
    private String otp;
    private String newPassword;
}
