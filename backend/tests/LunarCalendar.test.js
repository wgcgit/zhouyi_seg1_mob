/**
 * LunarCalendar 完整单元测试
 * 测试所有公开 API
 */

let LunarCalendar;

beforeAll(() => {
  LunarCalendar = require('../LunarCalendar');
});

describe('LunarCalendar 基础 API', () => {
  describe('solarToLunar', () => {
    test('公历 2024-09-10 转农历', () => {
      const result = LunarCalendar.solarToLunar(2024, 9, 10);
      expect(result.lunarYear).toBe(2024);
      expect(result.lunarMonth).toBe(8);
      expect(result.lunarDay).toBe(8);
      expect(result.zodiac).toBe('龙');
    });

    test('公历 2024-01-01 转农历（新年）', () => {
      const result = LunarCalendar.solarToLunar(2024, 1, 1);
      expect(result.lunarYear).toBe(2023);
      expect(result.lunarMonth).toBe(12);
      expect(result.lunarDay).toBe(20);
    });

    test('超出范围年份 1890 抛异常', () => {
      expect(() => LunarCalendar.solarToLunar(1890, 1, 1)).toThrow();
    });

    test('超出范围年份 2101 返回错误对象', () => {
      const result = LunarCalendar.solarToLunar(2101, 1, 1);
      expect(result.error).toBeDefined();
    });

    test('1891 年边界下限正常工作', () => {
      const result = LunarCalendar.solarToLunar(1891, 1, 1);
      expect(result.error).toBeUndefined();
      expect(result.lunarYear).toBe(1890);
    });
  });

  describe('lunarToSolar', () => {
    test('农历 2024-08-08 转公历', () => {
      const result = LunarCalendar.lunarToSolar(2024, 8, 8);
      expect(result.year).toBe(2024);
      expect(result.month).toBe(9);
      expect(result.day).toBe(10);
    });
  });

  describe('getSolarMonthDays', () => {
    // month 参数是数组索引 (0-11)，不是 1-12
    // month 0=1月, 1=2月, ..., 11=12月

    test('闰年2月29天', () => {
      // 2024 是闰年，2月有29天，month=1
      expect(LunarCalendar.getSolarMonthDays(2024, 1)).toBe(29);
    });

    test('平年2月28天', () => {
      expect(LunarCalendar.getSolarMonthDays(2023, 1)).toBe(28);
    });

    test('1月31天 (month=0)', () => {
      expect(LunarCalendar.getSolarMonthDays(2024, 0)).toBe(31);
    });

    test('4月30天 (month=3)', () => {
      expect(LunarCalendar.getSolarMonthDays(2024, 3)).toBe(30);
    });

    test('12月31天 (month=11)', () => {
      expect(LunarCalendar.getSolarMonthDays(2024, 11)).toBe(31);
    });
  });

  describe('calendar', () => {
    test('获取2024年9月日历', () => {
      const result = LunarCalendar.calendar(2024, 9);
      expect(result.monthDays).toBe(30);
      expect(result.monthData.length).toBe(30);
    });

    test('日历数据包含农历信息', () => {
      const result = LunarCalendar.calendar(2024, 9);
      const firstDay = result.monthData[0];
      expect(firstDay.lunarYear).toBeDefined();
      expect(firstDay.lunarMonthName).toBeDefined();
    });
  });
});

