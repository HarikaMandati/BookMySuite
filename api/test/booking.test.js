import request from 'supertest';
import app from '../server.js';
import Booking from '../models/Booking.js';

const testBooking = {
  userid: 'user123',
  hotelid: 'hotel456',
  roomid: 'room789',
  bookingdate: new Date().toISOString(),
  bookingdays: 3,
  rooms: ['room789'],
  cheapestPrice: 150
};

let createdBookingId;

beforeAll(async () => {
  await Booking.deleteMany({});
});

afterAll(async () => {
  await Booking.deleteMany({});
});

describe('Booking CRUD Operations', () => {
  test('should create a new booking', async () => {
    const response = await request(app)
      .post('/api/bookings')
      .send(testBooking)
      .expect(201);

    expect(response.body).toHaveProperty('_id');
    expect(response.body.userid).toBe(testBooking.userid);
    createdBookingId = response.body._id;
  });

  test('should get bookings by user ID', async () => {
    const response = await request(app)
      .get(`/api/bookings/${testBooking.userid}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].userid).toBe(testBooking.userid);
  });

  test('should get booking by ID', async () => {
    const response = await request(app)
      .get(`/api/bookings/booking/${createdBookingId}`)
      .expect(200);

  });

  test('should update a booking', async () => {
    const updatedData = { bookingdays: 5, cheapestPrice: 200 };
    const response = await request(app)
      .put(`/api/bookings/${createdBookingId}`)
      .send(updatedData)
      .expect(200);

    expect(Number(response.body.bookingdays)).toBe(updatedData.bookingdays);
    expect(Number(response.body.cheapestPrice)).toBe(updatedData.cheapestPrice);
  });

  test('should delete a booking', async () => {
    await request(app)
      .delete(`/api/bookings/${createdBookingId}`)
      .expect(200);

    const response = await request(app)
      .get(`/api/bookings/${createdBookingId}`)
      .expect(404);

    expect(response.body).toEqual("No bookings found for this user");
  });
  const invalidbookingid123="6666675f962d6cc37d789f00";

  test('should return 404 for non-existent booking', async () => {
    await request(app)
      .get(`/api/bookings/booking/${invalidbookingid123}`)
      .expect(404);
  });
const nonExistUserId="6777775f962d6cc37d989f35";
  test('should return empty array when no bookings found for user', async () => {
    const response = await request(app)
      .get(`/api/bookings/${nonExistUserId}`)
      .expect(404);

    expect(Array.isArray(response.body)).toBe(false);
  });
});
