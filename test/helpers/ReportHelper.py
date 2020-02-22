from robot.api import logger
from robot.libraries.BuiltIn import BuiltIn

def set_suite_tags(environment, remote_webdriver, capabilities, browser):
    """ This function appends tags to a test case depending on the given remote_webdriver
        if the remote_webdriver is 'true' the set_capabilities_as_test_tags is being executed.
        If not, it only tags the TC with the browserName. """
    BuiltIn().set_tags("environment: {}".format(environment.title()))
    BuiltIn().set_tags("remote_webdriver: {}".format(remote_webdriver.title()))
    if remote_webdriver.lower() == 'true':
        if '{' in str(capabilities):
            raise Exception('Please provide the $CAPABILITIES argument with the name (string) of the dictionary from browser_capabilities.robot that you want to use')
        else:
            try:
                get_capabilities = BuiltIn().get_variable_value("&{}".format(capabilities))
            except:
                raise Exception("Input error. The $CAPABILITIES variable seems empty when $REMOTE_WEBDRIVER is set to True.")
            if get_capabilities is None:
                raise Exception("Couldnt find variable {} Did you use a & in the browser_capabilities.robot instead of a $".format(capabilities))
        set_capabilities_as_test_tags(get_capabilities)
    elif remote_webdriver.lower() == 'false':
        BuiltIn().set_tags("browserName: {}".format(browser.title()))

def set_capabilities_as_test_tags(capabilities):
    """ This function appends tags to a test case according to the key:value pairs
        of the given capabilities dictionary. Argument capabilities, needs to be a dictionary"""
    for key in capabilities:
        if key == 'platformVersion':
            if capabilities.get('platform') == None:
                platform = capabilities.get('platformName')
            if platform is None:
                raise Exception("Error: couldn't find a value for key platform or platformName in the capabilities dictionary.")
            BuiltIn().set_tags("{}: {} ({})".format(key, capabilities[key], platform))
        elif key == 'version':
            browser_name = capabilities.get('browserName')
            BuiltIn().set_tags("{} version: {}".format(browser_name, capabilities[key]))
        elif key == 'os_version':
            os = capabilities.get('os')
            os_version = capabilities.get('os_version')
            BuiltIn().set_tags("os_version: {} ({})".format(os_version, os))
        elif key == 'tunnel' or key == 'chromeOptions' or key == 'browserstack.local':
            # This ensures that the key 'tunnel' is not added to the test tags
            pass
        else:
            BuiltIn().set_tags("{}: {}".format(key, capabilities[key]))