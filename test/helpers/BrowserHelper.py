from robot.api import logger
from robot.libraries.BuiltIn import BuiltIn
import configparser
import tempfile
from selenium import webdriver
from copy import deepcopy
import os


class BrowserHelper(object):
    def __init__(self):
        pass
    
    def setup_browser(self, instance_type, browser, remote_url, capabilities, setup_url):
        remote_url = BuiltIn().get_variable_value("${}".format(remote_url))
        if 'lambdatest' in remote_url:
                base_url = remote_url.partition('@')[2]
                protocol_key = remote_url.partition('@')[0]
                protocol = protocol_key.partition('//')[0] + '//'
                key = protocol_key.partition('//')[2]
                key_length = len(key)
                key_secret = "*" * key_length
                secret_remote_url = protocol + key_secret + base_url
        logger.info('Instance type: {}'.format(instance_type))
        if instance_type == 'local' and (remote_url != '' or capabilities != ''):
            if 'lambdatest' in remote_url:
                logger.info('Remote URL: {}'.format(secret_remote_url))
            else:
                logger.info('Remote URL: {}'.format(remote_url))
            logger.info('Capabilities: {}'.format(capabilities))
            raise Exception ("'remote_url' and 'capabilities' should not have a value if 'instance_type' is set to 'local'")
        if instance_type == 'remote' and (browser != ''):
            raise Exception("'browser' == '{}' | 'browser' should not have a value if 'instance type' is set to 'local', because the browser is set in the capabilities.".format(browser))
        if instance_type == 'local':
            logger.info('Browser: {}'.format(browser))
            self.connect_to_browser(url=setup_url, browser=browser, alias='kvk')
            selib = BuiltIn().get_library_instance('SeleniumLibrary')
            selib.maximize_browser_window()
        elif instance_type == 'remote':
            if 'lambdatest' in remote_url:
                logger.info('Remote URL: {}'.format(secret_remote_url))
            else:
                logger.info('Remote URL: {}'.format(remote_url))
            capabilities = BuiltIn().get_variable_value("${}".format(capabilities))
            logger.info('Capabilities: {}'.format(capabilities))
            test_name = BuiltIn().get_variable_value("${TEST NAME}")
            # Append test name to the capabilities. This value is used as test name in lamdatest
            if 'name' in capabilities:
                raise Exception("Please remove 'name' from the capabilites dictionary. As this key value is automatically set to the test case name.")
            capabilities['name'] = test_name
            selib = BuiltIn().get_library_instance('SeleniumLibrary')
            driver = webdriver.Remote(command_executor='{0}'.format(remote_url), desired_capabilities=capabilities)
            driver.get(setup_url)
            logger.info('Navigating to setup url: {}'.format(setup_url))
            index = selib.register_driver(driver, 'kvk')
            selib._drivers.switch(index)
            return index
        else:
            raise Exception("{} is an incorrect value for 'instance_type'. Please choose between 'remote' or 'local'")


    def get_value_from_radio_buttons(self, locator):
        # this is actually a copy from a private keyword in SeLib, 'get value' from that
        # library seems to always give the value of the first radiobutton and not from the selected one
        try:
            selib = BuiltIn().get_library_instance('Selenium2Library')
        except:
            selib = BuiltIn().get_library_instance('SeleniumLibrary')
        # when locating a radio button by id, it only gives one radiobutton
        # but it is still useful as a locator, if used: find the radiobutton and then use the name to get the group
        if locator[:3] == 'id=':
            radio_button = selib.find_element(locator)
            locator = 'name={}'.format(radio_button.get_attribute('name'))
        radio_buttons = selib.find_elements(locator)
        for element in radio_buttons:
            if element.is_selected():
                return element.get_attribute('value')
        return None

    def report_screenshot(self, *locators):
        """Reports a screenshot to the report, optionally highlights element ``locator``."""
        #######################################################################
        # makes a screenshot as a base64 string and adds it to the report
        # this makes the report having screenshots without separate screenshot files
        # TODO: add an optional argument to allow adding text to the screenshot
        #######################################################################
        try:
            selib = BuiltIn().get_library_instance('Selenium2Library')
        except:
            selib = BuiltIn().get_library_instance('SeleniumLibrary')
        driver = selib._current_browser()
        highlight_color = "mediumblue"
        num_elements = 0
        for locator in locators:
            webelements = selib.find_elements(locator)
            if len(webelements) > 0:
                num_elements += 1
                webelement = webelements[0]
                pos_x = webelement.location['x'] - 10   # -5 for border, another -5 for making it pretty
                if pos_x < 0:
                    pos_x = 0
                pos_y = webelement.location['y'] - 10
                if pos_y < 0:
                    pos_y = 0
                width = webelement.size['width'] + 10   # 2 * -5 for borders
                height = webelement.size['height'] + 10
                if webelement.tag_name == 'input':
                    if webelement.get_attribute('type') == 'radio':
                        if locator[:3] == 'id=':
                            radiogroup_name = webelement.get_attribute('name')
                            webelements = selib.find_elements('name={}'.format(radiogroup_name))
                        webelement = webelements[-1]
                        width = webelement.location['x'] - pos_x + webelement.size['width'] + 10
                        height = webelement.location['y'] - pos_y + webelement.size['height'] + 10
                driver.execute_script(
                    '''var div = document.createElement("div");div.setAttribute("id", "highlight{5}");div.setAttribute("style", "height: {0}px;width: {1}px;left: {2}px;top: {3}px;background-color: transparent;border-color: {4};border-style: solid;border-width: 5px;position: absolute;");document.body.appendChild(div);'''.format(
                        height, width, pos_x, pos_y, highlight_color, num_elements))
        img = driver.get_screenshot_as_base64()
        for element_index in range(1, num_elements + 1):
            driver.execute_script(
                '''var element = document.getElementById("highlight{}");element.parentNode.removeChild(element);'''.format(element_index))
        # Set image width depending on the useragent. 
        user_agent = str(driver.execute_script("return navigator.userAgent;"))
        if "(Linux; Android" in user_agent or "(iPhone; CPU iPhone" in user_agent:
            logger.info('<img src="data:image/png;base64, {}" style="width: 40%">'.format(img), True)
        else:
            logger.info('<img src="data:image/png;base64, {}" style="width: 75%">'.format(img), True)

    def _try_reuse(self, executor_url, session_ID, alias):
        selib = BuiltIn().get_library_instance('SeleniumLibrary')
        try:
            # temporary setting the loglevel of urllib3 to 'no warnings' to prevent warnings when selenium driver is not running
            import logging
            urllib3_log = logging.getLogger("urllib3")
            current_log_level = urllib3_log.level
            urllib3_log.setLevel(logging.CRITICAL)

            # try opening a remote webdriver with the URL of from the last session
            driver = webdriver.Remote(command_executor='{0}'.format(executor_url), desired_capabilities={})

            # set the loglevel of urllib3 back to the original log level
            urllib3_log.setLevel(current_log_level)

            # copy the driver object to a new object so that we can still control the window that is opened
            new_driver = deepcopy(driver)

            # switch the driver to the previous session by setting the session_id
            new_driver.session_id = session_ID

            #                # new approach, based on a solution i found on the internet
            #                # unfortunately, it fails when a new window is opened in a reused session
            #                new_driver = self._create_driver_session(strSessionID, strExecutorURL)
            # try to do a very simple action on the new driver, this will fail if the session does not exist
            # when it fails, we stop executing this function
            try:
                title = new_driver.title
            except:
                driver.close()
                return None

            # add the new driver to the WebDriverCache of the SeleniumLibrary and switch to it
            index = selib.register_driver(new_driver, alias)
            logger.debug('cache index for the new driver: {}'.format(selib._drivers.current_index))
            selib._drivers.switch(index)

            # close the empty browser window that was opened when creating the remote webdriver
            logger.debug('driver: {}, new_driver: {}'.format(driver.session_id, new_driver.session_id))
            driver.close()
            return index
        except:
            logger.debug('no selenium session')

    def connect_to_browser(self, url, browser='firefox', alias=None,
                     remote_url=False, desired_capabilities=None,
                     ff_profile_dir=None, reuse=True):
        selib = BuiltIn().get_library_instance('SeleniumLibrary')
        if reuse is True:
            if alias is None:
                new_index_or_alias = str(len(selib._drivers.drivers) + 1)
            else:
                new_index_or_alias = alias
            config = configparser.ConfigParser()
            config.read(tempfile.gettempdir() + os.sep + 'se_session.ini')
            # if there is no .ini, skip trying to connect to the previous session
            if config.has_section(new_index_or_alias):
                executor_url = config[new_index_or_alias]['url']
                session_ID = config[new_index_or_alias]['sessionid']
                logger.debug('driver details from ini: url={}; sessionid={}'.format(executor_url, session_ID))
                index = self._try_reuse(executor_url, session_ID, alias)
                if index is not None:
                    logger.debug('Successfully reconnected to existing session')
                    return index
                else:
                    logger.debug('Failed to reconnect to existing session')
        index = selib.open_browser(url, browser, alias, remote_url, desired_capabilities, ff_profile_dir)
        if reuse is True:
            driver = selib._drivers.drivers[index-1]
            executor_url = driver.command_executor._url
            session_ID = driver.session_id
            config.read(tempfile.gettempdir() + os.sep + 'se_session.ini')
            if alias is None:
                section = index
            else:
                section = alias
            config[section] = {'url': executor_url,
                             'sessionid': session_ID,
                             "driver": "webdriver.Remote(command_executor='{}', desired_capabilities={{}})".format(executor_url),
                             "driver.session_id": "'{}'".format(session_ID),
                             }
            with open(tempfile.gettempdir() + os.sep + 'se_session.ini', 'w') as configfile:
                config.write(configfile)
                configfile.close()
        return index

    def _create_driver_session(self, session_id, executor_url):
        from selenium.webdriver.remote.webdriver import WebDriver as RemoteWebDriver
        org_command_execute = RemoteWebDriver.execute

        def new_command_execute(self, command, params=None):
            if command == "newSession":
                return {'success': 0, 'value': None, 'sessionId': session_id}
            else:
                return org_command_execute(self, command, params)

        RemoteWebDriver.execute = new_command_execute
        new_driver = webdriver.Remote(command_executor=executor_url, desired_capabilities={})
        new_driver.session_id = session_id
        RemoteWebDriver.execute = org_command_execute
        return new_driver