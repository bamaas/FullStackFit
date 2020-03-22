*** Settings ***
Resource          ../keywords/all.robot

*** Variables ***
# The value in 'environment' is used to load the config file containing variables for the specific environment, such as the GUI_URL.
${ENVIRONMENT}                  localhost

*** Settings *** 
Suite Setup                     load env file       ${CURDIR}/../.env
Test Teardown                   report last output message on failure

*** Test Cases ***
Calculate TDEE
    [Tags]                 WS
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
    assert JSON         ${response}         $.bmr               1932      integer
    assert JSON         ${response}         $.carbReqGram       530       integer
    assert JSON         ${response}         $.carbReqKcal       2118      integer
    assert JSON         ${response}         $.carbReqPerc       61        integer
    assert JSON         ${response}         $.fatReqGram        80        integer
    assert JSON         ${response}         $.fatReqKcal        720       integer
    assert JSON         ${response}         $.fatReqPerc        21        integer
    assert JSON         ${response}         $.proteinReqGram    160       integer
    assert JSON         ${response}         $.proteinReqKcal    640       integer
    assert JSON         ${response}         $.proteinReqPerc    18        integer
    assert dictionary   ${response}         {"tdee":3478}

Calculate BMR
    [Tags]                 WS
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

Calculate BMI
    [Tags]                 WS
    # Test Data
    ${body}=                create dictionary   
    ...                     weight=80
    ...                     length=180
    # Test Script
    ${response}=            Send POST request  ${BACKEND_URL}/calculate_bmi  ${body}  expected_status=200
    should be equal         '${response}'       '25'
    ...                     Assertion failed. Expected the BMI response to be "25". Actual: "${response}".

Send wrong POST request and assert the status
    [Tags]                 WS
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