import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
    userID: { type: String, required: true },
    date: { type: Date, required: true },
    earning: { type: Number, required: true },
    description: { type: String, required: true }
}, {
    timestamps: true,
    versionKey: false
});

export default mongoose.model('Trip', tripSchema);