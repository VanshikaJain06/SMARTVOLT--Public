create schema SmartVolt;
use SmartVolt;

create table User(
	user_id varchar(30) primary key,
    user_firstname varchar(30) not null,
    user_lastname varchar(30) not null,
    user_phone varchar(10) not null unique,
    user_email varchar(30) not null unique,
    user_address varchar(30) not null,
    user_DOB date not null,
    user_credits numeric(10) not null,
    user_license varchar(15) not null unique);

create table Company(
	com_id varchar(5) primary key,
    com_name varchar(30) not null,
    com_phone varchar(10) not null unique,
    com_email varchar(30) not null unique,
    com_address varchar (80) not null,
    com_credits numeric(10) not null);

create table EVBattery(
	bat_id varchar(5) primary key,
    bat_name varchar(30) not null,
    bat_manufacturer varchar(30) not null,
    bat_capacity numeric(5) not null,
    bat_type varchar(15) not null,
    bat_chargingrate numeric(5) not null,
    bat_dischargingrate numeric(5) not null,
    bat_distance numeric(10) not null);

create table EV(
	ev_id varchar(5) primary key,
    ev_name varchar(30) not null,
    ev_model varchar(30) not null,
    ev_company  varchar(30) not null,
    bat_id varchar(5) not null,
    ev_type varchar(20) not null,
    ev_mileage numeric(5) not null,
    ev_port varchar(15) not null,
    foreign key (bat_id) references EVBattery(bat_id));

create table EVSEPort(
	port_id varchar(5) primary key,
    port_name varchar(35) not null,
    port_type varchar(30) not null,
    port_powersupply numeric(5) not null);

create table EVSE(
	evse_id varchar(5) primary key,
	evse_name varchar(30) not null,
	evse_model varchar(30) not null,
	evse_company  varchar(30) not null,
	evse_port1 varchar(5) not null,
	evse_port2 varchar(5) not null,
    foreign key (evse_port1) references EVSEPort(port_id),
    foreign key (evse_port2) references EVSEPort(port_id));

create table Station(
	station_id varchar(5) primary key,
    com_id varchar(5) not null,
    station_location varchar(40) not null,
    station_area varchar(20) not null,
    foreign key (com_id) references Company(com_id));

create table StationEVSE(
	station_evse_id varchar(5) primary key,
    evse_id varchar(5) not null,
    station_id varchar(5) not null,
    foreign key(station_id) references Station(station_id),
    foreign key(evse_id) references EVSE(evse_id));

create table Timeslot(
	slot_id varchar(5) primary key,
	from_time time not null,
	to_time time not null);

create table UserEV(
	user_ev_id varchar(5) primary key,
	user_id varchar(5) not null,
	ev_id varchar(5) not null,
	registration_no varchar(20) not null unique,
	purchase_date date not null,
	foreign key(user_id) references User(user_id),
	foreign key(ev_id) references EV(ev_id));

create table Booking(
	booking_id varchar(5) primary key,
	user_id varchar(5) not null,
	user_ev_id varchar(5) not null,
	station_evse_id varchar(5) not null,
	booking_status varchar(15) not null,
	booking_time  datetime not null,
	slot_from varchar(5) not null,
	slot_to varchar(5) not null,
	transaction_id varchar(25) not null unique,
	user_bat_charge numeric(5) not null,
	user_location varchar(40) not null,
    foreign key (user_id) references User(user_id),
    foreign key (user_ev_id) references UserEV(user_ev_id),
    foreign key (station_evse_id) references StationEVSE(station_evse_id),
    foreign key(slot_from) references Timeslot(slot_id),
    foreign key(slot_to) references Timeslot(slot_id));
  
create table UserEVBattery(
	user_ev_bat_id varchar(5) primary key,
	user_ev_id varchar(5) not null,
	remaining_charge numeric(5) not null,
	estimated_distance numeric(10) not null,
	last_charged varchar(5) not null unique,
    foreign key(user_ev_id) references UserEV(user_ev_id),
    foreign key(last_charged) references Booking(booking_id));

create table Request(
	request_id varchar(5) primary key,
	com_id varchar(5) not null,
	station_id varchar(5) not null,
	request_time datetime not null,
	request_status varchar(15) not null,
	curr_station_supply numeric(10) not null,
	requested_supply numeric(10) not null,
    foreign key(com_id) references Company(com_id),
    foreign key(station_id) references Station(station_id));
  
create table RequestResolve(
	resolve_id varchar(5) primary key,
	request_id varchar(5) not null,
	response_from varchar(20) not null,
	response_time datetime not null,
	response_supply numeric(10) not null,
	slot_from varchar(5) not null,
	slot_to varchar(5) not null,
    foreign key(request_id) references Request(request_id),
    foreign key(slot_from) references Timeslot(slot_id),
    foreign key(slot_to) references Timeslot(slot_id));

