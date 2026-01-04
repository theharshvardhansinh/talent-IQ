
import mongoose from 'mongoose';

const SubmissionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    problemSlug: {
        type: String,
        required: true,
    },
    competitionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Competition',
        required: false,
    },
    status: {
        type: String, // 'Accepted', 'Runtime Error', etc.
        required: true,
    },
    language: {
        type: String,
        required: true,
    },
    code: {
        type: String,
    },
    runtime: String,
    memory: String,
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

export default mongoose.models.Submission || mongoose.model('Submission', SubmissionSchema);
