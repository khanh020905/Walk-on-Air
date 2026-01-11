package shoes_management.shoe_backend.Exception;

import lombok.Getter;

@Getter
public enum ErrorCode {

    UNCATEGORIZE_EXCEPTION(9999, "Uncategorized Exception"),
    USER_EXISTED(1001, "User already exists"),
    EMAIL_EXISTED(1002, "Email already exists"),
    EMAIL_NOT_EXISTED(1002, "Email not exists"),
    USERNAME_INVALID(1003, "Username must at least 6 characters"),
    PASSWORD_INVALID(1004, "Password must at least 4 characters"),
    INVALID_KEY(1005, "Invalid message key"),
    USER_NOT_EXISTS(1006, "Invalid username or password"),
    GOOGLE_AUTHENTICATION_ERROR(1007, "Google Authentication Error"),
    PRODUCT_PRICE_INVALID(1008, "Product price must be greater than 0"),
    PRODUCT_NOT_FOUND(1009, "Product not found"),
    ;

    private int code;
    private String message;

    ErrorCode(int code, String message) {
        this.code = code;
        this.message = message;
    }
}
