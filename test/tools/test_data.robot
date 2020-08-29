*** Settings ***
Resource          ../keywords/all.robot

*** Variables ***
${ENVIRONMENT}                  localhostnodocker

*** Settings *** 
Test Teardown                   report last output message on failure

*** Test Cases ***
Create test data
    FOR     ${index}    IN RANGE    1000
            ${datetime}=                get current date        result_format=%Y-%m-%dT%H:%M:%S
            ${datetime}=                add time to date          ${datetime}   ${index} days       result_format=%Y-%m-%dT%H:%M:%S
            Send POST ENTRY request     datetime=${datetime}        note=${index}
    END            