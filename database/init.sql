CREATE TABLE log (id SERIAL PRIMARY KEY, date TIMESTAMP, weight REAL, note TEXT);
CREATE TABLE weekly_average (year SMALLINT, week, SMALLINT, weight REAL, PRIMARY KEY (year, week));