*** Settings ***
Resource                lambdatest_key.robot

*** Variables ***
${APPIUM_LOCAL_URL}     http://localhost:4723/wd/hub
${LAMBDATEST_URL}       http://${LAMBDATEST_USERNAME}:${LAMBDATEST_ACCESSKEY}@hub.lambdatest.com/wd/hub