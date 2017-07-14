drop database if exists bamazon;
create database bamazon;

use bamazon;
create table products (
	item_id integer(10) auto_increment not null,
    product_name varchar(30) not null,
	department_name varchar(30) not null,
    price decimal(10,2),
    stock_quantity integer(10),
    product_sales decimal(10,2) default 0.00,
    primary key (item_id)
);

create table departments (
	department_id integer(10) auto_increment not null,
    department_name varchar(30) not null,
    over_head_costs integer(10) not null,
    primary key (department_id)
);

insert into departments (department_name, over_head_costs)
values ('Board Games', 1000),
	('D&D', 500);

insert into products (product_name, department_name, price, stock_quantity, product_sales)
values ('Tokaido', 'Board Games', 39.99, 5, 399.59),
	('Codenames', 'Board Games', 19.95, 10, 199.50),
    ('Cards Against Humanity', 'Board Games', 25.00, 20, 500.00),
    ('Pandemic', 'Board Games', 39.99, 2, 399.00),
    ('Twilight Imperium', 'Board Games', 110.99, 14, 443.96);
    
    
insert into products (product_name, department_name, price, stock_quantity, product_sales)
values ('Players Handbook', 'D&D', 31.00, 9, 93.00),
	('Starter Set', 'D&D', 29.00, 4, 290.00),
    ('Dungeon Masters Guide', 'D&D', 31, 7, 341.00),
    ('Monster Manual', 'D&D', 38.00, 6, 114.00),
    ('Curse of Strahd', 'D&D', 38.00, 2, 74.00);
