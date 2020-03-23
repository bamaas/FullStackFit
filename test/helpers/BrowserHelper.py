from robot.api import logger
from robot.libraries.BuiltIn import BuiltIn
import configparser
import tempfile
import SeleniumLibrary
from selenium import webdriver
#from selenium.webdriver.chrome.options import Options
from copy import deepcopy
import os
import sys
from SeleniumLibrary.utils import is_truthy
import time
import urllib3
import json
from selenium.webdriver.remote.command import Command


class BrowserHelper(object):
    def __init__(self):
        pass
    
    def setup_browser(self, remote_webdriver, browser, remote_url, capabilities, setup_url, maximize_window):
        logger.info('remote_webdriver: {}'.format(remote_webdriver))
        if remote_webdriver.lower() == 'true':
            # Argument  validations...
            try:
                # Because you can't pass a dictionary through CLI you have to get it like this way....
                capabilities = BuiltIn().get_variable_value("&{}".format(capabilities))
            except:
                raise Exception("Input error. The $CAPABILITIES variable is not allowed to be empty because $REMOTE_WEBDRIVER == true")
            if browser != '':
                raise Exception("""'$BROWSER' == '{}' | '$BROWSER' should not have a value if '$REMOTE_WEBDRIVER' is set to 'false', because the browser is set in the $CAPABILITIES.""".format(browser))
            remote_url_log = remote_url   # Need 2 different vars. 1 for logging and 1 for actual execution.
            if 'browserstack' in remote_url:
                base_url = remote_url.partition('@')[2]
                protocol_key = remote_url.partition('@')[0]
                protocol = protocol_key.partition('//')[0] + '//'
                key = protocol_key.partition('//')[2]
                key_secret = "*" * len(key)
                remote_url_log = protocol + key_secret + base_url
                # Add extra capabilities for BrowserStack
                capabilities['browserstack.local'] = 'true'
                test_name = BuiltIn().get_variable_value("${TEST NAME}")
                capabilities['name'] = test_name
                capabilities['project'] = 'FullStackFit'
                semaphore_git_pre_name = os.environ.get('SEMAPHORE_GIT_PR_NAME')
                git_commit_sha = os.environ.get('GIT_COMMIT_SHA', 'Untitled Build')
                capabilities['build'] = str(semaphore_git_pre_name) + ' [' + str(git_commit_sha) + ']'
                # BS local connection
                key = os.getenv("BROWSERSTACK_KEY")
                BuiltIn().run_keyword('connect_bs_to_local', key)
            logger.info('Remote URL: {}'.format(remote_url_log))
            logger.info('Capabilities: {}'.format(capabilities))
            selib = BuiltIn().get_library_instance('SeleniumLibrary')
            driver = webdriver.Remote(command_executor='{0}'.format(remote_url), desired_capabilities=capabilities)
            if maximize_window.lower() == 'true':
                driver.maximize_window()
                driver.maximize_window()     # TODO this is a workaround. Somehow the browser doesn't get fully maximized the first time. (Chrome 76 and Chromedriver 76)
                logger.info('Maximized browser window')
            window_size = driver.get_window_size()
            BuiltIn().set_tags('resolution: {}x{}'.format(window_size.get('width'), window_size.get('height')))
            driver.get(setup_url)
            print('Navigating to setup url: {}'.format(setup_url))
            index = selib.register_driver(driver, 'kvk')
            selib._drivers.switch(index)
            return index
        elif remote_webdriver.lower() == 'false':
            if remote_url != '' or capabilities != '':
                raise Exception ("'$REMOTE_URL' and '$CAPABILITIES' should not have a value if '$REMOTE_WEBDRIVER' is set to 'false'")
            # Here we create the actual browser (if needed)
            logger.info('Browser: {}'.format(browser))
            self.connect_to_browser(url=setup_url, browser=browser, alias='kvk')
            selib = BuiltIn().get_library_instance('SeleniumLibrary')
            if maximize_window.lower() == 'true':
                selib.maximize_browser_window()
                selib.maximize_browser_window()     # TODO this is a workaround. Somehow the browser doesn't get fully maximized the first time. (Chrome 76 and Chromedriver 76)
                logger.info('Maximized browser window')
            window_size = selib.get_window_size()
            BuiltIn().set_tags('resolution: {}x{}'.format(window_size[0], window_size[1]))
        else:
            raise Exception("'{}' is an incorrect value for 'remote_webdriver'. Please choose between 'true' or 'false'".format(remote_webdriver))

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

    def _driver_is_active(self, executor_url, session_id, timeout=10, max_retries=2, debug=False):
        selenium_url = executor_url + '/session/' + session_id + '/title'
        retries = urllib3.util.Retry(connect=max_retries, read=max_retries, redirect=max_retries, total=max_retries)
        http = urllib3.PoolManager(retries=retries)
        start_time = time.time()
        driver_active = False
        try:
            response = http.request('GET', selenium_url, timeout=timeout)
            if response.status == 200:
                response_data = json.loads(response.data)
                if 'status' in response_data:
                    status = response_data['status']
                    if debug: print(f'status in response: {status}')
                    if status == 0: driver_active = True
                else:
                    driver_active = True
        except:
            pass
        end_time = time.time()
        if debug: print(f'duration: {end_time - start_time}')
        return driver_active

    def _try_reuse(self, executor_url, session_ID, alias):
        is_active = self._driver_is_active(executor_url, session_ID, timeout=5, max_retries=3)
        if is_active:
            selib = BuiltIn().get_library_instance('SeleniumLibrary')
            # using the fast approach (0.1 seconds)
            new_driver = self._create_driver_session(session_ID, executor_url)
            index = selib.register_driver(new_driver, alias)
            return index

        else:
            return None

    def connect_to_browser(self, url, browser='firefox', alias=None,
                     remote_url=False, desired_capabilities=None,
                     ff_profile_dir=None, reuse=True):
        """Opens a new browser instance to the given ``url`` or connects to a browser opened in a
        previous run with the same index or alias.

        If the argument ``reuse`` is False, this keyword behaves the same as *Open Browser* keyword from the SeleniumLibrary:
        http://robotframework.org/SeleniumLibrary/SeleniumLibrary.html#Open%20Browser

        If the argument ``reuse`` is not given or True, this keyword will try to connect a browser opened in an
        earlier run. If it can connect, it will not navigate to the given URL. If it can not connect (for example because
        the browser is closed), it will open a browser in the same way as the *Open Browser* keyword.
        If the optional argument ``alias`` is given, it will try to connect to a browser opened with that same ``alias``,
        this applies for browsers opened in a previous run or in a the current run.
        If ``alias`` is not given, it will try to connect to a browser based on it's index (These indices start from 1
        and are incremented when new browsers are opened), but only from a previous run. To connect to a browser opened in
        the same run based on it's index, use the index returned by the keyword as the alias.

        *Note*: when working with more than one browser, always define ``alias`` to be sure to connect the right browser.

        Examples:
        | `Connect To Browser` | http://example.com | Chrome  | alias=Example |
        | Title Should Be | Example |
        | Go To | http://another_example.com |
        | Title Should Be | Another Example |
        | `Connect To Browser` | http://example.com | Chrome  | alias=Example |
        | Title Should Be | Another Example |
        | ${index}= | `Connect To Browser` | http://example.com | Chrome  |
        | `Connect To Browser` | http://example.com | Chrome  | alias=${index} |
        *Note*: This example test will pass on the first run, but will fail the first ``Title Should be`` on the second run.
        During the second run, the first ``Connect To Browser`` will not navigate to the given URL but just connect to the
        browser which had navigated to the second URL in the first run.
        """
        reuse = is_truthy(reuse)
        selib = BuiltIn().get_library_instance('SeleniumLibrary')

        if reuse is True:
            if alias is None:
                new_index_or_alias = str(len(selib._drivers.drivers) + 1)
            else:
                # we have to see if there is a browser in the cache with that alias
                existing_aliases = selib._drivers._aliases
                logger.debug('existing aliases: {}'.format(existing_aliases))
                # if so: connect to it and return the index
                if alias in existing_aliases:
                    index = existing_aliases[alias]
                    selib._drivers.switch(index)
                    return index
                new_index_or_alias = alias
            config = configparser.ConfigParser()
            config.read(tempfile.gettempdir() + os.sep + 'se_session.ini')
            # if there is no .ini, skip trying to connect to the previous session
            if config.has_section(new_index_or_alias):
                executor_url = config[new_index_or_alias]['url']
                session_ID = config[new_index_or_alias]['sessionid']
                logger.debug('driver details from ini: url={}; sessionid={}'.format(executor_url, session_ID))
                # check if there is a browser in the browser cache that has the same session id
                driver_cache = selib._drivers.drivers
                for driver in driver_cache:
                    # if so: connect to it and return the index
                    if driver.session_id == session_ID:
                        index = driver_cache.index(driver) + 1
                        selib._drivers.switch(index)
                        return index
                start_time = time.time()
                index = self._try_reuse(executor_url, session_ID, alias)
                end_time = time.time()
                logger.debug(end_time - start_time)
                if index is not None:
                    logger.debug('Successfully reconnected to existing session')
                    return index
                else:
                    logger.debug('Failed to reconnect to existing session')
        # replace the __init__ of Chrome to always use the options that allow xml downloads
        from selenium import webdriver
        def __init__(self, executable_path="chromedriver", port=0,
                     options=None, service_args=None,
                     desired_capabilities=None, service_log_path=None,
                     chrome_options=None, keep_alive=True):
            options = webdriver.ChromeOptions()
            options.add_experimental_option('prefs', {'safebrowsing.enabled': True})
            options.add_argument('--safebrowsing-disable-download-protection')
            options.add_argument('--safebrowsing-disable-extension-blacklist')
            # Allow multiple downloads
            options.add_experimental_option("prefs", {'profile.default_content_setting_values.automatic_downloads': 1})
            self.init(executable_path, port, options, service_args, desired_capabilities, service_log_path,
                      chrome_options, keep_alive)

        if 'init' not in dir(webdriver.Chrome):
            webdriver.Chrome.init = webdriver.Chrome.__init__
            webdriver.Chrome.__init__ = __init__

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
        # this is set when by the orig command and is needed to make the switch_to_window work
        # new_driver.w3c = False
        return new_driver