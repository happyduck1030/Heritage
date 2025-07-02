import React, { useEffect, useState, useRef } from 'react';
import * as echarts from 'echarts';
import { Card, List, Badge, Spin } from 'antd';

// 非遗数据类型定义
interface HeritageItem {
  id: number;
  name: string;
  province: string;
  category: string;
  level: string;
  year: number;
  value: number;
}

// 分类数据类型
interface CategoryData {
  name: string;
  value: number;
  itemStyle?: {
    color: string;
  };
}

const provinceCoords: Record<string, [number, number]> = {
  '北京': [116.46, 39.92],
  '天津': [117.2, 39.13],
  '河北': [114.48, 38.03],
  '山西': [112.53, 37.87],
  '内蒙古': [111.65, 40.82],
  '辽宁': [123.38, 41.8],
  '吉林': [125.35, 43.88],
  '黑龙江': [126.63, 45.75],
  '上海': [121.47, 31.23],
  '安徽': [117.27, 31.86],
  '福建': [119.3, 26.08],
  '江西': [115.89, 28.68],
  '湖北': [114.31, 30.52],
  '湖南': [112.98, 28.21],
  '广东': [113.23, 23.16],
  '广西': [108.33, 22.84],
  '海南': [110.35, 20.02],
  '重庆': [106.5, 29.5],
  '四川': [104.06, 30.67],
  '贵州': [106.71, 26.57],
  '云南': [102.73, 25.04],
  '西藏': [91.11, 29.97],
  '陕西': [108.95, 34.27],
  '甘肃': [103.73, 36.03],
  '青海': [101.74, 36.56],
  '宁夏': [106.27, 38.47],
  '新疆': [87.68, 43.77],

};


