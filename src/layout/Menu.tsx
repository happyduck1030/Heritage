import React, { useState } from 'react';
import { AppstoreOutlined, MailOutlined, SettingOutlined, MenuOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu, Drawer, Button } from 'antd';
import tiandao from '../../public/images/tiandaochouqin.png'
type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  {
    key: 'sub1',
    label: '传统音乐',
    icon: <MailOutlined />,
    children: [
      {
        key: 'g1',
        label: '​​古琴艺术​',
        type: 'group',
        children: [
          { key: '1', label: '流派分布' },
          { key: '2', label: '传世名曲' },
        ],
      },
      {
        key: 'g2',
        label: '南音​',
        type: 'group',
      
        children: [
          { key: '3', label: '演奏形式' },
          { key: '4', label: '传承基地' },
        ],
      },
    ],
  },
  {
    key: 'sub2',
    label: '节庆民俗',
    icon: <AppstoreOutlined />,
    children: [
      { key: '5', label: '春节' },
      { key: '6', label: '那达慕' },
      
    ],
  },
  {
    type: 'divider',
  },
  {
    key: 'sub4',
    label: '非遗文化活动',
    icon: <SettingOutlined />,
    children: [
      { key: '9', label: '传承人研习​' },
      { key: '10', label: '非遗体验日​' },
      { key: '11', label: '传统手工艺制作' },
      { key: '12', label: '口头传说与表演艺术' },
    ],
  },
 
];

const App: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const onClick: MenuProps['onClick'] = (e) => {
    setDrawerOpen(false); // 移动端点击菜单后自动关闭
    console.log('click ', e);
  };

  return (
    <>
      {/* 移动端汉堡按钮 */}
      <div className="md:hidden flex items-center p-2 bg-white shadow z-20">
        <Button type="text" icon={<MenuOutlined />} onClick={() => setDrawerOpen(true)} />
        <span className="ml-2 font-bold text-lg">菜单</span>
      </div>
      {/* 侧边栏菜单（md及以上显示） */}
      <div className="hidden md:block">
        <Menu
          className='w-[100%] h-[70%]'
          onClick={onClick}
          style={{ width: 256 }}
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          mode="inline"
          items={items}
        />
        <div className='h-[30%] mt-44'>
          <img src={tiandao} alt="" />
        </div>
      </div>
      {/* 移动端抽屉菜单 */}
      <Drawer
        title={<span className="font-bold">导航菜单</span>}
        placement="left"
        closable={true}
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        width={240}
        bodyStyle={{ padding: 0 }}
        className="md:hidden"
      >
        <Menu
          onClick={onClick}
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          mode="inline"
          items={items}
        />
        <div className='h-[30%] p-2'>
          <img src={tiandao} alt="" />
        </div>
      </Drawer>
    </>
  );
};

export default App;