describe('八字扩展 API', () => {
  describe('getHourBranch', () => {
    // 公式: index = floor(((hour + 1) % 24) / 2)
    // hour 0-1  → 子 (0)
    // hour 1-2  → 丑 (1) 但 hour 1 是 01:00-02:59 的起点

    test('hour 0 -> 子 (23:00-00:59)', () => {
      expect(LunarCalendar.getHourBranch(0)).toBe('子');
    });

    test('hour 1 -> 丑 (01:00-02:59)', () => {
      expect(LunarCalendar.getHourBranch(1)).toBe('丑');
    });

    test('hour 2 -> 丑 (03:00-04:59)', () => {
      expect(LunarCalendar.getHourBranch(2)).toBe('丑');
    });

    test('hour 3 -> 寅 (05:00-06:59)', () => {
      expect(LunarCalendar.getHourBranch(3)).toBe('寅');
    });

    test('hour 6 -> 卯 (07:00-08:59)', () => {
      expect(LunarCalendar.getHourBranch(6)).toBe('卯');
    });

    test('hour 12 -> 午 (11:00-12:59)', () => {
      expect(LunarCalendar.getHourBranch(12)).toBe('午');
    });

    test('hour 23 -> 子 (23:00-23:59)', () => {
      expect(LunarCalendar.getHourBranch(23)).toBe('子');
    });
  });

  describe('getLunarHourName', () => {
    test('2024-09-10 09:00 时柱', () => {
      const result = LunarCalendar.getLunarHourName(2024, 9, 10, 9);
      expect(result.GanZhiHour.length).toBe(2);
      expect(result.hourGan).toBeDefined();
      expect(result.hourZhi).toBeDefined();
    });

    test('2024-09-10 23:00 晚子时', () => {
      const result = LunarCalendar.getLunarHourName(2024, 9, 10, 23);
      expect(result.hourZhi).toBe('子');
    });
  });

  describe('getBazi - 完整八字排盘', () => {
    test('2024-09-10 09:30 返回完整结构', () => {
      const result = LunarCalendar.getBazi(2024, 9, 10, 9);

      expect(result.yearGanZhi).toBeDefined();
      expect(result.monthGanZhi).toBeDefined();
      expect(result.dayGanZhi).toBeDefined();
      expect(result.hourGanZhi).toBeDefined();

      expect(result.yearGanZhi.length).toBe(2);
      expect(result.monthGanZhi.length).toBe(2);
      expect(result.dayGanZhi.length).toBe(2);
      expect(result.hourGanZhi.length).toBe(2);
    });

    test('2024-09-10 09:30 四柱干支有效', () => {
      const result = LunarCalendar.getBazi(2024, 9, 10, 9);
      const gans = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
      const zhis = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

      expect(gans).toContain(result.yearGan);
      expect(gans).toContain(result.monthGan);
      expect(gans).toContain(result.dayGan);
      expect(gans).toContain(result.hourGan);

      expect(zhis).toContain(result.yearZhi);
      expect(zhis).toContain(result.monthZhi);
      expect(zhis).toContain(result.dayZhi);
      expect(zhis).toContain(result.hourZhi);
    });

    test('子时边界 - 23:30 晚子时', () => {
      const result = LunarCalendar.getBazi(2024, 9, 10, 23);
      expect(result.hourZhi).toBe('子');
      expect(result.ziType).toBe('晚子时');
    });

    test('子时边界 - 00:30 早子时', () => {
      const result = LunarCalendar.getBazi(2024, 9, 10, 0);
      expect(result.hourZhi).toBe('子');
      expect(result.ziType).toBe('早子时');
    });

    test('非子时无 ziType', () => {
      const result = LunarCalendar.getBazi(2024, 9, 10, 9);
      expect(result.ziType).toBeNull();
    });

    test('1891年边界下限正常工作', () => {
      expect(() => LunarCalendar.getBazi(1891, 1, 1, 12)).not.toThrow();
      const result = LunarCalendar.getBazi(1891, 1, 1, 12);
      expect(result.yearGanZhi).toBeDefined();
    });

    test('2100年边界上限正常工作', () => {
      expect(() => LunarCalendar.getBazi(2100, 1, 1, 12)).not.toThrow();
      const result = LunarCalendar.getBazi(2100, 1, 1, 12);
      expect(result.yearGanZhi).toBeDefined();
    });

    test('超出范围 1890年 抛异常', () => {
      expect(() => LunarCalendar.getBazi(1890, 1, 1, 12)).toThrow();
    });

    test('超出范围 2101年 返回错误对象', () => {
      const result = LunarCalendar.getBazi(2101, 1, 1, 12);
      expect(result.error).toBeDefined();
    });

    test('多个日期验证一致性', () => {
      const dates = [
        [2024, 1, 15, 12],
        [2024, 3, 20, 23],
        [2024, 6, 15, 6],
        [2000, 2, 29, 15],
        [1990, 8, 15, 20],
      ];

      dates.forEach(([y, m, d, h]) => {
        expect(() => LunarCalendar.getBazi(y, m, d, h)).not.toThrow();
        const result = LunarCalendar.getBazi(y, m, d, h);
        expect(result.yearGanZhi.length).toBe(2);
        expect(result.monthGanZhi.length).toBe(2);
        expect(result.dayGanZhi.length).toBe(2);
        expect(result.hourGanZhi.length).toBe(2);
      });
    });

    test('hourDetail 包含完整调试信息', () => {
      const result = LunarCalendar.getBazi(2024, 9, 10, 9);
      expect(result.hourDetail).toBeDefined();
      expect(result.hourDetail.GanZhiHour).toBe(result.hourGanZhi);
      expect(result.hourDetail.hourGan).toBe(result.hourGan);
      expect(result.hourDetail.hourZhi).toBe(result.hourZhi);
    });

    test('农历信息完整', () => {
      const result = LunarCalendar.getBazi(2024, 9, 10, 9);
      expect(result.lunarYear).toBe(2024);
      expect(result.lunarMonth).toBe(8);
      expect(result.lunarDay).toBe(8);
      expect(result.lunarMonthName).toBe('八月');
      expect(result.lunarDayName).toBe('初八');
      expect(result.zodiac).toBe('龙');
    });
  });

  describe('getBazi - 换日口径测试', () => {
    test('默认 23点口径（子初换日）', () => {
      const result = LunarCalendar.getBazi(2024, 9, 10, 23);
      expect(result.ziType).toBe('晚子时');
    });

    test('0点口径（00:00换日）', () => {
      expect(() => LunarCalendar.getBazi(2024, 9, 10, 23, '0点')).not.toThrow();
    });
  });
});

describe('节日和节气', () => {
  test('春节', () => {
    const result = LunarCalendar.solarToLunar(2024, 2, 10);
    expect(result.lunarFestival).toContain('春节');
  });

  test('中秋节', () => {
    const result = LunarCalendar.solarToLunar(2024, 9, 17);
    expect(result.lunarFestival).toContain('中秋');
  });

  test('元旦节', () => {
    const result = LunarCalendar.solarToLunar(2024, 1, 1);
    expect(result.solarFestival).toContain('元旦');
  });

  test('清明节', () => {
    const result = LunarCalendar.solarToLunar(2024, 4, 4);
    expect(result.term).toBe('清明');
  });
});
