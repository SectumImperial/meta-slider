// eslint-disable-next-line import/no-import-module-exports
import './test.scss';

class User {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  getData(): string {
    return `${this.name} is ${this.age}`
  }
}

const max = new User('Max', 24);

function add(a: number, b: number): number {
  return a + b;
}

export { max, add };
