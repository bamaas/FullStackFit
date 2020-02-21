*** Settings ***
Resource          ../keywords/all.robot

*** Variables ***
# Choose between remote/local. If the browser instance is remote a remote_url should be given and you can give capabilities
${INSTANCE_TYPE}                local
# To run tests with different browser. Pass in another variable here, or through CLI: -v browser:Firefox
${BROWSER}                      chrome
${REMOTE_URL}                   
${CAPABILITIES}                 

*** Settings ***
Test Setup         setup browser     instance_type=${INSTANCE_TYPE}    browser=${BROWSER}    remote_url=${REMOTE_URL}    capabilities=${CAPABILITIES}    setup_url=${GUI_URL}
# When a test has failed, an additional screenshot is added to the report (because RF does not execute the 'on error' when a validation fails)
Test Teardown      close browser if running remotely and report screenshot on failure        ${INSTANCE_TYPE}

*** Test Cases ***
GUI test
    report screenshot

Testbas
    [Setup]
    Open Browser        https://google.com/     Chrome