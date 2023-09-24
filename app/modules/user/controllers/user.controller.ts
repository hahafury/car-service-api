import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from '@app/modules/user/services/user.service';
import { UserEntity } from '@app/modules/user/entities';
import { OnlyAuthorizedGuard } from '@app/modules/user/guards';
import { CurrentUser } from '@app/modules/user/decorators/current-user.decorator';
import { CurrentUserPayload } from '@app/modules/user/types/current-user';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('/me')
  @UseGuards(OnlyAuthorizedGuard)
  getMe(@CurrentUser() user: CurrentUserPayload): Promise<UserEntity | null> {
    const userId: number = user.id;
    return this.userService.getUserById(userId, { profile: true });
  }
}
