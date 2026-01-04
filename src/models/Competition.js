
import mongoose from 'mongoose';

const CompetitionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    hostId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    problems: [{
        type: String // Problem Slugs
    }],
    startTime: {
        type: Date,
        required: true,
    },
    endTime: { // Calculated or explicit
        type: Date,
        required: true,
    },
    durationMinutes: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['scheduled', 'active', 'ended'],
        default: 'scheduled',
    },
    participants: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        joinedAt: {
            type: Date,
            default: Date.now
        },
        score: {
            type: Number,
            default: 0
        },
        solvedProblems: [{
            type: String
        }],
        finishedAt: Date
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

export default mongoose.models.Competition || mongoose.model('Competition', CompetitionSchema);
