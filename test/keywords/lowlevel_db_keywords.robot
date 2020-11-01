*** Keywords ***
connect to db
    connect to database using custom params     psycopg2 	database='postgres', user='postgres', password='postgres', host='${DATABASE_HOST}', port=5432
    
Insert entry into db
    [Arguments]                        ${id}        ${date}     ${weight}       ${note}
    ${date}=                           run keyword if       '${date}' != 'current_timestamp'        set variable      TO_TIMESTAMP('${date}', 'YYYY/MM/DD[T]HH24:MI:SS')
    ...  ELSE                          set variable         ${date}
    ${year}=                           convert date         ${date}             result_format=%Y        exclude_millis=yes
    ${datetimeobj}=                    convert date         ${date}             result_format=datetime
    ${week}=                           evaluate             math.floor($datetimeobj.timetuple().tm_yday)       modules=datetime,math
    execute sql string                 INSERT INTO entry (id,date, weight, note, year, week) VALUES (${id}, ${date}, ${weight}, '${note}', ${year}, ${week}); 

Verify entry in db
    [Arguments]                         ${id}     ${weight}       ${note}     ${date}
    ${db}=                              get entry from db         id=${id}
    should be equal                     '${db}[weight]'           '${weight}'
    should be equal                     '${db}[note]'             '${note}'
    should be equal                     '${db}[date]'             '${date}'

Get entry from db
    [Arguments]                        ${id}
    ${row}=                            get row from query                  SELECT weight,note,date FROM entry WHERE id=${id}
    ${date}=                           convert date   ${row}[2]            result_format=%Y-%m-%dT%H:%M:%S
    ${entry}=                          create dictionary
    ...                                weight=${row}[0]
    ...                                note=${row}[1]
    ...                                date=${date}
    [Return]                           ${entry}