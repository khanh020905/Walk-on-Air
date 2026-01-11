package shoes_management.shoe_backend.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import shoes_management.shoe_backend.Entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

}
// Force Recompile
