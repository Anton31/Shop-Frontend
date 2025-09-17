export class UserDto {
  role: string;
  username: string | null;
  email: string;
  password: string;
  passwordConfirmed: string;

  constructor(role: string, username: string, email: string,
              password: string, passwordConfirmed: string) {
    this.role = role;
    this.username = username;
    this.email = email;
    this.password = password;
    this.passwordConfirmed = passwordConfirmed;
  }
}
