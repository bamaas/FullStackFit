*** Keywords ***
Login
    ${logged_in}=           run keyword and return status       page should contain element     id=username
    return from keyword if  '${logged_in}' == 'False'           already logged in
    input text              id=username     ${USERNAME}
    input text              id=password     ${PASSWORD}
    click element           class=submit

Edit entry
    [Arguments]                 ${date_old}         ${weight_old}       ${date_new}     ${weight_new}      ${note_new}
    Open actions menu of entry  ${date_old}         ${weight_old}
    click on element            //mat-icon[text()='edit']
    Fill entry sheet            weight=${weight_new}    note=${note_new}        date=${date_new}
    ${entry_xpath}=             Get entry xpath     ${date_new}         ${weight_new}
    wait until page contains element    ${entry_xpath}

Fill entry sheet
    [Arguments]                         ${weight}                ${note}            ${date}=None
    ${weight}=                          convert to string        ${weight}
    input text                          id=add-entry-input-weight       ${weight}
    run keyword if                      '${date}' != 'None'             set element value           id=add-entry-input-date         ${EMPTY}
    run keyword if                      '${date}' != 'None'             input text                  id=add-entry-input-date         ${date}
    input text                          id=add-entry-input-note         ${note}
    click element                       id=add-entry-btn-add

Delete entry
    [Arguments]                 ${date}             ${weight}
    ${entry_xpath}=             Get entry xpath     ${date}     ${weight}
    Open actions menu of entry  ${date}  ${weight}
    click on element            //mat-icon[text()='delete']
    click button                Delete
    # verify entry is added
    wait until page does not contain element        ${entry_xpath}

Open actions menu of entry
    [Arguments]         ${date}     ${weight}
    ${entry_xpath}=     Get entry xpath     ${date}  ${weight}
    click on element    ${entry_xpath}//mat-icon[text()='more_vert']

Get entry xpath
    [Arguments]                 ${date}     ${weight}
    ${weight}=                  convert to string       ${weight}
    ${lastchars}=               evaluate            $weight[-2:]
    ${weight}=                  run keyword if          '${lastchars}' == '.0'      evaluate       $weight[:-2]
    ...  ELSE                   set variable            ${weight}
    return from keyword         //table[@id='entries-table']//tr[td[1][normalize-space(.)='${date}'] and td[2][normalize-space(.)='${weight} kg']]

Add entry
    [Arguments]                         ${weight}                ${note}            ${date}
    ${weight}=                          convert to string               ${weight}
    ${note}=                            convert to string               ${note}
    click element                       id=nav-btn-entries
    click element                       id=nav-btn-add-entry
    Fill entry sheet                    ${weight}  ${note}  ${date}
    # verify entry is added
    ${entry_xpath}=                     Get entry xpath     ${date}     ${weight}
    wait until page contains element    ${entry_xpath}