*** Settings ***
Resource          ../keywords/all.robot

*** Variables ***
# The value in 'environment' is used to load the config file containing variables for the specific environment.
${ENVIRONMENT}                  localhost


########################
# Webdriver settings
# ---------------------
# If you want to run tests through BrowserStack, 
# set remote_webdriver to False and provide a remote_url and capabilities dictionary
########################
# Remote vs local
${REMOTE_WEBDRIVER}             False     
# Local
${BROWSER}                      
# Remote
${REMOTE_URL}                   #%{BROWSERSTACK_REMOTE_URL}
${CAPABILITIES}                 #w10_chrome
# Other settings
${MAXIMIZE_WINDOW}              True


*** Settings ***
Suite Setup         set suite tags      environment=${ENVIRONMENT}      remote_webdriver=${REMOTE_WEBDRIVER}      capabilities=${CAPABILITIES}          browser=${BROWSER}

Test Setup          setup browser     remote_webdriver=${REMOTE_WEBDRIVER}      browser=${BROWSER}                        remote_url=${REMOTE_URL}    
...                                   capabilities=${CAPABILITIES}              setup_url=${FRONTEND_URL}                 maximize_window=${MAXIMIZE_WINDOW}   

Test Teardown       run keywords      close browser if running remotely and report screenshot on failure                  ${REMOTE_WEBDRIVER}
...                 AND               report last output message on failure


*** Test Cases ***
Add entry in frontend
    [Tags]                      Smoke
    # Test script
    ${note}=                    get current date
    ${weight}=                  evaluate            (random.randint(1, 9)/10)+(random.randint(1,199))    modules=random
    Add entry                   weight=${weight}    note=${note}
    verify value in table       entries-table       Weight     ${weight} kg      Note       ${note}

Edit entry in frontend
    [Tags]                      Smoke
    # Setup
    Send POST ENTRY request
    reload page
    # Test Script
    click element                //mat-icon[text()='more_vert']
    click on element             //mat-icon[text()='edit']
    ${weight}=                   evaluate                       (random.randint(1, 9)/10)+(random.randint(1,199))    modules=random
    ${weight}=                   convert to string              ${weight}
    ${note}=                     get current date
    input text                   id=add-entry-input-weight      ${weight}
    input text                   id=add-entry-input-note        ${note}
    click on element             id=add-entry-btn-add
    verify value in table        entries-table       Weight     ${weight} kg      Note       ${note}

Delete entry in frontend
    [Tags]                      Smoke
    # Setup
    ${weight}=                  evaluate                (random.randint(1, 9)/10)+(random.randint(1,199))    modules=random
    ${weight}=                  convert to string       ${weight}
    ${datetime}=                get current date        result_format=%Y-%m-%dT%H:%M:%S
    ${randomint}=               evaluate                random.randint(4, 1000)    modules=random
    ${datetime}=                add time to date        ${datetime}     ${randomint} days            result_format=%Y-%m-%dT%H:%M:%S
    ${date}=                    convert date            ${datetime}     result_format=%d-%m-%Y
    Send POST ENTRY request     datetime=${datetime}        weight=${weight}
    reload page
    # Test Script
    Delete entry                ${date}  ${weight} 

*** Keywords ***
Delete entry
    [Arguments]                 ${date}             ${weight}
    ${entry_xpath}=             Get entry xpath     ${date}     ${weight}
    Open actions menu of entry  ${date}  ${weight}
    click on element            //mat-icon[text()='delete']
    click button                Delete
    wait until page does not contain element        ${entry_xpath}

Open actions menu of entry
    [Arguments]         ${date}     ${weight}
    ${entry_xpath}=     Get entry xpath     ${date}  ${weight}
    click on element    ${entry_xpath}//mat-icon[text()='more_vert']

Get entry xpath
    [Arguments]                 ${date}     ${weight}
    return from keyword         //table[@id='entries-table']//tr[td[1][normalize-space(.)='${date}'] and td[2][normalize-space(.)='${weight} kg']]

Add entry
    [Arguments]                         ${weight}                ${note}
    ${weight}=                          convert to string               ${weight}
    ${note}=                            convert to string               ${note}
    click element                       id=nav-btn-entries
    click element                       id=nav-btn-add-entry
    input text                          id=add-entry-input-weight       ${weight}
    input text                          id=add-entry-input-note         ${note}
    click element                       id=add-entry-btn-add

verify value in table
    [Arguments]             ${table_id}     ${search_column}    ${search_value}     ${value_column}     ${expected_value}
    ${actual_value}=        search value in table           ${table_id}     ${search_column}    ${search_value}     ${value_column}
    should be equal         ${actual_value}         ${expected_value}

search value in table
    [Arguments]             ${table_id}     ${search_column}    ${search_value}     ${value_column}
    [Documentation]         Searches a value in a table with headers and any number of rows.\n\n
    ...                     The search is based on finding a row with a specified value in a specified column and returning the value that is in
    ...                     that same row in a different column. The keyword returns the value based on the first occurance of the search value.
    ...                     If the search value is not found, the keyword will fail.\n\n
    ...                     ``div_form_id`` is the id of the grandparent div that wraps around the table.\n\n
    ...                     ``search_column`` is the text in the header of the column where we want to find the search value.\n\n
    ...                     ``search_value`` is the text in a cell of the search column that will determine the row we get the value from.\n\n
    ...                     ``value_column`` is the text in the header of the column that we want to retrieve the value from.
    # determine the column numbers for the search column and value column by searching the header table
    ${columns}=         get webelements          //table[@id='${table_id}']/thead/tr/th
    ${column_labels}=   Create List     ${EMPTY}    
    FOR    ${column}    IN    @{columns}
        ${text}=    get text       ${column}
        Append To List  ${column_labels}  ${text}
    END
    # get index from list returns -1 when the item is not found, in this case use an xpath that gives meaningful error
    ${search_index}=    get Index from list      ${column_labels}        ${search_column}
    run keyword if      ${search_index}==-1      get text       //table[@id='${table_id}']//th//*[text()='${search_column}']
    ${value_index}=     get Index from list      ${column_labels}        ${value_column}
    run keyword if      ${value_index}==-1       get text       //table[@id='${table_id}']//th//*[text()='${value_column}']
    ${value}=               get text             //table[@id='${table_id}']//tr[td[${search_index}][normalize-space(.)='${search_value}']]/td[${value_index}]
    return from keyword     ${value}