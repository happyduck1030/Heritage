import React, { useEffect, useRef, useState } from 'react';
import { Avatar, Form, Input, Button, message } from 'antd';
import { CameraOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const HeritagePersonal: React.FC = () => {
  const [form] = Form.useForm();
  const [avatar, setAvatar] = useState<string>(localStorage.getItem('avatar') || '');
  const [username, setUsername] = useState<string>(localStorage.getItem('username') || '');
  const [bio, setBio] = useState<string>(localStorage.getItem('bio') || '');
  const [address, setAddress] = useState<string>(localStorage.getItem('address') || '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    form.setFieldsValue({
      username,
      bio,
      address,
      avatar,
    });
  }, [form, username, bio, address, avatar]);

  // 头像选择
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  // 头像上传处理（本地base64）
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => {
        setAvatar(ev.target?.result as string);
        form.setFieldsValue({ avatar: ev.target?.result });
        localStorage.setItem('avatar', ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 保存信息到本地并同步更新
  const handleFinish = (values: { username: string; bio: string; address: string; avatar: string }) => {
    localStorage.setItem('username', values.username);
    localStorage.setItem('bio', values.bio || '');
    localStorage.setItem('address', values.address || '');
    localStorage.setItem('avatar', avatar || '');
    setUsername(values.username);
    setBio(values.bio);
    setAddress(values.address);
    setAvatar(avatar);
    message.success('信息已保存到本地');
  };

  // 退出登录
  const handleLogout = () => {
    localStorage.removeItem('token');
    message.success('已退出登录');
    setTimeout(() => {
      navigate('/login');
    }, 500);
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen relative px-2 sm:px-0"
      style={{
        background: avatar
          ? `url(${avatar}) center/cover no-repeat`
          : 'linear-gradient(to bottom right, #c3dafe, #d6bcfa)',
      }}
    >
      {/* 虚化背景遮罩 */}
      <div
        className="absolute inset-0"
        style={{
          background: avatar
            ? 'rgba(60, 60, 100, 0.5)'
            : 'linear-gradient(to bottom right, #c3dafe, #d6bcfa)',
          backdropFilter: 'blur(8px)',
          zIndex: 1,
        }}
      />
      {/* 内容卡片 */}
      <div className="relative z-10 w-full max-w-xl rounded-2xl shadow-2xl bg-white bg-opacity-90 p-4 sm:p-10 flex flex-col items-center">
        {/* 退出登录按钮 */}
        <Button
          type="default"
          icon={<LogoutOutlined />}
          className="absolute top-2 right-2 sm:top-4 sm:right-4"
          onClick={handleLogout}
        >
          <span className="hidden sm:inline">退出登录</span>
        </Button>
        {/* 头像 */}
        <div className="relative mb-4 sm:mb-6">
          <Avatar
            size={80}
            src={avatar}
            className="border-4 border-white shadow-lg cursor-pointer"
            onClick={handleAvatarClick}
            style={{ backgroundColor: '#e0e7ff' }}
          />
          <div
            className="absolute bottom-2 right-2 bg-white rounded-full p-1 sm:p-2 shadow cursor-pointer"
            onClick={handleAvatarClick}
            title="更换头像"
          >
            <CameraOutlined style={{ fontSize: 18, color: '#6366f1' }} />
          </div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleAvatarChange}
          />
        </div>
        {/* 用户名 */}
        <div className="text-lg sm:text-2xl font-bold text-indigo-900 mb-1">{username || '未设置用户名'}</div>
        <div className="text-indigo-400 mb-2 sm:mb-4">{address || '中国'}</div>
        {/* 个人简介 */}
        <div className="text-gray-600 mb-4 sm:mb-6 text-center text-sm sm:text-base">{bio || '这个人很神秘，什么都没写~'}</div>
        {/* 统计信息 */}
        <div className="flex flex-col sm:flex-row justify-between w-full px-2 sm:px-8 mb-4 sm:mb-8 gap-2 sm:gap-0">
          <div className="text-center cursor-pointer" onClick={() => navigate('/heritage/post')}>
            <div className="text-lg sm:text-xl font-bold text-indigo-900">5</div>
            <div className="text-indigo-400 text-xs sm:text-sm underline">我的发布</div>
          </div>
          <div className="text-center">
            <div className="text-lg sm:text-xl font-bold text-indigo-900">12</div>
            <div className="text-indigo-400 text-xs sm:text-sm">我的收藏</div>
          </div>
          <div className="text-center">
            <div className="text-lg sm:text-xl font-bold text-indigo-900">32</div>
            <div className="text-indigo-400 text-xs sm:text-sm">我的足迹</div>
          </div>
        </div>
        {/* 编辑表单 */}
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{
            username,
            bio,
            address,
            avatar,
          }}
          className="w-full"
        >
          <Form.Item label="用户名" name="username" rules={[{ required: true, message: '请输入用户名' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="个人简介" name="bio">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item label="地址" name="address">
            <Input />
          </Form.Item>
          <Form.Item name="avatar" hidden>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button color='cyan' variant='solid' htmlType="submit" block>
              确定
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default HeritagePersonal;
