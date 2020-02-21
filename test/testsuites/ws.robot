*** Settings ***
Resource          ../keywords/all.robot
Resource          ../config/${ENVIRONMENT}_environment.robot

*** Variables ***
# The value in 'environment' is used to load the config file containing variables for the specific environment, such as the GUI_URL.
${ENVIRONMENT}                  dev

*** Settings ***
Test Teardown       run keyword if test failed       report last output message

*** Test Cases ***
Send correct POST request and assert with JSONPath
    # Create the body
    ${body}=            create dictionary   name=john   
    ...                                     age=20  
    ...                                     weight=80   
    ...                                     length=180  
    ...                                     goal=Fat loss   
    ...                                     activitylevel=Vigorously active    
    ...                                     gender=man
    # Sent the request & assert
    ${response}=        send POST request   ${BACKEND_URL}/postjson       ${body}     200      # 200 is the expected status response
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
    # Another way of asserting
    ${tdee}=                        get from json       ${response}         $.tdee
    should be equal as integers     3478            ${tdeeZZZ}

Send wrong POST request and assert the status
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
    ${response}=        send POST request   ${BACKEND_URL}/postjson       ${body}     500      # 200 is the expected status response