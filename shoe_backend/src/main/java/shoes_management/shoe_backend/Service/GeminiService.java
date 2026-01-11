package shoes_management.shoe_backend.Service;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class GeminiService {
    @Value("${GOOGLE_GEMINI_API_KEY}")
    private String apiKey;

    @Value("${GOOGLE_GEMINI_URL}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final Gson gson = new Gson();

    public String getChatResponse(String userMessage) {
        String url = apiUrl + "?key=" + apiKey;

        String systemInstruction = """
                You are a helpful sales assistant for a shoe store called 'Walk on Air'.
                You help customers find running, trail, and lifestyle shoes.
                Be polite, concise, and encourage them to buy, dont't answer anything else except the main content about shoes.
                I have four main categories: Running, Life Style, Training, Walking, Trail.
                """;

        String combinedMessage = systemInstruction + "\n\nUser asked: " + userMessage;

        JsonObject part = new JsonObject();
        part.addProperty("text", combinedMessage);

        JsonArray parts = new JsonArray();
        parts.add(part);

        JsonObject content = new JsonObject();
        content.add("parts", parts);

        JsonArray contents = new JsonArray();
        contents.add(content);

        JsonObject root = new JsonObject();
        root.add("contents", contents);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        try {
            String jsonPayload = gson.toJson(root);

            HttpEntity<String> entity = new HttpEntity<>(jsonPayload, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

            System.out.println("Status Code: " + response.getStatusCode());
            System.out.println("Raw Response: " + response.getBody());

            JsonObject responseJson = JsonParser.parseString(response.getBody()).getAsJsonObject();

            if (responseJson.has("error")) {
                String errMsg = responseJson.get("error").getAsJsonObject().get("message").getAsString();
                System.err.println("Google API Error: " + errMsg);
                return "System Error: " + errMsg;
            }

            if (!responseJson.has("candidates") || responseJson.getAsJsonArray("candidates").size() == 0) {
                return "I'm sorry, I cannot answer that question.";
            }

            return responseJson.getAsJsonArray("candidates").get(0).getAsJsonObject()
                    .getAsJsonObject("content").getAsJsonArray("parts").get(0).getAsJsonObject()
                    .get("text").getAsString();

        } catch (Exception e) {
            e.printStackTrace();
            return "Sorry, I am having trouble connecting. Error: " + e.getMessage();
        }
    }
}