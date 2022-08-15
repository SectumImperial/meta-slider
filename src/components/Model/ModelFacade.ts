import Model from "./Model";
import Validator from "./Validator";
import { ModelInterface, ValidateSliderData } from "../Interfaces";
import Observer from "../../Observer/Observer";
import { MODEL_EVENTS } from "../Presenter/events";

class ModelFacade extends Observer {
  private state: ModelInterface;
  private model: Model;
  private validator: Validator;
  private validState: ModelInterface;

  constructor(state: ModelInterface) {
    super();
    this.state = state;
    this.validator = new Validator(this.state);
    this.validState = this.validator.validateData()
    this.model = new Model(this.validState);
  }

  public setState(state: ModelInterface) {
    this.validator.setData(state);
    const validState = this.validator.validateData()
    this.model.setState(validState);
  }

  public getState(): ModelInterface {
    return this.model.getState();
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
      this.model.updateState(movedTo);
      const newState = this.model.getState()
      this.emit(MODEL_EVENTS.VALUE_CHANGED, newState);
    }
  }
}

export default ModelFacade;

