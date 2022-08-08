import { ModelInterface, modelVal } from "./modelInterface";
import initialState from "./state";

class Model {

  state: ModelInterface = initialState;

  constructor(state: ModelInterface) {
    this.setState(state);
  }

  setState(state: ModelInterface) {
    this.state = { ...state };
  }

  getState(): ModelInterface {
    return this.state;
  }

  getValue(val: modelVal): number {
    return this.state[`${val}`];
  }

  increment(): void {
    this.state.value += 1;
  }

  decrement(): void {
    this.state.value -= 1;
  }

  getPercentVal(): number {
    const { value, min, max } = this.state;
    const range: number = max - min;
    const percent: number = Number(((value / range) * 100).toFixed(3));
    return percent;
  }

}


export default Model;

