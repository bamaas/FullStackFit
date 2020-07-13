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
${REMOTE_WEBDRIVER}             #True
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
Calculate TDEE
    [Tags]                              Critical        TDE001      e2e
    # Validate home screen
    element should be visible           //h3[text()='Calculator']
    # Fill form
    input text                          id=name-hb      Bas
    click element                       //mat-radio-button[@value='MALE']
    input text                          id=weight-hb    80
    input text                          id=length-hb    180
    input text                          id=age-hb       20
    # click element                       id=activitylevel-hb
    # click element                       //*[text()='Sedentary or light activity']
    # click element                       id=goal-hb
    # click element                       //*[text()='Fat loss']
    # click element                       //button[contains(.,'Calculate TDEE')]
    # wait until element is visible       //p[text()='BMR 1932 kcal']
    # page should contain element         //p[text()='TDEE: 2365 kcal']
    report screenshot
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