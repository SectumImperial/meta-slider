import Model from "../Model/Model";
import { ModelInterface } from "../Model/modelInterface";
import View from "../View/View";

class Presenter {
  model: Model;
  view: View;
  root: HTMLElement;

  constructor(root: HTMLElement, state: ModelInterface) {
    this.root = root;
    this.model = new Model(state);
    this.view = new View(root);
  }
}

export default Presenter;