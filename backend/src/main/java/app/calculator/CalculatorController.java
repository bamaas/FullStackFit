package app.calculator;
import org.springframework.web.bind.annotation.*;
import javax.servlet.http.HttpServletResponse;

@RestController
public class CalculatorController {

    @CrossOrigin
    @GetMapping("/calc")
    public User calc(@RequestParam("gender") User.Gender gender,
                     @RequestParam("length") int length,
                     @RequestParam("weight") int weight,
                     @RequestParam("age") int age,
                     @RequestParam("activityLevel") User.ActivityLevel activityLevel,
                     @RequestParam("goal") User.Goal goal){
        return new User(gender, length, weight, age, activityLevel, goal);
    }

    @GetMapping("/calc/ffm")
    public int ffm(@RequestParam int weight, @RequestParam int fatPercentage){
        return CalculatorService.calculateFFM(weight, fatPercentage);
    }

    @GetMapping("/calc/bmi")
    public int bmi(@RequestParam int length, @RequestParam int weight){
        return CalculatorService.calculateBMI(length, weight);
    }

    @GetMapping("/api")
    public void swaggerRedirect(HttpServletResponse response) {
        response.setHeader("Location", "/swagger-ui.html");
        response.setStatus(302);
    }
}