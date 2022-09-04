import Observer from '../../Observer/Observer';
import Slider from './subViews/Slider/Slider';
import { SLIDER_EVENTS } from '../../Observer/events';
import { SliderInterface } from '../Interfaces';

class View extends Observer {
  root!: Element;

  slider!: Slider;

  protected isRange!: boolean;

  constructor(root: Element, protected readonly state: SliderInterface) {
    super();
    this.initView(root, state);
  }

  private initView(root: Element, state: SliderInterface): void {
    const { isRange } = state;
    this.root = root;
    this.isRange = isRange;
    this.slider = new Slider(root, state);
    this.addSubscribeSlider();
  }

  public updateSlider(data: SliderInterface): void {
    this.slider.setState(data);
  }

  public update(data: SliderInterface, event: string): void {
    if (event === SLIDER_EVENTS.DATA_COLLECTED) {
      this.emit(SLIDER_EVENTS.VALUE_CHANGED, data);
    }
    if (event === SLIDER_EVENTS.VALUE_CHANGED) {
      this.updateSlider(data);
    }
  }

  private addSubscribeSlider(): void {
    this.slider.thumbFrom.addSubscriber(SLIDER_EVENTS.VALUE_START_CHANGE, this.slider);
    this.slider.thumbFrom.addSubscriber(SLIDER_EVENTS.KEY_DOWN, this.slider);
    if (this.isRange && this.slider.thumbTo) {
      this.slider.thumbTo.addSubscriber(SLIDER_EVENTS.VALUE_START_CHANGE, this.slider);
      this.slider.thumbTo.addSubscriber(SLIDER_EVENTS.KEY_DOWN, this.slider);
    }
    this.slider.scale.addSubscriber(SLIDER_EVENTS.SCALE_CLICKED, this.slider);
    this.slider.addSubscriber(SLIDER_EVENTS.SCALE_CLICKED, this);
    this.slider.addSubscriber(SLIDER_EVENTS.DATA_COLLECTED, this);
  }
}

export default View;
