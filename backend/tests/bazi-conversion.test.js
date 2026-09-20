const LunarCalendar = require('../LunarCalendar');

// 测试用例：公历 2024-09-10 09:30
const testDate = LunarCalendar.getBazi(2024, 9, 10, 9);
console.log('测试日期: 2024-09-10 09:30');
console.log('年柱:', testDate.yearGanZhi);
console.log('月柱:', testDate.monthGanZhi);
console.log('日柱:', testDate.dayGanZhi);
console.log('时柱:', testDate.hourGanZhi);
console.log('农历:', testDate.lunarYear, '年', testDate.lunarMonthName, '月', testDate.lunarDayName);
console.log('生肖:', testDate.zodiac);

// 验证返回值结构完整性
const hasAllFields =
  testDate.yearGanZhi && testDate.yearGanZhi.length === 2 &&
  testDate.monthGanZhi && testDate.monthGanZhi.length === 2 &&
  testDate.dayGanZhi && testDate.dayGanZhi.length === 2 &&
  testDate.hourGanZhi && testDate.hourGanZhi.length === 2 &&
  testDate.lunarYear &&
  testDate.lunarMonthName &&
  testDate.lunarDayName &&
  testDate.zodiac;

console.log('\n结构完整性验证:');
console.log('年柱存在且为2字符:', !!(testDate.yearGanZhi && testDate.yearGanZhi.length === 2));
console.log('月柱存在且为2字符:', !!(testDate.monthGanZhi && testDate.monthGanZhi.length === 2));
console.log('日柱存在且为2字符:', !!(testDate.dayGanZhi && testDate.dayGanZhi.length === 2));
console.log('时柱存在且为2字符:', !!(testDate.hourGanZhi && testDate.hourGanZhi.length === 2));
console.log('农历年存在:', !!testDate.lunarYear);
console.log('农历月名称存在:', !!testDate.lunarMonthName);
console.log('农历日名称存在:', !!testDate.lunarDayName);
console.log('生肖存在:', !!testDate.zodiac);

console.log('\n全部字段验证通过:', hasAllFields);

// 额外验证：确认四柱天干地支组合正确（天干1个+地支1个）
const ganList = '甲乙丙丁戊己庚辛壬癸';
const zhiList = '子丑寅卯辰巳午未申酉戌亥';

const validateGanZhi = (gz) => {
  if (!gz || gz.length !== 2) return false;
  const gan = gz[0];
  const zhi = gz[1];
  return ganList.includes(gan) && zhiList.includes(zhi);
};

console.log('\n干支组合验证:');
console.log('年柱干支有效:', validateGanZhi(testDate.yearGanZhi), testDate.yearGanZhi);
console.log('月柱干支有效:', validateGanZhi(testDate.monthGanZhi), testDate.monthGanZhi);
console.log('日柱干支有效:', validateGanZhi(testDate.dayGanZhi), testDate.dayGanZhi);
console.log('时柱干支有效:', validateGanZhi(testDate.hourGanZhi), testDate.hourGanZhi);

const allGanZhiValid =
  validateGanZhi(testDate.yearGanZhi) &&
  validateGanZhi(testDate.monthGanZhi) &&
  validateGanZhi(testDate.dayGanZhi) &&
  validateGanZhi(testDate.hourGanZhi);

console.log('\n=== 测试结果 ===');
console.log('结构完整且干支有效:', hasAllFields && allGanZhiValid);
process.exit((hasAllFields && allGanZhiValid) ? 0 : 1);