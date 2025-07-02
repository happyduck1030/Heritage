import React from 'react';
import { Card, Avatar, Tag, Button, Empty } from 'antd';
import { ShareAltOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

// 定义类型
interface SharedPost {
  id: number;
  name: string;
  imgUrl: string;
  description: string;
  time: string;
  isShared?: boolean;
}

const HeritagePost: React.FC = () => {
  const navigate = useNavigate();
  const sharedPosts: SharedPost[] = JSON.parse(localStorage.getItem('sharedPosts') || '[]');
  const username = localStorage.getItem('username');
  const avatar = localStorage.getItem('avatar');

  return (
    <div className="max-w-2xl sm:max-w-4xl mx-auto p-2 sm:p-4">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">我的发布</h1>
      {sharedPosts.length === 0 ? (
        <Empty description="暂无发布内容" />
      ) : (
        <div className="space-y-2 sm:space-y-4">
          {sharedPosts.map((post) => (
            <Card 
              key={post.id + post.time} 
              className="hover:shadow-2xl transition-all rounded-xl sm:rounded-2xl border-0 bg-white/90"
              bodyStyle={{ padding: '0', background: '#fff', borderRadius: '16px' }}
            >
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 p-2 sm:p-4">
                <div className="flex-shrink-0 w-full sm:w-44 h-28 rounded-lg overflow-hidden relative mb-2 sm:mb-0">
                  <img 
                    src={post.imgUrl} 
                    alt={post.name}
                    className="w-full h-full object-cover"
                  />
                  {post.isShared && (
                    <Tag color="blue" icon={<ShareAltOutlined />} style={{position:'absolute',top:8,left:8,zIndex:2,fontWeight:'bold',fontSize:13}}>转发</Tag>
                  )}
                </div>
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <Avatar src={avatar} icon={<UserOutlined />} />
                      <span className="font-medium text-indigo-700">{username || '匿名用户'}</span>
                    </div>
                    <h2 className="text-base sm:text-lg font-bold mb-1 hover:text-blue-600 cursor-pointer line-clamp-1"
                        onClick={() => navigate(`/heritage/inform/${post.id}`)}>
                      {post.name}
                    </h2>
                    <p className="text-gray-600 text-xs sm:text-sm mb-1 line-clamp-2">
                      {post.description}
                    </p>
                  </div>
                  <div className="flex justify-between items-center text-gray-400 text-xs mt-2">
                    <span>{new Date(post.time).toLocaleString()}</span>
                    <Button type="link" onClick={() => navigate(`/heritage/inform/${post.id}`)}>
                      查看详情
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default HeritagePost;
