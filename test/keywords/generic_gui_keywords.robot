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