class Person(object):
    def __init__(self, name='bas', age=20, gender='man', weight=80, activitylevel='Vigorously active', goal='Fat loss', length=180, level='Intermediate', bodyfatPerc=15):
        self.age = int(age)
        self.gender = gender
        self.weight = int(weight)
        self.activitylevel = activitylevel
        self.goal = goal
        self.level = level
        self.length = int(length)
        self.goalFactor = self.determine_goalFactor(self.goal)
        self.activitylevelFactor = self.determine_activitylevelFactor(self.activitylevel)
        self._bmr = self.calculate_bmr()
        self._tdee = self.calculate_tdee()
        self.calculate_macros()
        self.bmi = self.calculate_bmi()
        self.bodyfatPerc = int(bodyfatPerc)
        self.vvm = self.calculate_vvm()

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

    def calculate_bmr(self):
        if self.gender == 'man':
            bmr = 66.5 + ( 13.75 * self.weight ) + ( 5.003 * self.length ) - ( 6.755 * self.age )
        elif self.gender == 'woman':
            bmr = 665.1 + ( 9.563 * self.weight ) + ( 1.850 * self.length ) - ( 4.676 * self.age )
        else:
            raise Exception ("Error: expected gender to be 'woman' or 'man'. Actual: '{}'".format(self.gender))
        return round(bmr)
    
    def determine_goalFactor(self, goal):
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
    
    def determine_activitylevelFactor(self, activitylevel):
        switcher = {
            'Sedentary or light activity':1.53,
            'Active or moderately active':1.75,
            'Vigorously active':2.25
        }
        return switcher.get(activitylevel, "Invalid activity level")

    def calculate_tdee(self):
        tdee = round((self.bmr * self.activitylevelFactor) * self.goalFactor)
        return tdee

    def calculate_bmi(self):
        bmi = round(self.weight/((self.length/100)*(self.length/100)))
        return bmi

    def calculate_vvm(self):
        percentage = (100-self.bodyfatPerc)/100
        vvm = round(self.weight-(self.weight*percentage))
        return vvm
    
    def calculate_macros(self):
        # Protein
        self.proteinReqGram = round(self.weight * 2)
        self.proteinReqKcal = round(self.proteinReqGram * 4)
        self.proteinReqPerc = round(100 * self.proteinReqKcal / self.tdee)
        # Fat
        self.fatReqGram = round(self.weight)
        self.fatReqKcal = round(self.fatReqGram * 9)
        self.fatReqPerc = round(100 * self.fatReqKcal / self.tdee)
        # Carbs
        self.carbReqKcal = round(self.tdee - (self.proteinReqKcal + self.fatReqKcal))
        self.carbReqGram = round(self.carbReqKcal / 4)
        self.carbReqPerc = round(100 * self.carbReqKcal / self.tdee)
    
    def determine_deficit(self, level):
        switcher = {
            'Beginner':0.7,
            'Intermediate':0.8,
            'Advanced':0.9
        }
        return switcher.get(level, "Invalid level (deficit)")
    
    def determine_surplus(self, level):
        switcher = {
            'Beginner':1.2,
            'Intermediate':1.1,
            'Advanced':1.05
        }
        return switcher.get(level, "Invalid level (surplus)")

    # def macro_preset(self):
        # https://damnripped.com/tdee-calculator/
    #     high_protein = {
    #         'protein':2.5
    #         'fat':1
    #     }
    #     high_carb
    #     switcher = {
    #         ''
    #     }

    

# p = Person()
# print(p.tdee)
