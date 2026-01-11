package shoes_management.shoe_backend.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Entity
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long id;
    String name;
    @Column(name = "main_category")
    String mainCategory;
    String category;
    Double price;
    @Column(name = "original_price")
    Double originalPrice;
    String badge;
    @Column(name = "badge_color")
    String badgeColor;
    @Column(name = "image_url")
    String imageUrl;
    @Column(name = "is_favorite")
    boolean isFavorite;
    Float size;
}
