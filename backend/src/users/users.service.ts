import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/providers/prisma.service';
import { CreateAccountInput, CreateUserDTO } from './users.dto';
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
    return this.prisma.account.create({ data: createAccountInput });
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
        accounts: true,
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
}
