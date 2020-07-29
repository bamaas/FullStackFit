import unittest
import sys
import os
# The below adds the parent folder of the workspace to the sys path. 
# This way the python interperter is able to locate from app import person
# (app is child folder of backend. And backend is added to the sys path)
runpath = os.getcwd() + '/app'
            # filepath = os.path.abspath(runpath)
sys.path.append(runpath)
import person

####################################
# Run from root of backend folder
####################################

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
        john = person.Person(name=name, gender=gender, weight=weight, age=age, goal=goal, activitylevel=activitylevel, length=length)
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
        john = person.Person(name=name, gender=gender, weight=weight, age=age, goal=goal, activitylevel=activitylevel, length=length)
        self.assertEqual(john.tdee, 3478)

if __name__ == '__main__':
    unittest.main()