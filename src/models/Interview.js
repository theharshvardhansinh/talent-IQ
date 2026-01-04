
import mongoose from 'mongoose';

const InterviewSchema = new mongoose.Schema({
    interviewerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    intervieweeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'completed'],
        default: 'pending',
    },
    stage: {
        type: String,
        enum: ['request', 'coding', 'video', 'finished'],
        default: 'request',
    },
    problemId: {
        type: String, // Slug of the selected problem for Round 1
    },
    codingStartTime: {
        type: Date, // To track the 30-minute limit
    },
    codingResult: {
        type: String,
        enum: ['undecided', 'pass', 'fail'],
        default: 'undecided',
    },
    videoRoomId: {
        type: String, // Call ID for Stream
    },
    finalResult: {
        type: String,
        enum: ['undecided', 'pass', 'fail'],
        default: 'undecided',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

export default mongoose.models.Interview || mongoose.model('Interview', InterviewSchema);
