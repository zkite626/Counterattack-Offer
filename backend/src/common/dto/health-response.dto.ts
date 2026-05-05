import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class HealthDataDto {
  @ApiProperty({ example: 'ok' })
  status!: 'ok';

  @ApiProperty({ example: 'ok' })
  database!: 'ok';

  @ApiProperty({ description: '服务进程运行秒数', example: 12345 })
  uptime!: number;
}

export class HealthSuccessResponseDto {
  @ApiProperty({ example: true })
  success!: true;

  @ApiProperty({ type: HealthDataDto })
  data!: HealthDataDto;

  @ApiPropertyOptional({ example: 'req_018fdbb0-8f62-7c4e-9c49' })
  requestId?: string;
}
