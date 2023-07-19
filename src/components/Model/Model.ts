import {
  ModelOptions,
  ModelValue,
  ThumbId,
  HandledMoveModel,
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

  public updateStateMove(movedTo: number, thumb: ThumbId): void {
    const valueThumbObject = this.findSuitablePercent(movedTo, thumb);
    this.handleMove(valueThumbObject);
  }

  public getValue(val: ModelValue): number | undefined | boolean {
    return this.state[val];
  }

  public getPercentVal(): number {
    const { valueFrom, min, max } = this.state;
    const range: number = max - min;
    return Number(((valueFrom / range) * 100).toFixed(3));
  }

  private findSuitablePercent(percentMove: number, thumb: ThumbId): HandledMoveModel {
    const { step, min } = this.state;
    const nearestStep = Math.round(percentMove / (100 / this.getStepsCount()));
    const percent = (100 / this.getStepsCount()) * nearestStep;

    let value: number;
    if (percent === 100) {
      value = this.state.max;
    } else {
      value = min + step * nearestStep;
    }

    return {
      value,
      thumb,
      percent,
    };
  }

  private getStepsCount(): number {
    return Math.ceil((this.state.max - this.state.min) / this.state.step);
  }

  private handleMove(values: HandledMoveModel): void {
    const { value, thumb, percent } = values;
    if (value !== undefined) {
      this.updateMoved(value, percent, thumb);
    }
  }

  private updateMoved(val: number, percent: number, thumb: ThumbId): void {
    if (Number.isNaN(val) || Number.isNaN(percent)) {
      throw new Error('Invalid value or percent provided while updating the model.');
    }

    this.setState({
      [thumb]: val,
      thumbPercentTo: percent,
    });
  }
}

export default Model;
