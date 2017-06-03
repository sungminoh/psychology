import sqlite3
import sql
import os
import sys
dir_path = os.path.dirname(os.path.realpath(__file__))
sys.path.insert(0, os.path.join(dir_path, '..'))
from utils import helpers


class DatabaseManager(object):
    def __init__(self, datafile):
        self.datafile = datafile
        self.connect()

    def connect(self):
        self.conn = sqlite3.connect(self.datafile)
        self.cursor = self.conn.cursor()

    def close(self):
        self.conn.close()

    def commit(self):
        self.conn.commit()

    def drop_tables(self):
        for query in sql.drop_tables:
            self.cursor.execute(query)
        self.conn.commit()
        return self

    def create_tables(self):
        for query in sql.create_tables:
            self.cursor.execute(query)
        self.conn.commit()
        return self

    def get_test_id(self, table):
        self.cursor.execute('SELECT MAX(test_id) FROM %s' % table)
        max_test_id = self.cursor.fetchone()[0]
        if max_test_id is not None:
            return max_test_id + 1
        else:
            return 1

    def insert(self, table, data):
        query = sql.insert.get(table)
        self.cursor.executemany(query, data)
        self.commit()
        return self

    def select(self, table):
        query = sql.select.get(table)
        print query
        self.cursor.execute(query)
        return helpers.convert_to_float_rec(self.cursor.fetchall())

    def delete(self, table):
        query = sql.delete.get(table)
        self.cursor.execute(query)
        self.commit()
        return self


def init_database():
    DatabaseManager('./data/db.sqlite3').drop_tables().create_tables().close()


if __name__ == '__main__':
    init_database()
