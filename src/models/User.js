import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        select: false, // Do not return password by default
    },
    name: {
        type: String,
        required: [true, 'Please provide a name'],
    },
    role: {
        type: String,
        enum: ['interviewer', 'interviewee'],
        default: 'interviewee',
        required: true,
    },
    solvedProblems: [{
        type: String
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Helper to check if model is already compiled (for HMR)
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;
