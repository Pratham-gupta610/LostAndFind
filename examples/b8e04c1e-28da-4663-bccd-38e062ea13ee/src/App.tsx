import React, { useState, useMemo } from 'react';
import { Search, Trash2, Leaf, Battery, Pizza, FlaskRound as Flask, Info, AlertTriangle, ArrowRight } from 'lucide-react';

// 定义更详细的垃圾分类数据
const wasteTypes = {
  recyclable: {
    name: '可回收物',
    icon: <Battery className="w-8 h-8" />,
    color: 'blue',
    gradient: 'from-blue-400 to-blue-600',
    examples: ['纸张', '塑料', '金属', '玻璃', '织物', '报纸', '饮料瓶', '易拉罐', '旧衣物', '包装盒'],
    tips: [
      '投放前请清理干净',
      '纸张应保持平整',
      '玻璃制品要小心轻放',
      '金属物品确保无危险',
    ],
    commonItems: {
      '纸类': ['报纸', '杂志', '纸板箱', '包装纸'],
      '塑料': ['饮料瓶', '食品盒', '塑料袋', '包装膜'],
      '金属': ['易拉罐', '罐头盒', '金属瓶盖', '铝箔'],
      '玻璃': ['玻璃瓶', '玻璃杯', '玻璃制品'],
      '织物': ['旧衣物', '床单', '毛巾', '布料']
    }
  },
  hazardous: {
    name: '有害垃圾',
    icon: <Flask className="w-8 h-8" />,
    color: 'red',
    gradient: 'from-red-400 to-red-600',
    examples: ['电池', '药品', '油漆', '荧光灯管', '温度计', '过期药品', '杀虫剂', '化妆品', '墨盒', '充电宝'],
    tips: [
      '需要特殊处理，不可与其他垃圾混放',
      '电池需要单独收集',
      '药品要完整保存',
      '易碎品要妥善包装',
    ],
    commonItems: {
      '化学品': ['油漆', '杀虫剂', '清洁剂', '染发剂'],
      '医药品': ['过期药品', '药物包装', '针管', '体温计'],
      '电子产品': ['电池', '充电宝', '墨盒', '荧光灯'],
      '其他': ['化妆品', '指甲油', '染发剂']
    }
  },
  food: {
    name: '厨余垃圾',
    icon: <Pizza className="w-8 h-8" />,
    color: 'green',
    gradient: 'from-green-400 to-green-600',
    examples: ['剩菜剩饭', '果皮', '蛋壳', '茶渣', '骨头', '菜叶', '咖啡渣', '水果核', '过期食品', '面包'],
    tips: [
      '投放前沥干水分',
      '尽量去除包装物',
      '大块骨头需要分拣',
      '注意保持投放处清洁',
    ],
    commonItems: {
      '餐厨废料': ['剩菜', '剩饭', '面包', '点心'],
      '果蔬类': ['果皮', '菜叶', '果肉', '茎秆'],
      '其他': ['茶渣', '咖啡渣', '蛋壳', '中药渣'],
      '肉类废料': ['骨头', '鱼刺', '肉类']
    }
  },
  other: {
    name: '其他垃圾',
    icon: <Trash2 className="w-8 h-8" />,
    color: 'gray',
    gradient: 'from-gray-400 to-gray-600',
    examples: ['卫生纸', '尿不湿', '陶瓷', '贝壳', '污染衣物', '一次性餐具', '烟头', '灰土', '橡皮泥', '胶带'],
    tips: [
      '确保包裹严实',
      '尽量压缩体积',
      '有尖锐物体需要包裹',
      '保持投放口周围清洁',
    ],
    commonItems: {
      '生活废物': ['卫生纸', '尿不湿', '污染衣物', '烟头'],
      '餐饮用品': ['一次性餐具', '外卖餐盒', '吸管'],
      '其他物品': ['陶瓷', '贝壳', '胶带', '橡皮泥'],
      '清扫废物': ['灰土', '扫地垃圾', '污损纸张']
    }
  }
};

