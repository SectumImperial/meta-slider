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
    const { min, step, value } = this.state;
    let half: number;
    let newValue = value
    let minVal = min;
    let maxVal = minVal + step;

    for (let value of this.mapSteps.keys()) {

      if (movedTo > minVal && movedTo < maxVal) {

        half = this.findHalf(minVal, maxVal);

        minVal = maxVal;
        maxVal = value;

        if (movedTo <= half) newValue = minVal;
        if (movedTo > half) newValue = maxVal;


        const resultObj = {
          value: newValue,
          thumbPercent: this.mapSteps.get(newValue),
        }
        this.setState(resultObj);
        return
      }

      minVal = maxVal;
      maxVal = value;
    }
  }

  private findHalf(min: number, max: number): number {
    const result = (min + (max - min) / 2);
    console.log(min, max);
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

