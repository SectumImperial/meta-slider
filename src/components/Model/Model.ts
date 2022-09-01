import {
  ModelInterface,
  ModelVal,
  ThumbID,
  ThumbValPercent,
  HandleMoveModel,
  HandleMoveModelFrom,
  HandleMoveModelTo,
  isValTheSamePos,
  StepsMap,
} from '../Interfaces';

class Model {
  private state: ModelInterface;

  mapSteps!: StepsMap;

  stepPercent!: number;

  constructor(state: ModelInterface) {
    this.state = state;
    this.init();
  }

  private init() {
    this.mapSteps = this.createSteps();
    this.stepPercent = Number((this.state.step / this.findPercent()).toFixed(3));
  }

  public setState(state: object) {
    const oldState = this.state;
    this.state = { ...oldState, ...state };
  }

  public getState(): ModelInterface {
    return this.state;
  }

  public updateStateMove(movedTo: number, thumb: ThumbID): void {
    this.findSuitablePercent(movedTo, thumb);
  }

  private findSuitablePercent(percentMove: number, thumb: ThumbID) {
    const {
      step,
      max,
      min,
    } = this.state;

    const nearestCountStep = Math.floor(percentMove / this.stepPercent);
    const nearStep = nearestCountStep * step;
    const halfStep = Number((this.stepPercent / 2).toFixed(3));

    const halfMove = Number((percentMove % this.stepPercent).toFixed(3));

    let prevStepPercent = this.findPercentMap(nearStep);
    if (prevStepPercent === undefined) prevStepPercent = 0;
    let nextStepPercent = this.findPercentMap(nearStep + this.state.step);
    if (nextStepPercent === undefined) nextStepPercent = 100;

    if (percentMove === 100) {
      prevStepPercent = this.findPercentMap(max - step);
    }

    let value: number | undefined;
    let percent: number;
    if (halfMove < halfStep && prevStepPercent !== undefined) {
      value = this.mapSteps.get(prevStepPercent);
      percent = prevStepPercent;
    } else {
      value = this.mapSteps.get(nextStepPercent);
      percent = nextStepPercent;
    }

    if (percentMove === 100) {
      value = this.mapSteps.get(100);
      percent = 100;
    }
    if (value === undefined) value = min;

    this.handleMove({
      value,
      thumb,
      percent,
    });
  }

  private findPercentMap(value: number): number | undefined {
    return [...this.mapSteps.keys()].find((key) => this.mapSteps.get(key) === value);
  }

  private handleMove(values: HandleMoveModel) {
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

  private handleMoveFrom(values: HandleMoveModelFrom) {
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

  private handleMoveTo(values: HandleMoveModelTo) {
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

  private updateMoved(val: number, percent: number, thumb: ThumbID) {
    if (Number.isNaN(val) || percent === undefined) throw new Error('Something wrong with setting new values');
    const thumbPecent = ThumbValPercent[thumb];

    this.setState({
      [thumb]: val,
      [thumbPecent]: percent,
    });
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

  private createSteps(): StepsMap {
    const { step, max, min } = this.state;
    const mapSteps: StepsMap = new Map();
    const range = this.findRange();
    const percent = this.findPercent();

    let countStep = 0;
    for (let i = min; i <= max; i += step) {
      mapSteps.set(Number(((countStep * step) / percent).toFixed(3)), i);
      countStep += 1;
    }
    if (range % step !== 0) {
      mapSteps.set(max, 100);
    }

    countStep = 0;
    return mapSteps;
  }

  private findPercent() {
    const range = this.findRange();
    const percent = range / 100;
    return percent;
  }

  private findRange() {
    const range = this.state.max - this.state.min;
    return range;
  }
}

export default Model;
