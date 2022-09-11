import {
  ModelInterface,
  ModelVal,
  ThumbID,
  ThumbValPercent,
  HandleMoveModel,
  HandleMoveModelFrom,
  HandleMoveModelTo,
  isValTheSamePos,
} from '../Interfaces';

class Model {
  private state: ModelInterface;

  private stepPercent!: number;

  constructor(state: ModelInterface) {
    this.state = state;
    this.init();
  }

  public setState(state: object): void {
    const oldState = this.state;
    this.state = { ...oldState, ...state };
  }

  public getState(): ModelInterface {
    return this.state;
  }

  public updateStateMove(movedTo: number, thumb: ThumbID): void {
    this.findSuitablePercent(movedTo, thumb);
  }

  public getValue(val: ModelVal): number | undefined | boolean {
    return this.state[`${val}`];
  }

  public getPercentVal(): number {
    const { valueFrom, min, max } = this.state;
    const range: number = max - min;
    const percent = Number(((valueFrom / range) * 100).toFixed(3));
    return percent;
  }

  private init(): void {
    // this.mapSteps = this.createSteps();
    this.stepPercent = Number((this.state.step / this.findValPercent()));
  }

  private findSuitablePercent(percentMove: number, thumb: ThumbID) {
    const {
      step,
      max,
      min,
    } = this.state;

    const nearestPrevCountStep = Math.floor(percentMove / this.stepPercent);
    const nearestNextCountStep = Math.ceil(percentMove / this.stepPercent);

    const prevStep = min + (step * nearestPrevCountStep);
    const nextStep = min + (step * nearestNextCountStep);

    const prevPercent = this.stepPercent * nearestPrevCountStep;
    const nextPercent = this.stepPercent * nearestNextCountStep;

    const halfStep = Number((this.stepPercent / 2).toFixed(3));
    const halfMove = Number((percentMove % this.stepPercent).toFixed(3));

    let value: number;
    let percent: number | undefined;

    if (halfMove < halfStep) {
      value = prevStep;
      percent = prevPercent;
    } else {
      value = nextStep;
      percent = nextPercent;
    }

    const allSteps = Math.ceil((max - min) / step);
    const beforeEndPercent = this.stepPercent * (allSteps - 1);

    if (percentMove === 100 || 100 - ((100 - beforeEndPercent) / 2) < percentMove) {
      value = max;
      percent = 100;
    }
    if (percent === undefined) percent = this.stepPercent * nearestPrevCountStep;

    this.handleMove({
      value,
      thumb,
      percent,
    });
  }

  private handleMove(values: HandleMoveModel): void {
    const {
      value,
      thumb,
      percent,
    } = values;

    if (thumb === 'valueFrom') {
      this.handleMoveFrom({
        value,
        thumb,
        percent,
      });
    }

    if (thumb === 'valueTo') {
      this.handleMoveTo({
        value,
        thumb,
        percent,
      });
    }
  }

  private handleMoveFrom(values: HandleMoveModelFrom): void {
    const {
      value,
      thumb,
      percent,
    } = values;

    const {
      valueTo,
      thumbPercentTo,
    } = this.state;

    if (this.isValTheSamePos({
      value,
      valueAnotherThumb: valueTo,
      thumbPercent: thumbPercentTo,
      thumb,
      idVal: 'valueFrom',
    }) && valueTo !== undefined && thumbPercentTo !== undefined) {
      this.updateMoved(valueTo, thumbPercentTo, thumb);
    } else if (value !== undefined) this.updateMoved(value, percent, thumb);
  }

  private handleMoveTo(values: HandleMoveModelTo): void {
    const {
      value,
      thumb,
      percent,
    } = values;

    const {
      valueFrom,
      thumbPercentFrom,
    } = this.state;

    if (this.isValTheSamePos({
      value,
      valueAnotherThumb: valueFrom,
      thumbPercent: thumbPercentFrom,
      thumb,
      idVal: 'valueTo',
    }) && valueFrom !== undefined) {
      this.updateMoved(valueFrom, thumbPercentFrom, thumb);
    } else if (value !== undefined) {
      this.updateMoved(value, percent, thumb);
    }
  }

  private isValTheSamePos(values: isValTheSamePos) {
    const {
      value,
      valueAnotherThumb,
      thumbPercent,
      thumb,
      idVal,
    } = values;

    const { isRange } = this.state;

    const checkVal = isRange && thumbPercent !== undefined && thumb === idVal;
    let compareVal = false;
    if (value !== undefined && valueAnotherThumb !== undefined) {
      compareVal = idVal === 'valueFrom' ? value > valueAnotherThumb : value < valueAnotherThumb;
    }

    return checkVal && compareVal;
  }

  private findValPercent(): number {
    const range = this.findRange();
    const percent = range / 100;
    return percent;
  }

  private findRange(): number {
    const range = this.state.max - this.state.min;
    return range;
  }

  private updateMoved(val: number, percent: number, thumb: ThumbID): void {
    if (Number.isNaN(val) || percent === undefined) throw new Error('Something wrong with setting new values');
    const thumbPecent = ThumbValPercent[thumb];

    this.setState({
      [thumb]: val,
      [thumbPecent]: percent,
    });
  }
}

export default Model;
