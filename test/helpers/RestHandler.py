from datetime import datetime
from decimal import *
from requests import Session
import datetime
from robot.api import logger
from robot.libraries.BuiltIn import BuiltIn
import ast
import copy
import traceback
import json
from jsonpath_rw import jsonpath
from jsonpath_rw_ext import parse
import jsonpath_rw_ext as jp

class RestHandler(object):
    def get_from_JSON(self, json_file, jpath):
        """ 
        Search for a value in the given json file. 
        If multiple matches found it returns multiple matches 
        """
        data = json.dumps(json_file)    # Dict to string
        data = json.loads(data)         # string to json - pretty cumbersome
        value = jp.match(jpath, data)
        if len(value) == 0:
            raise Exception(f"No value found with jpath '{jpath}'")
        logger.info(f"Found '{value[0]}' with jpath '{jpath}'.")
        return value[0]

    def assert_JSON(self, json_file, jpath, expected_value, expected_type='string'):
        """ 
        Search for a value in a JSON file by giving a JSONPath.
        And validate the expected value against the actual/found value.
        """
        actual_value = self.get_from_JSON(json_file, jpath)
        if str(actual_value) != str(expected_value):
            BuiltIn().fail(f"Assertion failed. Actual value '{actual_value}' is not equal to the expected value of '{expected_value}'.")
        else:
            logger.info(f"Assertion passed. Actual value '{actual_value}' is equal to the expected value of '{expected_value}'.")

    def report_last_output_message_on_failure(self):
        status = BuiltIn().get_variable_value("${TEST STATUS}")
        if status == 'FAIL':
            try:
                history = BuiltIn().get_variable_value("${output}")
                if history is not None:
                    history = json.dumps(history, indent=4, sort_keys=True)
                    test_name = BuiltIn().get_variable_value("${TEST_NAME}")
                    logger.warn("Last output message in test '{}': {}".format(test_name, history))
            except:
                logger.info("No output message to report")

    def assert_dictionary(self, actual_dict, expected_json, msg=None):
        if isinstance(actual_dict, dict):
            try:
                expected_dict = ast.literal_eval(expected_json)
                assert_dictionary_with_json(actual_dict, expected_dict, msg)
            except ValueError as errorDescription:
                logger.error('ValueError decoding {}: {}'.format(expected_json, errorDescription))
            except SyntaxError as errorDescription:
                logger.error('SyntaxError decoding {}: {}'.format(expected_json, errorDescription))
        else:
            BuiltIn().fail("The first argument of 'assert dictionary' must be a dictionary.")

    def get_value_from_dictionary(self, actual_dict, key):
        if isinstance(actual_dict, dict):
            value = get_from_dictionary_with_json(actual_dict, key)
            return value
        else:
            BuiltIn().fail("The first argument of 'get value from dictionary' must be a dictionary.")


class NodeFound:
    def __init__(self, actual_value, expected_value):
        self.actual_value = actual_value
        self.expected_value = expected_value

    def __str__(self):
        return 'Node already found'


