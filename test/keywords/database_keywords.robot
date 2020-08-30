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
    [Arguments]         @{args}
    ${query}        set variable    ${EMPTY}
    FOR     ${arg}      IN      @{args}
        ${query}=       catenate        SEPARATOR=${SPACE}      ${query}        ${arg}
    END
    ${rows}=     query       ${query}
    [Return]     ${rows}

get row from query
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

verify value in db table
    [Arguments]                 ${table}    ${key}      ${expected_value}
    ${actual_value}=            get value from query    select VALUE
    ...                                                 from ${table}
    ...                                                 where KEY = '${key}'
    should be equal             '${actual_value}'       '${expected_value}'
    ...                         Validation failed. Expected to find value '${expected_value}' for key '${key}' in table '${table}'. Actual value: '${actual_value}'.
