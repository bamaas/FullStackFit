*** Settings ***
Resource          ../keywords/all.robot

*** Variables ***
# The value in 'environment' is used to load the config file containing variables for the specific environment, such as the GUI_URL.
${ENVIRONMENT}                  test

*** Settings *** 
Suite Setup                     connect to db
Suite Teardown                  disconnect from database
Test Setup                      delete all rows from table         entry
Test Teardown                   report last output message on failure

*** Test Cases ***
Get entries through api
    [Tags]                      API     DBconnection
    # Test Data
    set test variable           ${id}                   1
    ${date}=                    get current date        result_format=%Y-%m-%dT%H:%M:%S
    set test variable           ${weight}               80.0
    set test variable           ${note}                 ${TEST_NAME}
    # Test Script
    insert entry into db        id=${id}     date=${date}       weight=${weight}        note=${note}
    ${response}=                Send GET entries request    page_number=0           page_size=10
    ${entry}=                   get from list               ${response}             -1
    assert JSON                 ${entry}                    $.id                    ${id}           number
    assert JSON                 ${entry}                    $.date                  ${date}         string
    assert JSON                 ${entry}                    $.weight                ${weight}       number
    assert JSON                 ${entry}                    $.note                  ${note}         string

Delete entry through api
    [Tags]                             API     DBconnection
    # Test Data
    set test variable                  ${id}                1
    ${date}=                           get current date     result_format=%Y-%m-%dT%H:%M:%S
    set test variable                  ${weight}            80.0
    set test variable                  ${note}              This is a test note
    # Test Script
    insert entry into db               id=${id}         date=${date}      weight=${weight}       note=${note}
    send DELETE ENTRY request          id=${id}
    # validate the table is empty
    ${rows}	                           get rows from query 	        SELECT * FROM log
    ${rows_length}=                    get length      ${rows}
    should be equal                    '${rows_length}'        '0'  Entry is not deleted in database.

Post entry through api
    [Tags]                            API     DBconnection
    # Test Data
    set test variable                 ${weight}         80.0
    set test variable                 ${note}           Post entry api test
    ${current_date}=                  get current date  result_format=%Y-%m-%dT%H:%M:%S
    # Test Script
    ${response}=                      Send POST ENTRY request       date=${current_date}     weight=${weight}    note=${note}      
    Verify entry in db                id=${response}[id]            date=${current_date}     weight=${weight}    note=${note}         

Update entry through api
    [Tags]                              API     DBconnection
    # Test Data
        # inserted
    set test variable                  ${id}                1
    ${date}=                           get current date     result_format=%Y-%m-%dT%H:%M:%S
    set test variable                  ${weight}            80.0
    set test variable                  ${note}              This is a test note
        # updated
    ${updated_date}=                   add time to date     ${date}     2 days   result_format=%Y-%m-%dT%H:%M:%S
    set test variable                  ${updated_weight}    20.0
    set test variable                  ${updated_note}      My updated note
    # Test Script
    insert entry into db               id=${id}     date=${date}              weight=${weight}              note=${note}
    send UPDATE ENTRY request          id=${id}     date=${updated_date}      weight=${updated_weight}      note=${updated_note}
    verify entry in db                 id=${id}     date=${updated_date}      weight=${updated_weight}      note=${updated_note}