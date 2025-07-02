import React, { useEffect, useRef } from 'react';
import video from "../../public/videos/feiyi.mp4";
import { useNavigate } from 'react-router-dom';

import gsap from 'gsap';

const HeritageHome: React.FC = () => {
  const navigate = useNavigate();
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  const heritageVideos = [
    {
      id: 1,
      title: '古琴艺术',
      description: '中国最古老的弹拨乐器之一，承载三千年文化底蕴',
      imgUrl: 'https://imgs.699pic.com/images/501/258/157.jpg!detail.v1',
    },
    {
      id: 2,
      title: '京剧表演',
      description: '国粹艺术，融合唱念做打的综合表演形式',
      imgUrl: 'https://vcg00.cfp.cn/creative/vcg/800/new/VCG211352626541-QFC.jpg',
  
    },
    {
      id: 3,
      title: '传统剪纸',
      description: '民间艺术瑰宝，剪刀与纸张的千年对话',
      imgUrl: 'https://bpic.588ku.com/back_origin_min_pic/23/05/10/d84e7772064ab7503f36d70720c3f6e8.jpg!/fw/750/quality/99/unsharp/true/compress/true',
   
    }
  ];
  const heritagePeople=[
    { id: 1, name:'汪世瑜',
      type:'昆曲',
      dec:"汪世瑜是中国著名的昆曲表演艺术家，被誉为巾生魁首，他对昆曲艺术的传承与发展做出了巨大贡献。",
      imgUrl:"https://tse3-mm.cn.bing.net/th/id/OIP-C.bcKkSHaEZla7-T6XDQG2TwAAAA?w=122&h=183&c=7&r=0&o=7&cb=iwp2&dpr=1.4&pid=1.7&rm=3"
    },
     {
       id: 2, name: '李祥霆',
       type: '古琴艺术',
       dec: "李祥霆是著名的古琴演奏家、教育家，他不仅擅长演奏，还致力于古琴音乐的研究和教学工作，为中国古琴艺术的传承作出了重要贡献。",
       imgUrl:"https://tse1-mm.cn.bing.net/th/id/OIP-C.m02iWOs1JCl-WQeJo7T-jAHaFp?w=200&h=180&c=7&r=0&o=7&cb=iwp2&dpr=1.4&pid=1.7&rm=3"
     },
     {
       id: 3, name: '高凤莲',
       type: '剪纸艺术 ',
       dec: "高凤莲是中国民间剪纸艺术大师，她的剪纸作品风格独特，富有浓郁的地方特色和生活气息，为保护和发展中国剪纸艺术发挥了重要作用。",
       imgUrl:"https://tse2-mm.cn.bing.net/th/id/OIP-C.Cf9Ns9nnmTuU1Fu80oE-GgHaIw?w=175&h=208&c=7&r=0&o=7&cb=iwp2&dpr=1.4&pid=1.7&rm=3"
     },
     {
       id: 4, name: '薛永年',
       type: '木版水印技艺',
       dec: "薛永年是木版水印技艺的代表性传承人之一。木版水印是一种传统的印刷技术，薛永年通过自己的努力，使得这一古老技艺得以延续并发扬光大。",
       imgUrl:"https://tse4-mm.cn.bing.net/th/id/OIP-C.6FlY-u483aV584CjEqj90AHaKl?w=140&h=200&c=7&r=0&o=7&cb=iwp2&dpr=1.4&pid=1.7&rm=3"
     }
  ]

  useEffect(() => {
    gsap.fromTo(
      cardRefs.current,
      { opacity: 0, y: 100, scale: 0.7, rotate: -15 },
      { opacity: 1, y: 0, scale: 1, rotate: 0, stagger: 0.4, duration: 0.5, ease: 'back.out(1.2)' }
    );
  }, []);
const token=localStorage.getItem("token")
  // 处理点击跳转
  const handleItemClick = (id: number) => {
    if(!token)
    {

      navigate('/login');
    }else{
       navigate(`/heritage/inform/${id}`);
       console.log(token)
    }
   
  };

  return (
    <div className="min-h-screen">
      {/* 主视频展示区 */}
      <div className="relative bg-black w-full sm:w-[80%] md:w-[50%] h-60 sm:h-80 md:h-96 overflow-hidden mx-auto mt-4 rounded-lg">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={video} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black bg-opacity-0 flex flex-col justify-center items-center">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold  mb-4 sm:mb-6 text-center " style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
            中国非物质文化遗产
          </h1>
          <p className="text-sm sm:text-xl text-white max-w-2xl text-center px-2 sm:px-4">
            探索千年文化瑰宝，感受传统艺术魅力
          </p>
        </div>
      </div>

      {/* 视频卡片展示区 */}
      <div className="container mx-auto px-2 sm:px-6 py-10 sm:py-20">
        <h2 className="text-2xl sm:text-4xl font-bold text-center mb-8 sm:mb-16">精选非遗项目</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
          {heritageVideos.map((item, idx) => (
            <div
              key={item.id}
              ref={el => (cardRefs.current[idx] = el)}
              className={`rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl transform transition-all hover:scale-105 duration-300 cursor-pointer hover:bg-gradient-to-b from-violet-300 to-white hover:text-white bg-white`}
              onClick={() => handleItemClick(item.id)}
            >
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-2xl font-semibold mb-1 sm:mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-2 sm:mb-4 text-sm sm:text-base">{item.description}</p>
              </div>
              <div className="relative pt-[56.25%]">
                <img
                  src={item.imgUrl}
                  className="absolute top-0 left-0 w-full h-full object-fill"
                  alt={item.title}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 底部宣传区 */}
      <div className="bg-gray-50 py-10 sm:py-20">
        <div className="container mx-auto px-2 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-6">传承千年文化</h2>
          <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto mb-6 sm:mb-10">
            非物质文化遗产是中华民族智慧的结晶，是我们共同的文化记忆
          </p>
          <div className='mb-6 sm:mb-10'>
             <div className='text-lg sm:text-2xl font-bold mb-4 sm:mb-6'>优质传承人介绍</div>
             <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5 cursor-pointer'>
              {heritagePeople.map((item)=>(
                <div key={item.id} className='bg-white rounded-lg shadow-md p-4 sm:p-6'>
                  <div className='p-2 sm:p-4'>
                    <h3 className='text-lg sm:text-2xl font-semibold mb-1 sm:mb-2'>{item.name}</h3>
                    <p className='text-gray-600 mb-2 sm:mb-4 text-sm sm:text-base'>{item.dec}</p>
                    <img src={item.imgUrl} alt="image"  className='w-32 h-32 sm:w-56 sm:h-56 mx-auto object-cover' />
                  </div>
                </div>
              ))}
             </div>
          </div>
          <button className="bg-black text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full text-base sm:text-lg hover:bg-opacity-90 transition-all" onClick={() => navigate('/heritage/list')}>
            了解更多非遗项目
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeritageHome;