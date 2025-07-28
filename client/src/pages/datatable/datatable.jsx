import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Table, Button, Modal, message } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { AuthContext } from '../../context/AuthContext';
const BookingTable = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedBookingIndex, setSelectedBookingIndex] = useState(null); 
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const getBookingsByUserId = async () => {
    setLoading(true);
    try {
      if (!user._id) {
        navigate('/login');
        return;
      }
      console.log(" ",user);

      console.log(" id",user._id);
      const response = await axios.get(`/bookings/${user._id}`);
      setBookings(response.data);
    } catch (error) {
      message.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBookingsByUserId();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/bookings/${id}`);
      setBookings(bookings.filter(booking => booking._id !== id));
      message.success('Booking deleted successfully');
    } catch (error) {
      message.error('Failed to delete booking');
    }
  };

  // Table columns
  const columns = [
    {
      title: 'Booking ID',
      dataIndex: '_id',
      key: '_id',
      render: (_, __, index) => index + 1
    },
    {
      title: 'Booking Date',
      dataIndex: 'bookingdate',
      key: 'bookingdate',
      render: (date) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Duration (Days)',
      dataIndex: 'bookingdays',
      key: 'bookingdays'
    },
    {
      title: 'Price ($)',
      dataIndex: 'cheapestPrice',
      key: 'price',
      render: (price) => `$${price}`
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="action-buttons">
          <Button 
            type="text" 
            icon={<EyeOutlined />} 
            onClick={() => {
              setSelectedBooking(record);
              setIsModalVisible(true);
            }}
          />
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => navigate(`/bookings/edit/${record._id}`)}
          />
          <Button 
            type="text" 
            icon={<DeleteOutlined />} 
            onClick={() => handleDelete(record._id)}
            danger
          />
        </div>
      )
    }
  ];

  return (
    <div className="booking-table-container">
      <Table 
        columns={columns} 
        dataSource={bookings} 
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
      
      {/* View Booking Modal */}
      <Modal
        title="Booking Details"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Close
          </Button>
        ]}
      >
        {selectedBooking && (
          <div className="booking-details">
            <p><strong>Booking ID:</strong> {selectedBookingIndex + 1}</p>
            <p><strong>Booking Date:</strong> {new Date(selectedBooking.bookingdate).toLocaleString()}</p>
            <p><strong>Duration:</strong> {selectedBooking.bookingdays} days</p>
            <p><strong>Price:</strong> ${selectedBooking.cheapestPrice}</p>
            <p><strong>Rooms:</strong> {selectedBooking.rooms.join(', ')}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BookingTable;