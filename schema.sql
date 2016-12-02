DROP TABLE IF EXISTS app1;
DROP TABLE IF EXISTS app2;

CREATE TABLE app1(
    id              INTEGER PRIMARY KEY AUTO_INCREMENT,
    test_id         INTEGER NOT NULL,
    boxes           INTEGER NOT NULL,
    is_changed      TINYINT(1) NOT NULL,
    user_input      TINYINT(1) NOT NULL,
    correct         TINYINT(1) NOT NULL,
    expose          INTEGER NOT NULL,
    blink           INTEGER NOT NULL,
    inter           INTEGER NOT NULL,
    ts              TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE app2(
    id              INTEGER PRIMARY KEY AUTO_INCREMENT,
    test_id         INTEGER NOT NULL,
    letter          CHARACTER(1) NOT NULL,
    rotation        INTEGER NOT NULL,
    flip            TINYINT(1) NOT NULL,
    user_input      TINYINT(1) NOT NULL,
    correct         TINYINT(1) NOT NULL,
    ts              TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
