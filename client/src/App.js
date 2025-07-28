import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Home from "./pages/home/Home";
import Hotel from "./pages/hotel/Hotel";
import List from "./pages/list/List";
import Login from "./pages/login/Login";
import BookingTable from "./pages/datatable/datatable";
import BookingPopup from "./pages/editBooking/editBooking";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/hotels" element={<List/>}/>
        <Route path="/hotels/:id" element={<Hotel/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/my-bookings" element={<BookingTable />} />
        <Route path="/bookings/edit/:id" element={<BookingPopup />} />
        <Route path="/bookings" element={<BookingTable />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;