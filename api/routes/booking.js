import express from "express";
import {
  createBooking,
  deleteBooking,
  getBookingsByUserId,
  updateBooking,
  getBookingsById
} from "../controllers/booking.js";
import { verifyUser} from "../utils/verifyToken.js";

const router = express.Router();

router.post("/", createBooking);

router.put("/:id",  updateBooking); 

router.delete("/:id",  deleteBooking);

router.get("/:id", getBookingsByUserId);

router.get("/booking/:id", getBookingsById);

export default router;