import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApiErrorDto {
  @ApiProperty({
    description: '稳定错误码，供前端和移动端做分支处理',
    example: 'VALIDATION_ERROR',
  })
  code!: string;

  @ApiProperty({
    description: '面向用户或开发者的错误描述',
    example: '参数校验失败',
  })
  message!: string;

  @ApiPropertyOptional({
    description: '字段级校验错误，key 为字段名，value 为错误列表',
    example: { email: ['邮箱格式不正确'] },
    type: Object,
  })
  details?: Record<string, string[]>;
}

export class ApiFailureResponseDto {
  @ApiProperty({ example: false })
  success!: false;

  @ApiProperty({ type: ApiErrorDto })
  error!: ApiErrorDto;

  @ApiPropertyOptional({ example: 'req_018fdbb0-8f62-7c4e-9c49' })
  requestId?: string;
}
