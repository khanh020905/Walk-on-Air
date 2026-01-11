package shoes_management.shoe_backend.dto;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductRequest {
    String name;
    String mainCategory;
    String category;
    Double price;
    Double originalPrice;
    String badge;
    String badgeColor;
    String imageUrl;
    boolean favorite;
    Float size;
}
