import {
  ModelInputState,
  ModelInterface,
  ThumbID,
  ValidateSliderData,
} from '../Interfaces';

class Validator {
  private DEFAULT_GAP = 20;

  private min!: number;

  private max!: number;

  private valueFrom!: number;

  private step!: number;

  private resultObject!: ModelInterface;

  stepPercent!: number;

  valueTo!: number;

  thumbPercentFrom!: number;

  thumbPercentTo?: number;

  scalePercentGap: number | undefined;

  isTip!: boolean;

  isVertical!: boolean;

  isProgress!: boolean;

  scaleMarks!: boolean;

  isRange!: boolean;

  arrBooleans!: boolean[];

  constructor(readonly data: ModelInputState) {
    this.validateData(data);
  }

  public validateData(data: ModelInputState): ModelInterface {
    const prevBool = this.setBooleans(data);
    this.setData(data);
    this.resultObject = {
      ...data, ...prevBool, thumbPercentFrom: 0, thumbPercentTo: undefined,
    };

    this.checkRange();
    this.checkStep();
    this.checkValues();
    this.checkPercents();
    return this.resultObject;
  }

  // eslint-disable-next-line class-methods-use-this
  public performMoveToPercent(data: ValidateSliderData): number {
    const {
      coordsMove, scaleSize, keyEvent, thumbId,
    } = data;

    if (keyEvent) {
      if (keyEvent === 'increment' && thumbId === 'valueFrom') {
        return this.thumbPercentFrom + this.stepPercent;
      }

      if (keyEvent === 'decrement' && thumbId === 'valueFrom') {
        return this.thumbPercentFrom - this.stepPercent;
      }

      if (keyEvent === 'increment' && thumbId === 'valueTo' && this.thumbPercentTo !== undefined) {
        return this.thumbPercentTo + this.stepPercent;
      }

      if (keyEvent === 'decrement' && thumbId === 'valueTo' && this.thumbPercentTo !== undefined) {
        return this.thumbPercentTo - this.stepPercent;
      }
    }
    if (coordsMove === undefined || scaleSize === undefined) return 0;

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

  private setData(data: ModelInputState): void {
    const {
      min,
      max,
      valueFrom,
      step,
      scalePercentGap,
      valueTo,
    } = data;

    this.min = min;
    this.max = max;
    this.valueFrom = valueFrom;
    this.step = step;
    this.scalePercentGap = scalePercentGap;
    if (typeof this.scalePercentGap !== 'undefined' && typeof this.scalePercentGap !== 'number') {
      this.scalePercentGap = undefined;
    }

    if (this.isRange && valueTo !== undefined) {
      this.valueTo = valueTo;
    }

    this.stepPercent = this.step / (this.findRange() / 100);
  }

  private setBooleans(data: ModelInputState): object {
    const {
      isRange,
      isTip,
      isVertical,
      isProgress,
      scaleMarks,
    } = data;

    this.isRange = typeof isRange === 'boolean' ? isRange : false;
    this.isTip = typeof isTip === 'boolean' ? isTip : false;
    this.isVertical = typeof isVertical === 'boolean' ? isVertical : false;
    this.isProgress = typeof isProgress === 'boolean' ? isProgress : false;
    this.scaleMarks = typeof scaleMarks === 'boolean' ? scaleMarks : false;

    return {
      isRange: this.isRange,
      isTip: this.isTip,
      isVertical: this.isVertical,
      isProgress: this.isProgress,
      scaleMarks: this.scaleMarks,
    };
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
    if (Number.isNaN(this.min)) this.min = 0;
    if (Number.isNaN(this.max)) this.max = 10;
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
    if (Number.isNaN(this.step)) this.step = 1;
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

    if (this.valueTo !== undefined && this.valueFrom > this.valueTo && this.isRange) {
      [this.valueFrom, this.valueTo] = [this.valueTo, this.valueFrom];
    }

    this.resultObject.valueFrom = this.valueFrom;
    if (this.isRange) this.resultObject.valueTo = this.valueTo;
  }

  private checkValue(value: number): number {
    let result = value;
    if (Number.isNaN(result)) result = 0;
    if (result === this.max) {
      result = this.max;
      return result;
    }

    if (result % this.step !== 0 && result !== this.min) {
      const countStep = Math.round((result - this.min) / this.step);
      const countVal = this.min + (this.step * countStep);
      result = countVal;
    }

    if (result > this.max) {
      result = this.max;
    }

    if (result < this.min) {
      result = this.min;
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
    const currentPercent = Number((valOfRange / (this.findRange() / 100)).toFixed(3));
    return currentPercent;
  }
}

export default Validator;
