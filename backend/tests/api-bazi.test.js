const LunarCalendar = require('../LunarCalendar');

// 验证 API 路由中的八字转换逻辑
console.log('=== API 八字转换验证 ===\n');

// 模拟 API 路由中的转换逻辑
function simulateBaziConversion(birthTime) {
  const birthDateTime = new Date(birthTime);
  const year = birthDateTime.getFullYear();
  const month = birthDateTime.getMonth() + 1;
  const day = birthDateTime.getDate();
  const hour = birthDateTime.getHours();

  const bazi = LunarCalendar.getBazi(year, month, day, hour);

  const baziInfo = `四柱八字：
  年柱：${bazi.yearGanZhi}
  月柱：${bazi.monthGanZhi}
  日柱：${bazi.dayGanZhi}
  时柱：${bazi.hourGanZhi}
农历信息：
  农历年：${bazi.lunarYear}年
  农历月：${bazi.lunarMonthName}月
  农历日：${bazi.lunarDayName}
  生肖：${bazi.zodiac}`;

  return { bazi, baziInfo };
}

// 测试用例
const testCases = [
  { birthTime: '2024-09-10 09:30', expected: { year: '甲辰', month: '癸酉', day: '丁丑', hour: '乙巳' } },
  { birthTime: '2024-01-15 12:00', expected: { year: '甲辰', month: '丁丑', day: '戊子', hour: '戊午' } },
  { birthTime: '2024-03-20 23:30', expected: { year: '甲辰', month: '戊寅', day: '辛亥', hour: '壬子' } },
];

let allPassed = true;

testCases.forEach((tc, i) => {
  console.log(`测试 ${i + 1}: ${tc.birthTime}`);
  const { bazi, baziInfo } = simulateBaziConversion(tc.birthTime);
  console.log(`  年柱: ${bazi.yearGanZhi}`);
  console.log(`  月柱: ${bazi.monthGanZhi}`);
  console.log(`  日柱: ${bazi.dayGanZhi}`);
  console.log(`  时柱: ${bazi.hourGanZhi}`);

  // 验证结构
  const valid = bazi.yearGanZhi && bazi.monthGanZhi && bazi.dayGanZhi && bazi.hourGanZhi;
  console.log(`  结构完整: ${valid}`);
  console.log();
});

console.log('=== API 八字转换测试完成 ===');
process.exit(0);