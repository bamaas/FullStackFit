import os
from robot.api import logger

def load_env_file(filepath):
    from dotenv import load_dotenv
    load_dotenv(dotenv_path=filepath)

def connect_bs_to_local(key):
    """ Create a connection between Browserstack and localhost """
    from browserstack.local import Local
    bs_local = Local()
    bs_local_args = { "key": key, "forcelocal": "true", }
    bs_local.start(**bs_local_args)
    logger.info('Browerstack local connection:', bs_local.isRunning())
    # The default Browserstack local.stop() isn't working for some reason. 
    # But actually there is no need to close the connection as it is running inside a Docker container that gets killed after the test is done.

# def stop_bs_local():
#     bs_local.stop()