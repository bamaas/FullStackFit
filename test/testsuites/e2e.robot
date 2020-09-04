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
    # Setup - determine the latest entry and create one that has the same date
    send POST ENTRY request     
    ${response}=                send GET ENTRIES request
    ${latest_entry}=            get from list      ${response}      0      
    ${date}=                    convert date            ${latest_entry}[date]     result_format=%d-%m-%Y
    # Test script
    ${note}=                    get current date
    ${weight}=                  evaluate            (random.randint(1, 9)/10)+(random.randint(1,199))    modules=random
    Add entry                   weight=${weight}    note=${note}        date=${date}

Edit entry in frontend
    [Tags]                      Smoke
    # Setup
    send POST ENTRY request      # post entry to be sure there is at least 1 entry to edit
    ${response}=                 send GET ENTRIES request
    ${latest_entry}=             get from list      ${response}      0           # edit the top entry, so get the date and weight to be able to select it
    ${date_old}=                 convert date            ${latest_entry}[date]     result_format=%d-%m-%Y
    ${weight_old}=               set variable            ${latest_entry}[weight]
    reload page
    # Test Script
    ${note_new}=                get current date
    ${weight_new}=              evaluate            (random.randint(1, 9)/10)+(random.randint(1,199))    modules=random
    Edit entry                  date_old=${date_old}         weight_old=${weight_old}      date_new=${date_old}  weight_new=${weight_new}  note_new=${note_new}

Delete entry in frontend
    [Tags]                      Smoke
    # Setup
    ${weight}=                  evaluate                (random.randint(1, 9)/10)+(random.randint(1,199))    modules=random
    ${weight}=                  convert to string       ${weight}
    ${datetime}=                get current date        result_format=%Y-%m-%dT%H:%M:%S
    ${randomint}=               evaluate                random.randint(4, 1000)    modules=random
    ${datetime}=                add time to date        ${datetime}     ${randomint} days            result_format=%Y-%m-%dT%H:%M:%S
    ${date}=                    convert date            ${datetime}     result_format=%d-%m-%Y
    Send POST ENTRY request     date=${datetime}        weight=${weight}
    reload page
    # Test Script
    Delete entry                ${date}  ${weight}