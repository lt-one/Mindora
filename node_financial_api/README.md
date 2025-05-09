# Node.js 金融API测试服务

这是一个用于获取新浪财经和东方财富股票数据的Node.js API封装库。通过这个库，你可以方便地获取实时行情、K线数据、盘口数据等股票相关信息。

## 功能特点

### 新浪财经API

- 获取股票实时行情数据
- 获取K线图数据（日K、周K、月K）
- 获取指数实时数据
- 获取历史交易数据

### 东方财富API

- 获取股票实时行情数据
- 获取K线图数据（日K、周K、月K、分钟级别K线）
- 获取分时图数据
- 获取股票盘口数据（五档买卖盘）
- 获取股票列表
- 获取大盘指数数据

## 安装依赖

```bash
npm install
```

## 使用示例

### 新浪财经API

```javascript
const { sinaFinance } = require('./src');

// 获取单只股票实时数据
const singleStockData = await sinaFinance.getStockRealTimeData('sh600519');
console.log(singleStockData);

// 获取多只股票实时数据
const multipleStockData = await sinaFinance.getStockRealTimeData(['sh600519', 'sz000001']);
console.log(multipleStockData);

// 获取日K线数据
const dailyKLineData = await sinaFinance.getKLineData('sh600519', 'daily');
console.log(dailyKLineData);

// 获取指数实时数据
const indicesData = await sinaFinance.getIndicesData();
console.log(indicesData);

// 获取历史交易数据
const historicalTransactionData = await sinaFinance.getHistoricalTransactionData('sh600519', '2023-05-10');
console.log(historicalTransactionData);
```

### 东方财富API

```javascript
const { eastMoney } = require('./src');

// 获取股票实时行情数据
const stockQuote = await eastMoney.getStockQuote('600519');
console.log(stockQuote);

// 获取K线数据
// 参数: 股票代码, K线类型('101'日K, '102'周K, '103'月K, '104'5分钟, '105'15分钟, '106'30分钟, '107'60分钟), 数量
const kLineData = await eastMoney.getKLineData('600519', '101', 100);
console.log(kLineData);

// 获取分时数据
const timeSeriesData = await eastMoney.getTimeSeriesData('600519');
console.log(timeSeriesData);

// 获取股票盘口数据
const orderBookData = await eastMoney.getStockOrderBook('600519');
console.log(orderBookData);

// 获取股票列表
const shStockList = await eastMoney.getStockList('SH');
console.log(shStockList);

// 获取大盘指数数据
const marketIndices = await eastMoney.getMarketIndices();
console.log(marketIndices);
```

## 运行测试

运行所有测试：

```bash
node tests/index.js
```

单独运行新浪财经API测试：

```bash
node tests/sinaFinanceService.test.js
```

单独运行东方财富API测试：

```bash
node tests/eastMoneyService.test.js
```

## 数据格式说明

### 新浪财经API返回数据格式

#### 实时行情数据

```javascript
{
  "sh600519": {
    "name": "贵州茅台",
    "open": 1799.0,
    "prevClose": 1800.0,
    "price": 1808.0,
    "high": 1815.0,
    "low": 1798.0,
    "bid": 1808.0,
    "ask": 1809.0,
    "volume": 1614800,
    "amount": 2919203850.0,
    "bid1Volume": 200,
    "bid1Price": 1808.0,
    // ... 更多买卖盘数据 ...
    "date": "2023-05-12",
    "time": "15:00:00"
  }
}
```

#### K线数据

```javascript
[
  {
    "day": "2023-05-12",
    "open": "1799.000",
    "high": "1815.000",
    "low": "1798.000",
    "close": "1808.000",
    "volume": "1614800"
  },
  // ... 更多K线数据 ...
]
```

### 东方财富API返回数据格式

#### 实时行情数据

```javascript
{
  "code": "600519",
  "name": "贵州茅台",
  "price": 1808.0,
  "change": 8.0,
  "changePercent": 0.44,
  "open": 1799.0,
  "high": 1815.0,
  "low": 1798.0,
  "prevClose": 1800.0,
  "volume": 1614800,
  "amount": 2919203850.0,
  "turnoverRate": 1.29,
  "pe": 28.53,
  "pb": 8.93,
  "marketCap": 2270476922880,
  "circulationMarketCap": 2270476922880,
  "time": "2023-05-12 15:00:00"
}
```

#### K线数据

```javascript
[
  {
    "date": "2023-05-12",
    "open": 1799.0,
    "close": 1808.0,
    "high": 1815.0,
    "low": 1798.0,
    "volume": 1614800,
    "amount": 2919203850.0,
    "amplitude": 0.94,
    "changePercent": 0.44,
    "change": 8.0,
    "turnoverRate": 1.29
  },
  // ... 更多K线数据 ...
]
```

## 免责声明

本项目仅供学习和研究使用，不应用于商业和生产环境。API的稳定性和数据准确性不能保证，使用时请自行承担风险。

## 协议

MIT 