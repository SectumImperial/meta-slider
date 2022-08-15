import { ModelInterface, modelVal } from "../Interfaces";
import initialState from "../../state";
// import Observer from "../../Observer/Observer";

class Model {

  private state: ModelInterface = initialState;

  constructor(state: ModelInterface) {
    this.setState(state);
  }

  public setState(state: ModelInterface) {
    this.state = { ...state };
  }

  public getState(): ModelInterface {
    return this.state;
  }

  // public update(data: object) {
  //   const state = this.state;
  //   const newState = { ...state, ...data };
  //   this.setState(newState);
  //   console.log(this.state);
  // }

  public getValue(val: modelVal): number {
    return this.state[`${val}`];
  }

  public increment(): void {
    if (this.state.value !== this.state.max) this.state.value += 1;
  }

  public decrement(): void {
    if (this.state.value !== this.state.min) this.state.value -= 1;
  }

  public getPercentVal(): number {
    const { value, min, max } = this.state;
    const range: number = max - min;
    const percent: number = Number(((value / range) * 100).toFixed(3));
    return percent;
  }

}

export default Model;

