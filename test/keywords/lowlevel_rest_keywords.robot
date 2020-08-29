*** Keywords ***
Send UPDATE ENTRY request
    [Arguments]                 ${id}                   ${datetime}          ${weight}            ${note}
    ${body}=                    create dictionary   
    ...                         id=${id}
    ...                         weight=${weight}
    ...                         note=${note}
    ...                         date=${datetime}
    ${response}=                send PUT request         ${BACKEND_URL}/log     ${body}         
    assert JSON                 ${response}              $.id                   ${id}           number
    assert JSON                 ${response}              $.date                 ${datetime}     string
    assert JSON                 ${response}              $.weight               ${weight}       number
    assert JSON                 ${response}              $.note                 ${note}         string

Send POST ENTRY request
    [Arguments]                 ${datetime}=now          ${weight}=random            ${note}=post entry
    ${datetime}=                run keyword if           '${datetime}' == 'now'    get current date        result_format=%Y-%m-%dT%H:%M:%S
    ...  ELSE                   set variable             ${datetime}
    ${weight}=                  run keyword if          '${weight}' == 'random'     evaluate         (random.randint(1, 9)/10)+(random.randint(1,199))    modules=random
    ...  ELSE                   set variable            ${weight}
    ${body}=                    create dictionary   
    ...                         weight=${weight}
    ...                         note=${note} | ${datetime}
    ...                         date=${datetime}
    ${response}=                send POST request        ${BACKEND_URL}/log     ${body}         200 
    assert JSON                 ${response}              $.weight               ${weight}       number
    assert JSON                 ${response}              $.date                 ${datetime}     string
    assert JSON                 ${response}              $.note                 ${note} | ${datetime}         string
    dictionary should contain key      ${response}       id
    ${id}=                      get value from dictionary       ${response}     id
    [Return]                    ${id}

Send DELETE ENTRY request
    [Arguments]                 ${id}
    ${response}=                send DELETE request        ${BACKEND_URL}/log/${id}         

Send GET ENTRIES request
    [Arguments]                 ${page_number}=0        ${page_size}=9999
    ${response}=                send GET request        ${BACKEND_URL}/log/?pageNo=${page_number}&pageSize=${page_size}
    [Return]                    ${response}