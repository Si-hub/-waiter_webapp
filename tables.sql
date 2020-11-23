DROP TABLE IF EXISTS  dayShifts;
DROP TABLE IF EXISTS waiters;
DROP TABLE IF EXISTS weekdays;

CREATE TABLE waiters (
	id serial not null primary key,
    waiter_name text not null
      
);

CREATE TABLE weekdays (
    id serial not null primary key,
    day_name text not null
);

-- -- INSERT weekdays
INSERT INTO weekdays (day_name) VALUES ('Monday');
INSERT INTO weekdays (day_name) VALUES ('Tuesday');
INSERT INTO weekdays (day_name) VALUES ('Wednesday');
INSERT INTO weekdays (day_name) VALUES ('Thursday');
INSERT INTO weekdays (day_name) VALUES ('Friday');
INSERT INTO weekdays (day_name) VALUES ('Sartuday');
INSERT INTO weekdays (day_name) VALUES ('Sunday');


CREATE TABLE dayShifts(
    id serial not null primary key,
    waiter_id int,
    day_id int,
   FOREIGN KEY (waiter_id) REFERENCES waiters(id),
   FOREIGN KEY (day_id) REFERENCES weekdays(id)
);

--put tablename.column_name so that SQL might not incorrectly assume which table it is coming from
SELECT waiters.waiter_name, weekdays.day_name FROM dayShifts 
JOIN waiters ON waiters.id = dayShifts.waiter_id
JOIN weekdays ON weekdays.id = dayShifts.day_id;