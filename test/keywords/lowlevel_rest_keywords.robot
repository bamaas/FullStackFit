*** Keywords ***
Send UPDATE ENTRY request
    [Arguments]                 ${id}                   ${date}          ${weight}            ${note}
    ${body}=                    create dictionary   
    ...                         id=${id}
    ...                         weight=${weight}
    ...                         note=${note}
    ...                         date=${date}
    ${response}=                send PUT request         ${BACKEND_URL}/log     ${body}         
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
    ...                         date=${date}
    ${response}=                send POST request        ${BACKEND_URL}/log     ${body}         200 
    assert JSON                 ${response}              $.weight               ${weight}       number
    assert JSON                 ${response}              $.date                 ${date}     string
    assert JSON                 ${response}              $.note                 ${note}         string
    dictionary should contain key      ${response}       id
    [Return]                    ${response}

Send DELETE ENTRY request
    [Arguments]                 ${id}
    ${response}=                send DELETE request        ${BACKEND_URL}/log/${id}
    [Return]                    ${response}      

Send GET ENTRIES request
    [Arguments]                 ${page_number}=0        ${page_size}=9999
    ${response}=                send GET request        ${BACKEND_URL}/log/?pageNo=${page_number}&pageSize=${page_size}
    [Return]                    ${response}