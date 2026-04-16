// Tej - Booking model
import { Schema, model, Document, Types} from 'mongoose';

// Define the Booking interface
interface IBooking extends Document {
        userId: Types.ObjectId;
        resourceId: Types.ObjectId;
        date: Date;
        timeSlot: string;
        purpose: string;
        approvalImageUrl: string;
        status: 'pending' | 'approved' | 'rejected';
        returnedAt?: Date;
}

const bookingSchema = new Schema<IBooking>({
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        resourceId: { type: Schema.Types.ObjectId, ref: 'Resource', required: true },
        date: { type: Date, required: true },
        timeSlot: { type: String, required: true },
        purpose: { type: String, required: true },
        approvalImageUrl: { type: String, required: true},
        status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
        returnedAt: { type: Date, default: null },
}, { timestamps: true });

const Booking = model<IBooking>('Booking', bookingSchema);

export default Booking;

