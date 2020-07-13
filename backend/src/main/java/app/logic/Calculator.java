package app.logic;

import app.logic.Person.ActivityLevel;
import app.logic.Person.Goal;
import app.logic.Person.Gender;

import java.util.Map;

public interface Calculator{

    static int calculateBMI(int length, int weight){
        return Math.round(weight / ((length/100f) * (length/100f)));
    }

    static int calculateFFM(int weight, int fatPercentage){
        return Math.round((weight * (1 - fatPercentage / 100.0f)));
    }

    static int calculateBMR(Gender gender, int weight, int length, int age){
        int bmr = 0;
        switch (gender){
            case MALE:
                bmr = Math.round((66.5f + (13.75f * weight) + (5.003f * length) - (6.755f * age)));
                break;
            case FEMALE:
                bmr = Math.round(665.1f + (9.563f * weight) + (1.850f * length) - (4.676f * age));
                break;
        }
        return bmr;
    }     

    static int calculateTDEE(int bmr, ActivityLevel activityLevel, Goal goal){
        float goalFactor = 0;
        switch (activityLevel){
            case LOW:
                goalFactor = 0.8f;
                break;
            case MEDIUM:
                goalFactor = 1f;
                break;
            case HIGH:
                goalFactor = 1.2f;
                break;
        }
        float activityLevelFactor = 0;
        switch (goal){
            case FAT_LOSS:
                activityLevelFactor = 0.8f;
                break;
            case MAINTENANCE:
                activityLevelFactor = 1f;
                break;
            case MUSCLE_GROWTH:
                activityLevelFactor = 1.2f;
                break;
        }
        return Math.round(((bmr * activityLevelFactor) * goalFactor));
    }

    static Map calculateMacros(int weight, int tdee){
        // Protein
        int proteinGram = Math.round(weight * 2);
        int proteinKcal = Math.round(proteinGram * 4);
        int proteinPerc = Math.round(100f * proteinKcal / tdee);
        Map <String, Integer> protein = Map.of(
                "gram", proteinGram,
                "kcal", proteinKcal,
                "percentage", proteinPerc
        );
        // Fat
        int fatGram = weight;
        int fatKcal = Math.round(fatGram * 9);
        int fatPerc = Math.round(100f * fatKcal / tdee);
        Map <String, Integer> fat = Map.of(
                "gram", fatGram,
                "kcal", fatKcal,
                "percentage", fatPerc
        );
        // Carbs
        int carbKcal = Math.round(tdee - (proteinKcal + fatKcal));
        int carbGram = Math.round(carbKcal / 4f);
        int carbPerc = Math.round(100f * carbKcal / tdee);
        Map<String, Integer> carbohydrates = Map.of(
                "kcal", carbKcal,
                "gram", carbGram,
                "percentage", carbPerc
        );
        return Map.of(
                "protein", protein,
                "fat", fat,
                "carbohydrates", carbohydrates
        );

    }
}