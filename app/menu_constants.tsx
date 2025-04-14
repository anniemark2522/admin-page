import { SideNavItemGroup } from "../types/types";
import { BsGear,  BsQuestionCircle } from "react-icons/bs";
import { RiBoxingFill } from "react-icons/ri";
import { FaDatabase } from "react-icons/fa6";
import { IoNotifications } from "react-icons/io5";



export const SIDENAV_ITEMS: SideNavItemGroup[] = [

    {
        title: "Dashboards",
        menuList: [{
            title: 'Dashboard',
            path: '/',
            icon: <RiBoxingFill size={20} />,
        }]
    },
    {
        title: "Manage",
        menuList: [
            {
                title: 'Notification',
                path: '/notis',
                icon: <IoNotifications size={20} />,
            },
            {
                title: 'Data',
                path: '/data',
                icon: <FaDatabase size={20} />,
                submenu: true,
                subMenuItems: [
                    { title: 'Gym Muay Thai', path: '/data/gyms' },
                    { title: 'Accomodation', path: '/data/accommodation' },
                    { title: 'Food', path: '/data/food' },
                    { title: 'Attraction', path: '/data/attraction' },
                    { title: 'Member Trip', path: '/data/trips' },
                    { title: 'User', path: '/data/users' },
                    
                ],
            },
        ]
    },
    
    {
        title: "Others",
        menuList: [
            {
                title: 'Account',
                path: '/account',
                icon: <BsGear size={20} />,
            },
            {
                title: 'Help',
                path: '/help',
                icon: <BsQuestionCircle size={20} />,
            }
        ]
    }

];