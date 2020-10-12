#!/bin/bash
#####################################################################################################
# This script will start the test Docker container and execute the Robot Framework tests
# Failed tests will be re-executed, to a maximum of 3 times.
# This is useful because Selenium through a remote webdriver is not 100% stable and may give
# false positives. The final step is merging the log/output files into one log file.
#####################################################################################################
CURDIR=$(pwd | grep -o '[^/]*$')
if [ $CURDIR = 'test' ]; then
    testcontainer="bash testcontainer "
elif [ $CURDIR = 'fullStackFit' ]; then
    testcontainer="bash ./test/testcontainer "
else
    printf "Please run this script from ./test or ./FullStackFit (root)\nCURDIR: $CURDIR \n"
    exit 1
fi
# Init vars
rc1=0
rc2=0
rc3=0
rc4=0
tries=0
fail=false
# Cleanup old logs
rm -rf ./test/logs/output*
rm -rf ./test/logs/report*
rm -rf ./test/logs/log*
printf "Execute tests (1st run)...\n"
$testcontainer $1 -d logs -o output1.xml -l log1.html -r report1.html "${@:2}"
rc1=$?
tries=1
printf "Return Code: $rc1\n"
docker rm testcontainer &> /dev/null
# (2nd run) If failed then re-execute
    if [[ $rc1 != 0 ]]; then 
    printf "\n\n\nRerun failed TC's (2nd run)...\n"
    $testcontainer $1 -d logs -o output2.xml -l log2.html -r report2.html --rerunfailed logs/output1.xml "${@:2}"
    rc2=$?
    tries=2
    printf "Return Code: $rc2\n"
    docker rm testcontainer &> /dev/null
fi
# (3rd run) If failed then re-execute
if [[ $rc2 != 0 ]]; then 
    printf "\n\n\nRerun failed TC's (3rd run)...\n"
    $testcontainer $1 -d logs -o output3.xml -l log3.html -r report3.html --rerunfailed logs/output2.xml "${@:2}"
    rc3=$?
    tries=3
    printf "Return Code: $rc3\n"
    docker rm testcontainer &> /dev/null
fi
# Merge results
printf "\n\n\nMerging output files... \n==============================================================================\n"
$testcontainer rebot -d logs -o output.xml --merge logs/output*.xml
printf "\n\n\n"
rc4=$?
# Just to be sure...
docker rm testcontainer &> /dev/null || true
# Let the job fail (exit 1) if a test still failed after 3 tries.
# And exit 1 if something else went wrong. Like unexpected events that results in a return code != 0 
if [ $tries = 0 ]; then 
    exit 1
elif [[ $tries = 1 ]] && [[ $rc1 != 0 ]]; then
    exit 1
elif [[ $tries = 2 ]] && [[ $rc2 != 0 ]]; then
    exit 1
elif [[ $tries = 3 ]] && [[ $rc3 != 0 ]]; then
    exit 1
else
    exit 0
fi