import { ModelInterface, ValidateSliderData } from "../Interfaces";
import initialState from "../../state";

class Validator {
  private min!: number;
  private max!: number;
  private value!: number;
  private step!: number;
  thumbPercent!: number;
  private resultObject: ModelInterface;

  constructor(data: ModelInterface) {
    this.setData(data);
    this.resultObject = initialState;
  }

  public setData(data: ModelInterface): void {
    const { min, max, value, step, thumbPercent } = data;
    this.min = min;
    this.max = max;
    this.value = value;
    this.step = step;
    this.thumbPercent = thumbPercent;
  }

  public validateData(): ModelInterface {
    this.checkRange();
    this.checkStep();
    this.checkValue();

    return this.resultObject;
  }

  public performMoveToercent(data: ValidateSliderData): number {
    const { coordsMove, scaleWidth } = data;
    const percent = scaleWidth / 100;
    let percentMove = Number((coordsMove / percent).toFixed(2))
    if (percentMove < 0) percentMove = 0;
    if (percentMove > 100) percentMove = 100;
    return percentMove;
  }

  private checkRange(): void {
    if (this.min === this.max) {
      this.max = this.min + this.step;
    }

    if (this.min > this.max) {
      [this.min, this.max] = [this.max, this.min];
    }
    this.resultObject.min = this.min;
    this.resultObject.max = this.max;
  }

  private checkStep(): void {
    const allRange = this.max - this.min;

    if (this.step > allRange) {
      this.step = allRange
    }
    this.resultObject.step = this.step;
  }

  private checkValue(): void {
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