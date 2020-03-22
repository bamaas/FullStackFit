*** Variables ***
######################
# Appium local
######################

# Android devices
&{CHROMEOPTIONS}                       androidPackage=com.android.chrome
&{ANDROID_EMULATOR_CHROME}             chromeOptions=${CHROMEOPTIONS}    platformName=Android    platformVersion=10    deviceName=emulator-5554     browserName=Chrome
&{ANDROID_POCOPHONE_REAL_CHROME}       chromeOptions=${CHROMEOPTIONS}    platformName=Android    platformVersion=9     deviceName=8381e403          browserName=Chrome

# iOS devices
&{IOS_IPHONE8_EMULATOR_SAFARI}         platformName=iOS    platformVersion=12.0    deviceName=iPhone 8      browserName=Safari

######################
# Browserstack
######################
&{IPHONE8PLUS}                         browserName=iPhone          device=iPhone 8 Plus         realMobile=true       os_version=11     
&{W10_CHROME}                          os=Windows                  os_version=10                browser=Chrome        browser_version=76.0        resolution=1920x1080     browserstack.selenium_version=3.1.0
&{SAMSUNG_S8}                          os_version=7.0              device=Samsung Galaxy S8     real_mobile=true     