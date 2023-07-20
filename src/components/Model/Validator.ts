import {
  ModelInputState,
  ModelOptions,
  StepsMap,
  ThumbId,
  ValidSliderData,
} from '@src/components/Interfaces';

class Validator {
  private DEFAULT_GAP = 20;

  booleanVariables: {
    isTip: boolean;
    isVertical: boolean;
    isProgress: boolean;
    scaleMarks: boolean;
    isRange: boolean;
  };

  baseParams: {
    min: number;
    max: number;
    valueFrom: number;
    valueTo?: number | undefined;
    step: number
    stepPercent?: number | undefined;
    thumbPercentFrom?: number | undefined;
    thumbPercentTo?: number | undefined;
  };

  private resultObject?: ModelOptions;
  scalePercentGap: number | undefined;

  constructor(readonly data: ModelInputState) {
    this.baseParams = {
      min: 0,
      max: 100,
      valueFrom: 0,
      step: 1,
      valueTo: undefined,
      stepPercent: 10,
      thumbPercentFrom: undefined,
      thumbPercentTo: undefined,
    };

    this.booleanVariables = {
      isTip: false,
      isVertical: false,
      isProgress: false,
      scaleMarks: false,
      isRange: false,
    };

    this.validateData(data);
  }

  public validateData(data: ModelInputState): ModelOptions {
    this.setBooleans(data);
    this.setData(data);
    this.resultObject = {
      ...data,
      ...this.booleanVariables,
      thumbPercentFrom: 0,
      thumbPercentTo: undefined,
    };

    this.checkRange();
    this.checkStep();
    this.checkValues();
    this.checkPercents();
    return this.resultObject;
  }

  public performMoveToPercent(data: ValidSliderData): number {
    const { coordsMove, scaleSize, keyEvent, thumbId } = data;

    if (keyEvent !== undefined && this.baseParams.stepPercent !== undefined && this.baseParams.thumbPercentFrom !== undefined) {
      if (keyEvent === 'increment' && thumbId === 'valueFrom') {
        return this.baseParams.thumbPercentFrom + this.baseParams.stepPercent;
      }

      if (keyEvent === 'decrement' && thumbId === 'valueFrom') {
        return this.baseParams.thumbPercentFrom - this.baseParams.stepPercent;
      }

      if (keyEvent === 'increment' && thumbId === 'valueTo' && this.baseParams.thumbPercentTo !== undefined) {
        return this.baseParams.thumbPercentTo + this.baseParams.stepPercent;
      }

      if (keyEvent === 'decrement' && thumbId === 'valueTo' && this.baseParams.thumbPercentTo !== undefined) {
        return this.baseParams.thumbPercentTo - this.baseParams.stepPercent;
      }
    }

    if (coordsMove === undefined || scaleSize === undefined) return 0;

    const percent = scaleSize / 100;
    let percentMove = Number((coordsMove / percent).toFixed(2));
    if (percentMove < 0) percentMove = 0;
    if (percentMove > 100) percentMove = 100;
    return percentMove;
  }

  public validateMarks(options: { min: number, max: number, step: number, gap: number }): StepsMap {
    const { step, max, min, gap } = options;
    const mapSteps: StepsMap = new Map();
    const validGap = this.validateGap(gap);
    const range = this.findRange();
    const percent = range / 100;
    const stepPercent = step / percent;
    const stepCountGap = step * Math.ceil(validGap / stepPercent);
    const percentCountsGap = Math.ceil(stepCountGap / percent);

    for (let i = 0; i <= 100; i += percentCountsGap) {
      if (i <= 100 - percentCountsGap) {
        const stepCount = Math.round(i / stepPercent);
        const valueSteps = step * stepCount;
        const percentScale = valueSteps / percent;
        const value = min + valueSteps;

        mapSteps.set(value, percentScale);
      }
    }

    mapSteps.set(max, 100);
    return mapSteps;
  }

  public validateThumbId(movedTo: number): ThumbId {
    if (this.baseParams.thumbPercentFrom === undefined) return 'valueTo';
    if (!this.booleanVariables.isRange) return 'valueFrom';
    if (movedTo < this.baseParams.thumbPercentFrom) return 'valueFrom';
    if (this.baseParams.thumbPercentTo !== undefined && movedTo > this.baseParams.thumbPercentTo) return 'valueTo';

    if (this.baseParams.thumbPercentTo !== undefined && movedTo > this.baseParams.thumbPercentFrom && movedTo < this.baseParams.thumbPercentTo) {
      const diffFrom = movedTo - this.baseParams.thumbPercentFrom;
      const diffTo = this.baseParams.thumbPercentTo - movedTo;

      if (diffFrom === diffTo || diffFrom < diffTo) return 'valueFrom';
      if (diffFrom > diffTo) return 'valueTo';
    }

    return 'valueTo';
  }

