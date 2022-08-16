import Model from "./Model";
import Validator from "./Validator";
import { ModelInterface, SliderInterface, ValidateSliderData } from "../Interfaces";
import Observer from "../../Observer/Observer";
import { MODEL_EVENTS } from "../Presenter/events";

class ModelFacade extends Observer {
  private state: ModelInterface;
  private model: Model;
  private validator: Validator;
  private validState: ModelInterface;
  private prevMove: number;

  constructor(state: ModelInterface) {
    super();
    this.state = state;
    this.validator = new Validator(this.state);
    this.validState = this.validator.validateData()
    this.model = new Model(this.validState);
    this.prevMove = 0;
  }

  public setState(state: ModelInterface) {
    this.validator.setData(state);
    const validState = this.validator.validateData()
    this.model.setState(validState);
  }

  public getState(): SliderInterface {
    if (this.model.getState().scaleMarks) {
      return {
        ...this.model.getState(),
        scaleMap: this.model.mapSteps,
      }
    } else {
      return this.model.getState();
    }

  }

  public getModel(): Model {
    return this.model;
  }

  public getValidator(): Validator {
    return this.validator;
  }

  public update(data: ValidateSliderData, event: string) {
    if (event === MODEL_EVENTS.VALUE_CHANGED) {
      const movedTo = this.validator.performMoveToercent(data);
      if (movedTo === this.prevMove) return
      this.prevMove = movedTo;
      this.model.updateState(movedTo);
      const newState = this.model.getState()
      // console.log(newState);
      if (newState.scaleMarks) {
        this.emit(MODEL_EVENTS.VALUE_CHANGED, { ...newState, scaleMap: this.model.mapSteps });
      } else {
        this.emit(MODEL_EVENTS.VALUE_CHANGED, newState);
      }

    }
  }
}

export default ModelFacade;

