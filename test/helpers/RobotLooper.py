import sys
from robot.conf import RobotSettings
from robot.api import TestSuiteBuilder
import robot
from robot.utils import Application
from robot.run import USAGE
from robot import rebot
from robot.libraries.BuiltIn import BuiltIn
from robot.api import logger

class RobotLooper():

    def data_tags(self, *lst_values):
        lst_tags = BuiltIn().get_variable_value("@{TEST TAGS}")
        if isinstance(lst_values, tuple):
            logger.debug("[data tags] len(lst_values) = {}".format(len(lst_values)))
            if len(lst_values) > 0:
                if len(lst_tags) == 0:
                    return lst_values[0]
                else:
                    tag = lst_tags[0]
                    try:
                        tag_index = lst_values.index(tag)
                        BuiltIn().set_global_variable("${DATA TAG INDEX}", tag_index)
                        return tag
                    except ValueError:
                        BuiltIn().set_global_variable("${DATA TAG INDEX}", -1)
                        return lst_values[0]

            else:
                BuiltIn().fail("Keyword 'Data Tags' expected 1 or more arguments, got 0.")
                return None
        else:
            logger.warn('something is wrong with the arguments: {}'.format(lst_values))
            return lst_values

    def data_row(self, *lst_values):
        if isinstance(lst_values, tuple):
            if len(lst_values) > 0:
                tag_index = BuiltIn().get_variable_value("${DATA TAG INDEX}")
                if tag_index == -1 or tag_index is None:
                    return lst_values[0]
                else:
                    logger.debug("[data row] tag_index = {}; len(lst_values) = {}".format(tag_index, len(lst_values)))
                    if tag_index < len(lst_values):
                        return lst_values[tag_index]
                    else:
                        BuiltIn().fail("Column of data tag '{}' ({}) is higher than the number of values: {}".format(
                            BuiltIn().get_variable_value("@{TEST TAGS}")[0], tag_index + 1, lst_values))
            else:
                BuiltIn().fail("Keyword 'Data Row' expected 1 or more arguments, got 0.")
                return None
        else:
            logger.warn('something is wrong with the arguments: {}'.format(lst_values))
            return lst_values


class Run():

    def run(self, *tests, **options):
        debug = False
        app = Application(USAGE)
        dict_all_options, arguments = app._parse_arguments(*tests)
        # something weird is happening, from here _parse_arguments returns a dict with all
        # options (but with value None or []), while in robot it only gives the options that
        # are in the sys.argv. adding arg_limits, env_options and logger doesn't make a difference
        # workaround: build a new dict without the empty options
        dict_options = dict()
        list_included_test = []
        for option in dict_all_options:
            if dict_all_options[option] is not None:
                dict_options[option] = dict_all_options[option]
        settings = RobotSettings(dict_options)
        if debug is True:
            print(settings)
        suite = TestSuiteBuilder().build(arguments[0])
        if len(suite.suites) == 0:
            testsuites = [suite]
        else:
            testsuites = suite.suites
        for testsuite in testsuites:
            testsuite.filter(included_tests=dict_options['test'])
        suite.remove_empty_suites()
        for testsuite in testsuites:
            for test in testsuite.tests:
                tuple_tags = ()
                test_name = test.name
                for kw in test.keywords:
                    if kw.name.lower() == 'data tags':
                        tuple_tags = kw.args
                iterator = 1
                if len(tuple_tags) > 1:
                    new_test = robot.running.model.TestCase.deepcopy(test)
                    if "{ROLE}" in test.name:
                        test.name = test_name.replace("{ROLE}", tuple_tags[0])
                    else:
                        test.name = test_name + ' (' + tuple_tags[0] + ')'
                    for tag in tuple_tags[1:]:
                        if "{ROLE}" in test_name:
                            new_test.name = test_name.replace("{ROLE}", tag)
                        else:
                            new_test.name = test_name + ' (' + tag + ')'
                        for kw in new_test.keywords:
                            if kw.name.lower() == 'data tags':
                                kw.args = kw.args[1:]
                            if kw.name.lower() == 'data row':
                                kw.args = kw.args[1:]
                        testsuite.tests.insert(testsuite.tests.index(test) + iterator, new_test)
                        iterator += 1
                        new_test = robot.running.model.TestCase.deepcopy(new_test)
            # because we keep copying copies, we could not add tags and could not set the data row args to a single value
            # so we need to add the tags and set the data rg ow args to a single value in another loop
            for test in testsuite.tests:
                for kw in test.keywords:
                    if kw.name.lower() == 'data tags':
                        test.tags.add(kw.args[0])
                        kw.args = (kw.args[0],)
                    if kw.name.lower() == 'data row':
                        if len(kw.args) > 0:
                            kw.args = (kw.args[0],)
            if debug is True: 
                print("\n\nTestsuite:", testsuite)
                print("------------------------")
                print("All tests in this testsuite:", testsuite.tests, "\n")
                print("Tests:", settings['TestNames'], "\n")
                print("Include tag:", dict_options['include'], "\n")
                print("Exclude tag:", dict_options['exclude'], "\n")
                print("Tests before filtering:", testsuite.tests, "\n")
            if len(settings['ReRunFailed']) > 0:
                # Only run the tests that are needed to be re-executed.
                testsuite.filter(included_tests=settings['ReRunFailed'])
            else:
                # 'normal' filtering
                # apply the -e and -i arguments by using a filter
                testsuite.filter(included_tags=dict_options['include'])
                testsuite.filter(excluded_tags=dict_options['exclude'])
            if debug is True:
                print("Tests after filtering:", testsuite.tests, "\n\n\n")
        suite.remove_empty_suites()
        # if suite.test_count == 0:
        results = suite.run(settings)
        # this only creates the output.xml, so we have to rebot to generate the htmls
        try:
            robot.rebot(settings['Output'], outputdir=settings['OutputDir'], log=settings['Log'], report=settings['Report'])
        except:
            rebot(settings['Output'], outputdir=settings['OutputDir'], log=settings['Log'], report=settings['Report'])
        if results.return_code != 0:
            sys.exit(1)
        else:
            sys.exit(0)
        


if __name__ == '__main__':
    Run().run(sys.argv[1:])