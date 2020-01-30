from app import app
from flask import Flask, request, jsonify
from app.person import Person
from app.statistics import Bodyweight
import json

DEBUG = True

@app.route('/')
def hello_world():
    return 'Backend is running! :)'

@app.route('/postjson', methods = ['POST'])
def postJsonHandler():
    content = request.get_json()
    if DEBUG is True:
        print ("Request is json:", request.is_json)
        print ("Content is:",content)
    name = content['name']
    age = content['age']
    gender = content['gender']
    weight = content['weight']
    activitylevel = content['activitylevel']
    goal = content['goal']
    length = content['length']
    #level = content['level']
    person = Person(name=name, age=age, gender=gender, weight=weight, activitylevel=activitylevel, goal=goal, length=length)
    return jsonify( \
        bmr=person.bmr, tdee=person.tdee, \
        proteinReqGram=person.proteinReqGram, proteinReqKcal=person.proteinReqKcal, proteinReqPerc=person.proteinReqPerc, \
        fatReqGram=person.fatReqGram, fatReqKcal=person.fatReqKcal, fatReqPerc=person.fatReqPerc, \
        carbReqGram=person.carbReqGram, carbReqKcal=person.carbReqKcal, carbReqPerc=person.carbReqPerc)

# @app.route('/post_bodyweight', methods = ['POST'])
# def post_bodyweight():
#     content = request.get_json()
#     if DEBUG is True:
#         print ("Request is JSON:", request.is_json)
#         print ("Content is:",content)
#     weight = content['weight']

@app.route('/get_all_bodyweight_stats', methods = ['GET'])
def get_all_bodyweight_stats():
    stats = Bodyweight.get_all(Bodyweight)
    return stats