import Slider from './subViews/Slider/Slider';
import './view.scss'

class View {
  root: Element;
  slider: Slider;

  constructor(root: Element) {
    this.root = root;
    this.slider = new Slider(root);
  }
}

export default View;