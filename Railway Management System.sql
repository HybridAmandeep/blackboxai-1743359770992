CREATE TABLE Zone (
    Zone_id NUMBER PRIMARY KEY,
    Zone_name VARCHAR2(100),
    Zone_code VARCHAR2(50)
);

CREATE TABLE Station (
    Station_id NUMBER PRIMARY KEY,
    Station_code VARCHAR2(50),
    Station_name VARCHAR2(100),
    Zone_id NUMBER,
    FOREIGN KEY (Zone_id) REFERENCES Zone(Zone_id)
);

CREATE TABLE Class (
    Class_id NUMBER PRIMARY KEY,
    Class_code VARCHAR2(50),
    Class_name VARCHAR2(100),
    Seat_per_coach NUMBER
);

CREATE TABLE Train (
    Train_code NUMBER PRIMARY KEY,
    Train_name VARCHAR2(100),
    Distance NUMBER,
    Start_time TIMESTAMP,
    End_time TIMESTAMP,
    Start_station_code VARCHAR2(50),
    End_station_code VARCHAR2(50)
);

CREATE TABLE Train_fare (
    Class_id NUMBER,
    Train_code NUMBER,
    From_Km NUMBER,
    To_Km NUMBER,
    From_Date DATE,
    To_date DATE,
    Fare NUMBER,
    PRIMARY KEY (Class_id, Train_code),
    FOREIGN KEY (Class_id) REFERENCES Class(Class_id),
    FOREIGN KEY (Train_code) REFERENCES Train(Train_code)
);

CREATE TABLE Via_details (
    Details_id NUMBER PRIMARY KEY,
    Train_code NUMBER,
    Via_station_code VARCHAR2(50),
    Via_station_name VARCHAR2(100),
    Reach_time TIMESTAMP,
    Km_from_origin NUMBER,
    FOREIGN KEY (Train_code) REFERENCES Train(Train_code)
);

CREATE TABLE Ticket_reservation (
    PNR_no NUMBER PRIMARY KEY,
    Train_code NUMBER,
    From_Station VARCHAR2(50),
    To_Station VARCHAR2(50),
    From_Km NUMBER,
    To_Km NUMBER,
    From_date DATE,
    To_date DATE,
    FOREIGN KEY (Train_code) REFERENCES Train(Train_code)
);

CREATE TABLE PAX_info (
    Passenger_id NUMBER PRIMARY KEY,
    SRL_no NUMBER,
    PAX_Name VARCHAR2(100),
    PAX_age NUMBER,
    PAX_sex VARCHAR2(10),
    Seat_no VARCHAR2(10),
    Fare NUMBER,
    PNR_no NUMBER,
    FOREIGN KEY (PNR_no) REFERENCES Ticket_reservation(PNR_no)
);

CREATE TABLE Pay_info (
    Payment_id NUMBER PRIMARY KEY,
    Inst_amt NUMBER,
    Inst_type VARCHAR2(50),
    Pay_mode VARCHAR2(50),
    Pay_date DATE,
    PNR_no NUMBER,
    SRL_no NUMBER,
    Amount NUMBER,
    FOREIGN KEY (PNR_no) REFERENCES Ticket_reservation(PNR_no)
);

CREATE TABLE Refund_rule (
    Refundable_amt NUMBER,
    From_time TIMESTAMP,
    To_time TIMESTAMP
);

CREATE TABLE Login_credential (
    login_id VARCHAR2(100) PRIMARY KEY,
    password VARCHAR2(100)
);
