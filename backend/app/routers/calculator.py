from fastapi import APIRouter
from logic import logger
from logic.person import Person
from pydantic import BaseModel
import json

router = APIRouter()

class Calculate_All(BaseModel):
    name: str
    age: str
    gender: str
    weight: str
    activitylevel: str
    goal: str
    length: str

class Calculate_BMR(BaseModel):
    age: int
    gender: str
    weight: int
    length: int

class Calculate_TDEE(BaseModel):
    bmr: int
    activity_level_factor: int
    goal_factor: int

@router.post('/calculate_all')
async def calculate_all(request: Calculate_All):
    p = Person(name=request.name, age=request.age, gender=request.gender, weight=request.weight, \
                            activitylevel=request.activitylevel, goal=request.goal, length=request.length)
    # TODO rewrite code below to something more neath.
    result = {'bmr':p.bmr,'tdee':p.tdee, 'proteinReqGram':p.macros['protein_gr'], 'proteinReqKcal':p.macros['protein_kcal'], \
            'proteinReqPerc':p.macros['protein_perc'], 'carbReqGram':p.macros['carb_gram'], 'carbReqKcal':p.macros['carb_kcal'], \
            'carbReqPerc':p.macros['carb_perc'],'fatReqKcal':p.macros['fat_kcal'], 'fatReqGram':p.macros['fat_gram'], 'fatReqPerc':p.macros['fat_perc']}
    return result

@router.post('/calculate_bmr')
async def calculate_bmr(request: Calculate_BMR):
    p = Person(age=request.age, gender=request.gender, weight=request.weight, length=request.length)
    return p.bmr

# @router.post('/calculate_tdee')
# async def calculate_tdee(request: Calculate_TDEE):
#     p = person.Person(age=request.age, gender=request.gender, weight=request.weight, length=request.length)
#     return p.bmr


# @app.route('/post_bodyweight', methods = ['POST'])
# def post_bodyweight():
#     content = request.get_json()
#     if DEBUG is True:
#         print ("Request is JSON:", request.is_json)
#         print ("Content is:",content)
#     weight = content['weight']

# @router.get('/get_all_bodyweight_stats')
# def get_all_bodyweight_stats():
#     stats = statistics.Bodyweight.get_all(Bodyweight)
#     return stats