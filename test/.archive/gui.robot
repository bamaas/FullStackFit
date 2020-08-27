# Calculate TDEE
#     [Tags]                              Critical        TDE001      e2e
#     # # Fill form
#     log to console      test 1 2 3
    # input text                          id=name-hb      Bas
    # click element                       //mat-radio-button[@value='MALE']
    # input text                          id=weight-hb    80
    # input text                          id=length-hb    180
    # input text                          id=age-hb       20
    # click element                       id=activitylevel-hb
    # click element                       //*[text()='Sedentary or light activity']
    # click element                       id=goal-hb
    # click element                       //*[text()='Fat loss']
    # click element                       //button[contains(.,'Calculate TDEE')]
    # wait until element is visible       //p[text()='BMR 1932 kcal']
    # page should contain element         //p[text()='TDEE: 2365 kcal']
    # report screenshot
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