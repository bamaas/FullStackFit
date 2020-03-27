#!/bin/bash
#####################################################################################################
# This script will start the test Docker container and execute the Robot Framework tests
# Failed tests will be re-executed, to a maximum of 3 times.
# This is useful because Selenium through a remote webdriver is not 100% stable and may give
# false positives. The final step is merging the log/output files into one log file.
# This script can be run with robotlooper or robot. Should  be provided as the first cli argument.
#####################################################################################################
CURDIR=$(pwd | grep -o '[^/]*$')
if [ $CURDIR = 'test' ]; then
    testcontainer="bash testcontainer "
elif [ $CURDIR = 'fullStackFit' ]; then
    testcontainer="bash ./test/testcontainer "
else
    echo "Please run this script from ./test or ./fullStackFit (root)"
    exit 1
fi
# Init vars
rc1=0
rc2=0
rc3=0
rc4=0
# Cleanup old logs
rm -rf ./test/logs/output*
rm -rf ./test/logs/report*
rm -rf ./test/logs/log*
echo "Execute tests (1st run)..."
$testcontainer $1 -d logs -o output1.xml -l log1.html -r report1.html "${@:2}"
rc1=$?
echo "Return Code:" $rc1
docker rm testcontainer &> /dev/null
# (2nd run) If failed then re-execute
if [[ $rc1 != 0 ]]; then 
    echo "\n\n\nRerun failed TC's (2nd run)..."
    $testcontainer $1 -d logs -o output2.xml -l log2.html -r report2.html --rerunfailed logs/output1.xml "${@:2}"
    rc2=$?
    echo "Return Code:" $rc2
    docker rm testcontainer &> /dev/null
fi
# (3rd run) If failed then re-execute
if [[ $rc2 != 0 ]]; then 
    echo "\n\n\nRerun failed TC's (3rd run)..."
    $testcontainer $1 -d logs -o output3.xml -l log3.html -r report3.html --rerunfailed logs/output2.xml "${@:2}"
    rc3=$?
    echo "Return Code:" $rc3
    docker rm testcontainer &> /dev/null
fi
# Merge results
echo "\n\n\nMerging output files... \n=============================================================================="
$testcontainer rebot -d logs -o output.xml --merge logs/output*.xml
echo "\n\n\n"
rc4=$?
# Just to be sure...
docker rm testcontainer &> /dev/null || true
# Let the job fail if one of the tests failed
if [[ $rc1 != 0 ]] || [[ $rc2 != 0 ]] || [[ $rc3 != 0 ]] || [[ $rc4 != 0 ]]; then
    exit 1
fi