const HeritageMap: React.FC = () => {
  // 图表容器引用
  const mapChartRef = useRef<HTMLDivElement>(null);
  const pieChartRef = useRef<HTMLDivElement>(null);
  const barChartRef = useRef<HTMLDivElement>(null);

  // 图表实例
  const [mapChart, setMapChart] = useState<echarts.ECharts | null>(null);
  const [pieChart, setPieChart] = useState<echarts.ECharts | null>(null);
  const [barChart, setBarChart] = useState<echarts.ECharts | null>(null);

  // 当前选中的省份
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  // 是否显示省份子地图
  const [isProvinceMap, setIsProvinceMap] = useState<boolean>(false);
  // 加载状态
  const [loading, setLoading] = useState<boolean>(true);

  // mock 丰富的非遗数据
  const mockHeritageData: HeritageItem[] = [
    { id: 1, name: '昆曲', province: '江苏', category: '传统表演艺术', level: '国家级', year: 2001, value: 95 },
    { id: 2, name: '古琴艺术', province: '浙江', category: '传统音乐', level: '国家级', year: 2003, value: 92 },
    { id: 3, name: '京剧', province: '北京', category: '传统表演艺术', level: '国家级', year: 2010, value: 98 },
    { id: 4, name: '粤剧', province: '广东', category: '传统表演艺术', level: '国家级', year: 2006, value: 88 },
    { id: 5, name: '黄梅戏', province: '安徽', category: '传统表演艺术', level: '国家级', year: 2006, value: 85 },
    { id: 6, name: '川剧', province: '四川', category: '传统表演艺术', level: '国家级', year: 2006, value: 87 },
    { id: 7, name: '皮影戏', province: '陕西', category: '传统表演艺术', level: '国家级', year: 2011, value: 82 },
    { id: 8, name: '剪纸', province: '河北', category: '传统手工艺', level: '国家级', year: 2006, value: 89 },
    { id: 9, name: '景德镇陶瓷技艺', province: '江西', category: '传统手工艺', level: '国家级', year: 2006, value: 94 },
    { id: 10, name: '苏绣', province: '江苏', category: '传统手工艺', level: '国家级', year: 2006, value: 91 },
    { id: 11, name: '端午节', province: '湖南', category: '民俗', level: '国家级', year: 2006, value: 90 },
    { id: 12, name: '二十四节气', province: '全国', category: '民俗', level: '国家级', year: 2016, value: 96 },
    { id: 13, name: '藏医药浴法', province: '西藏', category: '传统医药', level: '国家级', year: 2018, value: 83 },
    { id: 14, name: '蒙古族长调民歌', province: '内蒙古', category: '传统音乐', level: '国家级', year: 2005, value: 84 },
    { id: 15, name: '维吾尔木卡姆', province: '新疆', category: '传统音乐', level: '国家级', year: 2005, value: 86 },
    { id: 16, name: '傣族象脚鼓舞', province: '云南', category: '传统舞蹈', level: '国家级', year: 2006, value: 81 },
    { id: 17, name: '壮族铜鼓', province: '广西', category: '传统手工艺', level: '国家级', year: 2006, value: 80 },
    { id: 18, name: '朝鲜族农乐舞', province: '吉林', category: '传统舞蹈', level: '国家级', year: 2009, value: 79 },
    { id: 19, name: '满族萨满教祭祀', province: '辽宁', category: '民俗', level: '国家级', year: 2006, value: 78 },
    { id: 20, name: '回族花儿', province: '宁夏', category: '传统音乐', level: '国家级', year: 2006, value: 77 },
    { id: 21, name: '藏戏', province: '青海', category: '传统表演艺术', level: '国家级', year: 2006, value: 85 },
    { id: 22, name: '花鼓戏', province: '湖北', category: '传统表演艺术', level: '国家级', year: 2006, value: 83 },
    { id: 23, name: '晋剧', province: '山西', category: '传统表演艺术', level: '国家级', year: 2006, value: 82 },
    { id: 24, name: '柳琴戏', province: '山东', category: '传统表演艺术', level: '国家级', year: 2008, value: 81 },
    { id: 25, name: '豫剧', province: '河南', category: '传统表演艺术', level: '国家级', year: 2006, value: 84 },
    { id: 26, name: '傩戏', province: '贵州', category: '传统表演艺术', level: '国家级', year: 2006, value: 79 },
    { id: 27, name: '闽南布袋戏', province: '福建', category: '传统表演艺术', level: '国家级', year: 2006, value: 80 },
    { id: 28, name: '黎族传统纺染织绣技艺', province: '海南', category: '传统手工艺', level: '国家级', year: 2009, value: 78 },
    { id: 29, name: '唐卡', province: '甘肃', category: '传统美术', level: '国家级', year: 2006, value: 88 },
    { id: 30, name: '热贡艺术', province: '青海', category: '传统美术', level: '国家级', year: 2009, value: 86 },
    // mock 更多数据
    { id: 31, name: '徽州木雕', province: '安徽', category: '传统手工艺', level: '省级', year: 2012, value: 75 },
    { id: 32, name: '南京云锦', province: '江苏', category: '传统手工艺', level: '国家级', year: 2009, value: 93 },
    { id: 33, name: '潮州木雕', province: '广东', category: '传统手工艺', level: '省级', year: 2011, value: 72 },
    { id: 34, name: '苗族银饰锻制技艺', province: '贵州', category: '传统手工艺', level: '国家级', year: 2006, value: 81 },
    { id: 35, name: '藏族唐卡绘制技艺', province: '西藏', category: '传统美术', level: '国家级', year: 2008, value: 85 },
    { id: 36, name: '蒙古族刺绣', province: '内蒙古', category: '传统手工艺', level: '省级', year: 2010, value: 70 },
    { id: 37, name: '哈尼梯田农耕系统', province: '云南', category: '民俗', level: '国家级', year: 2013, value: 88 },
    { id: 38, name: '客家山歌', province: '福建', category: '传统音乐', level: '省级', year: 2012, value: 74 },
    { id: 39, name: '东北二人转', province: '吉林', category: '传统表演艺术', level: '省级', year: 2010, value: 76 },
    { id: 40, name: '青海花儿', province: '青海', category: '传统音乐', level: '省级', year: 2011, value: 73 },
    { id: 41, name: '新疆大巴扎', province: '新疆', category: '民俗', level: '省级', year: 2015, value: 80 },
    { id: 42, name: '北京皮影戏', province: '北京', category: '传统表演艺术', level: '省级', year: 2012, value: 79 },
    { id: 43, name: '上海评弹', province: '上海', category: '传统表演艺术', level: '省级', year: 2011, value: 77 },
    { id: 44, name: '天津快板', province: '天津', category: '传统表演艺术', level: '省级', year: 2010, value: 75 },
    { id: 45, name: '重庆川江号子', province: '重庆', category: '传统音乐', level: '省级', year: 2013, value: 78 },
    { id: 46, name: '河北武强年画', province: '河北', category: '传统美术', level: '省级', year: 2012, value: 82 },
    { id: 47, name: '山西面塑', province: '山西', category: '传统手工艺', level: '省级', year: 2011, value: 80 },
    { id: 48, name: '山东柳编', province: '山东', category: '传统手工艺', level: '省级', year: 2012, value: 81 },
    { id: 49, name: '河南烩面', province: '河南', category: '民俗', level: '省级', year: 2014, value: 79 },
    { id: 50, name: '湖南花鼓灯', province: '湖南', category: '传统舞蹈', level: '省级', year: 2013, value: 77 },
  ];

  // 准备地图数据
  const getMapData = () => {
    const provinceData: { name: string; value: number }[] = [];
    const provinceCount: Record<string, number> = {};
    mockHeritageData.forEach(item => {
      if (item.province !== '全国') {
        if (provinceCount[item.province]) {
          provinceCount[item.province]++;
        } else {
          provinceCount[item.province] = 1;
        }
      }
    });
    for (const province in provinceCount) {
      provinceData.push({
        name: province,
        value: provinceCount[province]
      });
    }
    return provinceData;
  };

  // 准备分类数据
  const getCategoryData = () => {
    const categoryCount: Record<string, number> = {};
    mockHeritageData.forEach(item => {
      if (categoryCount[item.category]) {
        categoryCount[item.category]++;
      } else {
        categoryCount[item.category] = 1;
      }
    });
    const colors = [
      '#5470c6', '#91cc75', '#fac858', '#ee6666', 
      '#73c0de', '#3ba272', '#fc8452', '#9a60b4'
    ];
    const categoryData: CategoryData[] = [];
    let index = 0;
    for (const category in categoryCount) {
      categoryData.push({
        name: category,
        value: categoryCount[category],
        itemStyle: {
          color: colors[index % colors.length]
        }
      });
      index++;
    }
    return categoryData;
  };

  // 初始化地图
  const initMapChart = () => {
    if (mapChartRef.current) {
      let chart = mapChart;
      if (!chart) {
        chart = echarts.init(mapChartRef.current);
        setMapChart(chart);
      }
      const option = {
        title: {
          text: '中国非物质文化遗产地理分布',
          left: 'center',
          textStyle: {
            fontSize: 18,
            fontWeight: 'bolder'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: function(params) {
            if (params.componentSubType === 'map') {
              return `${params.name}:  44} 项非遗`;
            }
            if (params.componentSubType === 'markPoint') {
              return `${params.name}：${params.data.value}`;
            }
            return '';
          }
        },
        visualMap: {
          min: 0,
          max: 10,
          left: 'left',
          top: 'bottom',
          text: ['高', '低'],
          calculable: true,
          inRange: {
            color: ['#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027']
          }
        },
        series: [
          {
            name: '非遗数量',
            type: 'map',
            map: 'china',
            roam: true,
            emphasis: {
              label: {
                show: true
              }
            },
            data: getMapData(),
            markPoint: {
              symbol: 'pin',
              symbolSize: 50,
              label: { show: true, formatter: '{b}' },
              data: markPointData
            }
          }
        ]
      };
      console.log('option.series[0].data', getMapData());
      chart.setOption(option as any);
      chart.off('click');
      chart.off('mouseover');
     chart.on('click', (params: any) => {
      if (params.componentType === 'series' && params.seriesType === 'map') {
        const provinceName = params.name;
        if (provinceName in provinceCoords) {
          setSelectedProvince(provinceName);
          setIsProvinceMap(true);
        }
      }
    });
      chart.on('mouseover', (_params: echarts.ECElementEvent) => {});
    }
  };

  // 获取省份地图数据
  const getProvinceMapData = (province: string) => {
    const count: Record<string, number> = {};
    mockHeritageData.forEach(item => {
      if (item.province === province) {
        count[item.name] = 1;
      }
    });
    return Object.keys(count).map(name => ({ name, value: count[name] }));
  };

  // 初始化饼图
  const initPieChart = () => {
    if (pieChartRef.current) {
      let chart = pieChart;
      if (!chart) {
        chart = echarts.init(pieChartRef.current);
        setPieChart(chart);
      }
      const option = {
        title: {
          text: '非遗项目分类占比',
          left: 'center',
          textStyle: {
            fontSize: 16,
            fontWeight: 'bolder'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          top: 'middle'
        },
        series: [
          {
            name: '分类占比',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 16,
                fontWeight: 'bolder'
              }
            },
            labelLine: {
              show: false
            },
            data: getCategoryData()
          }
        ]
      };
      chart.setOption(option as any);
    }
  };

  // 初始化柱状图
  const initBarChart = () => {
    if (barChartRef.current) {
      let chart = barChart;
      if (!chart) {
        chart = echarts.init(barChartRef.current);
        setBarChart(chart);
      }
      // 按value值排序
      const sortedData = [...mockHeritageData].sort((a, b) => b.value - a.value).slice(0, 10);
      const option = {
        title: {
          text: '非遗项目热度排行榜',
          left: 'center',
          textStyle: {
            fontSize: 16,
            fontWeight: 'bolder'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: 'category',
          data: sortedData.map(item => item.name),
          axisLabel: {
            interval: 0,
            rotate: 30
          }
        },
        series: [
          {
            name: '热度值',
            type: 'bar',
            data: sortedData.map(item => item.value),
            itemStyle: {
              color: (params: { dataIndex: number }) => {
                const colorList = [
                  '#c23531', '#2f4554', '#61a0a8', '#d48265',
                  '#91c7ae', '#749f83', '#ca8622', '#bda29a',
                  '#6e7074', '#546570', '#c4ccd3'
                ];
                return colorList[params.dataIndex % colorList.length];
              }
            }
          }
        ]
      };
      chart.setOption(option as any);
    }
  };

  // 处理窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      mapChart?.resize();
      pieChart?.resize();
      barChart?.resize();
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [mapChart, pieChart, barChart]);

  // 初始化中国地图
  useEffect(() => {
    setLoading(true);
    console.log('准备请求 /maps/china.json');
    fetch('/maps/china.json')
      .then(res => {
        console.log('fetch /maps/china.json 状态:', res.status);
        return res.json();
      })
      .then(geoJson => {
        console.log('geoJson 加载成功', geoJson);
        echarts.registerMap('china', geoJson);
        setIsProvinceMap(false);
        setSelectedProvince('');
        setTimeout(() => {
          initMapChart();
          initPieChart();
          initBarChart();
          setLoading(false);
        }, 500);
      })
      .catch(err => {
        console.error('fetch /maps/china.json 失败', err);
      });
    return () => {
      mapChart?.dispose();
      pieChart?.dispose();
      barChart?.dispose();
    };
    // eslint-disable-next-line
  }, []);

  // 选中省份时加载省份地图
  useEffect(() => {
    if (isProvinceMap && selectedProvince) {
      setLoading(true);
      fetch(`/maps/${selectedProvince}.json`)
        .then(res => res.json())
        .then(geoJson => {
          echarts.registerMap(selectedProvince, geoJson);
          setTimeout(() => {
            initMapChart();
            setLoading(false);
          }, 500);
        })
        .catch(() => {
          setIsProvinceMap(false);
          setSelectedProvince('');
          setTimeout(() => {
            initMapChart();
            setLoading(false);
          }, 500);
        });
    }
    // eslint-disable-next-line
  }, [isProvinceMap, selectedProvince]);

  // 根据选中省份过滤数据
  const getProvinceHeritageData = () => {
    if (!selectedProvince) return [];
    return mockHeritageData.filter(item => item.province === selectedProvince);
  };

  // 返回中国地图
  const backToChinaMap = () => {
    setIsProvinceMap(false);
    setSelectedProvince('');
    setTimeout(() => {
      initMapChart();
    }, 300);
  };

  const markPointData = Object.entries(provinceCoords).map(([province, coord]) => {
    const heritage = mockHeritageData.find(item => item.province === province);
    return {
      name: province,
      coord,
      value: heritage ? heritage.name : '无数据'
    };
  });

  return (
    <div className="heritage-map-container p-4">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-blue-700">中国非物质文化遗产地图</h1>
        <p className="text-gray-500 mt-2">探索中华文化瑰宝的地理分布</p>
      </div>
  
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* 地图 */}
          <div className="lg:col-span-2">
            <Card className="shadow-md h-[500px]">
              <div ref={mapChartRef} style={{ height: '450px', width: '100%' }} />
            </Card>
          </div>
          {/* 饼图 */}
          <div>
            <Card className="shadow-md h-[500px]">
              <div ref={pieChartRef} style={{ height: '450px', width: '100%' }} />
            </Card>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 柱状图 */}
          <div className="lg:col-span-2">
            <Card className="shadow-md h-[400px]">
              <div ref={barChartRef} style={{ height: '350px', width: '100%' }} />
            </Card>
          </div>
          {/* 省份详情 */}
          <div>
            <Card
              title={selectedProvince ? `${selectedProvince}非遗项目` : '请点击地图选择省份'}
              className="shadow-md h-[400px] overflow-auto"
            >
              {selectedProvince ? (
                <List
                  itemLayout="horizontal"
                  dataSource={getProvinceHeritageData()}
                  renderItem={item => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Badge count={item.level} style={{ backgroundColor: item.level === '国家级' ? '#52c41a' : '#1890ff' }} />
                        }
                        title={<a href={`/heritage/inform/${item.id}`}>{item.name}</a>}
                        description={`${item.category} | ${item.year}年入选`}
                      />
                    </List.Item>
                  )}
                />
              ) : (
                <div className="flex justify-center items-center h-64 text-gray-400">
                  点击地图查看省份非遗详情
                </div>
              )}
            </Card>
          </div>
        </div>
    
    </div>
  );
};

export default HeritageMap;