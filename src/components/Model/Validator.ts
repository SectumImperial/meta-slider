import { ModelInterface, ValidateSliderData } from "../Interfaces";
import initialState from "../../state";

class Validator {
  private min!: number;
  private max!: number;
  private value!: number;
  private step!: number;
  thumbPercent!: number;
  private resultObject: ModelInterface;
  stepPercent: number;

  constructor(data: ModelInterface) {
    this.setData(data);
    this.stepPercent = this.step / (this.findRange() / 100);
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
    this.checkPercent();

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

  public validateMarks(mapSteps: Map<number, number>, percentEdge: number): Map<number, number> {
    const resultMap = new Map<number, number>();
    let prevPercent = 0;
    let nextPercent = percentEdge;

    for (let [value, percent] of mapSteps) {

      if (percent === 0 || percent === 100) {
        resultMap.set(value, percent);
      }

      if ((nextPercent - prevPercent) >= percentEdge && percent === nextPercent) {

        resultMap.set(value, percent);
        prevPercent = percent;
        nextPercent += percentEdge;

        console.log(prevPercent, nextPercent);
      }
    }
    return resultMap;
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
    const allRange = this.findRange();

    if (this.step > allRange) {
      this.step = allRange
    }
    this.resultObject.step = this.step;
  }

  private findRange(): number {
    const result = this.max - this.min;
    return result;
  }

  private checkValue(): void {
    if (this.value > this.max) {
      this.value = this.max;
    }

    if (this.value < this.min) {
      this.value = this.min;
    }

    if (this.value % this.step !== 0) {
      this.value = this.min;
    }

    this.resultObject.value = this.value;
  }

  private checkPercent(): void {
    const currentPercent = (this.value / (this.findRange() / 100))
    this.resultObject.thumbPercent = currentPercent;
  }
}

export default Validator;