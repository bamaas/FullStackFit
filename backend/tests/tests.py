import unittest
import sys
import os
import pathlib
filepath = str(pathlib.Path(__file__).parent.absolute())
runpath = filepath + '/../app'
runpath = os.path.normpath(runpath)
sys.path.append(runpath)
from logic.person import Person

class BMRcalculations(unittest.TestCase):
    def test_01(self):
        print("Test 01 - test BMR calculation")
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
        print("Test 01 - test TDEE calculation")
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