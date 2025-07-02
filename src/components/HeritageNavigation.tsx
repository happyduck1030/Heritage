import React from 'react';
import { NavLink } from 'react-router-dom';

const HeritageNavigation: React.FC = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row">
          <NavLink 
            to="/heritage" 
            end
            className={({ isActive }) => 
              `px-4 py-3 text-center hover:bg-blue-50 ${isActive ? 'border-b-2 border-blue-500 font-semibold' : ''}`
            }
          >
            首页
          </NavLink>
          <NavLink 
            to="/heritage/list" 
            className={({ isActive }) => 
              `px-4 py-3 text-center hover:bg-blue-50 ${isActive ? 'border-b-2 border-blue-500 font-semibold' : ''}`
            }
          >
            遗产名录
          </NavLink>
          <NavLink 
            to="/heritage/protection" 
            className={({ isActive }) => 
              `px-4 py-3 text-center hover:bg-blue-50 ${isActive ? 'border-b-2 border-blue-500 font-semibold' : ''}`
            }
          >
            保护政策
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default HeritageNavigation; 