import React, { useState } from 'react';
import {
    FaTh,
    FaBars,
    FaUserAlt,
    FaShoppingBag,
    FaThList,
    FaQq,
    FaSteamSquare,
    FaRegUser
} from "react-icons/fa";
import logo from '../../assets/sidebar/logo.png'
import { NavLink } from 'react-router-dom';
import { AiFillProduct } from 'react-icons/ai';
import { MdCategory, MdContactPage } from 'react-icons/md';
import { RiDiscountPercentFill } from 'react-icons/ri';
import { GiResize } from 'react-icons/gi';
import { IoColorPalette, IoNewspaper } from 'react-icons/io5';
import { GrUserWorker } from 'react-icons/gr';
import { CiBoxes } from 'react-icons/ci';
import { BsMenuButtonWideFill } from 'react-icons/bs';


const Sidebar = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);
    const menuItem = [
        {
            path: "/workers",
            name: "Ishchilar",
            icon: <GrUserWorker />
        },
        {
            path: "/users",
            name: "Foydalanuvchilar",
            icon: <FaRegUser  />
        },
        {
            path: "/box",
            name: "Box",
            icon: <CiBoxes  />
        },
        {
            path: "/tariflar",
            name: "Tariflar",
            icon: <BsMenuButtonWideFill  />
        },
        {
            path: "/buyutmalar",
            name: "Buyutmalar",
            icon: <IoColorPalette />
        },
        

    ]
    return (
        <div className=" admin">
            <div  className={`${!isOpen ?'sidebar':"sidebar__open"}`}>
                <div className="top_section">
                    <div style={{display:"flex", justifyContent:"center", alignItems:"center",width:"100%"}}>
                        <img style={{width:"80px" }} src={logo} alt="" />
                    </div>
                </div>
                <hr className="sidebar__hr" />
                {
                    menuItem.map((item, index) => (
                        <NavLink to={item.path} key={index} className="link" >
                            <div style={{display:"flex", alignItems:"center"}} className="icon">{item.icon}</div>
                            <div style={{ display: !isOpen ? "block" : "none" }} className="link_text">{item.name}</div>
                        </NavLink>
                    ))
                }
            </div>
            <main style={{ marginLeft: !isOpen ? "300px" : "50px", padding:"5px" }} className=''>{children}</main>
        </div>
    );
};

export default Sidebar;