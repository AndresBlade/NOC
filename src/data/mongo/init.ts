import mongoose from 'mongoose';

interface ConnectionOptions {
    mongoUrl: string;
    dbName: string;
    user: string;
    pass: string;
}

export class MongoDatabase {
    static async connect({mongoUrl, dbName}: ConnectionOptions) {
        await mongoose.connect(mongoUrl, {
            dbName,
            
        })
    }
}