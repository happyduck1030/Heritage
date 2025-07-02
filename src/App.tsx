import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './layout/Navbar';
import Menu from './layout/Menu';

import './App.css';

function App() {
  return (
    <div className="App flex flex-col md:flex-row">
      {/* 左侧固定菜单，移动端隐藏 */}
      <div className='menu hidden md:block fixed left-0 top-0 h-screen w-64 mr-4 z-10'>
        <Menu />
      </div>
      {/* 右侧内容区 */}
      <div className='content w-full md:ml-64' >
        {/* 顶部固定导航栏，移动端全宽，左移 */}
        <div className='fixed top-0 left-0 md:left-64 right-0 z-10 w-full'>
          <Navbar />
        </div>
        {/* 可滚动内容区 */}
        <div className='mt-20 p-2 sm:p-4'>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default App;
