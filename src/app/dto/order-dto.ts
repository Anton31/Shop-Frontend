export class OrderDto {
  description: string;
  username: string;
  email: string;

  constructor(description: string, username: string, email: string) {
    this.description = description;
    this.username = username;
    this.email = email;
  }
}
