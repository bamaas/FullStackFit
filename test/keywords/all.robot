*** Settings ***
# Config
Resource         ../config/environments.robot
Resource         ../config/browser_capabilities.robot
Resource         ../config/remote_webdriver_urls.robot

# Out of the box libraries
Library         DateTime
Library         String
Library         Collections
Library         OperatingSystem

# External libraries
Library          SeleniumLibrary    timeout=15      implicit_wait=1500 ms    run_on_failure=${NONE}      # No screenshot, created own keyword: report screenshot. This is used in the selenium teardown.
Library          REST

# Keywords
Resource        generic_gui_keywords.robot
Resource        generic_rest_keywords.robot

# Helpers/Handlers
Library         ../helpers/BrowserHelper.py
Library         ../helpers/RestHandler.py
Library         ../helpers/ReportHelper.py