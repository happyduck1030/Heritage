import React from 'react';

interface ProtectionPolicy {
  id: number;
  title: string;
  year: number;
  description: string;
}

const HeritageProtection: React.FC = () => {
  const policies: ProtectionPolicy[] = [
    {
      id: 1,
      title: '中华人民共和国非物质文化遗产法',
      year: 2011,
      description: '《中华人民共和国非物质文化遗产法》于2011年6月1日起施行，是我国非物质文化遗产保护工作的基本法律依据。该法律明确了非物质文化遗产的概念、范围、保护原则和管理体制，规定了非物质文化遗产代表性项目名录的认定和管理等内容。'
    },
    {
      id: 2,
      title: '国家级非物质文化遗产代表性项目名录',
      year: 2006,
      description: '从2006年开始，国务院已公布了五批国家级非物质文化遗产代表性项目名录，共计1557项。这些名录的公布，对于加强我国非物质文化遗产的保护与传承具有重要意义。'
    },
    {
      id: 3,
      title: '非物质文化遗产保护专项资金管理办法',
      year: 2010,
      description: '财政部、文化部制定的《非物质文化遗产保护专项资金管理办法》，为非物质文化遗产保护工作提供了财政支持，主要用于非物质文化遗产的调查、记录、建档等保护工作。'
    },
    {
      id: 4,
      title: '国家级非物质文化遗产代表性传承人认定与管理办法',
      year: 2008,
      description: '该办法规定了国家级非物质文化遗产代表性传承人的认定标准、程序、管理和支持措施等内容，旨在加强对传承人的保护和支持，确保非物质文化遗产的有效传承。'
    },
    {
      id: 5,
      title: '中国非物质文化遗产传承人群研修研习计划',
      year: 2015,
      description: '该计划由文化和旅游部实施，旨在通过系统化的培训，提高非物质文化遗产传承人的技艺水平和传承能力，促进非物质文化遗产的保护、传承和发展。'
    }
  ];

  return (
    <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">非物质文化遗产保护政策</h1>
      
      <div className="bg-blue-50 p-4 sm:p-6 rounded-lg mb-4 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4">保护理念</h2>
        <p className="mb-1 sm:mb-2 text-sm sm:text-base">非物质文化遗产保护工作以保护为主、抢救第一、合理利用、传承发展为基本方针。</p>
        <p className="text-sm sm:text-base">坚持政府主导、社会参与、法制保障、科学规范的原则，尊重非物质文化遗产的真实性、整体性和传承性。</p>
      </div>
      
      <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">主要政策法规</h2>
      
      <div className="space-y-3 sm:space-y-4">
        {policies.map(policy => (
          <div key={policy.id} className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-1 sm:mb-2 gap-1 sm:gap-0">
              <h3 className="text-base sm:text-lg font-bold">{policy.title}</h3>
              <span className="text-xs sm:text-sm bg-gray-100 px-2 py-1 rounded">{policy.year}年</span>
            </div>
            <p className="text-gray-700 text-sm sm:text-base">{policy.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeritageProtection; 