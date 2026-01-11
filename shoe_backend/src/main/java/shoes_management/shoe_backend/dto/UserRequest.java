package shoes_management.shoe_backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder // Recommended for easier testing
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserRequest {
    @Size(min = 6, message = "USERNAME_INVALID")
    String username;

    @Email(message = "INVALID_KEY")
    String email;

    @Size(min = 4, message = "PASSWORD_INVALID")
    String password;
}