import Observer from 'Src/Observer/Observer';
import { MODEL_EVENTS } from 'Src/Observer/events';
import {
  ModelInputState,
  ModelOptions,
  ModelValue,
  SliderOptions,
  StepsMap,
  ValidSliderData,
} from 'Src/components/Interfaces';
import Model from './Model';
import Validator from './Validator';

class ModelFacade extends Observer {
  private model: Model;

  private validator: Validator;

  private validState: ModelOptions;

  private prevMove?: number;

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

  public getState(): SliderOptions {
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

  public getValue(value: ModelValue) {
    return this.model.getState()[`${value}`];
  }

  public update(data: ValidSliderData): void {
    const typeData: 'scaleMove' | 'markMove' = data.percent === undefined ? 'scaleMove' : 'markMove';

    if (typeData === 'scaleMove') {
      const movedTo = this.validator.performMoveToPercent(data);
      let { thumbId } = data;
      if (thumbId === undefined) thumbId = this.validator.validateThumbId(movedTo);
      if (movedTo === this.prevMove) return;

      this.prevMove = movedTo;
      this.model.updateStateMove(movedTo, thumbId);
      const newState = this.model.getState();
      const validState = this.validator.validateData(newState);
      this.model.setState(validState);

      if (newState.scaleMarks) {
        this.emit(MODEL_EVENTS.VALUE_CHANGED, {
          ...this.model.getState(),
          scaleMap: this.validGapMarks(),
        });
      } else {
        this.emit(MODEL_EVENTS.VALUE_CHANGED, this.model.getState());
      }
    }

    if (data.percent !== undefined && data.value !== undefined && typeData === 'markMove') {
      const { percent, value } = data;
      const oldState = this.model.getState();
      const performedData = this.validator.validatePercent(percent, value, oldState);
      this.model.setState(performedData);
      this.emit(MODEL_EVENTS.VALUE_CHANGED, this.model.getState());
    }
  }

  public setValue(param: ModelValue, value: number | boolean): void {
    const oldState = this.model.getState();
    const newState = { ...oldState, [param]: value };
    const validState = this.validator.validateData(newState);
    this.model.setState(validState);
    this.emit(MODEL_EVENTS.VALUE_CHANGED, this.model.getState());
  }

  public validGapMarks(): StepsMap {
    const gap = this.model.getState().scalePercentGap || 20;
    const { min, max, step } = this.model.getState();
    const sliderMarks = this.validator.validateMarks({
      min, max, step, gap,
    });

    return sliderMarks;
  }
}

export default ModelFacade;
