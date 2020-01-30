*** Variables ***
# Android devices
&{CHROMEOPTIONS}                       androidPackage=com.android.chrome
&{ANDROID_EMULATOR_CHROME}             chromeOptions=${CHROMEOPTIONS}    platformName=Android    platformVersion=10    deviceName=emulator-5554     browserName=Chrome
&{ANDROID_POCOPHONE_REAL_CHROME}       chromeOptions=${CHROMEOPTIONS}    platformName=Android    platformVersion=9     deviceName=8381e403          browserName=Chrome

# iOS devices
&{IOS_IPHONE8_EMULATOR_SAFARI}         platformName=iOS    platformVersion=12.0    deviceName=iPhone 8      browserName=Safari

######################
# Lambdatest
######################
# Desktop (Windows)
&{W10_CHROME}                          platform=Windows 10     browserName=Chrome      version=78.0        resolution=1920x1080

# Mobile (iOS)
&{IOS12.1_IPHONEXSMAX}                 build=your build name   platform=iOS            deviceName=iPhone XS Max        platformVersion=12.1