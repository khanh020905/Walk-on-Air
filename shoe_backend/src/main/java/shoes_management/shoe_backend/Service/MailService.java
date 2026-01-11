package shoes_management.shoe_backend.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import shoes_management.shoe_backend.Entity.Order;
import shoes_management.shoe_backend.Entity.OrderItem;

@Service
public class MailService {
    @Autowired
    private JavaMailSender javaMailSender;

    public void sendMail(String toEmail, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("lenguyenquockhanh57@gmail.com");
        message.setSubject(subject);
        message.setText(body);
        message.setTo(toEmail);

        javaMailSender.send(message);
        System.out.println("mail sent to: " + toEmail);
    }

    public void sendBill(String toEmail, Order order) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom("lenguyenquockhanh57@gmail.com");
            helper.setTo(toEmail);
            helper.setSubject("Your Shoe Store Invoice - Order #" + order.getOrder_id());

            StringBuilder htmlMsg = new StringBuilder();
            htmlMsg.append("<h1>Thank you for your purchase!</h1>");
            htmlMsg.append("<p>Here is your order summary:</p>");
            htmlMsg.append("<table border='1'><tr><th>Shoe</th><th>Qty</th><th>Price</th></tr>");

            for (OrderItem item : order.getOrderItems()) {
                htmlMsg.append("<tr>");
                htmlMsg.append("<td>").append(item.getProduct().getName()).append("</td>");
                htmlMsg.append("<td>").append(item.getQuantity()).append("</td>");
                htmlMsg.append("<td>$").append(item.getPrice()).append("</td>");
                htmlMsg.append("</tr>");
            }
            htmlMsg.append("</table>");
            htmlMsg.append("<h3>Total: $").append(order.getTotal_amount()).append("</h3>");

            helper.setText(htmlMsg.toString(), true);
            javaMailSender.send(message);
        } catch (MessagingException e) {
            System.out.println(e.getMessage());
        }
    }
}