def find_dict_in_dict(actual_dict, expected_dict):
    # does not log, does not fail the test
    bln_has_selector = False
    selectors = {}
    values = {}
    bln_key_found = False
    for expected_key in expected_dict:
        if expected_key[0] == '*':
            bln_has_selector = True
            selectors[expected_key[1:]] = expected_dict[expected_key]
        else:
            values[expected_key] = expected_dict[expected_key]
    for expected_key in expected_dict:
        bln_key_found = False
        if bln_has_selector is False:
            if expected_key in actual_dict:
                bln_key_found = True
                if isinstance(expected_dict[expected_key], dict) and isinstance(actual_dict[expected_key], dict):
                    bln_key_found = find_dict_in_dict(actual_dict[expected_key], expected_dict[expected_key])
                elif isinstance(expected_dict[expected_key], dict) and isinstance(actual_dict[expected_key], list):
                    bln_sub_has_selector = False
                    sub_selectors = {}
                    sub_values = {}
                    for sub_expected_key in expected_dict[expected_key]:
                        if sub_expected_key[0] == '*':
                            bln_sub_has_selector = True
                            sub_selectors[sub_expected_key[1:]] = expected_dict[expected_key][sub_expected_key]
                        else:
                            sub_values[sub_expected_key] = expected_dict[expected_key][sub_expected_key]
                    bln_node_found_in_list = False
                    current_item_index = 0
                    for actual_list_item in actual_dict[expected_key]:
                        current_item_index += 1
                        if bln_sub_has_selector is True:
                            if all(item in actual_list_item.items() for item in sub_selectors.items()) is True:
                                bln_next_node_found = find_dict_in_dict(actual_list_item, sub_values)
                                for value_key in sub_values:
                                    expected_dict[expected_key][value_key] = sub_values[value_key]
                                for selector_key in sub_selectors:
                                    expected_dict[expected_key]['*' + selector_key] = NodeFound(None, None)
                                bln_node_found_in_list = bln_node_found_in_list or bln_next_node_found
                            else:
                                bln_next_node_found = find_dict_in_dict(actual_list_item, expected_dict[expected_key])
                                bln_node_found_in_list = bln_node_found_in_list or bln_next_node_found
                        else:
                            bln_next_node_found = find_dict_in_dict(actual_list_item, expected_dict[expected_key])
                            bln_node_found_in_list = bln_node_found_in_list or bln_next_node_found
                        if bln_node_found_in_list is True:
                            break
                    bln_key_found = bln_node_found_in_list
                else:
                    if isinstance(expected_dict[expected_key], NodeFound) is False:
                        expected_dict[expected_key] = NodeFound(actual_dict[expected_key], expected_dict[expected_key])
        else:
            bln_selectors_all_there = True
            for selector in selectors:
                bln_selector_is_there = False
                if selector in actual_dict:
                    if isinstance(selectors[selector], dict):
                        if isinstance(actual_dict[selector], dict):
                            bln_selector_is_there = find_dict_in_dict(actual_dict[selector], selectors[selector])
                        else:
                            # the item is a list
                            bln_selector_is_there = False
                            for list_item in actual_dict[selector]:
                                bln_selector_is_there = find_dict_in_dict(list_item, selectors[selector])
                                if bln_selector_is_there:
                                    break
                    else:
                        if selectors[selector] == actual_dict[selector]:
                            bln_selector_is_there = True
                if not bln_selector_is_there:
                    bln_selectors_all_there = False
                    break
            if bln_selectors_all_there is True:
                for selector_key in selectors:
                    expected_dict['*' + selector_key] = NodeFound(None, None)
                if len(values) == 0:
                    bln_key_found = True
                else:
                    bln_key_found = find_dict_in_dict(actual_dict, values)
                for value_key in values:
                    expected_dict[value_key] = values[value_key]
    if bln_key_found is False:
        for strActualKey in actual_dict:
            if isinstance(actual_dict[strActualKey], list):
                bln_node_found_in_list = False
                current_item_index = 0
                for actual_list_item in actual_dict[strActualKey]:
                    current_item_index += 1
                    if bln_has_selector is True:
                        bln_selectors_all_there = True
                        for selector in selectors:
                            bln_selector_is_there = False
                            if selector in actual_list_item:
                                if isinstance(selectors[selector], dict):
                                    bln_selector_is_there = find_dict_in_dict(actual_list_item[selector],
                                                                              selectors[selector])
                                else:
                                    if selectors[selector] == actual_list_item[selector]:
                                        bln_selector_is_there = True
                            if not bln_selector_is_there:
                                bln_selectors_all_there = False
                                break
                        if bln_selectors_all_there is True:
                            if len(values) == 0:
                                bln_next_node_found = True
                            else:
                                bln_next_node_found = find_dict_in_dict(actual_list_item, values)

                            for value_key in values:
                                expected_dict[value_key] = values[value_key]
                            for selector_key in selectors:
                                expected_dict['*' + selector_key] = NodeFound(None, None)
                            bln_node_found_in_list = bln_node_found_in_list or bln_next_node_found
                        else:
                            bln_next_node_found = find_dict_in_dict(actual_list_item, expected_dict)
                            bln_node_found_in_list = bln_node_found_in_list or bln_next_node_found
                    else:
                        if isinstance(actual_list_item, dict) or isinstance(actual_list_item, list):
                            bln_next_node_found = find_dict_in_dict(actual_list_item, expected_dict)
                            bln_node_found_in_list = bln_node_found_in_list or bln_next_node_found
                    if bln_node_found_in_list is True:
                        break
                bln_key_found = bln_node_found_in_list
            elif isinstance(actual_dict[strActualKey], dict):
                bln_key_found = find_dict_in_dict(actual_dict[strActualKey], expected_dict)
            if bln_key_found is True:
                break
    return bln_key_found


def assert_dictionary_with_json(actual_dict, expected_json, msg=None):
    # fails the test on error, does not log
    find_dict_in_dict(actual_dict, expected_json)
    result = report_assert_dictionary_with_json(expected_json)
    if isinstance(result, str):
        if msg is None:
            BuiltIn().fail(result)
        else:
            BuiltIn().fail(msg)


