import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context/userContext';
import { useNavigate } from 'react-router-dom';
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from '../../utils/data';

const SideMenu = ({ activeMenu }) => {
    const { user, clearUser } = useContext(UserContext);
    const [sideMenuData, setSideMenuData] = useState([]);
    const navigate = useNavigate();

    const handleClick = (route) => {
        if (route === 'logout') {
            handleLogout();
            return;
        }
        navigate(route);
    };

    const handleLogout = () => {
        localStorage.clear();
        clearUser();
        navigate('/login');
    };

    useEffect(() => {
        if (user) {
            setSideMenuData(user?.role === 'admin' ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA);
        }
    }, [user]);

    return (
        <div className='w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 sticky top-[61px] z-20'>
            <div className='flex flex-col items-center justify-center mb-7 pt-5'>
                <div className='relative'>
                    {user?.profileImageUrl ? (
                        <img
                            src={user.profileImageUrl}
                            alt='Profile Image'
                            className='w-20 h-20 bg-slate-400 rounded-full object-cover'
                        />
                    ) : (
                        <div className='w-20 h-20 bg-slate-400 rounded-full flex items-center justify-center text-white text-lg'>
                            {user?.name?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                    )}
                </div>

                {user?.role && (
                    <div className='text-[10px] font-medium bg-blue-100 text-blue-800 px-3 py-0.5 rounded mt-1 capitalize'>
                        {user.role}
                    </div>
                )}

                <h5 className='text-gray-950 font-medium leading-6 mt-3'>
                    {user?.name || ''}
                </h5>
                <p className='text-[12px] text-gray-500'>
                    {user?.email || ''}
                </p>
            </div>

            <div>
                {sideMenuData.map((item, index) => (
                    <button
                        key={`menu_${index}`}
                        className={`w-full flex items-center gap-4 text-[15px] ${
                            activeMenu === item.label
                                ? 'text-primary bg-gradient-to-r from-blue-50/40 to-blue-100/50 border-r-4 border-primary'
                                : 'text-gray-700 hover:bg-gray-100'
                        } py-3 px-6 mb-3 cursor-pointer transition-all`}
                        onClick={() => handleClick(item.path)}
                    >
                        <item.icon className='text-xl' />
                        {item.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SideMenu;
