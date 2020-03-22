import unittest
import sys
import os
import pathlib
filepath = str(pathlib.Path(__file__).parent.absolute())
runpath = filepath + '/../app'
runpath = os.path.normpath(runpath)
sys.path.append(runpath)
#from logic.person import Person
from logic.person import *

class Calculator_test(unittest.TestCase):
    def test_03(self):
        print("Test 03 - BMI calculation")
        bmi = Calculator.calculate_bmi(weight=80,length=180)
        self.assertEqual(bmi, 25)
    
    def test_04(self):
        print("Test 04 - FFM calculation")
        ffm = Calculator.calculate_ffm(weight=100, body_fat_perc=20)
        self.assertEqual(ffm, 80)

class Person_test(unittest.TestCase):
    def test_01(self):
        print("Test 01 - BMR calculation")
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
        print("Test 02 - TDEE calculation")
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