// 搜索数据库 - 预定义常见物品的分类
const searchDatabase = {
  '报纸': 'recyclable',
  '电池': 'hazardous',
  '果皮': 'food',
  '卫生纸': 'other',
  '塑料瓶': 'recyclable',
  '药品': 'hazardous',
  '剩饭': 'food',
  '烟头': 'other',
  '玻璃瓶': 'recyclable',
  '油漆': 'hazardous',
  '茶叶': 'food',
  '尿不湿': 'other',
  '纸箱': 'recyclable',
  '荧光灯': 'hazardous',
  '骨头': 'food',
  '陶瓷': 'other',
};

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState(null);
  const [searchResult, setSearchResult] = useState(null);

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term.trim() === '') {
      setSearchResult(null);
      return;
    }

    const result = Object.entries(searchDatabase).find(([item]) => 
      item.toLowerCase().includes(term.toLowerCase())
    );

    if (result) {
      setSearchResult({
        item: result[0],
        type: result[1]
      });
      setSelectedType(result[1]);
    } else {
      setSearchResult({ error: true });
    }
  };

  const totalItems = useMemo(() => {
    return Object.values(wasteTypes).reduce((total, type) => 
      total + type.examples.length, 0
    );
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* 顶部导航 */}
      <nav className="glass-effect sticky top-0 z-50 border-b border-green-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-green-500 rounded-lg p-2 animate-float">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">垃圾分类助手</h1>
                <p className="text-sm text-gray-600">让地球更美好</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-sm bg-white/50 px-4 py-2 rounded-full">
                <span className="text-gray-600">已收录</span>
                <span className="font-bold text-green-600 mx-1">{totalItems}</span>
                <span className="text-gray-600">种物品</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* 主要内容 */}
      <main className="container mx-auto px-4 py-8">
        {/* 搜索框 */}
        <div className="relative max-w-2xl mx-auto mb-12">
          <input
            type="text"
            placeholder="搜索垃圾类型（如：电池、果皮）..."
            className="w-full px-6 py-4 pl-14 rounded-2xl border border-green-100 focus:outline-none focus:ring-2 focus:ring-green-500/50 shadow-lg shadow-green-500/5"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-green-500 w-6 h-6" />
        </div>

        {/* 搜索结果提示 */}
        {searchResult && (
          <div className={`max-w-2xl mx-auto mb-8 p-4 rounded-xl ${
            searchResult.error 
              ? 'bg-red-50 border border-red-100' 
              : 'bg-green-50 border border-green-100'
          }`}>
            {searchResult.error ? (
              <div className="flex items-center text-red-600">
                <AlertTriangle className="w-5 h-5 mr-2" />
                <span>未找到相关物品，请尝试其他关键词</span>
              </div>
            ) : (
              <div className="flex items-center text-green-600">
                <Info className="w-5 h-5 mr-2" />
                <span>
                  "{searchResult.item}" 属于
                  <span className="font-bold mx-1">
                    {wasteTypes[searchResult.type].name}
                  </span>
                </span>
              </div>
            )}
          </div>
        )}

        {/* 分类卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {Object.entries(wasteTypes).map(([key, type]) => (
            <div
              key={key}
              className={`card-hover bg-white rounded-2xl p-6 cursor-pointer ${
                selectedType === key 
                  ? `ring-2 ring-${type.color}-500 shadow-lg shadow-${type.color}-500/10` 
                  : 'hover:shadow-xl'
              }`}
              onClick={() => setSelectedType(key)}
            >
              <div className={`bg-gradient-to-br ${type.gradient} w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-4`}>
                {type.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{type.name}</h3>
              <div className="space-y-2">
                {type.examples.slice(0, 3).map((example, index) => (
                  <div key={index} className="flex items-center text-gray-600 text-sm">
                    <ArrowRight className="w-4 h-4 mr-2 text-gray-400" />
                    {example}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 详细信息 */}
        {selectedType && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
            <div className="flex items-center mb-6">
              <div className={`bg-gradient-to-br ${wasteTypes[selectedType].gradient} w-12 h-12 rounded-xl flex items-center justify-center text-white mr-4`}>
                {wasteTypes[selectedType].icon}
              </div>
              <h2 className="text-2xl font-bold">
                {wasteTypes[selectedType].name}详细指南
              </h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* 分类介绍 */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">投放指南</h3>
                <ul className="space-y-4">
                  {wasteTypes[selectedType].tips.map((tip, index) => (
                    <li key={index} className="flex items-start">
                      <span className={`flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br ${wasteTypes[selectedType].gradient} text-white text-sm mr-3 flex-shrink-0`}>
                        {index + 1}
                      </span>
                      <span className="text-gray-600">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 常见物品分类 */}
              <div>
                <h3 className="text-lg font-semibold mb-4">常见物品分类</h3>
                <div className="space-y-6">
                  {Object.entries(wasteTypes[selectedType].commonItems).map(([category, items]) => (
                    <div key={category} className="bg-gray-50 rounded-xl p-4">
                      <h4 className="font-medium text-gray-700 mb-3">{category}</h4>
                      <div className="flex flex-wrap gap-2">
                        {items.map((item, index) => (
                          <span
                            key={index}
                            className="px-3 py-1.5 bg-white rounded-full text-sm text-gray-600 shadow-sm"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 底部提示 */}
      <footer className="bg-white border-t border-green-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-3">
            <p className="text-lg font-medium gradient-text">
              保护环境从垃圾分类开始
            </p>
            <p className="text-sm text-gray-500">
              让我们共同创造更美好的生活环境
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;