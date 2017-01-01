DROP TABLE IF EXISTS app1;
DROP TABLE IF EXISTS app2;
DROP TABLE IF EXISTS app3;
DROP TABLE IF EXISTS app4;


CREATE TABLE app1(
    id              INTEGER PRIMARY KEY AUTO_INCREMENT,
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

CREATE TABLE app2(
    id              INTEGER PRIMARY KEY AUTO_INCREMENT,
    test_id         VARCHAR(255) NOT NULL,
    letter          CHARACTER(1) NOT NULL,
    rotation        INTEGER NOT NULL,
    flip            TINYINT(1) NOT NULL,
    user_input      TINYINT(1) NOT NULL,
    correct         TINYINT(1) NOT NULL,
    delay           INTEGER NOT NULL,
    ts              TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE app3(
    id              INTEGER PRIMARY KEY AUTO_INCREMENT,
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

CREATE TABLE app4(
    id              INTEGER PRIMARY KEY AUTO_INCREMENT,
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

