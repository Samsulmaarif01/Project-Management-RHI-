import React, { useState } from 'react';
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import SideMenu from './SideMenu';

const Navbar = ({ activeMenu }) => {
    const [openSideMenu, setOpenSideMenu] = useState(false);

    return (
        <>
            <div className='h-[61px] flex items-center gap-5 bg-white border-b border-gray-200/50 backdrop-blur-[2px] px-7 sticky top-0 z-30'>
                <button className='block lg:hidden text-black' onClick={() => {
                    setOpenSideMenu(!openSideMenu);
                }}>
                    {openSideMenu ? (
                        <HiOutlineX className='text-2xl' />
                    ) : (
                        <HiOutlineMenu className='text-2xl' />
                    )}
                </button>

                <h2 className='text-lg font-medium text-black'>
                    Project Management
                </h2>
            </div>

            {/* Sidebar Mobile */}
            {openSideMenu && (
                <div className='lg:hidden fixed top-[61px] left-0 w-64 h-[calc(100vh-61px)] bg-white shadow z-40'>
                    <SideMenu activeMenu={activeMenu} />
                </div>
            )}
        </>
    );
};

export default Navbar;
