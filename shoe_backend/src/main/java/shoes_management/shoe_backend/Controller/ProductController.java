package shoes_management.shoe_backend.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import shoes_management.shoe_backend.Service.ProductService;
import shoes_management.shoe_backend.dto.ApiResponse;
import shoes_management.shoe_backend.dto.ProductRequest;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.validation.annotation.Validated;
import shoes_management.shoe_backend.Entity.Product;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import java.util.List;
import java.util.Optional;
import org.springframework.web.bind.annotation.PathVariable;

import org.springframework.data.domain.Page;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {
    @Autowired
    private ProductService productService;

    @PostMapping("/create-product")
    public ApiResponse<Product> createProduct(@RequestBody @Validated ProductRequest request) {
        ApiResponse<Product> res = new ApiResponse<>();
        Product product = productService.addProduct(request);
        res.setCode(1000);
        res.setData(product);
        return res;
    }

    @PostMapping("/create-products")
    public ApiResponse<List<Product>> createProducts(@RequestBody List<ProductRequest> requests) {
        ApiResponse<List<Product>> res = new ApiResponse<>();

        res.setCode(1000);
        res.setData(productService.addProducts(requests));

        return res;
    }

    @GetMapping("")
    public ApiResponse<Page<Product>> getProducts(
            @RequestParam(required = false) String mainCategory,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Float size,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Boolean favorite,
            @RequestParam(required = false) String badge,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "12") int sizeLimit,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        ApiResponse<Page<Product>> res = new ApiResponse<>();
        res.setCode(1000);
        Page<Product> products = productService.getFilteredProducts(
                mainCategory, category, size, minPrice, maxPrice, favorite, badge, page, sizeLimit, sortBy, sortDir);
        res.setData(products);
        return res;
    }

    @GetMapping("/{id}")
    public ApiResponse<Optional<Product>> getProductById(@PathVariable Long id) {
        ApiResponse<Optional<Product>> res = new ApiResponse<>();
        Optional<Product> product = productService.getProductById(id);
        res.setCode(1000);
        if (product.isEmpty()) {
            res.setMessage("Id doesn't exists");
        } else {
            res.setData(product);
        }
        return res;
    }

    @PutMapping("/update-favorite/{id}")
    public ApiResponse<Product> updateFavorite(@PathVariable Long id, @RequestParam boolean favorite) {
        ApiResponse<Product> res = new ApiResponse<>();

        res.setCode(1000);
        productService.updateFavorite(id, favorite);
        res.setMessage("Favorite updated");

        return res;
    }
}