  public validatePercent(percent: number, value: number, oldState: ModelOptions): ModelOptions {
    const { isRange } = oldState;

    if (!isRange) {
      const newData = { ...oldState, valueFrom: value, thumbPercentFrom: percent };
      return this.validateData(newData);
    }

    if (oldState.thumbPercentTo !== undefined) {
      const { thumbPercentFrom, thumbPercentTo } = oldState;
      let thumbPercent = 'thumbPercentFrom';
      let thumbValue: keyof ModelOptions = 'valueFrom';

      if (percent > thumbPercentTo) {
        thumbPercent = 'thumbPercentTo';
        thumbValue = 'valueTo';
      } else if (percent > thumbPercentFrom && percent < thumbPercentTo) {
        const differentPercent = thumbPercentTo - thumbPercentFrom;
        const percentValue = percent - thumbPercentFrom;
        const middle = differentPercent / 2;

        if (percentValue >= middle) {
          thumbPercent = 'thumbPercentTo';
          thumbValue = 'valueTo';
        }
      }

      const newData = { ...oldState, [thumbValue]: value, [thumbPercent]: percent };
      return this.validateData(newData);
    }

    return oldState;
  }

  private setData(data: ModelInputState): void {
    const { min, max, valueFrom, step, scalePercentGap, valueTo } = data;
    this.baseParams.min = min;
    this.baseParams.max = max;
    this.baseParams.valueFrom = valueFrom;
    this.baseParams.step = step;
    this.scalePercentGap = typeof scalePercentGap === 'number' ? scalePercentGap : undefined;

    if (this.booleanVariables.isRange && valueTo !== undefined) {
      this.baseParams.valueTo = valueTo;
    }

    this.baseParams.stepPercent = this.baseParams.step / (this.findRange() / 100);
  }

  private setBooleans(data: ModelInputState): void {
    const { isRange, isTip, isVertical, isProgress, scaleMarks } = data;
    this.booleanVariables.isRange = typeof isRange === 'boolean' ? isRange : false;
    this.booleanVariables.isTip = typeof isTip === 'boolean' ? isTip : false;
    this.booleanVariables.isVertical = typeof isVertical === 'boolean' ? isVertical : false;
    this.booleanVariables.isProgress = typeof isProgress === 'boolean' ? isProgress : false;
    this.booleanVariables.scaleMarks = typeof scaleMarks === 'boolean' ? scaleMarks : false;
  }

  private validateGap(basisPercent: number): number {
    let result = basisPercent;
    if (result < 0 || result > 100) result = this.DEFAULT_GAP;
    return result;
  }

  private checkRange(): void {
    if (Number.isNaN(this.baseParams.min)) this.baseParams.min = 0;
    if (Number.isNaN(this.baseParams.max)) this.baseParams.max = 10;

    if (this.baseParams.min === this.baseParams.max) {
      this.baseParams.max = this.baseParams.min + this.baseParams.step;
    }

    if (this.baseParams.min > this.baseParams.max) {
      [this.baseParams.min, this.baseParams.max] = [this.baseParams.max, this.baseParams.min];
    }

    this.resultObject!.min = this.baseParams.min;
    this.resultObject!.max = this.baseParams.max;
  }

  private checkStep(): void {
    if (Number.isNaN(this.baseParams.step)) this.baseParams.step = 1;
    const allRange = this.findRange();

    if (this.baseParams.step > allRange) {
      this.baseParams.step = allRange;
    }

    if (this.baseParams.step < 0.001) this.baseParams.step = 0.001;

    this.resultObject!.step = this.baseParams.step;
  }

  private findRange(): number {
    return this.baseParams.max - this.baseParams.min;
  }

  private checkValues(): void {
    this.baseParams.valueFrom = this.checkValue(this.baseParams.valueFrom);

    if (this.booleanVariables.isRange && this.baseParams.valueTo !== undefined) {
      this.baseParams.valueTo = this.checkValue(this.baseParams.valueTo);
    }

    if (this.baseParams.valueTo !== undefined && this.baseParams.valueFrom > this.baseParams.valueTo && this.booleanVariables.isRange) {
      [this.baseParams.valueFrom, this.baseParams.valueTo] = [this.baseParams.valueTo, this.baseParams.valueFrom];
    }

    this.resultObject!.valueFrom = this.baseParams.valueFrom;
    if (this.booleanVariables.isRange) this.resultObject!.valueTo = this.baseParams.valueTo;
  }

  private checkValue(value: number): number {
    let result = value;
    if (Number.isNaN(result)) result = 0;
    if (result === this.baseParams.max) return result;

    if (result % this.baseParams.step !== 0 && result !== this.baseParams.min) {
      const countStep = Math.round((result - this.baseParams.min) / this.baseParams.step);
      const countVal = this.baseParams.min + this.baseParams.step * countStep;
      result = countVal;
    }

    if (result > this.baseParams.max) {
      result = this.baseParams.max;
    }

    if (result < this.baseParams.min) {
      result = this.baseParams.min;
    }

    return result;
  }

  private checkPercents(): void {
    this.baseParams.thumbPercentFrom = this.checkPercent('valueFrom');
    this.resultObject!.thumbPercentFrom = this.baseParams.thumbPercentFrom;

    if (this.booleanVariables.isRange) {
      this.baseParams.thumbPercentTo = this.checkPercent('valueTo');
      this.resultObject!.thumbPercentTo = this.baseParams.thumbPercentTo;
    }
  }

  private checkPercent(value: ThumbId): number {
    const variable = this.baseParams[value];
    if (variable === undefined) return 0;
    const valueOfRange = variable - this.baseParams.min;
    const currentPercent = Number((valueOfRange / (this.findRange() / 100)).toFixed(3));
    return currentPercent;
  }
}

export default Validator;
