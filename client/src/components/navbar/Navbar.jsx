import "./navbar.css";
import { Link,useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
const Navbar = () => {
  const { user,dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    
    localStorage.removeItem("user");
    
    navigate("/");
  };


  return (
    <div className="navbar">
      <div className="navContainer">
        <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
          <span className="logo">BookMySuite</span>
        </Link>
        {/* {user ? user.username : (
          <div className="navItems">
            <button className="navButton">Register</button>
            <button className="navButton">Login</button>
          </div>
        )} */}
        {user ? (
          <div className="navItems">
            <button className="navButton" onClick={handleLogout}>Logout</button>
            {/* You might also want to show the username */}
            <span className="username">{user.username}</span>
          </div>
        ) : (
          <div className="navItems">
            {/* <button className="navButton">Register</button> */}
            <button 
              className="navButton" 
              onClick={() => navigate('/login')}
            >
              Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;