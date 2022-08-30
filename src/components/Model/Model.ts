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
  ModelSetVal,
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
    this.stepPercent = this.state.step / this.findPercent();
  }

  public setState(state: object) {
    const oldState = this.state;
    this.state = { ...oldState, ...state };
  }

  public getState(): ModelInterface {
    return this.state;
  }

  public updateStateMove(movedTo: number, thumb: ThumbID): void {
    const {
      nearStepPercent,
      halfStep,
      halfMove,
    } = this.findSuitablePercent(movedTo);

    this.setNewValue({
      nearStepPercent,
      halfStep,
      halfMove,
      thumb,
    });
  }

  private findSuitablePercent(percentMove: number) {
    const {
      step,
    } = this.state;

    const nearestCountStep: number = Math.round(percentMove / this.stepPercent);
    const nearStepPercent: number = nearestCountStep * this.stepPercent;
    const halfStep: number = this.stepPercent / 2;
    const halfMove = Number((percentMove % (step / this.findPercent())).toFixed(2));

    return {
      nearStepPercent,
      halfStep,
      halfMove,
    };
  }

  private setNewValue(data: ModelSetVal) {
    const {
      halfMove,
      halfStep,
      nearStepPercent,
      thumb,
    } = data;

    if (halfMove < halfStep) {
      const val = this.mapSteps.get(nearStepPercent);
      const percent = nearStepPercent;

      this.handleMove({
        val,
        thumb,
        percent,
      });
    }

    if (halfMove >= halfStep) {
      const val = nearStepPercent + this.stepPercent <= 100
        ? this.mapSteps.get(nearStepPercent) : this.mapSteps.get(100);
      const percent = nearStepPercent;

      this.handleMove({
        val,
        thumb,
        percent,
      });
    }
  }

  private handleMove(values: HandleMoveModel) {
    const {
      val,
      thumb,
      percent,
    } = values;

    if (thumb === 'valueFrom') {
      this.handleMoveFrom({
        val,
        thumb,
        percent,
      });
    }

    if (thumb === 'valueTo') {
      this.handleMoveTo({
        val,
        thumb,
        percent,
      });
    }
  }

  private handleMoveFrom(values: HandleMoveModelFrom) {
    const {
      val,
      thumb,
      percent,
    } = values;

    const {
      valueTo,
      thumbPercentTo,
    } = this.state;

    if (this.isValTheSamePos({
      val,
      valueAnotherThumb: valueTo,
      thumbPercent: thumbPercentTo,
      thumb,
      idVal: 'valueFrom',
    }) && valueTo !== undefined && thumbPercentTo !== undefined) {
      this.updateMoved(valueTo, thumbPercentTo, thumb);
    } else if (val !== undefined) this.updateMoved(val, percent, thumb);
  }

  private handleMoveTo(values: HandleMoveModelTo) {
    const {
      val,
      thumb,
      percent,
    } = values;

    const {
      valueFrom,
      thumbPercentFrom,
    } = this.state;

    if (this.isValTheSamePos({
      val,
      valueAnotherThumb: valueFrom,
      thumbPercent: thumbPercentFrom,
      thumb,
      idVal: 'valueTo',
    }) && valueFrom !== undefined) {
      this.updateMoved(valueFrom, thumbPercentFrom, thumb);
    } else if (val !== undefined) {
      this.updateMoved(val, percent, thumb);
    }
  }

  private isValTheSamePos(values: isValTheSamePos) {
    const {
      val,
      valueAnotherThumb,
      thumbPercent,
      thumb,
      idVal,
    } = values;

    const { isRange } = this.state;

    const checkVal = isRange && thumbPercent !== undefined && thumb === idVal;
    let compareVal = false;
    if (val !== undefined && valueAnotherThumb !== undefined) {
      compareVal = idVal === 'valueFrom' ? val > valueAnotherThumb : val < valueAnotherThumb;
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
      mapSteps.set((countStep * step) / percent, i);
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
