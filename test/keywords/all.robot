*** Settings ***
# Config
Resource         ../config/environments.robot
Resource         ../config/browser_capabilities.robot
Resource         ../config/users.robot

# Out of the box libraries
Library         DateTime
Library         String
Library         Collections
Library         OperatingSystem

# External libraries
Library          SeleniumLibrary    timeout=15      implicit_wait=1500 ms    run_on_failure=${NONE}      # No screenshot, created own keyword: report screenshot. This is used in the selenium teardown.
Library          REST
Library          DatabaseLibrary

# Keywords
Resource        special_keywords.robot
Resource        generic_fe_keywords.robot
Resource        generic_rest_keywords.robot
Resource        lowlevel_rest_keywords.robot
Resource        generic_db_keywords.robot
Resource        lowlevel_db_keywords.robot

# Helpers/Handlers
Library         ../helpers/SetupHelper.py
Library         ../helpers/BrowserHelper.py
Library         ../helpers/RestHandler.py
Library         ../helpers/ReportHelper.py
Library         ../helpers/RobotLooper.py