import { Controller, Get } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';

export interface HealthResponse {
  status: string;
  service: string;
  timestamp: string;
}

@Public()
@Controller('health')
export class HealthController {
  @Get()
  health(): HealthResponse {
    return {
      status: 'UP',
      service: 'tms-backend',
      timestamp: new Date().toISOString(),
    };
  }
}
