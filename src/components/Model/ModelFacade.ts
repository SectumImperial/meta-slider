import Model from "./Model";
import Validator from "./Validator";
import { ModelInterface } from "../Interfaces";

class ModelFacade {
  private state: ModelInterface;
  private model: Model;
  private validator: Validator;
  private validState: ModelInterface;

  constructor(state: ModelInterface) {
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
}

export default ModelFacade;

