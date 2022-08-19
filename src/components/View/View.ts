import Observer from '../../Observer/Observer';
import Slider from './subViews/Slider/Slider';
import './view.scss'
import { SLIDER_EVENTS } from '../Presenter/events'
import { SliderInterface } from '../Interfaces';

class View extends Observer {
  root: Element;
  slider: Slider;
  isRange: boolean;

  constructor(root: Element, protected readonly state: SliderInterface) {
    const { isRange } = state;
    super();
    this.root = root;
    this.isRange = isRange;
    this.slider = new Slider(root, state);
    this.setSliderState(state);
    this.addSubscribeSlider();
  }

  public updateSlider(data: SliderInterface) {
    this.slider.setState(data);
  }

  private setSliderState(data: SliderInterface) {
    this.slider.setState(data);
  }


  public update(data: SliderInterface, event: string) {
    if (event === SLIDER_EVENTS.DATA_COLLECTED) {
      this.emit(SLIDER_EVENTS.VALUE_CHANGED, data);
    }
    if (event === SLIDER_EVENTS.VALUE_CHANGED) {
      this.updateSlider(data);
    }
  }

  private addSubscribeSlider() {
    this.slider.thumbFrom.addSubscriber(SLIDER_EVENTS.VALUE_START_CHANGE, this.slider);
    if (this.isRange && this.slider.thumbTo) this.slider.thumbTo.addSubscriber(SLIDER_EVENTS.VALUE_START_CHANGE, this.slider);
    this.slider.addSubscriber(SLIDER_EVENTS.DATA_COLLECTED, this);
  }
}

export default View;