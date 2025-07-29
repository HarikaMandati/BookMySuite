import Booking from "../models/Booking.js";

export const createBooking = async (req, res, next) => {
  try {
    const { userid, hotelid, roomid, bookingdate, bookingdays, rooms, cheapestPrice } = req.body;
    
    const newBooking = new Booking({
      userid,
      hotelid,
      roomid,
      bookingdate,
      bookingdays,
      rooms,
      cheapestPrice
    });

    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (err) {
    next(err);
  }
};


export const getBookingsByUserId = async (req, res, next) => {
    try {
      const userId = req.params.id;


      const bookings = await Booking.find({ userid: userId });
      
      if (!bookings || bookings.length === 0) {
        return res.status(404).json("No bookings found for this user");
      }
      res.status(200).json(bookings);
    } catch (err) {
      next(err);
    }
  };
  export const getBookingsById = async (req, res, next) => {
    try {
      const bookings = await Booking.find({ _id: req.params.id });
      if (!bookings || bookings.length === 0) {
        return res.status(404).json("No bookings found for this id");
      }

      res.status(200).json(bookings);
    } catch (err) {
      next(err);
    }
  };

  export const updateBooking = async (req, res, next) => {
    try {
      const updatedBooking = await Booking.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      if (!updatedBooking) return res.status(404).json("Booking not found");
      res.status(200).json(updatedBooking);
    } catch (err) {
      next(err);
    }
  };

  export const deleteBooking = async (req, res, next) => {
    try {
      const deletedBooking = await Booking.findByIdAndDelete(req.params.id);
      if (!deletedBooking) return res.status(404).json("Booking not found");
      res.status(200).json("Booking has been deleted");
    } catch (err) {
      next(err);
    }
  };