package shoes_management.shoe_backend.Exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.resource.NoResourceFoundException;
import shoes_management.shoe_backend.dto.ApiResponse;

@ControllerAdvice
public class GlobalException {

    // 1. Handle Custom Logic Errors (e.g. User Existed)
    @ExceptionHandler(value = AppException.class)
    public ResponseEntity<ApiResponse> handleAppException(AppException e) {
        ErrorCode errorCode = e.getErrorCode();
        ApiResponse response = new ApiResponse();
        response.setCode(errorCode.getCode());
        response.setMessage(errorCode.getMessage());
        return ResponseEntity.badRequest().body(response);
    }

    // 2. Handle Validation Errors (e.g. Password too short - Error 400)
    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse> handlingValidation(MethodArgumentNotValidException exception) {
        String enumKey = exception.getFieldError().getDefaultMessage();
        ErrorCode errorCode = ErrorCode.INVALID_KEY;

        try {
            errorCode = ErrorCode.valueOf(enumKey);
        } catch (IllegalArgumentException e) {
        }

        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setCode(errorCode.getCode());
        apiResponse.setMessage(errorCode.getMessage());
        return ResponseEntity.badRequest().body(apiResponse);
    }

    // 3. Handle 404 Not Found (Optional - if you want clean JSON for wrong URLs)
    @ExceptionHandler(value = NoResourceFoundException.class)
    public ResponseEntity<ApiResponse> handleNotFoundException(NoResourceFoundException exception) {
        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setCode(404);
        apiResponse.setMessage("URL not found: " + exception.getResourcePath());
        return ResponseEntity.status(404).body(apiResponse);
    }

    // 4. Handle everything else (Crash protection - Error 500)
    @ExceptionHandler(value = Exception.class)
    public ResponseEntity<ApiResponse> handlingRuntimeException(RuntimeException exception) {
        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setCode(ErrorCode.UNCATEGORIZE_EXCEPTION.getCode());
        apiResponse.setMessage(exception.getMessage());
        return ResponseEntity.badRequest().body(apiResponse);
    }
}