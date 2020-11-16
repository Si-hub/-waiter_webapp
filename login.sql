create table accounts (
	id serial not null primary key,
    username text not null ,
    pass_word text not null,
    
);

INSERT INTO accounts ('id', 'username', 'pass_word') VALUES (1, 'simthera', 'sim123$%');