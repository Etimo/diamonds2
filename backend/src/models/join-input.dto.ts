import { ApiProperty } from '@nestjs/swagger';

export class JoinInputDto {
  @ApiProperty({
    description: 'The secret token of the bot that you want to join with.',
  })
  botToken: string;
}
