package shoes_management.shoe_backend.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import shoes_management.shoe_backend.Entity.Users;

import java.util.Optional;

public interface UserRepository extends JpaRepository<Users, String> {
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    Optional<Users> findByUsernameAndPassword(String username, String password);
    Optional<Users> findByEmailAndPassword(String email, String password);
    Optional<Users> findByEmail(String email);
}
