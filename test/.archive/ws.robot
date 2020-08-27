Calculate TDEE
    [Tags]                 WS       tdee
    # Test Data
    set test variable        ${gender}          MALE
    set test variable        ${age}             27
    set test variable        ${weight}          80
    set test variable        ${length}          180
    set test variable        ${goal}            MUSCLE_GROWTH
    set test variable        ${activityLevel}   HIGH
    # Sent the request & assert
    ${response}=        send GET request   ${BACKEND_URL}/calc?gender=${gender}&length=${length}&weight=${weight}&age=${age}&activityLevel=${activityLevel}&goal=${goal}     expected_status=200
    assert JSON         ${response}         $.bmr                                       1885      
    assert JSON         ${response}         $.macronutrients.carbohydrates.gram         339      
    assert JSON         ${response}         $.macronutrients.carbohydrates.kcal         1354      
    assert JSON         ${response}         $.macronutrients.carbohydrates.percentage   50      
    assert JSON         ${response}         $.macronutrients.fat.gram                   80       
    assert JSON         ${response}         $.macronutrients.fat.kcal                   720       
    assert JSON         ${response}         $.macronutrients.fat.percentage             27       
    assert JSON         ${response}         $.macronutrients.protein.gram               160       
    assert JSON         ${response}         $.macronutrients.protein.kcal               640       
    assert JSON         ${response}         $.macronutrients.protein.percentage         24
    assert JSON         ${response}         $.tdee                                      2714

Calculate BMI for an {DATATAG} person
    [Tags]                      WS       bmi
    # Test Data
    Data tags                   healthy     overweight      underweight
    ${weight}=  data row        80          100             60
    ${length}=  data row        180         160             200
    ${expected_bmi}=  data row  25          39              15
    # Test Script
    ${body}=                    create dictionary   
    ...                         weight=${weight}
    ...                         length=${length}
    ${response}=                Send GET request  ${BACKEND_URL}/calc/bmi?&length=${length}&weight=${weight}  expected_status=200
    should be equal             '${response}'       '${expected_bmi}'
    ...                         Assertion failed. Expected the BMI response to be "25". Actual: "${response}".

Send wrong POST request and assert the status
    [Tags]                 WS       tdee
    [Documentation]                         Wrong gender given. Return status should be equal to 500
    # Sent the request & assert
    ${response}=        send GET request   ${BACKEND_URL}/calc/all?gender=nogender&length=80&weight=180&activityLevel=LOW&goal=FAT_LOSS         expected_status=404    