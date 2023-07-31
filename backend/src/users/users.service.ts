import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/providers/prisma.service';
import { CreateAccountInput, CreateUserDTO, RequestUser } from './users.dto';
import bcrypt from 'bcrypt';
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(createUserDTO: CreateUserDTO) {
    if (createUserDTO.password) {
      createUserDTO.password = await bcrypt.hash(createUserDTO.password, 10);
    }

    return this.prisma.user.create({
      data: createUserDTO,
      select: {
        id: true,
        email: true,
        givenName: true,
        familyName: true,
        picture: true,
        role: true,
        organizer: { select: { id: true } },
      },
    });
  }

  createAccount(createAccountInput: CreateAccountInput) {
    return this.prisma.account.create({
      data: {
        locale: createAccountInput.locale,
        providerAccountId: createAccountInput.providerAccountId,
        providerType: createAccountInput.providerType,
        verified: createAccountInput.verified,
        accessToken: createAccountInput.accessToken,
        refreshToken: createAccountInput.refreshToken,
        user: {
          connect: { id: createAccountInput.userId },
        },
      },
    });
  }

  findOneByEmail(email: string, exposePassword = false) {
    return this.prisma.user.findFirst({
      where: { email },
      select: {
        id: true,
        email: true,
        givenName: true,
        familyName: true,
        picture: true,
        role: true,
        accounts: {
          select: {
            id: true,
            providerType: true,
          },
        },
        password: exposePassword,
        organizer: { select: { id: true } },
      },
    });
  }

  getUserPreview(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        givenName: true,
        familyName: true,
        picture: true,
        role: true,
        organizer: { select: { id: true } },
      },
    });
  }

  async isFollowingOrganizer(userId: string, organizerId: string) {
    const followed = await this.prisma.user.findFirst({
      where: { id: userId, follows: { some: { organizerId } } },
    });

    return !!followed;
  }

  async getLikedEvents(user: RequestUser) {
    const likedEvents = await this.prisma.user.findUnique({
      where: { id: user.id },
      select: {
        looks: {
          select: {
            eventId: true,
          },
        },
      },
    });

    return likedEvents;
  }

  async getFollowedOrganizers(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        follows: {
          select: { organizerId: true },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    return user.follows;
  }
}
