import { MODEL_EVENTS, SLIDER_EVENTS } from '@src/Observer/events';
import Observer from '@src/Observer/Observer';
import { ModelInputState, ModelValue, SliderOptions } from '@src/components/Interfaces';
import View from '../View/View';
import ModelFacade from '../Model/ModelFacade';

class Presenter extends Observer {
  private modelFacade: ModelFacade;

  private view: View;

  constructor(root: HTMLElement, state: ModelInputState) {
    super();
    this.modelFacade = new ModelFacade(state);
    this.view = new View(root, this.modelFacade.getState());
    this.subscribeModel();
    this.subscribeSlider();
  }

  public getState(): SliderOptions {
    return this.modelFacade.getState();
  }

  public setState(state: ModelInputState): void {
    this.modelFacade.setState(state);
  }

  public setValue(param: ModelValue, value: number | boolean): void {
    this.modelFacade.setValue(param, value);
  }

  public getValue(param: ModelValue): number | boolean | undefined {
    return this.modelFacade.getValue(param);
  }

  private subscribeSlider(): void {
    this.view.addSubscriber(SLIDER_EVENTS.VALUE_CHANGED, this.modelFacade);
  }

  private subscribeModel(): void {
    this.modelFacade.addSubscriber(MODEL_EVENTS.VALUE_CHANGED, this.view);
  }
}

export default Presenter;
