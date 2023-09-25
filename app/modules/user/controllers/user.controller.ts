import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from '@app/modules/user/services/user.service';
import { UserEntity } from '@app/modules/user/entities';
import { OnlyAuthorizedGuard } from '@app/modules/user/guards';
import { CurrentUser } from '@app/modules/user/decorators/current-user.decorator';
import { CurrentUserPayload } from '@app/modules/user/types/current-user';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '@app/modules/user/decorators/roles';
import { RoleEnum } from '@app/modules/user/types/role.enum';
import { RolesGuard } from '@app/modules/user/guards/roles.guard';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiResponse({
    status: 403,
    description: 'Forbidden',
  })
  @ApiResponse({
    status: 200,
    description: 'User data',
  })
  @Get('/me')
  @Roles(RoleEnum.CLIENT)
  @UseGuards(OnlyAuthorizedGuard, RolesGuard)
  getMe(@CurrentUser() user: CurrentUserPayload): Promise<UserEntity | null> {
    const userId: number = user.id;
    return this.userService.getUserById(userId, { profile: true });
  }
}
