import React, { useCallback, useRef, useState, useEffect } from 'react';
import './Login.css';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { Background, type Engine } from 'tsparticles-engine';
import {Button,Checkbox,Form,Input,message} from 'antd'
import shilver from '../../../public/images/shilver.png'
import { login, register } from '../../api/user'
import { useNavigate } from 'react-router-dom';
// @ts-expect-error: no types for react-simple-captcha
import { loadCaptchaEnginge, LoadCanvasTemplate, validateCaptcha } from 'react-simple-captcha';
// import loginBg from '../../../public/images/login-bg.png';
import loginBg from '../../../public/images/loginBg.jpg'


const Login = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isLogin, setIsLogin] = useState(true);
  const [captchaInput, setCaptchaInput] = useState('');

  // 切换登录/注册时清空表单
  const handleSwitch = () => {
    setIsLogin(!isLogin);
    form.resetFields();
    setCaptchaInput('');
    loadCaptchaEnginge(4);
  };

  // 初始化粒子效果
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  // 配置粒子效果
  const particlesOptions: any = {
    background: {
      color: {
        value: "#111827",
      },
    },
    fpsLimit: 120,
    particles: {
      number: {
        value: 80,
        density: {
          enable: true,
          value_area: 800,
        },
      },
      color: {
        value: "#ffffff",
      },
      shape: {
        type: "circle",
      },
      opacity: {
        value: 0.5,
        random: false,
      },
      size: {
        value: 3,
        random: true,
      },
      line_linked: {
        enable: true,
        distance: 150,
        color: "#ffffff",
        opacity: 0.6,
        width: 1,
      },
      move: {
        enable: true,
        speed: 3,
        direction: "none",
        random: false,
        straight: false,
        out_mode: "out",
        bounce: false,
      },
    },
    interactivity: {
      detectsOn: "canvas",
      events: {
        onhover: {
          enable: true,
          mode: "repulse",
        },
        onclick: {
          enable: true,
          mode: "push",
        },
        resize: true,
      },
      modes: {
        repulse: {
          distance: 100,
          duration: 0.4,
        },
        push: {
          particles_nb: 4,
        },
      },
    },
    retina_detect: true,
  };

  const onFinish = async (values: any) => {
    if (!validateCaptcha(captchaInput)) {
      messageApi.open({
        type: 'error',
        content: '验证码输入错误！',
        className: 'custom-class',
        style: { marginTop: '5vh' },
      });
      loadCaptchaEnginge(4);
      setCaptchaInput('');
      return;
    }
    try {
      let res;
      if (isLogin) {
        res = await login(values);
      } else {
        res = await register(values);
      }
      if (res?.status === 200) {
        localStorage.setItem('token', res.token);
        messageApi.open({
          type: 'success',
          content: isLogin ? '登录成功' : '注册成功',
          className: 'custom-class',
          style: { marginTop: '5vh' },
        });
        navigate('/heritage');
      } else {
        messageApi.open({
          type: 'error',
          content: '用户名或密码错误',
          className: 'custom-class',
          style: { marginTop: '5vh' },
        });
      }
    } catch (error) {
      messageApi.open({
        type: 'error',
        content: '用户名或密码错误',
        className: 'custom-class',
        style: { marginTop: '5vh' },
      });
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('表单校验失败:', errorInfo);
  };

  // 组件挂载时生成验证码
  useEffect(() => {
    loadCaptchaEnginge(4);
  }, []);

  // 刷新验证码
  const refreshCaptcha = () => {
    loadCaptchaEnginge(4);
    setCaptchaInput('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 relative">
      <Particles 
        className="absolute top-0 left-0 w-full h-full" 
        id="tsparticles"
        init={particlesInit}
        options={particlesOptions} 
      />
           {contextHolder}
      <div className="relative z-10 flex w-[900px] h-[520px] rounded-2xl shadow-2xl overflow-hidden bg-white/10 backdrop-blur b ">
        {/* 左侧图片全覆盖 */}
        <div className="flex-1  flex items-center justify-center p-0">
          <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${shilver})` }} />
        </div>
        {/* 右侧表单卡片 */}
        <div className="flex-1 bg-white/80 flex flex-col justify-center items-center p-10">
          <h1 className="text-3xl font-bold text-center mb-2 text-purple-600 font-serif tracking-wide select-none">
            {isLogin ? '登录' : '注册'}
          </h1>
          <div className="mb-6 flex justify-center">
            <svg className="w-20 h-20" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M912 704a99.04 99.04 0 0 1-2.08 17.28C902.88 758.4 869.92 842.4 720 832l45.28-64L800 720z" fill="#D6A62D"></path><path d="M912 704a99.04 99.04 0 0 1-2.08 17.28c-24.96 27.04-68.64 49.92-144 48L800 720z" fill="#FFD466"></path><path d="M256 848s-64 45.28-64 64 48 16 48 16a28.64 28.64 0 0 0 16 32 43.2 43.2 0 0 0 12.16 3.68 76.32 76.32 0 0 0 72.48-31.04L368 896zM640 848s64 45.28 64 64-48 16-48 16a28.64 28.64 0 0 1-16 32 43.2 43.2 0 0 1-12.16 3.68 76.32 76.32 0 0 1-72.48-31.04L528 896z" fill="#FFF0C9"></path><path d="M624 880q-20.8 8.32-40.8 14.88C330.08 976 176 820.32 176 700a334.24 334.24 0 0 1 10.56-76 311.36 311.36 0 0 1 43.04-94.4L224 528c-4-9.12-7.52-17.92-10.4-26.4C152.16 328.64 272 256 272 256l7.52 1.28C288 204.48 320 140.64 416 96c139.68-64 268.8 4.64 324.64 116.64 1.92-2.4 4-4.64 6.08-4.64a11.2 11.2 0 0 1 5.28 0s58.72 34.56 48 176a411.04 411.04 0 0 1-19.68 103.2l11.68 1.92a107.36 107.36 0 0 1 24 30.24 153.12 153.12 0 0 1 9.44 19.2C862.08 626.72 846.72 788.96 624 880z" fill="#FFD466"></path><path d="M560 296a24 16 90 1 0 32 0 24 16 90 1 0-32 0Z" fill="#001C63"></path><path d="M608 776a292.64 292.64 0 0 1-24.8 118.88C330.08 976 176 820.32 176 700a334.24 334.24 0 0 1 10.56-76 224.8 224.8 0 0 1 189.44-112C504.16 512 608 630.24 608 776z" fill="#F0C763"></path><path d="M624 880c-277.28 113.28-448-53.28-448-180a312 312 0 0 1 53.6-170.88L224 528c-4-9.12-7.52-17.92-10.4-26.4L224 512l64-32c-3.2 7.2-135.68 200.96-48 288 168 166.08 385.92 88 480 0 81.92-76.48 86.88-109.92 105.76-229.44C862.08 626.72 846.72 788.96 624 880z" fill="#F0C763"></path><path d="M320 280a24 16 90 1 0 32 0 24 16 90 1 0-32 0Z" fill="#001C63"></path><path d="M816 519.36c-43.2 33.12-77.6 48-64 8.64 30.08-89.92-16-288-16-288l10.72-32a11.2 11.2 0 0 1 5.28 0s58.72 34.56 48 176a412.16 412.16 0 0 1-19.68 103.36l11.68 1.92a107.36 107.36 0 0 1 24 30.08z" fill="#F0C763"></path><path d="M480 448c-52.16 19.84-246.72 48-304 0a82.72 82.72 0 0 1-21.6-24.96C136.8 389.92 176 370.24 208 368c40-2.72 141.28-20 160-48s64-16 64-16c32 3.84 45.6 34.56 104.32 60.64L544 368c65.28 26.72-8 58.72-64 80z" fill="#FFDB7D"></path><path d="M536.32 364.64C529.12 384 484.8 401.92 448 416c-49.28 18.72-226.24 44.96-293.6 7.04C136.8 389.92 176 370.24 208 368c40-2.72 141.28-20 160-48s64-16 64-16c32 3.84 45.6 34.56 104.32 60.64z" fill="#FFF0C9"></path><path d="M440 360m-8 0a8 8 0 1 0 16 0 8 8 0 1 0-16 0Z" fill="#001C63"></path><path d="M360 360m-8 0a8 8 0 1 0 16 0 8 8 0 1 0-16 0Z" fill="#001C63"></path><path d="M688 224m-16 0a16 16 0 1 0 32 0 16 16 0 1 0-32 0Z" fill="#FFFFFF"></path></svg>
          </div>
          <Form
            className="flex flex-col w-full max-w-[340px]"
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            form={form}
          >
            <Form.Item
              label={<span className="text-gray-700">用户名</span>}
              name="username"
              validateStatus="warning"
              hasFeedback
              rules={[
                { message: '请输入用户名!' },
                { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线!' },
                { required: true, message: 'Please input your username!' },
              ]}
              className="w-full"
            >
              <Input placeholder="请输入用户名" className="rounded focus:ring-2 focus:ring-purple-400" />
            </Form.Item>
            <Form.Item
              label={<span className="text-gray-700">密码</span>}
              name="password"
              validateStatus="warning"
              hasFeedback
              rules={[
                { message: '请输入密码!' },
                { pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, message: '密码必须是至少6位，且包含字母和数字!' },
                { required: true, message: 'Please input your password!' },
              ]}
              className="w-full"
            >
              <Input.Password placeholder="请输入密码" className="rounded focus:ring-2 focus:ring-purple-400" />
            </Form.Item>
            {/* 验证码 */}
            <Form.Item className="w-full" label={<span className="text-gray-700">验证码</span>} required>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="请输入验证码"
                  value={captchaInput}
                  onChange={e => setCaptchaInput(e.target.value)}
                  className="rounded focus:ring-2 focus:ring-purple-400"
                  style={{ width: 100 }}
                />
                <LoadCanvasTemplate />
                <Button type="link" className="text-blue-500 hover:text-blue-700 p-0" onClick={refreshCaptcha}>
                  换一张
                </Button>
              </div>
            </Form.Item>
            <Form.Item name="remember" valuePropName="checked" label={null} className="w-full">
              <Checkbox className="text-gray-700">Remember me</Checkbox>
            </Form.Item>
            <Form.Item label={null} className="w-full">
              <Button type="primary" htmlType="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded shadow-md transition">
                {isLogin ? '登录' : '注册'}
              </Button>
            </Form.Item>
            <Form.Item className="w-full text-center">
              <Button type="link" onClick={handleSwitch} className="text-blue-500 hover:text-blue-700">
                {isLogin ? '没有账号？去注册' : '已有账号？去登录'}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;