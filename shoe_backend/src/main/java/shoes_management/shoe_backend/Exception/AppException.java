package shoes_management.shoe_backend.Exception;

import lombok.Getter;

@Getter
public class AppException extends RuntimeException{
    private ErrorCode errorCode;

    public AppException(ErrorCode errorCode){
         super(errorCode.getMessage());
        this.errorCode = errorCode;
    }
}
