package shoes_management.shoe_backend.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import shoes_management.shoe_backend.Service.OrderService;
import shoes_management.shoe_backend.dto.ApiResponse;
import shoes_management.shoe_backend.dto.CheckoutRequest;
import shoes_management.shoe_backend.Entity.Order;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {
    @Autowired
    private OrderService orderService;

    @PostMapping("/create-order")
    public ApiResponse<Order> createOrder(@RequestBody @Validated CheckoutRequest request) {
        ApiResponse<Order> res = new ApiResponse<>();
        Order order = orderService.placeOrder(request);
        res.setCode(1000);
        res.setData(order);
        return res;
    }
}
