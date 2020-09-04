*** Keywords ***
execute query
    [Arguments]         @{args}
    ${query}        set variable    ${EMPTY}
    FOR     ${arg}      IN      @{args}
        ${query}=       catenate        SEPARATOR=${SPACE}      ${query}        ${arg}
    END
    ${rc}=      query       ${query}
    log         ${rc}       console=True

get rows from query
    [Documentation]     Returns all the found rows from a query.
    [Arguments]         @{args}
    ${query}        set variable    ${EMPTY}
    FOR     ${arg}      IN      @{args}
        ${query}=       catenate        SEPARATOR=${SPACE}      ${query}        ${arg}
    END
    ${rows}=     query       ${query}
    [Return]     ${rows}

get row from query
    [Documentation]     Returns the first row from a query.
    [Arguments]         @{args}
    ${rows}=            get rows from query      @{args}
    ${row}=             get from list            ${rows}        0
    [Return]            ${row}

get value from query
    [Documentation]     Returns the first found value, from the first row, from the given query.
    [Arguments]         @{args}
    ${row}=             get row from query     @{args}
    ${value}=           get from list          ${row}       0
    [Return]            ${value}