import { ModelInterface } from "../Interfaces";
import View from "../View/View";
import Observer from "../../Observer/Observer";
import { MODEL_EVENTS, SLIDER_EVENTS } from './events'
import ModelFacade from "../Model/ModelFacade";


class Presenter extends Observer {
  modelFacade: ModelFacade;
  view: View;
  root: HTMLElement;

  constructor(root: HTMLElement, state: ModelInterface) {
    super()
    this.root = root;

    this.modelFacade = new ModelFacade(state);
    this.view = new View(root, this.modelFacade.getState());
    this.subscribeModel();
    this.subscribeSlider();
  }

  private subscribeSlider() {
    this.view.addSubscriber(SLIDER_EVENTS.VALUE_CHANGED, this.modelFacade);
  }

  private subscribeModel() {
    this.modelFacade.addSubscriber(MODEL_EVENTS.VALUE_CHANGED, this.view);
  }
}

export default Presenter;