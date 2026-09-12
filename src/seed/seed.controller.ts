import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import { Auth } from 'src/user/decorators/auth-decorator';
import { ValidRoles } from 'src/user/interfaces/validRoles';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  @Auth(ValidRoles.ADMIN)
  executeSeed() {
    return this.seedService.runSeed();
  }
}
