/**
 * 推盘 API 集成测试
 * 测试 /api/paipan 端点
 */

const request = require('supertest');

// 直接加载 server
const app = require('../server.js').app;

describe('POST /api/paipan 参数验证', () => {
  test('缺少必填参数返回 400', async () => {
    const response = await request(app)
      .post('/api/paipan')
      .send({})
      .expect('Content-Type', /json/)
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toContain('缺少必要参数');
  });

  test('缺少姓名返回 400', async () => {
    const response = await request(app)
      .post('/api/paipan')
      .send({
        gender: '男',
        birthTime: '2024-09-10 09:30',
        province: '北京市',
        city: '北京市'
      })
      .expect(400);

    expect(response.body.success).toBe(false);
  });

  test('缺少性别返回 400', async () => {
    const response = await request(app)
      .post('/api/paipan')
      .send({
        name: '张三',
        birthTime: '2024-09-10 09:30',
        province: '北京市',
        city: '北京市'
      })
      .expect(400);

    expect(response.body.success).toBe(false);
  });

  test('缺少出生时间返回 400', async () => {
    const response = await request(app)
      .post('/api/paipan')
      .send({
        name: '张三',
        gender: '男',
        province: '北京市',
        city: '北京市'
      })
      .expect(400);

    expect(response.body.success).toBe(false);
  });

  test('出生时间格式错误返回 400', async () => {
    const response = await request(app)
      .post('/api/paipan')
      .send({
        name: '张三',
        gender: '男',
        birthTime: 'invalid-date',
        province: '北京市',
        city: '北京市'
      })
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toContain('格式错误');
  });

  test('缺少省份返回 400', async () => {
    const response = await request(app)
      .post('/api/paipan')
      .send({
        name: '张三',
        gender: '男',
        birthTime: '2024-09-10 09:30',
        city: '北京市'
      })
      .expect(400);

    expect(response.body.success).toBe(false);
  });

  test('缺少城市返回 400', async () => {
    const response = await request(app)
      .post('/api/paipan')
      .send({
        name: '张三',
        gender: '男',
        birthTime: '2024-09-10 09:30',
        province: '北京市'
      })
      .expect(400);

    expect(response.body.success).toBe(false);
  });
});

describe('POST /api/paipan 八字转换验证', () => {
  test('有效参数应返回结果或 LLM 错误（不返回参数错误）', async () => {
    const response = await request(app)
      .post('/api/paipan')
      .send({
        name: '测试用户',
        gender: '男',
        birthTime: '2024-09-10 09:30',
        province: '北京市',
        city: '北京市',
        advanced: false
      });

    // 验证不是参数错误
    if (response.body.error && response.body.error.includes('缺少必要参数')) {
      throw new Error('不应返回参数错误');
    }

    // 可能是成功或 LLM 错误，但参数验证应该通过
    expect(response.body.success === true || response.body.error.includes('LLM')).toBe(true);
  });

  test('日期超出范围返回 400', async () => {
    const response = await request(app)
      .post('/api/paipan')
      .send({
        name: '测试用户',
        gender: '男',
        birthTime: '1890-01-01 09:30', // 超出 1891-2100 范围
        province: '北京市',
        city: '北京市',
        advanced: false
      });

    // 八字转换失败应返回 400
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});

describe('GET /api/health', () => {
  test('健康检查端点', async () => {
    const response = await request(app)
      .get('/api/health')
      .expect(200);

    expect(response.body.status).toBe('ok');
  });
});