def report_assert_dictionary_with_json(expected_dict):
    # logs errors, does not fail the test
    for key in expected_dict:
        if isinstance(expected_dict[key], dict):
            result = report_assert_dictionary_with_json(expected_dict[key])
            if isinstance(result, NodeFound) is False:
                return result
        elif isinstance(expected_dict[key], NodeFound) is False:
            if key[0] == '*':
                pass
                return "Key '{}' with value '{}' not found".format(key[1:], expected_dict[key])
            else:
                return "Key '{}' not found".format(key)
        else:
            if key[0] != '*':
                if isinstance(expected_dict[key].actual_value, datetime.date) is True:
                    expected_dict[key].actual_value = expected_dict[key].actual_value.strftime('%Y-%m-%d')
                if isinstance(expected_dict[key].actual_value, datetime.datetime) is True:
                    expected_dict[key].actual_value = expected_dict[key].actual_value.strftime('%Y-%m-%d')
                if expected_dict[key].actual_value == expected_dict[key].expected_value:
                    logger.info(
                        "Assert of value for key '{}' passed: {}".format(key, expected_dict[key].actual_value))
                else:
                    return "Assert of value for key '{}' failed, expected: {}, actual: {}".format(key,
                                                                                                  expected_dict[
                                                                                                      key].expected_value,
                                                                                                  expected_dict[
                                                                                                      key].actual_value)
            else:
                if len(expected_dict) == 1:
                    pass
                    return expected_dict[key]


def complete_search_json(search_json):
    curly_position = search_json.find('}')
    if curly_position == -1:
        search_json = '{{"{}"}}'.format(search_json)
    try:
        completed_search_dict = json.loads(search_json)
        BuiltIn().fail('{} not valid: no search key found'.format(search_json))
    except json.decoder.JSONDecodeError:
        formatted_lines = traceback.format_exc().splitlines()
        err = (formatted_lines[-1])
        err_pos = int(err[err.find('(char') + 6:-1])
        enhanced_search_json = (search_json[:err_pos] + ': null' + search_json[err_pos:]).strip()
        try:
            search_dict = json.loads(enhanced_search_json)
            return search_dict
        except:
            formatted_lines = traceback.format_exc().splitlines()
            err = (formatted_lines[-1])
            err_pos = int(err[err.find('(char') + 6:-1]) - len(': None')
            err_msg = 'Error in argument at position {}: '.format(err_pos) + search_json[:err_pos] + '^' + search_json[
                                                                                                           err_pos:]
            BuiltIn().fail(err_msg)


def get_from_dictionary_with_json(actual_dict, search_json):
    # fails the test on error, does not log
    search_dict = complete_search_json(search_json)
    original_search_dict = copy.deepcopy(search_dict)
    find_dict_in_dict(actual_dict, search_dict)
    if isinstance(search_dict, dict):
        # temp_search_dict = copy.deepcopy(search_dict)
        # temp_found = report_get_from_dictionary_with_json(temp_search_dict, original_search_dict)
        # print("result from 'report get': {} [{}]".format(temp_found, type(temp_found)))
        # if isinstance(temp_found, NodeFound):
        #     print("value: {}".format(temp_found.actual_value))
        found = report_get_from_dictionary_with_json(search_dict, original_search_dict)
        if isinstance(found, NodeFound):
            return found.actual_value
        elif isinstance(found, str):
            BuiltIn().fail(found)
        else:
            BuiltIn().fail("Key '{}' not found".format(search_json))
            return None
    elif isinstance(search_dict[search_json], NodeFound) is False:
        logger.error('node {} not found'.format(search_json))
        BuiltIn().fail('key not found')
        return None
    else:
        return search_dict[search_json].actual_value


def report_get_from_dictionary_with_json(expected_dict, search_dict):
    # should act the same as report_get_from_dictionary_with_json: logs errors, does not fail the test
    for key in expected_dict:
        if search_dict[key] is None:
            if isinstance(expected_dict[key], NodeFound):
                logger.info("Value for key = '{}': {}".format(key, expected_dict[key].actual_value))
                return expected_dict[key]
            else:
                return
        elif isinstance(expected_dict[key], NodeFound):
            # this can be a selector
            if key[0] != '*':
                return "Key '{}' found, but it's value is not an object (expected: {}; actual: {})".format(key, str(
                    search_dict[key]).replace('None', '¿value?'), expected_dict[key].actual_value)
            else:
                pass
        elif isinstance(search_dict[key], dict):
            return report_get_from_dictionary_with_json(expected_dict[key], search_dict[key])
        else:
            pass