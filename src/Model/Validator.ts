import { ModelInterface } from "./modelInterface";

class Validator {
  min!: number;
  max!: number;
  value!: number;
  step!: number;

  constructor(data: ModelInterface) {
    const { min, max, value, step } = data;
    this.min = min;
    this.max = max;
    this.value = value;
    this.step = step;
  }

  public validateData() {

  }
}

export default Validator;