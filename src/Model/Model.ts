import ModelInterface from "./modelInterface";

class Model implements ModelInterface {
  min: number;
  max: number;
  value: number;
  step: number;

  constructor(min: number, max: number, value: number, step: number) {
    this.min = min;
    this.max = max;
    this.value = value;
    this.step = step;
  }
}

export default Model;

