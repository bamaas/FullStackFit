*** Settings ***
Resource          ../keywords/all.robot

*** Variables ***
# The value in 'environment' is used to load the config file containing variables for the specific environment, such as the GUI_URL.
${ENVIRONMENT}                  localhostnodocker

*** Settings *** 
Test Teardown                   report last output message on failure

*** Test Cases ***
Post entry
    [Tags]      Smoke
    Send POST ENTRY request

Get entries
    [Tags]      Smoke
    send POST ENTRY request
    ${entries}=                        Send GET entries request
    ${entry}=                          get from list     ${entries}     -1
    dictionary should contain key      ${entry}          id
    dictionary should contain key      ${entry}          weight
    dictionary should contain key      ${entry}          note
    dictionary should contain key      ${entry}          date

Delete entry
    [Tags]      Smoke
    ${id}=                          send POST entry request
    send DELETE ENTRY request       ${id}

Update entry
    [Tags]      Smoke
    send POST entry request
    ${entries}=                        send GET entries request
    ${entry}=                          get from list     ${entries}      -1
    Send UPDATE ENTRY request          ${entry}[id]      ${entry}[date]  ${entry}[weight]   My updated entry!
    # Verify the entry is updated
    ${entries}=                        Send GET entries request
    ${updated_entry}=                  get from list            ${entries}     -1
    should be equal                    ${entry}[id]             ${updated_entry}[id]
    should be equal                    ${entry}[weight]         ${updated_entry}[weight]
    should be equal                    ${entry}[date]           ${updated_entry}[date]
    should be equal                    ${updated_entry}[note]   My updated entry!