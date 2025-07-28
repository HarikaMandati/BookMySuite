import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './editBooking.css';

const BookingPopup = ({ booking: propBooking, mode: propMode, onClose: propOnClose, onSave: propOnSave }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [internalBooking, setInternalBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isStandalone = !propBooking && id;
  const booking = isStandalone ? internalBooking : propBooking;
  const mode = isStandalone ? 'edit' : propMode;
  const onClose = isStandalone ? () => navigate('/bookings') : propOnClose;
  const onSave = isStandalone ? async (updatedData) => {
    try {
      await axios.put(`/bookings/${id}`, updatedData);
      navigate('/bookings', { state: { message: 'Booking updated successfully' } });
    } catch (err) {
      console.error('Error updating booking:', err);
      setError('Failed to update booking');
    }
  } : propOnSave;

  useEffect(() => {
    if (isStandalone) {
      const fetchBooking = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`/bookings/booking/${id}`);
          setInternalBooking(response.data);
        } catch (err) {
          setError('Failed to load booking data');
          console.error('Error fetching booking:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchBooking();
    }
  }, [id, isStandalone]);

  const [editData, setEditData] = useState({
    userid: '',
    hotelid: '',
    roomid: '',
    bookingdate: '',
    bookingdays: 1,
    rooms: [],
    cheapestPrice: 0
  });

  useEffect(() => {
    if (booking) {
      setEditData({
        userid: booking[0].userid || '',
        hotelid: booking[0].hotelid || '',
        roomid: booking[0].roomid || '',
        bookingdate: booking[0].bookingdate 
          ? new Date(booking[0].bookingdate).toISOString().slice(0, 16)
          : new Date().toISOString().slice(0, 16),
        bookingdays: booking[0].bookingdays || 1,
        rooms: booking.rooms || [],
        cheapestPrice: booking[0].cheapestPrice || 0
      });
    }
  }, [booking]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: name === 'cheapestPrice' || name === 'bookingdays' 
        ? Number(value) 
        : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editData);
  };

  if (isStandalone) {
    if (loading) return <div className="loading-spinner">Loading...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!booking) return <div className="no-data">Booking not found</div>;
  }

  if (!booking && mode === 'view') {
    return (
      <div className="popup-overlay">
        <div className="booking-popup">
          <button className="close-btn" onClick={onClose}>×</button>
          <h2>No Booking Data</h2>
          <div className="popup-content">
            <p>No booking information available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="popup-overlay">
      <div className="booking-popup">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>{mode === 'edit' ? 'Edit Booking' : 'Booking Details'}</h2>

        <div className="popup-content">
          {mode === 'view' ? (
            <div className="view-mode">
              <div className="detail-row">
                <span className="detail-label">Booking ID:</span>
                <span className="detail-value">{booking._id}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Booking Date:</span>
                <span className="detail-value">
                  {new Date(booking.bookingdate).toLocaleString()}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Duration:</span>
                <span className="detail-value">{booking.bookingdays} days</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Price:</span>
                <span className="detail-value">${booking.cheapestPrice}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Rooms:</span>
                <span className="detail-value">{(booking.rooms || []).join(', ')}</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="edit-form">
              <div className="form-group">
                <label>Booking Date</label>
                <input
                  type="datetime-local"
                  name="bookingdate"
                  value={editData.bookingdate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Duration (Days)</label>
                <input
                  type="number"
                  name="bookingdays"
                  value={editData.bookingdays}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>
              <div className="form-group">
                <label>Price ($)</label>
                <input
                  type="number"
                  name="cheapestPrice"
                  value={editData.cheapestPrice}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="form-actions">
              <button 
              className="navButton" 
              onClick={() => navigate('/my-bookings')}>
              Cancel
            </button>

                <button type="submit" className="save-btn">
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingPopup;