import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

import "./reserve.css";
import useFetch from "../../hooks/useFetch";
import { useContext, useState } from "react";
import { SearchContext } from "../../context/SearchContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Reserve = ({ setOpen, hotelId }) => {
  const [selectedRooms, setSelectedRooms] = useState([]);
  const { data, loading, error } = useFetch(`/hotels/room/${hotelId}`);
  const { dates } = useContext(SearchContext);
console.log("hotelId ",hotelId);
  const getDatesInRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const date = new Date(start.getTime());

    const dates = [];

    while (date <= end) {
      dates.push(new Date(date).getTime());
      date.setDate(date.getDate() + 1);
    }

    return dates;
  };

  const alldates = getDatesInRange(dates[0].startDate, dates[0].endDate);

  const isAvailable = (roomNumber) => {
    const isFound = roomNumber.unavailableDates.some((date) =>
      alldates.includes(new Date(date).getTime())
    );

    return !isFound;
  };

  const handleSelect = (e) => {
    const checked = e.target.checked;
    const value = e.target.value;
    setSelectedRooms(
      checked
        ? [...selectedRooms, value]
        : selectedRooms.filter((item) => item !== value)
    );
  };

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);


  const handleClick = async () => {
    try {
      // First update room availability
      await Promise.all(
        selectedRooms.map((roomId) => {
          return axios.put(`/rooms/availability/${roomId}`, {
            dates: alldates,
          });
        })
      );
  
      // Then create booking for each selected room
      await Promise.all(
        selectedRooms.map(async (roomId) => {
          const room = data.find(item => 
            item.roomNumbers.some(rn => rn._id === roomId)
          );
          
          if (room) {
            const bookingData = {
              userid: user._id, 
              hotelid: hotelId,
              roomid: roomId,
              bookingdate: new Date().toISOString(),
              bookingdays: alldates.length,
              rooms: selectedRooms,
              cheapestPrice: room.price * alldates.length
            };
            
            await axios.post("/bookings", bookingData);
          }
        })
      );
  
      setOpen(false);
      navigate("/");
    } catch (err) {
      console.error("Booking failed:", err);
      // Handle error (show message to user, etc.)
    }
  };
  // const handleClick = async () => {
  //   try {
  //     await Promise.all(
  //       selectedRooms.map((roomId) => {
  //         const res = axios.put(`/rooms/availability/${roomId}`, {
  //           dates: alldates,
  //         });
  //         console.log("roomId ",roomId);

  //         return res.data;
  //       })
  //     );
  //     setOpen(false);
  //     navigate("/");
  //   } catch (err) {}
  // };
  return (
    <div className="reserve">
      <div className="rContainer">
        <FontAwesomeIcon
          icon={faCircleXmark}
          className="rClose"
          onClick={() => setOpen(false)}
        />
        <span>Select your rooms:</span>
        {data.map((item) => (
          <div className="rItem" key={item._id}>
            <div className="rItemInfo">
              <div className="rTitle">{item.title}</div>
              <div className="rDesc">{item.desc}</div>
              <div className="rMax">
                Max people: <b>{item.maxPeople}</b>
              </div>
              <div className="rPrice">{item.price}</div>
            </div>
            <div className="rSelectRooms">
              {item.roomNumbers.map((roomNumber) => (
                <div className="room">
                  <label>{roomNumber.number}</label>
                  <input
                    type="checkbox"
                    value={roomNumber._id}
                    onChange={handleSelect}
                    disabled={!isAvailable(roomNumber)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
        <button onClick={handleClick} className="rButton">
          Reserve Now!
        </button>
      </div>
    </div>
  );
};

export default Reserve;