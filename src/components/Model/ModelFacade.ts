import Model from './Model';
import Validator from './Validator';
import {
  ModelInputState,
  ModelInterface,
  ModelVal,
  SliderInterface,
  ThumbID,
  ValidateSliderData,
} from '../Interfaces';
import Observer from '../../Observer/Observer';
import { MODEL_EVENTS } from '../../Observer/events';

class ModelFacade extends Observer {
  private model: Model;

  private validator: Validator;

  private validState: ModelInterface;

  private prevMove!: number;

  constructor(state: ModelInputState) {
    super();
    this.validator = new Validator(state);
    this.validState = this.validator.validateData(state);
    this.model = new Model(this.validState);
  }

  public setState(state: ModelInterface) {
    const validState = this.validator.validateData(state);
    this.model.setState(validState);
  }

  public getState(): SliderInterface {
    if (this.model.getState().scaleMarks) {
      const gap = this.model.getState().scalePercentGap || 20;
      const sliderMarks = this.validator.validateMarks(this.model.mapSteps, gap);
      return {
        ...this.model.getState(),
        scaleMap: sliderMarks,
      };
    }
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
      const movedTo = this.validator.performMoveToPercent(data);
      let { thumbId } = data;
      if (thumbId === undefined) thumbId = this.validator.validateThumbId(movedTo);
      if (movedTo === this.prevMove) return;

      this.prevMove = movedTo;
      this.model.updateStateMove(movedTo, thumbId as ThumbID);
      const newState = this.model.getState();
      const validState = this.validator.validateData(newState);
      this.model.setState(validState);

      if (newState.scaleMarks) {
        this.emit(MODEL_EVENTS.VALUE_CHANGED, { ...validState, scaleMap: this.model.mapSteps });
      } else {
        this.emit(MODEL_EVENTS.VALUE_CHANGED, validState);
      }
    }
  }

  public setValue(param: ModelVal, value: number | boolean) {
    const oldState = this.model.getState();
    const newState = { ...oldState, [param]: value };
    const validState = this.validator.validateData(newState);
    this.model.setState(validState);
    this.emit(MODEL_EVENTS.VALUE_CHANGED, this.model.getState());
  }
}

export default ModelFacade;
