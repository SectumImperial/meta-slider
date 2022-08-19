import { ModelInterface, modelVal } from "../Interfaces";
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

  public updateState(movedTo: number): void {
    const { step } = this.state;
    const nearestCountStep: number = Math.floor(movedTo / (step / this.findPercent()))
    const nearStepPercent: number = nearestCountStep * this.stepPercent;
    const halfStep: number = step / 2;
    const halfMove: number = Number((movedTo % (step / this.findPercent())).toFixed(2));

    if (halfMove < halfStep) {
      const val = this.mapSteps.get(nearStepPercent);
      const percent = nearStepPercent;
      if (val !== undefined) this.updateMoved(val, percent);
      return
    }

    if (halfMove >= halfStep) {
      const val = nearStepPercent + this.stepPercent <= 100 ? this.stepPercent + step : 100;
      const percent = nearStepPercent;
      if (percent !== undefined) this.updateMoved(val, percent);
      return
    }
    return
  }


  private updateMoved(val: number, percent: number) {
    if (isNaN(val) || percent === undefined) throw new Error('Somethnig wrong in setting new values');

    this.setState({
      valueFrom: val,
      thumbPercent: percent,
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

