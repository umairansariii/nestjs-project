import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from './guard/auth.guard';
import { AppService } from './app.service';
import { Permissions } from './decorators/permissions.decorator';
import { Resource } from './permission/enums/resource.enum';
import { Action } from './permission/enums/action.enum';
import { AuthorizationGuard } from './guard/authorization.guard';

@UseGuards(AuthGuard, AuthorizationGuard)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Permissions([{ resource: Resource.users, actions: [Action.read] }])
  @Get()
  someProtectedRoute(@Req() req: any) {
    return { message: 'Accessed resource', userId: req.userId };
  }
}
