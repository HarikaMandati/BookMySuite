import mongoose from "mongoose";
const BookingSchema = new mongoose.Schema({
  userid: {
    type: String,
    required: true,
  },
  hotelid: {
    type: String,
    required: true,
  },
  roomid: {
    type: String,
    required: true,
  },
  bookingdate: {
    type: String,
    required: true,
  },
  bookingdays: {
    type: String,
    required: true,
  },
  rooms: {
    type: [String],
  },
  cheapestPrice: {
    type: Number,
    required: true,
  },
});

export default mongoose.model("Booking", BookingSchema)