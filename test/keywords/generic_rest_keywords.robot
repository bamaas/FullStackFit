*** Keywords ***
Create REST header
    [Arguments]         ${access_token}              ${content_type}=application/json
    ${header}=          create dictionary            Authorization=Bearer ${access_token}
    ...                                              Content-Type=${content_type}
    [Return]            ${header}

Send GET request
    [Arguments]         ${url}      ${header}       ${expected_status}=200
    [Documentation]     Sends a GET request and asserts the statuscode for status 200. Returns the response in JSON.
    REST.set headers    ${header}
    REST.GET            ${url}
    ${output}=          output
    # Make a variable at test level so it is accessible for the function 'get_last_output_message'
    set test variable   ${output}   ${output}
    assert dictionary   ${output}   {"status":${expected_status}}   
    ${response}=        output      response body
    [Return]            ${response}

Send POST request
    [Arguments]         ${url}       ${header}      ${body}        ${expected_status}=201
    [Documentation]     Sends a POST request and asserts the statuscode for status 201. Returns the response in JSON.
    REST.set headers    ${header}
    REST.POST           ${url}       ${body}
    ${output}=          output
    # Make a variable at test level so it is accessible for the function 'get_last_output_message'
    set test variable   ${output}    ${output}
    assert dictionary   ${output}    {"status":${expected_status}}
    ${response}=        output       response body      
    [Return]            ${response}

Send PUT request
    [Arguments]         ${url}       ${header}      ${body}        ${expected_status}=200
    [Documentation]     Sends a PUT request and asserts the statuscode for status 200 Returns the response in JSON.
    REST.set headers    ${header}
    REST.PUT            ${url}       ${body}
    ${output}=          output
    # Make a variable at test level so it is accessible for the function 'get_last_output_message'
    set test variable   ${output}    ${output}
    assert dictionary   ${output}    {"status":${expected_status}}
    ${response}=        output       response body      
    [Return]            ${response}

Send DELETE request
    [Arguments]         ${url}      ${header}       ${expected_status}=200
    [Documentation]     Sends a DELETE request and asserts the statuscode for status 200. Returns the response in JSON.
    REST.set headers    ${header}
    REST.DELETE         ${url}      
    ${output}=          output
    # Make a variable at test level so it is accessible for the function 'get_last_output_message'
    set test variable   ${output}   ${output}
    assert dictionary   ${output}   {"status":${expected_status}}
    ${response}=        output      response body      
    [Return]            ${response} 