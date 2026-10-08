import mongoose from 'mongoose'
import { LogSeverityLevel } from '../../../domain/entities/log.entity';

/*
    level: LogSeverityLevel;
    message: string;
    createdAt: Date;
    origin: string;
*/

const logSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    origin: {
        type: String,
    },
    level: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "low"
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
});

export const LogModel = mongoose.model('Log', logSchema);
