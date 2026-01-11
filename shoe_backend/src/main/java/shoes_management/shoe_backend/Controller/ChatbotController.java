package shoes_management.shoe_backend.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import shoes_management.shoe_backend.Service.GeminiService;
import shoes_management.shoe_backend.dto.ApiResponse;
import shoes_management.shoe_backend.dto.ChatbotRequest;

@RestController
@RequestMapping("/api/chatbot")
@CrossOrigin("http://localhost:3000")
public class ChatbotController {
    @Autowired
    private GeminiService geminiService;

    @PostMapping()
    public String getChatResponse(@RequestBody ChatbotRequest request) {
        return geminiService.getChatResponse(request.getMessage());
    }
}
