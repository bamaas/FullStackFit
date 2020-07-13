import app.logic.Calculator;
import app.logic.Person;
import app.logic.Person.*;

// Test NG
import com.google.common.base.Splitter;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.util.Map;

public class TestCalculator {

    @Test
    void testBMI(){
        int bmi = Calculator.calculateBMI(180, 80);
        Assert.assertEquals(bmi, 25);
    }

    @Test
    void testFFM(){
        int ffm = Calculator.calculateFFM(100, 20);
        Assert.assertEquals(ffm, 80);
    }

    @Test
    void testBMRMan(){
        int bmr = Calculator.calculateBMR(Gender.MALE, 80, 180, 20);
        Assert.assertEquals(bmr, 1932);
    }

    @Test
    void testBMRWoman(){
        int bmr = Calculator.calculateBMR(Gender.FEMALE, 60, 160, 20);
        Assert.assertEquals(bmr, 1441);
    }

    @Test
    void testTDEE(){
        int tdee = Calculator.calculateTDEE(1932, ActivityLevel.HIGH, Goal.MAINTENANCE);
        Assert.assertEquals(tdee, 2318);
    }

    @Test
    void testMacros(){
        Map macronutrients = Calculator.calculateMacros(80, 2500);
        Assert.assertEquals(((Map) macronutrients.get("carbohydrates")).get("kcal"), 1140, "carbKcal failed");
        Assert.assertEquals(((Map) macronutrients.get("carbohydrates")).get("percentage"), 46, "carbPerc failed");
        Assert.assertEquals(((Map) macronutrients.get("carbohydrates")).get("gram"), 285, "carbGram failed");
        Assert.assertEquals(((Map) macronutrients.get("fat")).get("kcal"), 720, "fatKcal failed");
        Assert.assertEquals(((Map) macronutrients.get("fat")).get("percentage"), 29, "fatPerc failed");
        Assert.assertEquals(((Map) macronutrients.get("fat")).get("gram"), 80, "fatgram failed");
        Assert.assertEquals(((Map) macronutrients.get("protein")).get("kcal"), 640, "proteinKcal failed");
        Assert.assertEquals(((Map) macronutrients.get("protein")).get("percentage"), 26, "proteinPerc failed");
        Assert.assertEquals(((Map) macronutrients.get("protein")).get("gram"), 160, "proteinGram failed");
    }
}

