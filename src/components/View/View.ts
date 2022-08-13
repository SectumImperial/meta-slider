import Observer from '../../Observer/Observer';
import Slider from './subViews/Slider/Slider';
import SliderComponents from './subViews/SliderComponents/SliderComponents';
import './view.scss'


const testState = {
  min: 0,
  max: 100,
  value: 0,
  step: 1,
  thumbPercent: 0,
}

class View extends Observer {
  root: Element;
  slider: Slider;
  components: SliderComponents;

  constructor(root: Element) {
    super();
    this.root = root;
    this.slider = new Slider(root);
    this.components = new SliderComponents(this.root, testState);
    this.subscribeSlider();
  }

  private subscribeSlider() {
    this.components.addSubscriber('VALUE_CHANGE', this.components);
  }
}

export default View;