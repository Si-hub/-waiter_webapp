Drop table admin_checkin;
Drop table waiters;
Drop table days_working;

create table waiters (
	id serial not null primary key,
    waiter_name text not null
      
);

create table days_working (
    id serial not null primary key,
    day_name text not null
);

INSERT INTO days_working (day_name) VALUES ('Sunday');
INSERT INTO days_working (day_name) VALUES ('Monday');
INSERT INTO days_working (day_name) VALUES ('Tuesday');
INSERT INTO days_working (day_name) VALUES ('Wednesday');
INSERT INTO days_working (day_name) VALUES ('Thursday');
INSERT INTO days_working (day_name) VALUES ('Friday');
INSERT INTO days_working (day_name) VALUES ('Sartuday');

create table admin_checkin(
    id serial not null primary key,
    waiter_id int,
    day_id int,
   FOREIGN KEY (waiter_id) REFERENCES waiters(id),
   FOREIGN KEY (day_id) REFERENCES days_working(id)
);
