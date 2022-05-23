create table user(
id int PRIMARY KEY AUTO_INCREMENT,
address varchar(255),
username varchar(255),
password varchar(255),
receive_address text,
launch_num  int(10) default 0,
success_num int(10) default 0,
balance  int(10),
photo    varchar(255) default ''
);


create table product(
id int PRIMARY KEY AUTO_INCREMENT,
category varchar(30),
productName varchar(255),
sellers varchar(255),
price decimal(7,1),
information   text,
img_link      varchar(255),
launch_time  varchar(255),
end_time     varchar(255),
userid  int(10),
collectuser int(10),
hash        varchar(255),
CONSTRAINT FOREIGN key(userid) REFERENCES user(id)
);

create table comment(
id int primary key auto_increment,
productid  int(10),
comment  text,
constraint foreign key(productid) references product(id)
);

create table indent(
indentid int primary key auto_increment,
productid int,
sellers    varchar(255),
buyers      int,
deliver    varchar(255),
tuikuan    varchar(255) default '',
buynum     int(11)      default 1,
yuanyin    text
);
create table chat(
id      int primary key auto_increment,
userid  int,
time    varchar(255),
msg     text
);

