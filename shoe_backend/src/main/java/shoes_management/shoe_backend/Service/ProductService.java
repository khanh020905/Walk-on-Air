package shoes_management.shoe_backend.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import shoes_management.shoe_backend.dto.ProductRequest;
import shoes_management.shoe_backend.Entity.Product;

import shoes_management.shoe_backend.Repository.ProductRepository;
import shoes_management.shoe_backend.Exception.AppException;
import shoes_management.shoe_backend.Exception.ErrorCode;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    public Product addProduct(ProductRequest request) {
        Product product = new Product();
        product.setName(request.getName());
        product.setMainCategory(request.getMainCategory());
        product.setCategory(request.getCategory());
        product.setPrice(request.getPrice());
        product.setOriginalPrice(request.getOriginalPrice());
        product.setBadge(request.getBadge());
        product.setBadgeColor(request.getBadgeColor());
        product.setImageUrl(request.getImageUrl());
        product.setFavorite(request.isFavorite());
        product.setSize(request.getSize());

        if (product.getPrice() < 0) {
            throw new AppException(ErrorCode.PRODUCT_PRICE_INVALID);
        }
        return productRepository.save(product);
    }

    public List<Product> addProducts(List<ProductRequest> list) {
        List<Product> products = new ArrayList<>();
        for (ProductRequest p : list) {
            Product product = new Product();
            product.setName(p.getName());
            product.setMainCategory(p.getMainCategory());
            product.setCategory(p.getCategory());
            product.setPrice(p.getPrice());
            product.setOriginalPrice(p.getOriginalPrice());
            product.setBadge(p.getBadge());
            product.setBadgeColor(p.getBadgeColor());
            product.setImageUrl(p.getImageUrl());
            product.setFavorite(p.isFavorite());
            product.setSize(p.getSize());
            products.add(product);
        }
        return productRepository.saveAll(products);
    }

    public Page<Product> getFilteredProducts(String mainCategory, String category, Float size,
            Double minPrice, Double maxPrice, Boolean favorite, String badge,
            int pageNo, int pageSize, String sortBy, String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);

        String dbCategory = (category != null && !category.equalsIgnoreCase("All") && !category.isEmpty())
                ? category
                : null;

        return productRepository.findFilteredProducts(mainCategory, dbCategory, size, minPrice, maxPrice, favorite,
                badge,
                pageable);
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public void updateFavorite(Long id, boolean favorite) {
        Optional<Product> optionalProduct = productRepository.findById(id);
        if (optionalProduct.isPresent()) {
            Product product = optionalProduct.get();
            product.setFavorite(favorite);
            productRepository.save(product);
        } else {
            throw new AppException(ErrorCode.PRODUCT_NOT_FOUND);
        }
    }
}
