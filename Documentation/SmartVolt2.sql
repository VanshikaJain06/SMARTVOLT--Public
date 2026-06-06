create schema SmartVolt2;
use SmartVolt2;

create table User(
	user_id int primary key auto_increment,
    user_firstname varchar(30) not null,
    user_lastname varchar(30) not null,
    user_phone varchar(10) not null unique,
    user_email varchar(30) not null unique,
    user_address varchar(50) not null,
    user_DOB date not null,
    user_credits int not null,
    user_license varchar(15) not null unique);

create table Company(
	com_id int primary key auto_increment,
    com_name varchar(30) not null,
    com_phone varchar(10) not null unique,
    com_email varchar(30) not null unique,
    com_address varchar(50) not null,
    com_credits int not null);

create table Port(
	port_id int primary key auto_increment,
    port_name varchar(20) not null,
    port_type varchar(30) not null,
    port_powersupply int not null);

create table EVBattery(
	bat_id int primary key auto_increment,
    bat_name varchar(30) not null,
    bat_manufacturer varchar(30) not null,
    bat_capacity int not null,
    bat_type varchar(15) not null,
    bat_chargingrate int not null,
    bat_dischargingrate int not null,
    bat_hours int not null);

create table EV(
	ev_id int primary key auto_increment,
    ev_name varchar(30) not null,
    ev_model varchar(30) not null,
    ev_company  varchar(30) not null,
    bat_id int not null,
    ev_type varchar(20) not null,
    ev_mileage int not null,
    ev_port int not null,
    foreign key (bat_id) references EVBattery(bat_id),
    foreign key (ev_port) references Port(port_id));

create table EVSE(
	evse_id int primary key auto_increment,
	evse_name varchar(30) not null,
	evse_model varchar(30) not null,
	evse_company  varchar(30) not null,
	evse_port1 int not null,
	evse_port2 int not null,
    foreign key (evse_port1) references Port(port_id),
    foreign key (evse_port2) references Port(port_id));

create table Station(
	station_id int primary key auto_increment,
    com_id int not null,
    station_location varchar(40) not null,
    station_area varchar(20) not null,
    foreign key (com_id) references Company(com_id));

create table StationEVSE(
	station_evse_id int primary key auto_increment,
    evse_id int not null,
    station_id int not null,
    foreign key(station_id) references Station(station_id),
    foreign key(evse_id) references EVSE(evse_id));

create table UserEVBattery(
	user_ev_bat_id int primary key auto_increment,
	remaining_charge int not null,
	estimated_distance int not null);

create table UserEV(
	user_ev_id int primary key auto_increment,
	user_id int not null,
	ev_id int not null,
    user_ev_bat_id int not null,
	registration_no varchar(20) not null unique,
	purchase_date date not null,
	foreign key(user_id) references User(user_id),
	foreign key(ev_id) references EV(ev_id),
    foreign key(user_ev_bat_id) references UserEVBattery(user_ev_bat_id));

create table Timeslot(
	slot_id int primary key auto_increment,
	from_time time not null,
	to_time time not null);

create table Booking(
	booking_id int primary key auto_increment,
	user_id int not null,
	user_ev_id int not null,
	station_evse_id int not null,
	booking_status varchar(15) not null,
	booking_time  datetime not null,
	slot_from int not null,
	slot_to int not null,
	transaction_id varchar(25) not null unique,
	user_bat_charge int not null,
	user_location varchar(40) not null,
    foreign key (user_id) references User(user_id),
    foreign key (user_ev_id) references UserEV(user_ev_id),
    foreign key (station_evse_id) references StationEVSE(station_evse_id),
    foreign key (slot_from) references Timeslot(slot_id),
    foreign key (slot_to) references Timeslot(slot_id));

create table Request(
	request_id int primary key auto_increment,
	com_id int not null,
	station_id int not null,
	request_time datetime not null,
	request_status varchar(15) not null,
	curr_station_supply int not null,
	requested_supply int not null,
    foreign key(com_id) references Company(com_id),
    foreign key(station_id) references Station(station_id));
  
create table RequestResolve(
	resolve_id int primary key auto_increment,
	request_id int not null,
	response_from varchar(10) not null,
	response_time datetime not null,
	response_supply int not null,
	slot_from int not null,
	slot_to int not null,
    foreign key(request_id) references Request(request_id),
    foreign key(slot_from) references Timeslot(slot_id),
    foreign key(slot_to) references Timeslot(slot_id));

create table Reports(
	report_id int primary key auto_increment,
	report_from varchar(10) not null,
	report_time datetime not null,
	report_status varchar(15) not null,
	report_description varchar(200) not null);


