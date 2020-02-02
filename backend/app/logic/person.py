from logic import calculator

class Person():
    def __init__(self, name='bas', age=20, gender='man', weight=80, activitylevel='Vigorously active', goal='Fat loss', length=180, level='Intermediate', body_fat_perc=15):
    # def __init__(self, name, age, gender, weight, activitylevel, goal, length, level, bodyfatPerc):
        self.age = int(age)
        self.gender = gender.lower()
        self.weight = int(weight)
        self.activitylevel = activitylevel
        self.goal = goal
        self.level = level
        self.length = int(length)
        self.body_fat_perc = int(body_fat_perc)
        # Factors
        self.goal_factor = self.determine_goal_factor(self.goal)
        self.activitylevel_factor = self.determine_activitylevel_factor(self.activitylevel)
        # Calculations
        self._bmr = calculator.calculate_bmr(self.gender, self.weight, self.length, self.age)
        self._tdee = calculator.calculate_tdee(self.bmr, self.activitylevel_factor, self.goal_factor)
        self.bmi = calculator.calculate_bmi(self.weight, self.length)
        self.ffm = calculator.calculate_ffm(self.weight, self.body_fat_perc)
        self.macros = calculator.calculate_macronutrients(self.weight, self.tdee)
    
    # TOOD create getters and setters for BMI, VVM, FFMI

    @property
    def bmr(self):
        return self._bmr
    
    @bmr.setter
    def bmr(self, value):
        raise AttributeError("It is not allowed to set BMR")

    @property
    def tdee(self):
        return self._tdee

    @tdee.setter
    def tdee(self, value):
        raise AttributeError("It is not allowed to set TDEE")

    ######################
    # Strings to factors
    ######################

    def determine_deficit_factor(self, level):
        switcher = {
            'Beginner':0.7,
            'Intermediate':0.8,
            'Advanced':0.9
        }
        return switcher.get(level, "Invalid level (deficit)")
    
    def determine_surplus_factor(self, level):
        switcher = {
            'Beginner':1.2,
            'Intermediate':1.1,
            'Advanced':1.05
        }
        return switcher.get(level, "Invalid level (surplus)")
    
    def determine_goal_factor(self, goal):
        switcher = {
            'Fat loss':0.8,
            'Maintenance':1,
            'Muscle gain':1.2
        }
        return switcher.get(goal, "Invalid goal")

        # if goal == 'Fat loss':
        #     return self.determine_deficit(self.level)
        # elif goal == 'Maintenance':
        #     return 1
        # elif goal == 'Muscle gain':
        #     return self.determine_deficit(self.level)
        # else:
        #     raise ValueError("Invalid goal")
    
    def determine_activitylevel_factor(self, activitylevel):
        switcher = {
            'Sedentary or light activity':1.53,
            'Active or moderately active':1.75,
            'Vigorously active':2.25
        }
        return switcher.get(activitylevel, "Invalid activity level")