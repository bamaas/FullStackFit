*** Variables ***
${USERNAME}            ${${USER}_USER}[username]
${PASSWORD}            ${${USER}_USER}[password]
${PASSWORD}            ${${USER}_USER}[userid]

&{TEST_USER}           username=Test        password=test           userid=5283b454-cae6-4515-ace4-26a0df8830db
&{LOCAL_USER}          username=Test        password=test           userid=3aa88660-d6ad-430a-829c-276d3cc7a6b4