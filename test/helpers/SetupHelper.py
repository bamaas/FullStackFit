from robot.api import logger
from browserstack.local import Local
from dotenv import load_dotenv

class SetupHelper():

    ROBOT_LIBRARY_SCOPE = 'GLOBAL'

    def __init__(self):
        self.bs_local = Local()
        
    def load_env_file(self, filepath):
        load_dotenv(dotenv_path=filepath)

    def connect_bs_to_local(self, key):
        """ Create a connection between Browserstack and localhost """
        bs_local_args = { "key": key, "forcelocal": "true", }
        if not self.bs_local.isRunning():
            self.bs_local.start(**bs_local_args)
            logger.info('Created Browserstack local connection.')

    def disconnect_from_browserstack(self):
        self.bs_local.stop()
        logger.info('Stopped Browserstack local connection.')