package shoes_management.shoe_backend.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

import shoes_management.shoe_backend.Entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
        @Query("SELECT p FROM Product p WHERE " +
                        "(:mainCategory IS NULL OR p.mainCategory = :mainCategory) " +
                        "AND (:category IS NULL OR p.category = :category) " +
                        "AND (:size IS NULL OR p.size = :size) " +
                        "AND (:minPrice IS NULL OR p.price >= :minPrice) " +
                        "AND (:maxPrice IS NULL OR p.price <= :maxPrice) " +
                        "AND (:favorite IS NULL OR p.isFavorite = :favorite) " +
                        "AND (:badge IS NULL OR p.badge = :badge)")
        Page<Product> findFilteredProducts(
                        @Param("mainCategory") String mainCategory,
                        @Param("category") String category,
                        @Param("size") Float size,
                        @Param("minPrice") Double minPrice,
                        @Param("maxPrice") Double maxPrice,
                        @Param("favorite") Boolean favorite,
                        @Param("badge") String badge,
                        Pageable pageable);

        Page<Product> findByMainCategory(String mainCategory, Pageable pageable);

        Optional<Product> findById(long id);
}
