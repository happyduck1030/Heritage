import React, { useEffect, useState, useRef } from 'react';
import { Carousel, Card, Rate, Button, Spin, Row, Col, Tag } from 'antd';
import { getHeritageList } from '../api/heritage';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

const hotNews = [
  {
    id: 1,
    title: '非遗传承人亮相央视春晚',
    content: '2024年央视春晚邀请多位非遗传承人现场展示技艺，弘扬中华传统文化。',
  },
  {
    id: 2,
    title: '国家级非遗项目保护成果展在京举办',
    content: '本次展览集中展示了近年来我国非遗保护的丰硕成果，吸引众多市民参观。',
  },
  {
    id: 3,
    title: '数字化助力非遗走进年轻人',
    content: '通过短视频、直播等新媒体形式，非遗项目焕发新活力，吸引更多年轻人关注。',
  },
];

interface HeritageItem {
  id: number;
  name: string;
  category: string;
  dec?: string;
  description?: string;
  imgUrl: string;
  ratings?: { rating: number }[];
  comments?: any[];
}

const HeritageList: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [heritageList, setHeritageList] = useState<HeritageItem[]>([]);
  const navigate = useNavigate();
  const cardsRef = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const fetchList = async () => {
      setLoading(true);
      const res = await getHeritageList();
      if (res?.status === 200) {
        setHeritageList(res.data);
      }
      setLoading(false);
    };
    fetchList();
  }, []);

  // 卡片动画
  useEffect(() => {
    if (!loading && heritageList.length > 0) {
      gsap.fromTo(
        cardsRef.current,
        { opacity: 0, y: 100, scale: 0.7, rotate: -15 },
        { opacity: 1, y: 0, scale: 1, rotate: 0, stagger: 0.18, duration: 1, ease: 'back.out(1.7)' }
      );
    }
  }, [loading, heritageList]);

  // 轮播图图片（可用heritageList前几张）
  const carouselImages = heritageList.slice(0, 3).map(item => item.imgUrl);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* 轮播图 */}
      <div className="w-full max-w-5xl mx-auto mt-4 sm:mt-6 mb-6 sm:mb-10 rounded-xl overflow-hidden shadow-lg px-0 sm:px-2">
        <Carousel autoplay>
          {carouselImages.map((img, idx) => (
            <div key={idx}>
              <img src={img} alt={`轮播${idx}`} className="w-full h-40 sm:h-72 object-cover" />
            </div>
          ))}
        </Carousel>
      </div>
      {/* 热门头条新闻 */}
      <div className="max-w-5xl mx-auto mb-6 sm:mb-8 px-2 sm:px-0">
        <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4 text-yellow-600">非遗热门头条</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6">
          {hotNews.map(news => (
            <div key={news.id} className="bg-white rounded-xl shadow p-3 sm:p-4 hover:shadow-lg transition-all">
              <div className="font-semibold text-base sm:text-lg mb-1 sm:mb-2 text-blue-700">{news.title}</div>
              <div className="text-gray-600 text-xs sm:text-sm">{news.content}</div>
            </div>
          ))}
        </div>
      </div>
      {/* 列表 */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 bg-white px-2 sm:px-0">
        {loading ? (
          <Spin size="large" className="col-span-2 mx-auto my-20" />
        ) : (
          heritageList.length === 0 ? (
            <div className="col-span-2 text-center text-gray-400 py-20">暂无数据</div>
          ) : (
            heritageList.map((item, idx) => (
              <div
                key={item.id}
                ref={el => { cardsRef.current[idx] = el!; }}
              >
                <Card
                  hoverable
                  className="rounded-xl shadow-md transition-all"
                  cover={
                    <img
                      alt={item.name}
                      src={item.imgUrl}
                      className="h-40 sm:h-56 w-full object-cover rounded-t-xl"
                    />
                  }
                  onClick={() => navigate(`/heritage/inform/${item.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-base sm:text-xl font-bold">{item.name}</span>
                      <Tag color="blue">{item.category}</Tag>
                    </div>
                    <div className="text-gray-500 text-xs sm:text-sm mb-1 sm:mb-2">{item.dec?.slice(0, 50) || item.description?.slice(0, 50)}...</div>
                    <div className="flex items-center gap-2 sm:gap-4">
                      <Rate
                        disabled
                        allowHalf
                        value={
                          item.ratings && item.ratings.length
                            ? item.ratings.reduce((sum, r) => sum + (r.rating || 0), 0) / item.ratings.length
                            : 0
                        }
                      />
                      <span className="text-gray-400 text-xs">
                        {item.ratings?.length || 0}人评分
                      </span>
                      <span className="text-gray-400 text-xs ml-auto">
                        {item.comments?.length || 0}条评论
                      </span>
                    </div>
                    <Button
                      type="primary"
                      className="w-full mt-1 sm:mt-2"
                      onClick={e => {
                        e.stopPropagation();
                        navigate(`/heritage/inform/${item.id}`);
                      }}
                    >
                      查看详情
                    </Button>
                  </div>
                </Card>
              </div>
            ))
          )
        )}
      </div>
    </div>
  );
};

export default HeritageList;
