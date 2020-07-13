import unittest
import sys
import os
import pathlib
filepath = str(pathlib.Path(__file__).parent.absolute()) + '/../app'
runpath = os.path.normpath(filepath)
sys.path.append(runpath)
from logic import Calculator
from logic import Person


class Calculator_tests(unittest.TestCase):
    def test_bmi_calculation(self):
        print("Calculator - BMI calculation")
        bmi = Calculator.calculate_bmi(weight=80,length=180)
        self.assertEqual(bmi, 25)
    
    def test_ffm_calculation(self):
        print("Calculator - FFM calculation")
        ffm = Calculator.calculate_ffm(weight=100, body_fat_perc=20)
        self.assertEqual(ffm, 80)
    
    # def test_bmr_man_calculation(self):
    #     bmr = Calculator.calculate_bmr("man", 80, 180, 20)
    #     self.assertEqual(bmr, 20)


class Person_tests(unittest.TestCase):
    def test_01(self):
        print("Person - BMR calculation")
        name = 'john'
        age = 20
        weight = 80
        gender = 'man'
        length = 180
        goal = 'Fat loss'
        activitylevel = 'Vigorously active'
        john = Person(name=name, gender=gender, weight=weight, age=age, goal=goal, activitylevel=activitylevel, length=length)
        self.assertEqual(john.bmr, 1932)
    
    def test_02(self):
        print("Person - TDEE calculation")
        name = 'john'
        age = 20
        weight = 80
        gender = 'man'
        length = 180
        goal = 'Fat loss'
        activitylevel = 'Vigorously active'
        john = Person(name=name, gender=gender, weight=weight, age=age, goal=goal, activitylevel=activitylevel, length=length)
        self.assertEqual(john.tdee, 3478)


if __name__ == '__main__':
    unittest.main()