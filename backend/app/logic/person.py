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
        self._bmr = Calculator.calculate_bmr(self.gender, self.weight, self.length, self.age)
        self._tdee = Calculator.calculate_tdee(self.bmr, self.activitylevel_factor, self.goal_factor)
        self.bmi = Calculator.calculate_bmi(self.weight, self.length)
        self.ffm = Calculator.calculate_ffm(self.weight, self.body_fat_perc)
        self.macros = Calculator.calculate_macronutrients(self.weight, self.tdee)
    
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
    

class Calculator():

    @staticmethod
    def calculate_bmr(gender, weight, length, age):
        if gender.lower() == 'man':
            bmr = 66.5 + ( 13.75 * weight ) + ( 5.003 * length ) - ( 6.755 * age )
        elif gender.lower() == 'woman':
            bmr = 665.1 + ( 9.563 * weight ) + ( 1.850 * length ) - ( 4.676 * age )
        else:
            raise Exception ("Error: expected gender to be 'woman' or 'man'. Actual: '{}'".format(gender))
        return round(bmr)

    @staticmethod
    def calculate_tdee(bmr, activity_level_factor, goal_factor):
        tdee = (bmr * activity_level_factor) * goal_factor
        return round(tdee)

    @staticmethod
    def calculate_macronutrients(weight, tdee):
        # Protein
        protein_gr = round(weight * 2)
        protein_kcal = round(protein_gr * 4)
        protein_perc = round(100 * protein_kcal / tdee)
        # Fat
        fat_gram = round(weight)
        fat_kcal = round(fat_gram * 9)
        fat_perc = round(100 * fat_kcal / tdee)
        # Carbs
        carb_kcal = round(tdee - (protein_kcal + fat_kcal))
        carb_gram = round(carb_kcal / 4)
        carb_perc = round(100 * carb_kcal / tdee)
        macronutrients = {'protein_gr':protein_gr, 'protein_kcal':protein_kcal, 'protein_perc':protein_perc, \
                'fat_gram':fat_gram, 'fat_kcal':fat_kcal, 'fat_perc':fat_perc, \
                'carb_kcal':carb_kcal, 'carb_gram':carb_gram, 'carb_perc':carb_perc}
        return macronutrients

    @staticmethod
    def calculate_bmi(weight, length):
        bmi = weight/((length/100)*(length/100))
        return round(bmi)

    @staticmethod
    def calculate_ffm(weight, body_fat_perc):
        percentage = (100-body_fat_perc)/100
        ffm = weight-(weight*percentage)
        return round(ffm)