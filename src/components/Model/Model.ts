import { ModelInterface, modelVal } from "../Interfaces";
import initialState from "../../state";
// import Observer from "../../Observer/Observer";

type StepsMap = Map<number, number>;

class Model {

  private state: ModelInterface = initialState;
  mapSteps: StepsMap;

  constructor(state: ModelInterface) {
    this.state = state;
    this.mapSteps = this.createSteps();
  }

  public setState(state: object) {
    const oldState = this.state;
    this.state = { ...oldState, ...state };
  }

  public getState(): ModelInterface {
    return this.state;
  }

  public updateState(movedTo: number): void {
    const { step, max } = this.state;
    const nearestCountStep: number = Math.floor(movedTo / (step / this.findPercent()))
    const nearStep: number = nearestCountStep * step;
    const halfStep: number = step / 2;
    const halfMove: number = Number((movedTo % (step / this.findPercent())).toFixed(2));


    if (halfMove < halfStep) {
      const val = nearStep;
      const percent = this.mapSteps.get(val);
      if (percent !== undefined) this.updateMoved(val, percent);
      return
    }

    if (halfMove >= halfStep) {
      const val = nearStep + step <= max ? nearStep + step : max;
      const percent = this.mapSteps.get(val);
      if (percent !== undefined) this.updateMoved(val, percent);
      return
    }
    return
  }


  private updateMoved(val: number, percent: number) {
    if (isNaN(val) || percent === undefined) throw new Error('Somethnig wrong in setting new values');

    this.setState({
      value: val,
      thumbPercent: percent,
    });
  }

  private createSteps(): StepsMap {
    const { step, max } = this.state;
    const mapSteps: StepsMap = new Map();
    const range = this.findRange();
    const percent = this.findPercent();
    for (let i = 0; i <= range; i += step) {
      mapSteps.set(i, i / percent);
    }
    if (range % step !== 0) {
      mapSteps.set(max, 100);
    }
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


  public getValue(val: modelVal): number {
    return this.state[`${val}`];
  }

  public increment(): void {
    if (this.state.value !== this.state.max) this.state.value += this.state.step;
  }

  public decrement(): void {
    if (this.state.value !== this.state.min) this.state.value -= this.state.step;
  }

  public getPercentVal(): number {
    const { value, min, max } = this.state;
    const range: number = max - min;
    const percent: number = Number(((value / range) * 100).toFixed(3));
    return percent;
  }

}

export default Model;

