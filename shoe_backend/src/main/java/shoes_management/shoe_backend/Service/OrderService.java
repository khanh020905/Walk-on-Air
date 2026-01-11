package shoes_management.shoe_backend.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import shoes_management.shoe_backend.Repository.OrderRepository;
import shoes_management.shoe_backend.Repository.PaymentRepository;
import shoes_management.shoe_backend.Repository.ProductRepository;
import shoes_management.shoe_backend.Repository.UserRepository;
import shoes_management.shoe_backend.dto.CheckoutRequest;
import shoes_management.shoe_backend.dto.OrderItemRequest;
import shoes_management.shoe_backend.Entity.Order;
import shoes_management.shoe_backend.Entity.OrderItem;
import shoes_management.shoe_backend.Entity.Payment;
import shoes_management.shoe_backend.Entity.Product;
import shoes_management.shoe_backend.Entity.Users;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.time.LocalDateTime;

@Service
public class OrderService {
    @Autowired
    private MailService mailService;
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private PaymentRepository paymentRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProductRepository productRepository;

    @Transactional
    public Order placeOrder(CheckoutRequest request) {
        Users user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = new Order();
        order.setUser(user);
        order.setStatus("PAID");
        order.setCreated_at(new Date());

        List<OrderItem> orderItems = new ArrayList<>();
        double totalAmount = 0.0;

        for (OrderItemRequest itemRequest : request.getOrderItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setPrice(product.getPrice());

            orderItems.add(orderItem);
            totalAmount += (product.getPrice() * itemRequest.getQuantity());
        }

        order.setOrderItems(orderItems);
        order.setTotal_amount(totalAmount);

        Order savedOrder = orderRepository.save(order);

        Payment payment = new Payment();
        payment.setOrder(savedOrder);
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setAmount(totalAmount);
        payment.setPaymentDate(LocalDateTime.now());
        paymentRepository.save(payment);

        mailService.sendBill(user.getEmail(), savedOrder);

        return savedOrder;
    }
}
