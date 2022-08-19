import { ModelInterface, ValidateSliderData } from "../Interfaces";
import initialState from "../../state";

class Validator {
  private DEFAULT_GAP: number = 20;

  private min!: number;
  private max!: number;
  private valueFrom!: number;
  private step!: number;
  thumbPercent!: number;
  private resultObject: ModelInterface;
  stepPercent: number;
  isRange!: boolean;
  valueTo?: number;

  constructor(data: ModelInterface) {
    this.setData(data);
    this.stepPercent = this.step / (this.findRange() / 100);
    this.resultObject = initialState;
  }

  public setData(data: ModelInterface): void {
    const { min, max, valueFrom, step, thumbPercent, isRange, valueTo } = data;
    this.min = min;
    this.max = max;
    this.valueFrom = valueFrom;
    this.step = step;
    this.thumbPercent = thumbPercent;
    this.isRange = isRange;
    if (this.isRange && valueTo) this.valueTo = valueTo;
  }

  public validateData(): ModelInterface {
    this.checkRange();
    this.checkStep();
    this.checkValues();
    this.checkPercent();

    return this.resultObject;
  }

  public performMoveToPercent(data: ValidateSliderData): number {
    const { coordsMove, scaleWidth } = data;
    const percent = scaleWidth / 100;
    let percentMove = Number((coordsMove / percent).toFixed(2))
    if (percentMove < 0) percentMove = 0;
    if (percentMove > 100) percentMove = 100;
    return percentMove;
  }

  public validateMarks(mapSteps: Map<number, number>, basisPercent: number = this.DEFAULT_GAP): Map<number, number> {
    const percentEdge = this.validateGap(basisPercent);
    const resultMap = new Map<number, number>();
    let prevPercent = 0;
    let nextPercent = percentEdge;

    for (let [percent, value] of mapSteps) {

      if (percent === 0 || percent === 100) {
        resultMap.set(percent, value);
      }

      if (Math.round(nextPercent) - Math.round(prevPercent) >= percentEdge && percent >= nextPercent) {
        resultMap.set(percent, value);
        prevPercent = percent;
        nextPercent = percent + percentEdge;
      }
    }

    return resultMap;
  }

  private validateGap(basisPercent: number): number {
    let result = basisPercent;
    if (result < 0 || result > 100) basisPercent = this.DEFAULT_GAP
    return result;
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
    if (!this.step) this.step = 1;
    this.resultObject.step = this.step;
  }


  private findRange(): number {
    const result = this.max - this.min;
    return result;
  }

  private checkValues(): void {
    this.valueFrom = this.checkValue(this.valueFrom);

    if (this.isRange) {
      this.valueTo = this.checkValue(this.valueTo);
    }

    if (this.valueTo && this.valueFrom > this.valueTo) {
      this.valueFrom = this.valueTo;
      this.resultObject.valueTo = this.valueTo;
    }

    this.resultObject.valueFrom = this.valueFrom;
  }

  private checkValue(value: number = 0): number {

    if (value > this.max) {
      value = this.max;
    }

    if (this.valueFrom < this.min) {
      value = this.min;
    }

    if (value % this.step !== 0) {
      const stepVal = this.step * Math.floor((value / this.step))
      value = stepVal;
    }

    return value;
  }

  private checkPercent(): void {
    const valOfRange = this.valueFrom - this.min;
    const currentPercent = (valOfRange / (this.findRange() / 100))
    this.resultObject.thumbPercent = currentPercent;
  }
}

export default Validator;