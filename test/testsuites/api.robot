*** Settings ***
Resource          ../keywords/all.robot

*** Variables ***
# The value in 'environment' is used to load the config file containing variables for the specific environment, such as the GUI_URL.
${ENVIRONMENT}                  localhostnodocker

*** Settings *** 
# Suite Setup                     connect to database using custom params     psycopg2 	database='postgres', user='postgres', password='postgres', host='${DATABASE_HOST}', port=5432
# Suite Teardown                  disconnect from database
Test Teardown                   report last output message on failure

*** Test Cases ***
# Get entries db
#     delete all rows from table         log
#     execute sql string                 INSERT INTO log (id,date, weight, note) VALUES (9, current_timestamp + interval '5' day, 9, 'test note'); 
#     ${entries}=                        Send GET entries request
#     ${entry}=                          get from list     ${entries}     -1
#     dictionary should contain key      ${entry}          id
#     dictionary should contain key      ${entry}          weight
#     dictionary should contain key      ${entry}          note
#     dictionary should contain key      ${entry}          date

# Delete entry db
#     delete all rows from table         log
#     execute sql string                 INSERT INTO log (id,date, weight, note) VALUES (9, current_timestamp, 9, 'test note'); 
#     send DELETE ENTRY request          9

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
    ${response}=                        send POST entry request
    send DELETE ENTRY request           ${response}[id]

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

*** Keywords ***
Insert entry into db
    execute sql string                 INSERT INTO log (id,date, weight, note) VALUES (9, current_timestamp, 9, 'test note'); 