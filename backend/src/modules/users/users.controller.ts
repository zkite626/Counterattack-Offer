import { Body, Controller, Get, Put, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import type { AuthenticatedUser } from "../auth/auth.types";
import type {
  SaveStudentProfileDto,
  StudentProfileResponse,
} from "./dto/profile.dto";
import { UsersService } from "./users.service";

@Controller("users")
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("me/profile")
  async getMyProfile(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<{ profile: StudentProfileResponse | null }> {
    try {
      return { profile: await this.usersService.getStudentProfile(user.id) };
    } catch (error) {
      throw error;
    }
  }

  @Put("me/profile")
  async saveMyProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: SaveStudentProfileDto,
  ): Promise<{ profile: StudentProfileResponse }> {
    try {
      return {
        profile: await this.usersService.saveStudentProfile(user.id, dto),
      };
    } catch (error) {
      throw error;
    }
  }
}
