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