import {
  ModelOptions,
  ModelValue,
  ThumbAttr,
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

  public handleSliderClick = (clickPos: number, thumb: ThumbAttr): void => {
    const valueThumbObject = this.findSuitablePercent(clickPos);
    this.updateStateMove(valueThumbObject.value, thumb);
  };

  public handleMouseMove = (movedTo: number, thumb: ThumbAttr): void => {
    const valueThumbObject = this.findPercent(movedTo, thumb);
    const { value } = valueThumbObject;
    if (value !== undefined && typeof value === 'number') this.updateStateMove(value, thumb);
  };

  public getValue = (val: ModelValue): number | undefined | boolean => {
    return this.state[val];
  };

  public getPercentVal = (): number => {
    const { valueFrom, min, max } = this.state;
    const range: number = max - min;
    return Number(((valueFrom / range) * 100).toFixed(3));
  };

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

  private findPercent(percentMove: number, thumb: ThumbAttr) {
    const { min, max, step, isRange } = this.state;
    const percentValue = thumb === 'valueFrom' ? 'thumbPercentFrom' : 'thumbPercentTo';
  
    let currentPercent = this.state[percentValue];
    let currentValue = this.state[thumb as keyof ModelOptions];

    if (currentValue === undefined) currentValue = min;
    if (currentPercent === undefined) {
      if (typeof currentValue === 'number') {
        if (currentPercent === undefined) currentPercent = (currentValue - min) / (max - min) * 100;
      } else {
        currentValue = min;
        currentPercent = (currentValue - min) / (max - min) * 100;
      }
    }
  
    const nextPercent = currentPercent + (100 / this.getStepsCount());
    const prevPercent = currentPercent - (100 / this.getStepsCount());
  
    const nearestPrevStep = Math.floor((percentMove / 100) * this.getStepsCount());
    const nearestNextStep = Math.ceil((percentMove / 100) * this.getStepsCount());
  
    const nearestPrevValue =  min + nearestPrevStep * step;
    const nearestNextValue = min + nearestNextStep * step;
    const nearestPrevPercent = (nearestPrevValue - min) / (max - min) * 100;
    const nearestNextPercent = (nearestNextValue - min) / (max - min) * 100;
  
  
    const value = percentMove >= nextPercent ? nearestPrevValue
      : percentMove <= prevPercent ? nearestNextValue
      : currentValue;
  
    const percent = percentMove >= nextPercent ? nearestPrevPercent
      : percentMove <= prevPercent ? nearestNextPercent
      : percentMove;
  
    if(typeof value !== 'number') throw new Error('value should be a number');
    if (thumb === 'valueFrom' && this.state.valueTo !== undefined && value > this.state.valueTo && isRange) {
      const { valueTo, thumbPercentTo } = this.state;
      return {
        valueTo,
        thumbPercentTo,
      };
    }
  
    if (thumb === 'valueTo' && this.state.valueFrom !== undefined && value < this.state.valueFrom && isRange) {
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
  
  private getStepsCount = (): number => {
    return Math.ceil((this.state.max - this.state.min) / this.state.step);
  };

  private updateStateMove = (val: number, thumb: ThumbAttr): void => {
    if (Number.isNaN(val) || val < this.state.min || val > this.state.max) {
      throw new Error('Invalid value provided while updating the model.');
    }

    this.setState({
      [thumb]: val,
    });
  };
}

export default Model;
