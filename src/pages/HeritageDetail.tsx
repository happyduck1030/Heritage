import React from 'react';
import { useParams, Link } from 'react-router-dom';

interface HeritageData {
  id: number;
  name: string;
  category: string;
  region: string;
  year: number;
  description: string;
  history: string;
  significance: string;
  image: string;
}

const heritageDatabase: Record<number, HeritageData> = {
  1: {
    id: 1,
    name: '昆曲',
    category: '传统表演艺术',
    region: '江苏',
    year: 2001,
    description: '昆曲是中国古老的戏曲剧种之一，被誉为"百戏之祖"，2001年被联合国教科文组织列入首批"人类口头和非物质遗产代表作"名录。',
    history: '昆曲起源于明代中叶的江苏昆山，距今已有六百多年历史。它由元末明初的昆山腔发展而来，后经魏良辅的改革而成熟。',
    significance: '昆曲艺术集音乐、舞蹈、文学、戏剧、美术等为一体，被称为中国传统文化的珍品和"中国戏曲的活化石"。',
    image: '/images/kunqu.jpg'
  },
  2: {
    id: 2,
    name: '古琴艺术',
    category: '传统音乐',
    region: '全国',
    year: 2003,
    description: '古琴艺术是中国传统音乐文化中的重要组成部分，2003年被联合国教科文组织列入人类非物质文化遗产代表作名录。',
    history: '古琴有三千多年的历史，是中国最古老的弹拨乐器之一。它不仅是音乐演奏工具，更承载了丰富的文化内涵和哲学思想。',
    significance: '古琴艺术体现了中国传统文化中的"天人合一"理念，对中国文人的审美情趣和精神追求产生了深远影响。',
    image: '/images/guqin.jpg'
  },
  3: {
    id: 3,
    name: '京剧',
    category: '传统表演艺术',
    region: '北京',
    year: 2010,
    description: '京剧是中国最具代表性的戏曲剧种之一，2010年被联合国教科文组织列入人类非物质文化遗产代表作名录。',
    history: '京剧形成于清代乾隆、嘉庆年间，是在徽剧基础上，融合了汉剧、昆曲、秦腔等多种戏曲艺术而发展形成的。',
    significance: '京剧被誉为"国粹"，是中华民族优秀传统文化的重要组成部分，对中国戏曲艺术的发展具有深远影响。',
    image: '/images/peking-opera.jpg'
  },
  4: {
    id: 4,
    name: '中国剪纸',
    category: '传统手工艺',
    region: '全国',
    year: 2009,
    description: '中国剪纸是中国民间艺术的重要组成部分，2009年被联合国教科文组织列入人类非物质文化遗产代表作名录。',
    history: '剪纸起源于汉代，流行于民间，是中国最普及的民间艺术形式之一。各地区的剪纸风格各异，展现了丰富的地域文化特色。',
    significance: '剪纸艺术反映了中国人民的审美情趣和生活智慧，是中华民族传统文化的重要载体。',
    image: '/images/paper-cutting.jpg'
  },
  5: {
    id: 5,
    name: '端午节',
    category: '传统节日',
    region: '全国',
    year: 2009,
    description: '端午节是中国重要的传统节日之一，2009年被联合国教科文组织列入人类非物质文化遗产代表作名录。',
    history: '端午节起源于中国古代，距今已有2000多年历史。传说与纪念爱国诗人屈原有关，但其起源更早，与古代人们的祛病防疫、祭祀活动相关。',
    significance: '端午节体现了中华民族的爱国情怀和文化认同，其习俗包括赛龙舟、吃粽子、佩香囊等，具有丰富的文化内涵。',
    image: '/images/dragon-boat-festival.jpg'
  }
};

const HeritageDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const heritageId = parseInt(id || '0');
  const heritage = heritageDatabase[heritageId];

  if (!heritage) {
    return (
      <div className="container mx-auto px-2 sm:px-4 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">未找到相关遗产信息</h1>
        <Link to="/heritage/list" className="text-blue-500 hover:underline">
          返回列表
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8">
      <div className="mb-2 sm:mb-4">
        <Link to="/heritage/list" className="text-blue-500 hover:underline">
          返回列表
        </Link>
      </div>
      
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">{heritage.name}</h1>
      
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-4 sm:mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <div className="border rounded-lg overflow-hidden mb-2 sm:mb-4">
              <img 
                src={heritage.image} 
                alt={heritage.name} 
                className="w-full h-auto object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=图片加载失败';
                }}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-2 sm:mb-4">
              <div>
                <p className="text-gray-600 text-xs sm:text-base">类别</p>
                <p className="font-semibold text-sm sm:text-base">{heritage.category}</p>
              </div>
              <div>
                <p className="text-gray-600 text-xs sm:text-base">地区</p>
                <p className="font-semibold text-sm sm:text-base">{heritage.region}</p>
              </div>
              <div>
                <p className="text-gray-600 text-xs sm:text-base">入选年份</p>
                <p className="font-semibold text-sm sm:text-base">{heritage.year}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-base sm:text-xl font-bold mb-1 sm:mb-2">基本介绍</h2>
            <p className="mb-2 sm:mb-4 text-sm sm:text-base">{heritage.description}</p>
            
            <h2 className="text-base sm:text-xl font-bold mb-1 sm:mb-2">历史渊源</h2>
            <p className="mb-2 sm:mb-4 text-sm sm:text-base">{heritage.history}</p>
            
            <h2 className="text-base sm:text-xl font-bold mb-1 sm:mb-2">文化意义</h2>
            <p className="text-sm sm:text-base">{heritage.significance}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeritageDetail; 