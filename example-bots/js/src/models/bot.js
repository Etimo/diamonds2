export class Bot {
  constructor(name, email, token) {
    this.name = name;
    this.email = email;
    this.token = token;
    this.position = { x: 0, y: 0 };
    this.base = { x: 0, y: 0 };
  }

  setPosition(board) {
    // return position
  }

  setBase(board) {}
}
