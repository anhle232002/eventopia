export class RequestUser {
  id: string;
  email: string;
  givenName?: string;
  familyName?: string;
  picture?: string;
  role: string;
  organizer: { id: string };
}

export class CreateUserDTO {
  email: string;
  givenName?: string;
  familyName?: string;
  picture?: string;
  role: string;
  password?: string;
}

export class CreateAccountInput {
  userId: string;
  providerType: string;
  providerAccountId: string;
  verified: boolean;
  locale: string;
  accessToken?: string;
  refreshToken?: string;
}
