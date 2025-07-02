import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// 在导入部分添加deleteComment
import { getHeritageById, addComment, addRating, deleteComment } from '../api/heritage';
import { Spin, Breadcrumb, Tag, Divider, Form, Input, Button, Rate, message, List, Avatar, Modal } from 'antd';
import { HomeOutlined, BookOutlined, EnvironmentOutlined, TagOutlined, UserOutlined } from '@ant-design/icons';
import { notification } from 'antd';  // 引入notification组件
import { addLike } from '../api/heritage';  // 引入点赞API


interface HeritageData {
  id: number;
  name: string;
  protection_unit: string;
  category: string;
  region: string;
  dec: string;
  imgUrl: string;
  comments: Array<{
    content: string;
    username: string;
    date: string;
  }>;
  ratings: Array<{
    rating: number;
    username: string;
    date: string;
  }>;
}
const { TextArea } = Input;

const HeritageInform: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [heritage, setHeritage] = useState<HeritageData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [commentForm] = Form.useForm();
  const [ratingForm] = Form.useForm();
  const [currentUsername] = useState(localStorage.getItem('username'));
  const [currentAvatar] = useState(localStorage.getItem('avatar'));
  const [likeCount, setLikeCount] = useState<number>(0);
  const [isLiked,setIsLiked] = useState<boolean>(false);
    const [isRated,setIsRated] = useState<boolean>(false);

  useEffect(() => {
    const fetchHeritageData = async () => {
      try {
        setLoading(true);
        const response = await getHeritageById(Number(id));
              console.log(response);
        if (response.status === 200) {
    
          setHeritage(response.data);
          setLikeCount(response.data.likes.length);
        } else {
          setError('获取数据失败');
        }
      } catch (err) {
        console.error('获取非遗信息失败:', err);
        setError('获取数据失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchHeritageData();
    }
  }, [id]);

  // 修改评论提交函数
  const handleCommentSubmit = async (values: { content: string }) => {
    try {
      const response = await addComment(Number(id), {
        content: values.content,
        username: currentUsername || '匿名用户'
      });
      if (response) {
        messageApi.open({
           type: 'success',
          content: '评论成功',
           className: 'custom-class',
             style: {
                marginTop: '5vh',
              },
              });
        commentForm.resetFields();
        // 刷新数据
        const updatedResponse = await getHeritageById(Number(id));
        setHeritage(updatedResponse.data);
      }
    } catch (error) {
      message.error('评论发表失败: ' + error.message);
    }
  };

  // const handleRatingSubmit = async (values: { rating: number }) => {
  //   try {
  //     const response = await addRating(Number(id), {
  //       rating: values.rating,
  //       username: currentUsername || '匿名用户'
  //     });
    
  //     if (response.data) {
  //     console.log("点赞成功");
  //       messageApi.open({
  //         type: 'success',
  //         content: '评分成功',
  //         className: 'custom-class',
  //          style: {
  //            marginTop: '5vh',
  //           },
  //          });
  //       ratingForm.resetFields();
  //       // 直接更新本地数据
  //       setHeritage(prev => ({
  //         ...prev!,
  //         ratings: [
  //           ...(prev?.ratings || []),
  //           {
  //             rating: values.rating,
  //             username: currentUsername || '匿名用户',
  //             date: new Date().toISOString()
  //           }
  //         ]
  //       }));
  //     }
  //   } catch (error) {
  //     message.error('评分提交失败');
  //   }
  // };

  // 计算平均评分
  const calculateAverageRating = () => {
    if (!heritage?.ratings?.length) return '0.0';
    const sum = heritage.ratings.reduce((acc, curr) => acc + curr.rating, 0);
    return (sum / heritage.ratings.length).toFixed(1);
  };

  // // 添加删除评论函数
  // const handleDeleteComment = async (commentId: string) => {
  //   try {
  //     const response = await deleteComment(Number(id), commentId);
  //     if (response) {
  //       console.log(response)
  //     messageApi.open({
  //         type: 'success',
  //         content: '点赞成功',
  //         className: 'custom-class',
  //          style: {
  //            marginTop: '5vh',
  //           },
  //          });
  //       // 直接更新本地数据
  //       setHeritage(prev => ({
  //         ...prev!,
  //         comments: prev?.comments?.filter(c => c._id !== commentId) || []
  //       }));
  //     }
  //   } catch (error) {
  //     console.error('删除评论失败:', error);
  //     message.error('删除评论失败');
  //   }
  // };

  
  // 添加状态
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);
  
  // 修改转发功能
  const handleShare = () => {
    setIsShareModalVisible(true);
  };
  
  // 添加通知函数
  const showNotification = (type: 'success' | 'info' | 'warning' | 'error', message: string, description: string = '') => {
      messageApi.open({
          type: 'success',
          content: '转发成功',
          className: 'custom-class',
           style: {
             marginTop: '5vh',
            },
           });
  };

  // 修改点赞函数
  const handleLike = async () => {
      if (!currentUsername) {
         messageApi.open({
          type: 'warning',
          content: '请先登录',
          className: 'custom-class',
           style: {
             marginTop: '5vh',
            },
           });
          return;
      }
      
      try {
          const response = await addLike(Number(id), { username: currentUsername });
          console.log(response)
          if (response.status === 200) {
              messageApi.success('点赞成功');
              setLikeCount(response.data);
              setIsLiked(true);
          }
      } catch (error) {
          if (error.response?.status === 400) {
              messageApi.warning('您已经点赞过了');
          } else {
              messageApi.error('点赞失败，请稍后重试');
              console.error('点赞失败:', error);
          }
      }
  };
  
  // 修改评分提交函数
  const handleRatingSubmit = async (values: { rating: number }) => {
      if (!currentUsername) {
         messageApi.open({
          type: 'warning',
          content: '请先登录',
          className: 'custom-class',
           style: {
             marginTop: '5vh',
            },
           });
          return;
      }
  
      try {
          const response = await addRating(Number(id), {
              rating: values.rating,
              username: currentUsername
          });
  
          if (response.status === 200) {
            if(isRated){
               messageApi.open({
            type: 'error',
            content: '您已经评分过了噢',
             className: 'custom-class',
             style: {
               marginTop: '5vh',
              },
             });
             return
            }
             messageApi.open({
            type: 'success',
            content: '评分提交成功',
             className: 'custom-class',
             style: {
               marginTop: '5vh',
              },
             });
             setIsRated(true)
              ratingForm.resetFields();
              setHeritage(prev => ({
                  ...prev!,
                  ratings: response.data.ratings
              }));
          }
      } catch (error) {
          if (error.response?.status === 400) {
            console.log(error)
              messageApi.open({
          type: 'warning',
          content: '您已经评分过了',
          className: 'custom-class',
           style: {
             marginTop: '5vh',
            },
           });
          } else {
              messageApi.open({
          type: 'error',
          content: '评分失败 请稍后再试',
          className: 'custom-class',
           style: {
             marginTop: '5vh',
            },
           });
          }
      }
  };
  
  // 修改删除评论函数
  const handleDeleteComment = async (commentId: string) => {
      try {
        console.log(id)
          const response = await deleteComment(Number(id), commentId);
              
          if (response.status === 200 && response.data) {
              messageApi.success('评论删除成功');
              // 更新本地数据
              setHeritage(prev => ({
                  ...prev!,
                  comments: response.data
              }));
          }
      } catch (error) {
          console.error('删除评论失败:', error);
          messageApi.error('删除评论失败');
      }
  };

  
  // 修改转发确认函数
  const handleShareConfirm = () => {
    if (!heritage) return;
    const shareList = JSON.parse(localStorage.getItem('sharedPosts') || '[]');
    if (!shareList.find((item: any) => item.id === heritage.id)) {
      shareList.unshift({
        id: heritage.id,
        name: heritage.name,
        imgUrl: heritage.imgUrl,
        description: heritage.dec || heritage.description,
        time: new Date().toISOString(),
        isShared: true,
      });
      localStorage.setItem('sharedPosts', JSON.stringify(shareList));
      showNotification('success', '转发成功', '可在个人中心-我的发布查看');
    } else {
      showNotification('info', '提示', '已转发过该内容');
    }
    setIsShareModalVisible(false);
  };

  
  
  // 在return中添加Modal组件


  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spin size="large" tip="加载中..." />
      </div>
    );
  }

  if (error || !heritage) {
    return (
      <div className="flex flex-col justify-center items-center h-96">
        <p className="text-red-500 text-xl">{error || '未找到相关非遗信息'}</p>
        <button 
          onClick={() => window.history.back()}
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          返回上一页
        </button>
      </div>
    );
  }

  return (
    
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* 面包屑导航 */}
      <Breadcrumb className="mb-6">
        <Breadcrumb.Item href="/">
          <HomeOutlined /> 首页
        </Breadcrumb.Item>
        <Breadcrumb.Item>{heritage.name}</Breadcrumb.Item>
      </Breadcrumb>

      {/* 文章标题 */}
      <div className="text-center mb-10">
        
        <h1 className="text-4xl font-bold mb-4">{heritage.name}</h1>
        <div className="flex justify-center space-x-4">
          <Tag color="blue" icon={<TagOutlined />}>{heritage.category}</Tag>
          <Tag color="green" icon={<EnvironmentOutlined />}>{heritage.region}</Tag>
          <Tag color="purple">保护单位: {heritage.protection_unit}</Tag>
        </div>
      </div>

      {/* 主图 */}
      <div className="mb-10 rounded-xl overflow-hidden shadow-lg">
        <img 
          src={heritage.imgUrl} 
          alt={heritage.name} 
          className="w-full h-auto object-cover max-h-[500px]"
        />
      </div>

      {/* 文章内容 */}
      <div className="bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-4 border-l-4 border-blue-500 pl-4">项目介绍</h2>
        <div className="text-lg leading-relaxed mb-8 text-gray-700">
          {heritage.dec.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4">{paragraph}</p>
          ))}
        </div>

        <Divider />

        {/* 保护信息 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 border-l-4 border-green-500 pl-4">保护信息</h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="mb-2"><span className="font-semibold">保护单位:</span> {heritage.protection_unit}</p>
            <p className="mb-2"><span className="font-semibold">所属类别:</span> {heritage.category}</p>
            <p><span className="font-semibold">地区分布:</span> {heritage.region}</p>
          </div>
        </div>

        {/* 评分区域 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 border-l-4 border-yellow-500 pl-4">评分</h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <span className="text-3xl font-bold mr-2">{calculateAverageRating()}</span>
              <Rate disabled allowHalf value={parseFloat(calculateAverageRating())} />
              <span className="ml-2 text-gray-500">({heritage.ratings?.length || 0}人评分)</span>
            </div>
            <Form form={ratingForm} onFinish={handleRatingSubmit}>
              <Form.Item name="rating" rules={[{ required: true, message: '请选择评分' }]}>
                <Rate allowHalf />
              </Form.Item>
              <Form.Item>
                <Button color="cyan" variant='solid' htmlType="submit">
                  提交评分
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>

        <div className="flex gap-4 mb-8">
           {contextHolder}
          <Button color="danger" variant="solid" onClick={handleLike}>
            👍 点赞 {likeCount > 0 && <span>({likeCount})</span>}
          </Button>
          <Button color="cyan" variant="solid" onClick={handleShare}>
            🔄 转发
          </Button>
        </div>

        {/* 评论区域 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 border-l-4 border-green-500 pl-4">评论</h2>
          <div className="bg-gray-50 p-6 rounded-lg mb-4">
            <Form form={commentForm} onFinish={handleCommentSubmit}>
              <Form.Item name="content" rules={[{ required: true, message: '请输入评论内容' }]}>
                <TextArea rows={4} placeholder="写下你的评论..." />
              </Form.Item>
              <Form.Item>
                <Button color='cyan' variant='solid' htmlType="submit">
                  发表评论
                </Button>
              </Form.Item>
            </Form>
          </div>
       
          <List
            itemLayout="horizontal"
            dataSource={heritage.comments || []}
            renderItem={item => (
              <List.Item
                actions={[
                  (item.username === currentUsername) && (
                    <Button 
                      type="primary" 
                      danger
                      onClick={() => handleDeleteComment(item._id || item.date)}
                      style={{ backgroundColor: '#ff4d4f', borderColor: '#ff4d4f', color: 'white' }}
                    >
                      删除
                    </Button>
                  )
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      src={item.username === currentUsername ? currentAvatar : undefined}
                      icon={<UserOutlined />}
                    />
                  }
                  title={item.username}
                  description={
                    <>
                      <p>{item.content}</p>
                      <span className="text-gray-400 text-sm">
                        {new Date(item.date).toLocaleString()}
                      </span>
                    </>
                  }
                />
              </List.Item>
            )}
          />
            <Modal
    title="转发提醒"
    open={isShareModalVisible}
    onOk={handleShareConfirm}
    onCancel={() => setIsShareModalVisible(false)}
    okText="确认转发"
    cancelText="取消"
     okButtonProps={{ 
        style: { backgroundColor: '#8045FF', borderColor: '#8045FF' },
        className: 'hover:bg-purple-700 focus:ring-2 focus:ring-purple-300'
    }}
  >
    <p>确定要转发"{heritage?.name}"吗？</p>
    <p className="text-gray-500 text-sm mt-2">转发后将显示在你的个人主页中</p>
  </Modal>
        </div>

        {/* 相关推荐 */}
        <div>
          <h2 className="text-2xl font-bold mb-4 border-l-4 border-yellow-500 pl-4">相关推荐</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(item => (
              <div key={item} className="bg-gray-50 p-4 rounded-lg hover:shadow-md transition-all cursor-pointer">
                <h3 className="font-semibold">相关非遗项目 {item}</h3>
                <p className="text-gray-500 text-sm">点击查看详情</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default HeritageInform;