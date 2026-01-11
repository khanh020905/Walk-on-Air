package shoes_management.shoe_backend.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import shoes_management.shoe_backend.Entity.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {

}
// Force Recompile
