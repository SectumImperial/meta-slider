import {
  ModelOptions,
  ModelValue,
  ThumbId,
} from '@src/components/Interfaces';

class Model {
  private state: ModelOptions;

  constructor(state: ModelOptions) {
    this.state = state;
  }

  public setState(state: Partial<ModelOptions>): void {
    this.state = { ...this.state, ...state };
  }

  public getState(): ModelOptions {
    return this.state;
  }

  public handleSliderClick(clickPos: number, thumb: ThumbId): void {
    const valueThumbObject = this.findSuitablePercent(clickPos);
    this.updateStateMove(valueThumbObject.value, thumb);
  }

  public handleMouseMove(movedTo: number, thumb: ThumbId): void {
    const valueThumbObject = this.findPercent(movedTo, thumb);
    const { value } = valueThumbObject;
    if (value !== undefined) this.updateStateMove(value, thumb); 
  }

  public getValue(val: ModelValue): number | undefined | boolean {
    return this.state[val];
  }

  public getPercentVal(): number {
    const { valueFrom, min, max } = this.state;
    const range: number = max - min;
    return Number(((valueFrom / range) * 100).toFixed(3));
  }

  private findSuitablePercent(percentMove: number) {
    const { step, min, max } = this.state;
    const nearestStep = Math.round(percentMove / (100 / this.getStepsCount()));
    const percent = (100 / this.getStepsCount()) * nearestStep;

    let value: number;
    if (percent === 100) {
      value = max;
    } else {
      value = min + step * nearestStep;
    }

    return {
      value,
      percent,
    };
  }

  private findPercent(percentMove: number, thumb: ThumbId) {
    const { min, max, step } = this.state;
    const percentValue = thumb === 'valueFrom' ? 'thumbPercentFrom' : 'thumbPercentTo';
  
    let currentPercent = this.state[percentValue];
    let currentValue = this.state[thumb];
  
    if (currentValue === undefined) currentValue = min;
    if (currentPercent === undefined) currentPercent = (currentValue - min) / (max - min) * 100;
  
    const nextPercent = currentPercent + (100 / this.getStepsCount());
    const prevPercent = currentPercent - (100 / this.getStepsCount());
  
    const value = percentMove >= nextPercent ? currentValue + step
      : percentMove <= prevPercent ? currentValue - step
      : currentValue;
  
    const percent = percentMove >= nextPercent ? nextPercent
      : percentMove <= prevPercent ? prevPercent
      : percentMove;
  
    if (thumb === 'valueFrom' && this.state.valueTo !== undefined && value > this.state.valueTo) {
      const { valueTo, thumbPercentTo } = this.state;
      return {
        valueTo,
        thumbPercentTo,
      };
    }
  
    if (thumb === 'valueTo' && this.state.valueFrom !== undefined && value < this.state.valueFrom) {
      const { valueFrom, thumbPercentFrom } = this.state;
      return {
        valueFrom,
        thumbPercentFrom,
      };
    }
  
    return {
      value,
      percent,
    };
  }
  
  

  private getStepsCount(): number {
    return Math.ceil((this.state.max - this.state.min) / this.state.step);
  }

  private updateStateMove(val: number, thumb: ThumbId): void {
    if (Number.isNaN(val)) {
      throw new Error('Invalid value provided while updating the model.');
    }

    this.setState({
      [thumb]: val,
    });
  }
}

export default Model;
