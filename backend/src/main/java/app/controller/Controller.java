package app.controller;

import app.logic.Calculator;
import app.logic.Person;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;

@RestController
public class Controller {

    @CrossOrigin
    @GetMapping("/calc")
    public Person calc(@RequestParam("gender") Person.Gender gender,
                       @RequestParam("length") int length,
                       @RequestParam("weight") int weight,
                       @RequestParam("age") int age,
                       @RequestParam("activityLevel") Person.ActivityLevel activityLevel,
                       @RequestParam("goal") Person.Goal goal){
        return new Person(gender, length, weight, age, activityLevel, goal);
    }

    @GetMapping("/calc/ffm")
    public int ffm(@RequestParam int weight, @RequestParam int fatPercentage){
        return Calculator.calculateFFM(weight, fatPercentage);
    }

    @GetMapping("/calc/bmi")
    public int bmi(@RequestParam int length, @RequestParam int weight){
        return Calculator.calculateBMI(length, weight);
    }

    @GetMapping("/api")
    public void swaggerRedirect(HttpServletResponse response) {
        response.setHeader("Location", "/swagger-ui.html");
        response.setStatus(302);
    }
}