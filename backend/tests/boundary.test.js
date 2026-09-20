const LunarCalendar = require('../LunarCalendar');

console.log('=== 边界日期测试 ===\n');

// 测试 1891 年（边界下限）
console.log('测试 1891-01-01 12:00（边界下限）');
try {
  const minYear = LunarCalendar.getBazi(1891, 1, 1, 12);
  console.log('  年柱:', minYear.yearGanZhi);
  console.log('  月柱:', minYear.monthGanZhi);
  console.log('  日柱:', minYear.dayGanZhi);
  console.log('  时柱:', minYear.hourGanZhi);
  console.log('  成功\n');
} catch (e) {
  console.log('  失败:', e.message, '\n');
}

// 测试 2100 年（边界上限）
console.log('测试 2100-12-31 23:00（边界上限）');
try {
  const maxYear = LunarCalendar.getBazi(2100, 12, 31, 23);
  console.log('  年柱:', maxYear.yearGanZhi);
  console.log('  月柱:', maxYear.monthGanZhi);
  console.log('  日柱:', maxYear.dayGanZhi);
  console.log('  时柱:', maxYear.hourGanZhi);
  console.log('  成功\n');
} catch (e) {
  console.log('  失败:', e.message, '\n');
}

// 测试 1890 年（超出范围）
console.log('测试 1890-01-01 12:00（应失败，超出范围）');
try {
  const invalid = LunarCalendar.getBazi(1890, 1, 1, 12);
  console.log('  意外成功:', invalid);
  console.log('  失败: 应该抛出异常\n');
} catch (e) {
  console.log('  正确抛出异常:', e.message, '\n');
}

// 测试 2101 年（超出范围）
console.log('测试 2101-01-01 12:00（应失败，超出范围）');
try {
  const invalid = LunarCalendar.getBazi(2101, 1, 1, 12);
  console.log('  意外成功:', invalid);
  console.log('  失败: 应该抛出异常\n');
} catch (e) {
  console.log('  正确抛出异常:', e.message, '\n');
}

console.log('=== 边界测试完成 ===');
process.exit(0);