import {
  ModelInterface,
  ThumbID,
  ValidateSliderData,
  // ValidateSliderDataClicked,
} from '../Interfaces';
import initialState from '../../state';

class Validator {
  private DEFAULT_GAP = 20;

  private min!: number;

  private max!: number;

  private valueFrom!: number;

  private step!: number;

  private resultObject: ModelInterface;

  stepPercent: number;

  isRange!: boolean;

  valueTo!: number;

  thumbPercentFrom!: number;

  thumbPercentTo?: number;

  constructor(readonly data: ModelInterface) {
    this.setData(data);
    this.stepPercent = this.step / (this.findRange() / 100);
    this.resultObject = initialState;
  }

  public setData(data: ModelInterface): void {
    const {
      min,
      max,
      valueFrom,
      step,
      thumbPercentFrom,
      thumbPercentTo,
      isRange,
      valueTo,
    } = data;

    this.min = min;
    this.max = max;
    this.valueFrom = valueFrom;
    this.step = step;
    this.thumbPercentFrom = thumbPercentFrom;

    this.isRange = isRange;
    if (this.isRange && valueTo) {
      this.valueTo = valueTo;
      this.thumbPercentTo = thumbPercentTo || 100;
    }
  }

  public validateData(): ModelInterface {
    this.checkRange();
    this.checkStep();
    this.checkValues();
    this.checkPercents();
    return this.resultObject;
  }

  // eslint-disable-next-line class-methods-use-this
  public performMoveToPercent(data: ValidateSliderData): number {
    const { coordsMove, scaleSize } = data;
    const percent = scaleSize / 100;
    let percentMove = Number((coordsMove / percent).toFixed(2));
    if (percentMove < 0) percentMove = 0;
    if (percentMove > 100) percentMove = 100;
    return percentMove;
  }

  public validateMarks(
    mapSteps: Map<number, number>,
    basisPercent: number = this.DEFAULT_GAP,
  ): Map<number, number> {
    const percentEdge = this.validateGap(basisPercent);
    const resultMap = new Map<number, number>();
    let prevPercent = 0;
    let nextPercent = percentEdge;

    mapSteps.forEach((value: number, percent: number) => {
      if (percent === 0 || percent === 100) {
        resultMap.set(percent, value);
      }

      if (this.isGetGap(nextPercent, prevPercent, percent, percentEdge)) {
        resultMap.set(percent, value);
        prevPercent = percent;
        nextPercent = percent + percentEdge;
      }
    });

    return resultMap;
  }

  // eslint-disable-next-line class-methods-use-this
  private isGetGap(
    nextPercent: number,
    prevPercent: number,
    percent: number,
    percentEdge: number,
  ): boolean {
    return Math.round(nextPercent) - Math.round(prevPercent) >= percentEdge
      && percent >= nextPercent
      && (100 - percentEdge) >= nextPercent;
  }

  private validateGap(basisPercent: number): number {
    let result = basisPercent;
    if (result < 0 || result > 100) result = this.DEFAULT_GAP;
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
      this.step = allRange;
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

    if (this.valueTo !== undefined && this.valueFrom > this.valueTo) {
      [this.valueFrom, this.valueTo] = [this.valueTo, this.valueFrom];
      this.resultObject.valueTo = this.valueTo;
    }

    this.resultObject.valueFrom = this.valueFrom;
  }

  private checkValue(value = 0): number {
    let result = value;
    if (value > this.max) {
      result = this.max;
    }

    if (this.valueFrom < this.min) {
      result = this.min;
    }

    if (value % this.step !== 0) {
      const stepVal = this.step * Math.floor((value / this.step));
      result = stepVal;
    }
    return result;
  }

  private checkPercents(): void {
    this.thumbPercentFrom = this.checkPercent('valueFrom');
    this.resultObject.thumbPercentFrom = this.thumbPercentFrom;
    if (this.isRange) {
      this.thumbPercentTo = this.checkPercent('valueTo');
      this.resultObject.thumbPercentTo = this.thumbPercentTo;
    }
  }

  private checkPercent(value: ThumbID = 'valueFrom'): number {
    const valOfRange = this[value] - this.min;
    const currentPercent = (valOfRange / (this.findRange() / 100));
    return currentPercent;
  }

  public validateThumbId(movedTo: number): ThumbID {
    if (!this.isRange) return 'valueFrom';
    if (movedTo < this.thumbPercentFrom) return 'valueFrom';
    if (this.thumbPercentTo !== undefined && movedTo > this.thumbPercentTo) return 'valueTo';

    if (movedTo > this.thumbPercentFrom
      && this.thumbPercentTo !== undefined
      && movedTo < this.thumbPercentTo) {
      const diffFrom = movedTo - this.thumbPercentFrom;
      const diffTo = this.thumbPercentTo - movedTo;

      if (diffFrom === diffTo || diffFrom < diffTo) return 'valueFrom';
      if (diffFrom > diffTo) return 'valueTo';
    }
    return 'valueTo';
  }
}

export default Validator;
