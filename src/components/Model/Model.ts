import { ModelInterface, modelVal, ThumbID, ThumbValPercent, HandleMoveModel, HandleMoveModelFrom, HandleMoveModelTo } from "../Interfaces";
import initialState from "../../state";
// import Observer from "../../Observer/Observer";

type StepsMap = Map<number, number>;

class Model {

  private state: ModelInterface;
  mapSteps!: StepsMap;
  stepPercent!: number;

  constructor(state: ModelInterface = initialState) {
    this.state = state;
    this.init();

  }

  private init() {
    this.mapSteps = this.createSteps();
    this.stepPercent = this.state.step / this.findPercent()
  }

  public setState(state: object) {
    const oldState = this.state;
    this.state = { ...oldState, ...state };
  }

  public getState(): ModelInterface {
    return this.state;
  }

  public updateState(movedTo: number, thumb: ThumbID): void {
    const { step, valueTo, valueFrom, isRange, thumbPercentTo, thumbPercentFrom } = this.state;

    const nearestCountStep: number = Math.round(movedTo / this.stepPercent);
    const nearStepPercent: number = nearestCountStep * this.stepPercent;
    const halfStep: number = this.stepPercent / 2;
    const halfMove: number = Number((movedTo % (step / this.findPercent())).toFixed(2));

    if (halfMove < halfStep) {
      const val = this.mapSteps.get(nearStepPercent);
      const percent = nearStepPercent;

      this.handleMove({
        isRange,
        val,
        valueFrom,
        valueTo,
        thumb,
        percent,
        thumbPercentTo,
        thumbPercentFrom,
      })
    }

    if (halfMove >= halfStep) {
      const val = nearStepPercent + this.stepPercent <= 100 ? this.mapSteps.get(nearStepPercent) : this.mapSteps.get(100);
      const percent = nearStepPercent;

      this.handleMove({
        isRange,
        val,
        valueFrom,
        valueTo,
        thumb,
        percent,
        thumbPercentTo,
        thumbPercentFrom,
      })
    }

    return
  }

  private handleMove(values: HandleMoveModel) {
    const {
      isRange,
      val,
      valueFrom,
      valueTo,
      thumb,
      percent,
      thumbPercentTo,
      thumbPercentFrom
    } = values;

    if (thumb === 'valueFrom') {
      this.handleMoveFrom({
        isRange,
        val,
        valueTo,
        thumb,
        percent,
        thumbPercentTo,
      })
    }

    if (thumb === 'valueTo') {
      this.handleMoveTo({
        isRange,
        val,
        valueFrom,
        thumb,
        percent,
        thumbPercentFrom,
      })
    }
  }

  private handleMoveFrom(values: HandleMoveModelFrom) {
    const {
      isRange,
      val,
      valueTo,
      thumb,
      percent,
      thumbPercentTo
    } = values

    if (isRange && val && valueTo && thumb === 'valueFrom' && val > valueTo && thumbPercentTo) {
      this.updateMoved(valueTo, thumbPercentTo, thumb)
    } else {
      if (val !== undefined) this.updateMoved(val, percent, thumb);
    }
  }

  private handleMoveTo(values: HandleMoveModelTo) {
    const {
      isRange,
      val,
      valueFrom,
      thumb,
      percent,
      thumbPercentFrom
    } = values

    if (isRange && val !== undefined && valueFrom && thumbPercentFrom && thumb === 'valueTo' && val < valueFrom) {
      this.updateMoved(valueFrom, thumbPercentFrom, thumb)
    } else {
      if (val !== undefined) this.updateMoved(val, percent, thumb);
    }
  }


  private updateMoved(val: number, percent: number, thumb: ThumbID) {
    if (isNaN(val) || percent === undefined) throw new Error('Somethnig wrong in setting new values');
    const thumbPecent = ThumbValPercent[thumb]

    this.setState({
      [thumb]: val,
      [thumbPecent]: percent,
    });
  }

  private createSteps(): StepsMap {
    const { step, max, min } = this.state;
    const mapSteps: StepsMap = new Map();
    const range = this.findRange();
    const percent = this.findPercent();

    let countStep = 0;
    for (let i = min; i <= max; i += step) {
      mapSteps.set((countStep * step) / percent, i);
      countStep++
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


  public getValue(val: modelVal): number | undefined {
    return this.state[`${val}`];
  }

  public increment(): void {
    if (this.state.valueFrom !== this.state.max) this.state.valueFrom += this.state.step;
  }

  public decrement(): void {
    if (this.state.valueFrom !== this.state.min) this.state.valueFrom -= this.state.step;
  }

  public getPercentVal(): number {
    const { valueFrom, min, max } = this.state;
    const range: number = max - min;
    const percent: number = Number(((valueFrom / range) * 100).toFixed(3));
    return percent;
  }

}

export default Model;

