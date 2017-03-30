import sqlite3
from ..utils import helpers
import sql


class DatabaseManager(object):
    def __init__(self, datafile):
        self.conn = sqlite3.connect(datafile)
        self.cursor = self.conn.cursor()

    def drop_tables(self):
        for sql in sql.drop_tables:
            self.cursor.execute(sql)
        self.conn.commit()
        return self

    def create_tables(self):
        for sql in sql.create_tables:
            self.cursor.execute(sql)
        self.conn.commit()
        return self

    def close(self):
        self.conn.close()

    def commit(self):
        self.conn.commit()

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

    def select(self, table, param=None):
        query = sql.select.get(table)
        self.cursor.execute(query, param)
        return helpers.convert_to_float_rec(self.cursor.fetchall())

    def delete(self, table):
        query = sql.delete.get(table)
        self.cursor.execute(query)
        self.commit()
        return self

    def download(self, table):
        query = sql.download.get(table)
        self.cursor.execute(query)
        return helpers.convert_to_float_rec(self.cursor.fetchall())


def init_database():
    DatabaseManager('./db.sqlite3').drop_tables().create_tables().close()


if __name__ == '__main__':
    init_database()
