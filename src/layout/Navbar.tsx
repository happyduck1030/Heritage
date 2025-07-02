import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GithubOutlined, UserOutlined } from '@ant-design/icons';
import { message, Avatar } from 'antd';
import bgImg from '../../public/images/bgimg.png'


const Navbar = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  const avatar = localStorage.getItem('avatar');

  const handleNavigation = (path: string) => {
    navigate(path);
  };
  useEffect(() => {
    console.log('用户名:', username);
console.log('头像:', avatar);
  }, []);
        const token = localStorage.getItem('token');
  const handlePersonalCenter = () => {

    
    if (!token) {
      message.warning('请先登录！');
      navigate('/login');
    } else {
      navigate('/heritage/personal');
    }
  };

  return (
   <>
   <div className=' backdrop-blur-md border-lime-100 rounded-lg overflow-hidden ' >
     <div className='w-full h-[60px] md:h-[72px] mb-2 md:mb-4 flex  bg-center bg-no-repeat bg-cover  justify-between items-center px-2 -z-10 md:px-0' style={{ backgroundImage: `url(/../../public/images/bgimg.png)` }} >
      {/* 左侧 */}
      <div className="overflow-x-auto scrollbar-hide w-full">
        <ul className='flex text-base md:text-xl p-1 md:p-2 ml-1 md:ml-5 justify-start rounded-full mt-1  min-w-max'>
           <div className='mr-4 md:mr-14 flex items-center'>
          <GithubOutlined  style={{color:'blue'}} className='text-3xl md:text-5xl'/>
        </div>
          <li 
            className="cursor-pointer transition-all bg-white text-blue-500 px-3 md:px-6 py-1 md:py-2 rounded-lg border-blue-600 mr-2 md:mr-4
            border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px]
            active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
            onClick={() => handleNavigation('/heritage')}
          >
            <p>首页</p>
          </li>
          <li 
            className="cursor-pointer transition-all bg-white text-blue-500  px-3 md:px-6 py-1 md:py-2 rounded-lg border-blue-600 
            border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] mr-2 md:mr-4
            active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
            onClick={() => handleNavigation('/heritage/map')}
          >
            非遗全景
          </li>
          <li 
            className="cursor-pointer transition-all bg-white text-blue-500  px-3 md:px-6 py-1 md:py-2 rounded-lg border-blue-600 
            border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] mr-2 md:mr-4
            active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
            onClick={() => handleNavigation('/heritage/list')}
          >
            动态资讯
          </li>
          <li 
            className="cursor-pointer transition-all bg-white text-blue-500 px-3 md:px-6 py-1 md:py-2 rounded-lg border-blue-600 
            border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] 
            active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
          >
            传承人
          </li>
            {/* 右侧 */}
     
        </ul>     
        
      </div>
     <div className='flex   items-center min-w-[80px] md:min-w-[120px] justify-end  relative mr-80'>
        {/* 用户头像和用户名 */}
        {token?  (
          <div className="flex items-center  cursor-pointer text-white bg-transparent hover:text-cyan-400 px-3 py-1 rounded-lg hover:bg-gray-50" onClick={handlePersonalCenter}>
            <Avatar
              src={avatar || undefined}
              icon={<UserOutlined />}
              size={40}
              className="mr-2"
              style={{ backgroundColor: '#e6f4ff', color: '#1890ff' }}
            />
            <span className="text-xl  font-medium truncate max-w-[80px] md:max-w-[120px]">
              {username}
            </span>
          </div>
        ):(
          <div className="flex items-center  cursor-pointer text-white bg-transparent hover:text-cyan-400 px-3 py-1 rounded-lg hover:bg-gray-50" onClick={() => handleNavigation('/login')}>
            <Avatar
              icon={<UserOutlined />}
              size={40}
              className="mr-2"
              style={{ backgroundColor: '#e6f4ff', color: '#1890ff' }}
            />
            <span className="text-xl  font-medium truncate max-w-[80px] md:max-w-[120px]">
              登录
            </span>
          </div>
        )}
      </div>
      
    </div>
    
   </div>
   </>
  );
};

export default Navbar;
//  