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

  public updateState(movedTo: number) {
    const { step, value, thumbPercent } = this.state;
    let half: number;
    let prevVal = value;
    let nextVal = value + step;
    let newValue = value
    let currentPercent = thumbPercent;

    if (movedTo >= currentPercent) {
      prevVal = newValue;
      nextVal = newValue + step;
    }

    if (movedTo < currentPercent) {
      prevVal = newValue - step;
      nextVal = newValue;
    }

    half = this.findHalf(this.mapSteps.get(prevVal) as number, this.mapSteps.get(nextVal) as number)

    if (movedTo >= half) {
      const resultObj = {
        value: nextVal,
        thumbPercent: this.mapSteps.get(nextVal),
      }
      this.setState(resultObj);
      return
    } else {
      const resultObj = {
        value: prevVal,
        thumbPercent: this.mapSteps.get(prevVal),
      }
      this.setState(resultObj);
      return
    }
  }

  private findHalf(min: number, max: number): number {
    const result = (min + (max - min) / 2);
    return result;
  }

  private createSteps(): StepsMap {
    const { min, max, step } = this.state;
    const mapSteps: StepsMap = new Map();
    const range = max - min;
    const percent = range / 100;
    for (let i = 0; i <= range; i += step) {
      mapSteps.set(i, i / percent);
    }
    return mapSteps;
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

