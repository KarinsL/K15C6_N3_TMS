import { HealthController } from './health.controller';

describe('HealthController', () => {
  it('reports UP', () => {
    expect(new HealthController().health()).toMatchObject({
      status: 'UP',
      service: 'tms-backend',
    });
  });
});
