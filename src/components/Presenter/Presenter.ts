import { ModelInterface } from "../Interfaces";
import View from "../View/View";
import Observer from "../../Observer/Observer";
import { MODEL_EVENTS, SLIDER_EVENTS } from './events'
import ModelFacade from "../Model/ModelFacade";


// const testState = {
//   min: 0,
//   max: 100,
//   value: 0,
//   step: 1,
//   thumbPercent: 0,
// }

class Presenter extends Observer {
  modelFacade: ModelFacade;
  view: View;
  root: HTMLElement;

  constructor(root: HTMLElement, state: ModelInterface) {
    super()
    this.root = root;
    this.view = new View(root);
    this.modelFacade = new ModelFacade(state);
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