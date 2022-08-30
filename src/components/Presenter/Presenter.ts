import { ModelInputState } from '../Interfaces';
import View from '../View/View';
import Observer from '../../Observer/Observer';
import { MODEL_EVENTS, SLIDER_EVENTS } from '../../Observer/events';
import ModelFacade from '../Model/ModelFacade';

class Presenter extends Observer {
  modelFacade: ModelFacade;

  view: View;

  root: HTMLElement;

  constructor(root: HTMLElement, state: ModelInputState) {
    super();
    this.root = root;

    this.modelFacade = new ModelFacade(state);
    this.view = new View(root, this.modelFacade.getState());
    this.subscribeModel();
    this.subscribeSlider();
  }

  private subscribeSlider(): void {
    this.view.addSubscriber(SLIDER_EVENTS.VALUE_CHANGED, this.modelFacade);
  }

  private subscribeModel(): void {
    this.modelFacade.addSubscriber(MODEL_EVENTS.VALUE_CHANGED, this.view);
  }
}

export default Presenter;
