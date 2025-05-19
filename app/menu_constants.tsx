import { SideNavItemGroup } from "../types/types";
import { BsGear,  BsQuestionCircle } from "react-icons/bs";
import { RiBoxingFill } from "react-icons/ri";
import { FaDatabase } from "react-icons/fa6";
import { IoNotifications } from "react-icons/io5";



export const SIDENAV_ITEMS: SideNavItemGroup[] = [

    {
        title: "Manage",
        menuList: [
            {
                title: 'Data',
                path: '/data',
                icon: <FaDatabase size={20} />,
                submenu: true,
                subMenuItems: [
                    { title: 'Main', path: '/data/main' },
                    { title: 'Location Gym', path: '/data/location' },
                    { title: 'Gym Muay Thai', path: '/data/gyms' },
                    { title: 'Accomodation', path: '/data/accommodation' },
                    { title: 'Food', path: '/data/food' },
                    { title: 'Attraction', path: '/data/attraction' },
                    { title: 'User', path: '/data/users' },
                    
                ],
            },
        ]
    },

];