// Database connection and CRUD operations for IRCTC Clone
class DatabaseService {
    constructor() {
        // Mock database - in a real implementation, this would connect to an actual database
        this.db = {
            Zone: [],
            Station: [],
            Class: [],
            Train: [],
            Train_fare: [],
            Via_details: [],
            Ticket_reservation: [],
            PAX_info: [],
            Pay_info: [],
            Login_credential: []
        };

        // Initialize with sample data from your schema
        this.initializeSampleData();
    }

    initializeSampleData() {
        // Sample zones
        this.db.Zone = [
            { Zone_id: 1, Zone_name: 'Northern Railway', Zone_code: 'NR' },
            { Zone_id: 2, Zone_name: 'Western Railway', Zone_code: 'WR' }
        ];

        // Sample stations
        this.db.Station = [
            { Station_id: 1, Station_code: 'DEL', Station_name: 'Delhi', Zone_id: 1 },
            { Station_id: 2, Station_code: 'MUM', Station_name: 'Mumbai', Zone_id: 2 }
        ];

        // Sample classes
        this.db.Class = [
            { Class_id: 1, Class_code: '1A', Class_name: 'First AC', Seat_per_coach: 24 },
            { Class_id: 2, Class_code: '2A', Class_name: 'Second AC', Seat_per_coach: 48 }
        ];

        // Sample user
        this.db.Login_credential = [
            { login_id: 'testuser', password: 'test123', user_type: 'customer' }
        ];

        // Sample train
        this.db.Train = [
            { 
                Train_code: '12345',
                Train_name: 'RAJDHANI EXPRESS',
                Start_station_code: 'DEL',
                End_station_code: 'MUM',
                Start_time: '18:30',
                End_time: '08:30',
                Distance: 1400
            }
        ];
    }

    // Generic CRUD operations
    async create(table, data) {
        if (!this.db[table]) throw new Error(`Table ${table} does not exist`);
        const newRecord = { ...data };
        this.db[table].push(newRecord);
        return newRecord;
    }

    async read(table, id) {
        if (!this.db[table]) throw new Error(`Table ${table} does not exist`);
        if (id) {
            return this.db[table].find(record => record[`${table}_id`] === id);
        }
        return this.db[table];
    }

    async update(table, id, data) {
        if (!this.db[table]) throw new Error(`Table ${table} does not exist`);
        const index = this.db[table].findIndex(record => record[`${table}_id`] === id);
        if (index === -1) throw new Error(`Record not found in ${table}`);
        this.db[table][index] = { ...this.db[table][index], ...data };
        return this.db[table][index];
    }

    async delete(table, id) {
        if (!this.db[table]) throw new Error(`Table ${table} does not exist`);
        const index = this.db[table].findIndex(record => record[`${table}_id`] === id);
        if (index === -1) throw new Error(`Record not found in ${table}`);
        return this.db[table].splice(index, 1)[0];
    }

    // Specific operations for IRCTC
    async getTrainsBetweenStations(fromStationCode, toStationCode) {
        return this.db.Train.filter(train => 
            train.Start_station_code === fromStationCode && 
            train.End_station_code === toStationCode
        );
    }

    async getFare(trainCode, classId) {
        return this.db.Train_fare.find(fare => 
            fare.Train_code === trainCode && 
            fare.Class_id === classId
        );
    }

    async createReservation(reservationData, passengers, paymentInfo) {
        // Create ticket reservation
        const reservation = await this.create('Ticket_reservation', reservationData);
        
        // Add passengers
        const paxRecords = await Promise.all(passengers.map(passenger => 
            this.create('PAX_info', { ...passenger, PNR_no: reservation.PNR_no })
        ));
        
        // Add payment record
        const paymentRecord = await this.create('Pay_info', { 
            ...paymentInfo, 
            PNR_no: reservation.PNR_no 
        });
        
        return { reservation, paxRecords, paymentRecord };
    }

    async getUserCredentials(username) {
        return this.db.Login_credential.find(cred => cred.login_id === username);
    }
}

// Export singleton instance
const dbService = new DatabaseService();
module.exports = dbService;
