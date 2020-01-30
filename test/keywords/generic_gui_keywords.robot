*** Keywords ***
Login   
    [Tags]      WIP
    [Arguments]         ${environment}          #${username}=None     ${password}=None
    # TODO check if already logged in (to correct environment)
    ${environment}=     convert to lowercase        ${environment}
    go to               ${environment_${environment}_URL}
    # ${username}=        run keyword if      '${username}' != 'None'  _get username    ${username}
    # ...  ELSE           set variable        ${username}
    # ${password}=        run keyword if      '${username}' != 'None'  _get password    ${password}
    # ...  ELSE           set variable        ${password}

_get username
    [Tags]      WIP
    [Arguments]                 ${username}=None
    return from keyword if      '${username}'!='None'       ${username}
    return from keyword         

_get password
    [Tags]      WIP
    [Arguments]                 ${password}=None
    return from keyword if      '${password}'!='None'       ${password}


Create remote webdriver
    [Arguments]              ${command_executor}    ${desired_capabilities}     ${url}     
    create webdriver         Remote    command_executor=${command_executor}    desired_capabilities=${desired_capabilities}
    go to                    ${url}

Close browser if running remotely and report screenshot on failure
    [Arguments]         ${instance_type}
    [Documentation]     This keyword closes the browser if running tests through Selenium grid (Lambdatest). And it reports a screenshot on failure.
    ...                 Closing the browser is needed, otherwise you would get a timeout error. 
    ...                 When runinng locally it is not needed because you can reuse a already opened browser. 
    ...                 This saves time when writing/debugging test scripts.
    run keyword if      '${TEST_STATUS}'!='PASS'            report screenshot
    run keyword if      '${instance_type}' == 'remote'      close all browsers