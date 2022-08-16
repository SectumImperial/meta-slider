import Observer from '../../Observer/Observer';
import Slider from './subViews/Slider/Slider';
import Thumb from './subViews/Thumb/Thumb';
import './view.scss'
import { SLIDER_EVENTS } from '../Presenter/events'
import { SliderInterface } from '../Interfaces';

class View extends Observer {
  root: Element;
  slider: Slider;

  constructor(root: Element) {
    super();
    this.root = root;
    this.slider = new Slider(root);
    this.addSubscribeSlider();
  }

  public updateSlider(data: SliderInterface) {
    this.slider.getNewState(data);
  }

  public setSliderState(data: SliderInterface) {
    this.slider.setState(data);
  }


  public update(data: SliderInterface, event: string) {
    if (event === SLIDER_EVENTS.DATA_COLLECTED) {
      const sliderData = data;
      this.emit(SLIDER_EVENTS.VALUE_CHANGED, sliderData);
    }
    if (event === SLIDER_EVENTS.VALUE_CHANGED) {
      this.updateSlider(data);
    }
  }

  public getThumb(): Thumb {
    return this.slider.thumb;
  }

  private addSubscribeSlider() {
    this.getThumb().addSubscriber(SLIDER_EVENTS.VALUE_START_CHANGE, this.slider);
    this.slider.addSubscriber(SLIDER_EVENTS.DATA_COLLECTED, this);
  }
}

export default View;