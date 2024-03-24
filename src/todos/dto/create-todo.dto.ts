import { ApiProperty } from '@nestjs/swagger';

export class CreateTodoDto {
  @ApiProperty()
  readonly title: string;
  @ApiProperty()
  readonly body: string;
}
