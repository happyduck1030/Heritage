import React from 'react';
import { Outlet } from 'react-router-dom';
import HeritageNavigation from '../components/HeritageNavigation';

const HeritageLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-700 text-white py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold">中国非物质文化遗产保护平台</h1>
        </div>
      </header>
      
      <HeritageNavigation />
      
      <main className="pb-8">
        <Outlet />
      </main>
      
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-3">关于我们</h3>
              <p className="text-gray-300 text-sm">
                中国非物质文化遗产保护平台致力于保护和传承中国丰富的非物质文化遗产，
                通过数字化方式记录和展示各类非遗项目，促进公众对非遗的了解和参与。
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">联系方式</h3>
              <p className="text-gray-300 text-sm">电话：010-12345678</p>
              <p className="text-gray-300 text-sm">邮箱：heritage@example.com</p>
              <p className="text-gray-300 text-sm">地址：北京市朝阳区文化路100号</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">相关链接</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li><a href="http://www.ihchina.cn/" className="hover:underline" target="_blank" rel="noopener noreferrer">中国非物质文化遗产网</a></li>
                <li><a href="http://www.cich.org.cn/" className="hover:underline" target="_blank" rel="noopener noreferrer">中国非物质文化遗产保护中心</a></li>
                <li><a href="https://ich.unesco.org/" className="hover:underline" target="_blank" rel="noopener noreferrer">UNESCO非物质文化遗产</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-700 text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} 中国非物质文化遗产保护平台 版权所有
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HeritageLayout; 