const LunarCalendar = require('../LunarCalendar');

console.log('=== 子时边界测试 ===\n');

// 测试子时：23:30 -> 时支应该是子
const lateNight = LunarCalendar.getBazi(2024, 9, 10, 23);
console.log('23:30 八字:');
console.log('  时柱:', lateNight.hourGanZhi, '(含子)');
console.log('  时支:', lateNight.hourZhi);

// 测试早子时：00:30 -> 时支也是子
const earlyMorning = LunarCalendar.getBazi(2024, 9, 10, 0);
console.log('00:30 八字:');
console.log('  时柱:', earlyMorning.hourGanZhi, '(含子)');
console.log('  时支:', earlyMorning.hourZhi);

// 测试 01:30 -> 时支应该是丑
const oneAM = LunarCalendar.getBazi(2024, 9, 10, 1);
console.log('01:30 八字:');
console.log('  时柱:', oneAM.hourGanZhi);
console.log('  时支:', oneAM.hourZhi);

// 验证子时处理
console.log('\n=== 验证结果 ===');
console.log('23:30 时支是子:', lateNight.hourZhi === '子');
console.log('00:30 时支是子:', earlyMorning.hourZhi === '子');
console.log('01:30 时支是丑:', oneAM.hourZhi === '丑');

// 子时类型标注
console.log('\n=== 子时类型 ===');
console.log('23:30 ziType:', lateNight.ziType || '(无)');
console.log('00:30 ziType:', earlyMorning.ziType || '(无)');

const allPassed =
  lateNight.hourZhi === '子' &&
  earlyMorning.hourZhi === '子' &&
  oneAM.hourZhi === '丑';

console.log('\n=== 测试结果 ===');
console.log('子时边界测试通过:', allPassed);
process.exit(allPassed ? 0 : 1);