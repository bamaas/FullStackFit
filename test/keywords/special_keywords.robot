*** Keywords ***
Should Be False
    [Documentation]     Fails if the given condition is not false.
    [Arguments]         ${boolean}      ${msg}=${NONE}
    should be equal     '${boolean}'    'False'     ${msg}

TO DO
    [Documentation]     Reports a TO DO as a warning in the results report
    [Arguments]     @{message_list}
    # Argument is a list so that we can split the message on multiple lines
    ${message}=     set variable    [Test: ${TEST_NAME}]
    FOR    ${line}   IN   @{message_list}
           ${message}=          set variable   ${message}\n${line}
    END
    log         TO DO: ${message}       level=WARN

Get Test UID
    [Documentation]     Gets the UID of a test. If no UID is found, 'None' is returned.
    ...                 An UID always has a length of 6 and starts with 3 letters and end with 3 numbers.
    ${UID}=  set variable       None
    FOR     ${tag}      IN      @{TEST_TAGS}
            # If prefix_alpha is True, postfix_alpha is False, and length is 6. Then we got the UID tag.
            ${length}=                  get length  ${tag}
            ${prefix}=                  get substring   ${tag}      0       3
            ${postfix}=                 get substring   ${tag}      3       6
            ${prefix_alpha}=            evaluate        $prefix.isalpha()       
            ${postfix_alpha}=           evaluate        $postfix.isalpha()
            ${UID}=  run keyword if     ${length} == 6 and '${prefix_alpha}' == 'True' and '${postfix_alpha}' == 'False'     set variable     ${tag}
            ...  ELSE                   set variable       None
            exit for loop if            '${UID}' != 'None'       # Exit the loop if the UID Tag is found
    END
    return from keyword         ${UID}

Get Test Data Tag
    [Documentation]     Gets the data tag of a test. If no Data Tag is found, 'None' is returned.
    # When running tests through RobotLooper an additional test tag is set that starts with 'dataTag: '.
    # With the FOR loop below we try to find that tag so we can use it when generating the challenge title
    ${data_tag}=    set variable    None
    FOR     ${tag}      IN      @{TEST_TAGS}
            ${length}=                  get length  ${tag}
            continue for loop if        ${length} < 8       # The data dat length is always > 8. So if < 8 go to next item in loop. 
            ${prefix}=                  get substring       ${tag}      0               9
            ${postfix}=                 replace string      ${tag}      dataTag:${SPACE}        ${EMPTY}        # This removes 'dataTag: ' from the tag string
            ${data_tag}=                run keyword if      '${prefix}' == 'dataTag: '          set variable        ${postfix}
            ...  ELSE                   set variable        None
            exit for loop if            '${data_tag}' != 'None'       # Exit the loop if the dataTag is found
    END
    return from keyword                 ${data_tag}

Close Browser If Running Remotely And Report Screenshot On Failure
    [Arguments]         ${remote_webdriver_bool}
    [Documentation]     This keyword closes the browser if running tests through Selenium Grid or Appium (remote_webdriver == true). And it reports a screenshot on failure.
    ...                 Closing the browser is needed, otherwise you would get a timeout error. 
    ...                 When runinng locally it is not needed because you can reuse a already opened browser. Only works for Chrome!
    ...                 This saves time when writing/debugging test scripts.
    ${remote_webdriver_bool}=        convert to lowercase                   ${remote_webdriver_bool}
    run keyword if test failed       report screenshot
    run keyword if                  '${remote_webdriver_bool}' == 'true'         close all browsers

Get Rendering Mode
    [Tags]                  WIP
    [Documentation]         Gets the browser window width and returns either 'Mobile' or 'Desktop' depending on the browser width.
    ${window_size}=         get window size
    ${window_width}=        get from list      ${window_size}      0
    ${rendering_mode}=      set variable if    ${window_width} < ${RESPONSIVE_BREAKPOINT}       Mobile      Desktop     # First value is returned when True, second when False.
    run keyword if          '${rendering_mode}' == 'Mobile'     element should be visible       //button[@class='button menu']    # Verify the hamburger menu icon is visible
    ...  ELSE                                                   element should not be visible   //button[@class='button menu']    
    return from keyword     ${rendering_mode}