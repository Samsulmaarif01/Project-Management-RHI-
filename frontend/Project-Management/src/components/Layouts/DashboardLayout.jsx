import React, { useContext } from 'react';
import { UserContext } from '../../context/userContext';
import Navbar from './Navbar';
import SideMenu from './SideMenu';

const DashboardLayout = ({ children, activeMenu }) => {
    const { user } = useContext(UserContext);

    return (
        <div>
            <Navbar activeMenu={activeMenu} />
            {user && (
                <div className='flex'>
                    {/* Sidebar Desktop */}
                    <div className='hidden lg:block'>
                        <SideMenu activeMenu={activeMenu} />
                    </div>

                    {/* Konten Utama */}
                    <div className='flex-grow px-5 py-4'>
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardLayout;
