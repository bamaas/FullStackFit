*** Keywords ***
Send UPDATE ENTRY request
    [Arguments]                 ${id}                   ${date}          ${weight}            ${note}
    ${body}=                    create dictionary   
    ...                         id=${id}
    ...                         userId=${USERID}
    ...                         weight=${weight}
    ...                         note=${note}
    ...                         date=${date}
    ${access_token}=            Get access token        username=${USERNAME}   password=${PASSWORD}
    ${header}=                  Create REST header      ${access_token}
    ${response}=                send PUT request         ${BACKEND_URL}/entry   ${header}       ${body}         
    assert JSON                 ${response}              $.id                   ${id}           number
    assert JSON                 ${response}              $.date                 ${date}         string
    assert JSON                 ${response}              $.weight               ${weight}       number
    assert JSON                 ${response}              $.note                 ${note}         string
    [Return]                    ${response}

Send POST ENTRY request
    [Arguments]                 ${date}=now              ${weight}=random          ${note}=timestamp
    ${date}=                    run keyword if           '${date}' == 'now'    get current date        result_format=%Y-%m-%dT%H:%M:%S
    ...  ELSE                   set variable             ${date}
    ${weight}=                  run keyword if           '${weight}' == 'random'     evaluate         (random.randint(1, 9)/10)+(random.randint(1,199))    modules=random
    ...  ELSE                   set variable             ${weight}
    ${note}=                    run keyword if           '${note}' == 'timestamp'     get current date        result_format=%Y-%m-%dT%H:%M:%S
    ...  ELSE                   set variable             ${note}
    ${body}=                    create dictionary   
    ...                         weight=${weight}
    ...                         note=${note}
    ...                         userId=${USERID}
    ...                         date=${date}
    ${access_token}=            Get access token        username=${USERNAME}   password=${PASSWORD}
    ${header}=                  Create REST header      ${access_token}
    ${response}=                send POST request        ${BACKEND_URL}/entry   ${header}    ${body}      200
    assert JSON                 ${response}              $.weight               ${weight}    number
    assert JSON                 ${response}              $.date                 ${date}      string
    assert JSON                 ${response}              $.note                 ${note}      string
    dictionary should contain key      ${response}       id
    [Return]                    ${response}

Send DELETE ENTRY request
    [Arguments]                 ${id}
    ${access_token}=            Get access token        username=${USERNAME}   password=${PASSWORD}
    ${header}=                  Create REST header      ${access_token}
    ${response}=                send DELETE request     ${BACKEND_URL}/entry/${id}      ${header}
    [Return]                    ${response}      

Send GET ENTRIES request
    [Arguments]                 ${page_number}=0        ${page_size}=9999
    ${access_token}=            Get access token        username=${USERNAME}   password=${PASSWORD}
    ${header}=                  Create REST header      ${access_token}
    ${response}=                send GET request        ${BACKEND_URL}/entry/?pageNo=${page_number}&pageSize=${page_size}       header=${header}
    [Return]                    ${response}

Get access token
    [Arguments]             ${username}      ${password}    ${realm}=FitTrack       ${client_id}=fittrack-application
    ${new_token_needed}=    _new token needed
    return from keyword if  '${new_token_needed}' == 'FALSE'    ${ACCESS_TOKEN}
    ${data}=                create dictionary               client_id=${client_id}
    ...                                                     username=${username}
    ...                                                     password=${password}
    ...                                                     grant_type=password
    ${response}=            sent_form_urlencoded_request    ${AUTH_URL}/realms/${realm}/protocol/openid-connect/token  data=${data}  expected_status=200
    ${access_token}=        get from dictionary             ${response}         access_token
    ${expires_in}=          get from dictionary             ${response}         expires_in
    ${current_date}=        get current date                result_format=%Y-%m-%dT%H:%M:%S
    ${expiry_date}=         add time to date                ${current_date}     ${expires_in} seconds
    set global variable     ${ACCESS_TOKEN}                 ${access_token}
    set global variable     ${EXPIRY_DATE}                  ${expiry_date}
    [Return]                ${access_token}

_new token needed
    ${access_token}=        get variable value              ${ACCESS_TOKEN}
    return from keyword if  '${access_token}' == 'None'     TRUE
    ${current_date}=        get current date                result_format=%Y-%m-%dT%H:%M:%S
    ${remaining_time}=      subtract date from date         ${EXPIRY_DATE}      ${current_date}      result_format=number
    ${new_token_needed}=    set variable if                 ${remaining_time} < 60           TRUE        FALSE
    [Return]                ${new_token_needed}
