*** Settings ***
Resource          ../keywords/all.robot

*** Variables ***
# The value in 'environment' is used to load the config file containing variables for the specific environment, such as the GUI_URL.
${ENVIRONMENT}                  localhost

*** Settings *** 
#Suite Setup                     load env file       ${CURDIR}/../.env
Test Teardown                   report last output message on failure

*** Test Cases ***
Calculate TDEE
    [Tags]                 WS       tdee
    # Create the body
    ${body}=            create dictionary   name=john   
    ...                                     age=20  
    ...                                     weight=80   
    ...                                     length=180  
    ...                                     goal=Fat loss   
    ...                                     activitylevel=Vigorously active    
    ...                                     gender=man
    # Sent the request & assert
    ${response}=        send POST request   ${BACKEND_URL}/calculate_all       ${body}     expected_status=200
    assert JSON         ${response}         $.bmr               1932      
    assert JSON         ${response}         $.carbReqGram       530       
    assert JSON         ${response}         $.carbReqKcal       2118      
    assert JSON         ${response}         $.carbReqPerc       61        
    assert JSON         ${response}         $.fatReqGram        80        
    assert JSON         ${response}         $.fatReqKcal        720       
    assert JSON         ${response}         $.fatReqPerc        21        
    assert JSON         ${response}         $.proteinReqGram    160       
    assert JSON         ${response}         $.proteinReqKcal    640       
    assert JSON         ${response}         $.proteinReqPerc    18
    assert JSON         ${response}         $.tdee              3478

Calculate BMR
    [Tags]                 WS       bmr
    # Test Data
    ${body}=                create dictionary   
    ...                     age=20
    ...                     gender=man
    ...                     weight=80
    ...                     length=180
    # Test Script
    ${response}=            Send POST request  ${BACKEND_URL}/calculate_bmr  ${body}  expected_status=200
    should be equal         '${response}'       '1932'
    ...                     Assertion failed. Expected the BMR response to be "1932". Actual: "${response}".

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
    ${response}=                Send POST request  ${BACKEND_URL}/calculate_bmi  ${body}  expected_status=200
    should be equal             '${response}'       '${expected_bmi}'
    ...                         Assertion failed. Expected the BMI response to be "25". Actual: "${response}".

Send wrong POST request and assert the status
    [Tags]                 WS       tdee
    [Documentation]                         Wrong gender given. Return status should be equal to 500
    # Create the body
    ${body}=            create dictionary   name=john   
    ...                                     age=20  
    ...                                     weight=80   
    ...                                     length=180  
    ...                                     goal=Fat loss   
    ...                                     activitylevel=Vigorously active    
    ...                                     gender=nogender
    # Sent the request & assert
    ${response}=        send POST request   ${BACKEND_URL}/calculate_all       ${body}     expected_status=500