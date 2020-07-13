package app.logic;

import java.util.Map;

public class Person{

    public enum Gender {
        MALE,
        FEMALE
    }
    public enum ActivityLevel {
        LOW,
        MEDIUM,
        HIGH
    }
    public enum Goal {
        FAT_LOSS,
        MAINTENANCE,
        MUSCLE_GROWTH,
    }

    public Person(Gender gender, int length, int weight, int age, ActivityLevel activityLevel, Goal goal){
        this.gender = gender;
        this.length = length;
        this.weight = weight;
        this.age = age;
        this.activityLevel = activityLevel;
        this.goal = goal;
        init();
    }

    private Gender gender;
    private int length;
    private int weight;
    private int age;
    private int bmi;
    private int bmr;
    private ActivityLevel activityLevel;
    private Goal goal;
    private int tdee;
    private Map macronutrients;

    private void init(){
        this.bmi = Calculator.calculateBMI(this.length, this.weight);
        this.bmr = Calculator.calculateBMR(this.gender, this.weight, this.length, this.age);
        this.tdee = Calculator.calculateTDEE(this.bmr, this.activityLevel, this.goal);
        this.macronutrients = Calculator.calculateMacros(this.weight, this.tdee);
    }

    // Getters
    public Gender getGender(){return this.gender;}
    public int getLength(){
        return this.length;
    }
    public int getWeight(){
        return this.weight;
    }
    public int getAge(){
        return this.age;
    }
    public int getBMI(){
        return this.bmi;
    }
    public int getBMR(){
        return this.bmr;
    }
    public ActivityLevel getActivityLevel(){
        return this.activityLevel;
    }
    public Goal getGoal(){
        return this.goal;
    }
    public int getTDEE(){
        return this.tdee;
    }
    public Map getMacronutrients(){return this.macronutrients;}

    // Setters
    public void setLength(int length){
        this.length = length;
        init();
    }
    public void setWeight(int weight){
        this.weight = weight;
        init();
    }
    public void setAge(int age){
        this.age = age;
        init();
    }
    public void setActivityLevel(ActivityLevel activitylevel){
        this.activityLevel = activitylevel;
        init();
    }
    public void setGoal(Goal goal){
        this.goal = goal;
        init();
    }
}