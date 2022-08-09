import { ModelInterface } from "./modelInterface";
import initialState from "./state";

class Validator {
  private min!: number;
  private max!: number;
  private value!: number;
  private step!: number;
  private resultObject: ModelInterface;

  constructor(data: ModelInterface) {
    const { min, max, value, step } = data;
    this.min = min;
    this.max = max;
    this.value = value;
    this.step = step;

    this.resultObject = initialState;
  }

  public validateData() {
    this.checkRange();
    this.checkStep();
    this.checkValue();

    return this.resultObject;
  }

  private checkRange() {
    if (this.min === this.max) {
      this.max = this.min + this.step;
    }

    if (this.min > this.max) {
      [this.min, this.max] = [this.max, this.min];
    }
    this.resultObject.min = this.min;
    this.resultObject.max = this.max;
  }

  private checkStep() {
    const allRange = this.max - this.min;

    if (this.step > allRange) {
      this.step = allRange
    }
    this.resultObject.step = this.step;
  }

  private checkValue() {
    if (this.value > this.max) {
      this.value = this.max;
    }

    if (this.value < this.min) {
      this.value = this.min;
    }

    this.resultObject.value = this.value;
  }
}

export default Validator;