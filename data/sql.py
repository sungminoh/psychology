drop_tables =  ["""
                DROP TABLE IF EXISTS visual_working_memory;
                ""","""
                DROP TABLE IF EXISTS mental_rotation;
                ""","""
                DROP TABLE IF EXISTS task_switching;
                ""","""
                DROP TABLE IF EXISTS stop_signal_task;
                ""","""
                DROP TABLE IF EXISTS nback;
                ""","""
                DROP TABLE IF EXISTS spatial_memory;
                """]

create_tables = ["""
                 CREATE TABLE visual_working_memory(
                 id              INTEGER PRIMARY KEY AUTOINCREMENT,
                 test_id         VARCHAR(255) NOT NULL,
                 boxes           INTEGER NOT NULL,
                 is_changed      TINYINT(1) NOT NULL,
                 user_input      TINYINT(1) NOT NULL,
                 correct         TINYINT(1) NOT NULL,
                 expose          INTEGER NOT NULL,
                 blink           INTEGER NOT NULL,
                 inter           INTEGER NOT NULL,
                 ts              TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                 );
                 ""","""
                 CREATE TABLE mental_rotation(
                 id              INTEGER PRIMARY KEY AUTOINCREMENT,
                 test_id         VARCHAR(255) NOT NULL,
                 letter          CHARACTER(1) NOT NULL,
                 rotation        INTEGER NOT NULL,
                 flip            TINYINT(1) NOT NULL,
                 user_input      TINYINT(1) NOT NULL,
                 correct         TINYINT(1) NOT NULL,
                 delay           INTEGER NOT NULL,
                 ts              TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                 );
                 ""","""
                 CREATE TABLE task_switching(
                 id              INTEGER PRIMARY KEY AUTOINCREMENT,
                 test_id         VARCHAR(255) NOT NULL,
                 val             INTEGER NOT NULL,
                 quant           INTEGER NOT NULL,
                 game_type       CHARACTER(1) NOT NULL,
                 compatibility   VARCHAR(32) NOT NULL,
                 user_input      TINYINT(1) NOT NULL,
                 correct         TINYINT(1) NOT NULL,
                 delay           INTEGER NOT NULL,
                 ts              TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                 );
                 ""","""
                 CREATE TABLE stop_signal_task(
                 id              INTEGER PRIMARY KEY AUTOINCREMENT,
                 test_id         VARCHAR(255) NOT NULL,
                 location        VARCHAR(8) NOT NULL,
                 stop            INTEGER NOT NULL,
                 user_input      VARCHAR(8) NOT NULL,
                 correct         VARCHAR(8) NOT NULL,
                 delay           INTEGER,
                 fixation        INTEGER NOT NULL,
                 blink           INTEGER NOT NULL,
                 wait            INTEGER NOT NULL,
                 ts              TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                 );
                 ""","""
                 CREATE TABLE nback(
                 id              INTEGER PRIMARY KEY AUTOINCREMENT,
                 test_id         VARCHAR(255) NOT NULL,
                 game_seq        INTEGER NOT NULL,
                 number_seq      INTEGER NOT NULL,
                 nback_type      VARCHAR(8) NOT NULL,
                 number          INTEGER NOT NULL,
                 hit             TINYINT(1) NOT NULL,
                 user_input      TINYINT(1) NOT NULL,
                 correct         TINYINT(1) NOT NULL,
                 expose          INTEGER NOT NULL,
                 blink           INTEGER NOT NULL,
                 ts              TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                 );
                 ""","""
                 CREATE TABLE spatial_memory(
                 id              INTEGER PRIMARY KEY AUTOINCREMENT,
                 test_id         VARCHAR(255) NOT NULL,
                 game_seq        INTEGER NOT NULL,
                 target_seq      INTEGER NOT NULL,
                 position        VARCHAR(16) NOT NULL,
                 user_trials     INTEGER NOT NULL,
                 speed           INTEGER NOT NULL,
                 ts              TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                 )
                 """]


insert = {
    'visual_working_memory': ('INSERT INTO visual_working_memory '
                              '(test_id, boxes, is_changed, user_input, correct, expose, blink, inter) '
                              'VALUES (?, ?, ?, ?, ?, ?, ?, ?)'),
    'mental_rotation': ('INSERT INTO mental_rotation '
                        '(test_id, letter, rotation, flip, user_input, correct, delay) '
                        'VALUES (?, ?, ?, ?, ?, ?, ?) '),
    'task_switching': ('INSERT INTO task_switching '
                       '(test_id, val, quant, game_type, compatibility, user_input, correct, delay) '
                       'VALUES (?, ?, ?, ?, ?, ?, ?, ?) '),
    'stop_signal_task': ('INSERT INTO stop_signal_task '
                         '(test_id, location, stop, user_input, correct, delay, fixation, blink, wait) '
                         'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'),
    'nback': ('INSERT INTO nback '
              '(test_id, game_seq, number_seq, nback_type, number, hit, user_input, correct, expose, blink) '
              'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'),
    'spatial_memory': ('INSERT INTO spatial_memory '
                       '(test_id, game_seq, target_seq, position, user_trials, speed) '
                       'VALUES (?, ?, ?, ?, ?, ?)')
}

select = {
    'visual_working_memory': ('SELECT '
                              'test_id, boxes, is_changed, user_input, correct, expose, blink, inter, ts '
                              'FROM visual_working_memory '),
    'mental_rotation': ('SELECT '
                        'test_id, letter, rotation, flip, user_input, correct, delay, ts '
                        'FROM mental_rotation '),
    'task_switching': ('SELECT '
                       'test_id, val, quant, game_type, compatibility, user_input, correct, delay, ts '
                       'FROM task_switching '),
    'stop_signal_task': ('SELECT '
                         'test_id, location, stop, user_input, correct, delay, fixation, blink, wait, ts '
                         'FROM stop_signal_task '),
    'nback': ('SELECT '
              'test_id, game_seq, number_seq, nback_type, number, hit, user_input, correct, expose, blink, ts '
              'FROM nback '),
    'spatial_memory': ('SELECT '
                       'test_id, game_seq, target_seq, position, user_trials, speed, ts '
                       'FROM spatial_memory ')
}

delete = {
    'visual_working_memory': ('DELETE FROM visual_working_memory'),
    'mental_rotation': ('DELETE FROM mental_rotation'),
    'task_switching': ('DELETE FROM task_switching'),
    'stop_signal_task': ('DELETE FROM stop_signal_task'),
    'nback': ('DELETE FROM nback'),
    'spatial_memory': ('DELETE FROM spatial_memory')
}
