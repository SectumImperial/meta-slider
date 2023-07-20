import Observer from '@src/Observer/Observer';
import { MODEL_EVENTS } from '@src/Observer/events';
import {
  ModelInputState,
  ModelOptions,
  ModelValue,
  SliderOptions,
  StepsMap,
  ValidSliderData,
} from '@src/components/Interfaces';
import Model from './Model';
import Validator from './Validator';

class ModelFacade extends Observer {
  private model: Model;
  private validator: Validator;

  constructor(state: ModelInputState) {
    super();
    this.validator = new Validator(state);
    const validState = this.validator.validateData(state);
    this.model = new Model(validState);
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

  public getValue(value: ModelValue) {
    return this.model.getState()[value];
  }

  public update(data: ValidSliderData): void {
    const isScaleMove = data.percent === undefined;

    if (isScaleMove) {
      const movedTo = this.validator.performMoveToPercent(data);
      const thumbId = data.thumbId ?? this.validator.validateThumbId(movedTo);

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
    } else {
      const { percent, value } = data;
      const performedData = this.validator.validatePercent(
        percent!,
        value!,
        this.model.getState()
      );
      this.model.setState(performedData);
      this.emit(MODEL_EVENTS.VALUE_CHANGED, this.model.getState());
    }
  }

  public setValue(param: ModelValue, value: number | boolean): void {
    const oldState = this.model.getState();
    const newState: ModelOptions = { ...oldState, [param]: value };
    const validState = this.validator.validateData(newState);
    this.model.setState(validState);
    this.emit(MODEL_EVENTS.VALUE_CHANGED, this.model.getState());
  }

  public validGapMarks(): StepsMap {
    const { scalePercentGap, min, max, step } = this.model.getState();
    const gap = scalePercentGap ?? 20;
    const sliderMarks = this.validator.validateMarks({ min, max, step, gap });
    return sliderMarks;
  }
}

export default ModelFacade;
