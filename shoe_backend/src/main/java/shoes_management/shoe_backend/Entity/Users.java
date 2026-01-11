package shoes_management.shoe_backend.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "users")

public class Users {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;
    @Size(min = 6, message = "Username must at least 6 characters")
    String username;
    String email;
    @Size(min = 4, message = "Password must at least 4 characters")
    String password;
    int role;
    String picture;
}
