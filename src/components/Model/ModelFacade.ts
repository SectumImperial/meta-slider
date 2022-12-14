import Model from './Model';
import Validator from './Validator';
import {
  ModelInputState,
  ModelInterface,
  ModelVal,
  SliderInterface,
  StepsMap,
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

  public setState(state: ModelInputState): void {
    const validState = this.validator.validateData(state);
    this.model.setState(validState);
  }

  public getState(): SliderInterface {
    if (this.model.getState().scaleMarks) {
      const sliderMarks = this.validGapMarks();
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

  public getValue(value: ModelVal) {
    return this.model.getState()[`${value}`];
  }

  public update(data: ValidateSliderData, event: string): void {
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
        this.emit(MODEL_EVENTS.VALUE_CHANGED, { ...validState, scaleMap: this.validGapMarks() });
      } else {
        this.emit(MODEL_EVENTS.VALUE_CHANGED, validState);
      }
    }
  }

  public setValue(param: ModelVal, value: number | boolean): void {
    const oldState = this.model.getState();
    const newState = { ...oldState, [param]: value };
    const validState = this.validator.validateData(newState);
    this.model.setState(validState);
    this.emit(MODEL_EVENTS.VALUE_CHANGED, this.model.getState());
  }

  private validGapMarks(): StepsMap {
    const gap = this.model.getState().scalePercentGap || 20;
    const { min, max, step } = this.model.getState();
    const sliderMarks = this.validator.validateMarks({
      min, max, step, gap,
    });

    return sliderMarks;
  }
}

export default ModelFacade;
