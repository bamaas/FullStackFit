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
${BROWSER}                      #Chrome
# Remote
${REMOTE_URL}                   #%{BROWSERSTACK_REMOTE_URL}
${CAPABILITIES}                 #w10_chrome
# Other settings
${MAXIMIZE_WINDOW}              True


*** Settings ***
Suite Setup         set suite tags      environment=${ENVIRONMENT}      remote_webdriver=${REMOTE_WEBDRIVER}      capabilities=${CAPABILITIES}          browser=${BROWSER}
#...                 AND               load env file       ${CURDIR}/../.env

Test Setup          setup browser     remote_webdriver=${REMOTE_WEBDRIVER}      browser=${BROWSER}                        remote_url=${REMOTE_URL}    
...                                   capabilities=${CAPABILITIES}              setup_url=${FRONTEND_URL}                 maximize_window=${MAXIMIZE_WINDOW}   

Test Teardown       run keywords      close browser if running remotely and report screenshot on failure                  ${REMOTE_WEBDRIVER}
...                 AND               report last output message on failure


*** Test Cases ***
# Calculate TDEE
#     [Tags]                              Critical        TDE001      e2e
#     # # Fill form
#     log to console      test 1 2 3
    # input text                          id=name-hb      Bas
    # click element                       //mat-radio-button[@value='MALE']
    # input text                          id=weight-hb    80
    # input text                          id=length-hb    180
    # input text                          id=age-hb       20
    # click element                       id=activitylevel-hb
    # click element                       //*[text()='Sedentary or light activity']
    # click element                       id=goal-hb
    # click element                       //*[text()='Fat loss']
    # click element                       //button[contains(.,'Calculate TDEE')]
    # wait until element is visible       //p[text()='BMR 1932 kcal']
    # page should contain element         //p[text()='TDEE: 2365 kcal']
    # report screenshot
    # Validate Protein Req
    # page should contain element         //td[text()=' 160 gram']
    # page should contain element         //td[text()=' 640 kcal']
    # page should contain element         //td[text()=' 27% ']
    # # Validate Carb Req
    # page should contain element         //td[text()=' 251 gram']
    # page should contain element         //td[text()=' 1005 kcal']
    # page should contain element         //td[text()=' 42% ']
    # # Validate Fat Req
    # page should contain element         //td[text()=' 80 gram']
    # page should contain element         //td[text()=' 720 kcal']
    # page should contain element         //td[text()=' 30% ']
    # Reset button
    # click element                       //button[contains(.,'Reset')]
    # wait until element is visible       //h3[text()='Calculator']

Add entry
    [Tags]      Critical
    # Test script
    ${today}=           get current date       
    Add entry           weight=15      date=${today}  note=This is a test
    verify value in table  entries-table       Weight     15 kg      Note       This is a test


# Edit entry
#     click element                       //mat-icon[text()='more_vert']
#     click element                       //*[text()='edit']
#     input text                          id=add-entry-input-weight       11
#     click element                       id=add-entry-btn-add
#     page should contain element         //*[text()='15 kg']
#     page should not contain element         //*[text()='11 kg']

# Delete entry
#     click element                           //mat-icon[text()='more_vert']
#     click element                             //*[text()='delete']
#     click element                           //button/span[text()='Delete']
#     page should not contain element         //*[text()='15 kg']

*** Keywords ***
Add entry
    [Arguments]                         ${weight}                       ${date}      ${note}
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