*** Settings ***
Resource          ../keywords/all.robot

*** Variables ***
# The value in 'environment' is used to load the config file containing variables for the specific environment, such as the GUI_URL.
${ENVIRONMENT}                  prod            #localhostnodocker

*** Settings *** 
#Suite Setup                     load env file       ${CURDIR}/../.env
Test Teardown                   report last output message on failure

*** Test Cases ***
Bas
    FOR     ${index}        IN RANGE        200
            Send POST entry request
    END

Post entry
    Send POST entry request

Get entries
    send POST entry request
    ${entries}=                        Send GET entries request
    ${entry}=                          get from list     ${entries}     0
    dictionary should contain key      ${entry}          id
    dictionary should contain key      ${entry}          weight
    dictionary should contain key      ${entry}          note
    dictionary should contain key      ${entry}          date

Delete entry
    ${id}=                          send POST entry request
    send DELETE entry request       ${id}

*** Keywords ***
Send POST entry request
    [Arguments]                 ${date}=2020-05-10T19:03:22        ${weight}=80.0            ${note}=This is a test note
    ${body}=                    create dictionary   
    ...                         weight=${weight}
    ...                         note=${note}
    ...                         date=${date}
    ${response}=                send POST request        ${BACKEND_URL}/log     ${body}         200 
    assert JSON                 ${response}              $.weight               ${weight}       number
    assert JSON                 ${response}              $.date                 ${date}         string
    assert JSON                 ${response}              $.note                 ${note}         string
    dictionary should contain key      ${response}       id
    ${id}=                      get value from dictionary       ${response}     id
    [Return]                    ${id}

Send DELETE entry request
    [Arguments]                 ${id}
    ${response}=                send DELETE request        ${BACKEND_URL}/log/${id}         

Send GET entries request
    [Arguments]                 ${page_number}=0        ${page_size}=20
    ${response}=                send GET request        ${BACKEND_URL}/log/?pageNo=${page_number}&pageSize=${page_size}
    [Return]                    ${response}