import { Controller, Get } from '@nestjs/common';

@Controller('boards')
export class BoardsController {
    @Get()
    findAll(): string {
        return "Hello2";
    }
}