insert into User (user_firstname, user_lastname, user_phone, user_email, user_address, user_DOB, user_credits, user_license) values
	("Ashwin", "Kumar V", "9148827639", "ashwingt20001@gmail.com", "muthyalanagar", "2000-03-12", 200, "REQ234567"),
	("Vanshika", "Jain", "6204943110", "vanshika@gmail.com", "HSR layout", "2000-02-23", 196, "LNC654372"),
	("Saumya", "Thukral", "9801460419", "saumya@gmail.com", "Church Street", "2000-03-14", 197, "FNC6543201");

insert into Company (com_name, com_phone, com_email, com_address, com_credits) values
	("Siemens", "7896665553","ashwinkumarv9@gmail.com", "Muthyalanagar", 500),
	("Shells", "765245827", "shells57@gmail.com", "Jayanagar", 467),
	("ABB", "9328604192", "abb43@gmail.com", "Shantinagar", 437);
    
insert into Port (port_name, port_type, port_powersupply) values
	("J1772", "Lvl1 AC", 12),
	("CHAdeMO", "Lvl3 DC", 11),
	("Tesla Super Charger", "Lvl3 DC", 10);

insert into EVBattery (bat_name, bat_manufacturer, bat_capacity, bat_type, bat_chargingrate, bat_dischargingrate, bat_hours) values
	("Cosmics", "BYD", 60, "Li-Ion", 3, 4, 12),
	("Power metz", "Panasonic", 70, "Li-Ion", 5, 4, 11),
	("Day Track", "CALB", 80, "Li-Ion", 4, 4, 13);

insert into EV (ev_name, ev_model, ev_company, bat_id, ev_type, ev_mileage, ev_port) values
	("Altis", "325ci", "Arcfox", 1,"BEV", 14, 1),
	("Apex", "682sq", "ZYD", 2, "BEV", 15, 2),
	("Alcraft", "872tc", "Taurale", 3, "BEV", 16, 2);

insert into EVSE (evse_name, evse_model, evse_company, evse_port1, evse_port2) values
	("Servo", "AB", "RWE", 1, 1),
	("Depot", "AC", "Webasto", 2, 1),
	("Zeal", "ABD", "EvGo", 3, 3);

insert into Station (com_id, station_location, station_area) values
	(1, "Btm Layout", "latitude.logitude"),
	(2, "Jayanagar", "latitude.logitude"),
	(3, "Shantinagar", "latitude.logitude");

insert into StationEVSE (evse_id, station_id) values
	(1, 1),
	(2, 2),
	(3, 3);

insert into UserEVBattery (remaining_charge, estimated_distance) values
	(20, 2),
	(15, 3),
	(18, 4);

insert into UserEV (user_id, ev_id, user_ev_bat_id, registration_no, purchase_date) values
	(1, 1, 1, 'KA 04 JB 1212', "2022-05-01"),
	(2, 2, 2, 'KA 05 JE 1312', "2022-04-27"),
	(3, 3, 3, 'KA 01 MB 1252', "2022-04-29");

insert into Timeslot (from_time, to_time) values
	("0:00:00", "0:30:00"),
	("1:00:00", "1:30:00"),
	("2:00:00", "2:30:00");

insert into Booking (user_id, user_ev_id, station_evse_id, booking_status, booking_time, slot_from, slot_to, transaction_id, user_bat_charge, user_location) values
	(1, 1, 1, "confirmed", "2022-04-29 12:45:56", 1, 2, 'T1234', 20, "Shantinagar"),
	(2, 2, 2, "canceled", "2022-04-30 1:46:57", 1, 2, 'T2345', 11, "HSR layout"),
	(3, 3, 3, "completed", "2022-04-30 3:47:50", 1, 3, 'T2625', 12, "Jayanagar");

insert into Request (com_id, station_id, request_time, request_status, curr_station_supply, requested_supply) values
	(1, 1, "2022-04-29 12:00:00", "open", 80, 50),
	(2, 2, "2022-03-13 1:00:00", "accepted", 70, 80),
	(3, 3, "2022-04-30  2:00:00", "complete", 30, 100);

insert into RequestResolve (request_id, response_from, response_time, response_supply, slot_from, slot_to) values
	(1, 'C2', "2022-04-30 1:00:00", 40, 1, 3),
	(2, 'U1', "2022-03-14 2:00:00", 15, 1, 2),
	(3, 'C1', "2022-05-01 1:00:00", 100, 2, 3);

insert into Reports (report_from, report_time, report_status, report_description) values
	('U1', "2022-05-01 1;00:00", "submitted", "booking issues"),
	('C1', "2022-05-02 2:00:00", "acknowledged", "request generation issue"),
	('U2', "2022-05-03 3:00:00", "acknowledged", "error while slot booking");





