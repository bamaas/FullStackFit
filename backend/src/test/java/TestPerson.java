import app.calculator.User;
import app.calculator.User.*;

// TestNG
import org.testng.Assert;
import org.testng.annotations.Test;
import org.testng.annotations.BeforeTest;

import java.util.Map;

public class TestPerson{

    private User john;
    private User jane;

    @BeforeTest
    public void init(){
        this.john = new User(Gender.MALE, 180, 80, 20, ActivityLevel.MEDIUM, Goal.MAINTENANCE);
        this.jane = new User(Gender.FEMALE, 160, 60, 20, ActivityLevel.MEDIUM, Goal.MAINTENANCE);
    }

    // Getters
    @Test
    void BMIMan(){
        int bmi = john.getBMI();
        Assert.assertEquals(bmi, 25);
    }

    @Test
    void BMIWoman(){
        int bmi = jane.getBMI();
        Assert.assertEquals(bmi, 23);
    }

    @Test
    void BMRMan(){
        int bmr = john.getBMR();
        Assert.assertEquals(bmr, 1932);
    }

    @Test
    void BMRWoman(){
        int bmr = jane.getBMR();
        Assert.assertEquals(bmr, 1441);
    }

    @Test
    void setLength(){
        Assert.assertNotEquals(jane.getLength(), 200);
        jane.setLength(200);
        Assert.assertEquals(jane.getLength(), 200);
    }

    @Test
    void setWeight(){
        Assert.assertNotEquals(jane.getWeight(), 45);
        jane.setWeight(45);
        Assert.assertEquals(jane.getWeight(), 45);
    }

    @Test
    void setAge(){
        Assert.assertNotEquals(jane.getAge(), 50);
        jane.setAge(50);
        Assert.assertEquals(jane.getAge(), 50);
    }

    @Test
    void getMacros(){
        Map macronutrients = john.getMacronutrients();
        Assert.assertEquals(((Map) macronutrients.get("fat")).get("gram"), 80, "carbKcal failed");
    }

    @Test
    void bmiChangedAfterNewAge(){
        int bmiBefore = john.getBMI();
        int tdeeBefore = john.getTDEE();
        int bmrBefore = john.getBMR();
        john.setAge(80);
        Assert.assertNotEquals(bmiBefore, john.getAge());
        Assert.assertNotEquals(tdeeBefore, john.getTDEE());
        Assert.assertNotEquals(bmrBefore, john.getBMR());
    }
}