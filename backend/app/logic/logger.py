import os
import sys
from storage import PGDatabaseHandler as pg
from datetime import datetime
import json

TABLE_NAME = 'bodyweight'

class DateTimeEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, datetime):
            return o.isoformat()
        return json.JSONEncoder.default(self, o)

class Bodyweight(object):
    def insert(self, weight, table=TABLE_NAME):
        pg.execute_sql_query("INSERT INTO {} (datetime, weight) VALUES (current_timestamp, {})".format(table, weight))

    def get_all(self, table=TABLE_NAME):
        # TODO fix the select * FROM to select weight, datetime
        records = pg.execute_sql_query("SELECT * FROM {}".format(table))
        json_string = json.dumps(records, cls=DateTimeEncoder, sort_keys=True, indent=4)
        print(json_string)
        return json_string