create table Reports(
	report_id varchar(5) primary key,
	report_from varchar(5) not null,
	report_time datetime not null,
	report_status varchar(15) not null,
	report_description varchar(200) not null /*,
    foreign key(report_from) references User(user_id),
    foreign key(report_from) references Company(com_id)*/);


insert into User values
	('U01', "Ashwin", "Kumar V", "9148827639", "ashwingt20001@gmail.com", "muthyalanagar", "2000-03-12", 200, "REQ234567"),
	('U02', "Vanshika", "Jain", "6204943110", "vanshika@gmail.com", "HSR layout", "2000-02-23", 196, "LNC654372"),
	('U03', "Saumya", "Thukral", "9801460419", "saumya@gmail.com", "Church Street", "2000-03-14", 197, "FNC6543201");

insert into Company values
	('C01', "Siemens", "7896665553","ashwinkumarv9@gmail.com", "Muthyalanagar", 500),
	('C02', "Shells", "765245827", "shells57@gmail.com", "Jayanagar", 467),
	('C03', "ABB", "9328604192", "abb43@gmail.com", "Shantinagar", 437);

insert into EVBattery values
	('EB01', "Cosmics", "BYD", 60, "Li-Ion", 3, 4, 30),
	('EB02', "Power metz", "Panasonic", 70, "Li-Ion", 5, 4, 40),
	('EB03', "Day Track", "CALB", 80, "Li-Ion", 4, 4, 20);

insert into EV values
	('E01', "Altis", "325ci", "Arcfox", 'EB01',"BEV", 14, 'J1772'),
	('E02', "Apex", "682sq", "ZYD", 'EB02', "BEV", 15, 'J1772'),
	('E03', "Alcraft", "872tc", "Taurale", 'EB03', "BEV", 16, 'CHAdeMO');

insert into EVSEPort values
	('P01', "J1772", "Lvl1 AC", 12),
	('P02', "CHAdeMO", "Lvl3 DC", 11),
	('P03', "Tesla Super Charger", "Lvl3 DC", 10);

insert into EVSE values
	('ES01', "Servo", "AB", "RWE", "P01", "P01"),
	('ES02', "Depot", "AC", "Webasto", "P02", "P01"),
	('ES03', "Zeal", "ABD", "EvGo", "P03", "P03");

insert into Station values
	('S01', 'C01', "Btm Layout", "latitude.logitude"),
	('S02', 'C02', "Jayanagar", "latitude.logitude"),
	('S03', 'C03', "Shantinagar", "latitude.logitude");

insert into StationEVSE values
	('SE01', 'ES01', 'S01'),
	('SE02', 'ES02', 'S02'),
	('SE03', 'ES03', 'S03');

insert into Timeslot values
	('T01', "0:00:00", "0:30:00"),
	('T02', "1:00:00", "1:30:00"),
	('T03', "2:00:00", "2:30:00");
    
insert into UserEV values
	('UE01', 'U01', 'E01', 'KA 04 JB 1212', "2022-05-01"),
	('UE02', 'U02', 'E02', 'KA 05 JE 1312', "2022-04-27"),
	('UE03', 'U03', 'E03', 'KA 01 MB 1252', "2022-04-29");

insert into Booking values
	('B01', 'U01', 'UE01', 'SE01', "confirmed", "2022-04-29 12:45:56", 'T01', 'T02', 'T1234', 20, "Shantinagar"),
	('B02', 'U02', 'UE02', 'SE02', "canceled", "2022-04-30 1:46:57", 'T01', 'T02', 'T2345', 11, "HSR layout"),
	('B03', 'U03', 'UE03', 'SE03', "completed", "2022-04-30 3:47:50", 'T01', 'T03', 'T2625', 12, "Jayanagar");

insert into UserEVBattery values
	('UB01', 'UE01', 20, 2, 'B01'),
	('UB02', 'UE02', 15, 3, 'B02'),
	('UB03', 'UE03', 18, 4, 'B03');

insert into Request values
	('RQ01', 'C01', 'S01', "2022-04-29 12:00:00", "open", 80, 50),
	('RQ02', 'C02', 'S02', "2022-03-13 1:00:00", "accepted", 70, 80),
	('RQ03', 'C03', 'S03', "2022-04-30  2:00:00", "complete", 30, 100);

insert into RequestResolve values
	('RS01', 'RQ01', 'C02', "2022-04-30 1:00:00", 40, 'T01', 'T03'),
	('RS02', 'RQ02', 'U01', "2022-03-14 2:00:00", 15, 'T01', 'T02'),
	('RS03', 'RQ03', 'C01', "2022-05-01 1:00:00", 100, 'T02', 'T03');

insert into Reports values
	('R01', 'U01', "2022-05-01 1;00:00", "submitted", "booking issues"),
	('R02', 'C01', "2022-05-02 2:00:00", "acknowledged", "request generation issue"),
	('R03', 'U02', "2022-05-03 3:00:00", "acknowledged", "error while slot booking");






