import React, { useState, useContext } from 'react';
import { NavLink, Link } from "react-router-dom";
import "./Navbar.css";
import logo from '../assets/yves-logo.png';
import { IoMdMenu, IoMdClose } from "react-icons/io";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useContext(AuthContext);
    const toggleMenu = () => setIsOpen(!isOpen);
    const navigate = useNavigate();


    const handleBookNow = () => {
        setIsOpen(false);

        if (!user) {
            // 🔐 Not logged in → go to login
            navigate("/login?redirect=book");
        } else {
            // ✅ Logged in → go to booking
            navigate("/book");
        }
    };


    return (
        <div className='navbar'>
            <Link to="/">
                <img src={logo} alt="Logo" className='logo' />
            </Link>
            <div className="menu-toggle" onClick={toggleMenu}>
                {isOpen ? <IoMdClose /> : <IoMdMenu />}
            </div>


            <div className={`mobile-nav ${isOpen ? "open" : ""}`}>
                <ul>
                    <li>
                        <NavLink
                            to="/"
                            className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
                            onClick={() => setIsOpen(false)}
                        >
                            Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/services"
                            className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
                            onClick={() => setIsOpen(false)}
                        >
                            Services
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/collections"
                            className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
                            onClick={() => setIsOpen(false)}
                        >
                            Collections
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to="/about"
                            className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
                            onClick={() => setIsOpen(false)}
                        >
                            About
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to="/location"
                            className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
                            onClick={() => setIsOpen(false)}
                        >
                            Location
                        </NavLink>
                    </li>
                </ul>

                <div className='right-container'>

                    {!user ? (
                        <>
                            {/* Not logged in */}
                            <Link to="/login" onClick={() => setIsOpen(false)}>
                                <button className="contact-btn">Sign In</button>
                            </Link>
                        </>
                    ) : (
                        <>
                            {/* Logged in */}
                            <Link to="/account" onClick={() => setIsOpen(false)}>
                                <button className="contact-btn">Account</button>
                            </Link>
                        </>
                    )}

                    <button className='book-btn' onClick={handleBookNow}>Book now</button>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
