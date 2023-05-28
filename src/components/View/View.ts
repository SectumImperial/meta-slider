import Observer from 'Src/Observer/Observer';
import { SLIDER_EVENTS } from 'Src/Observer/events';
import { SliderOptions } from 'Src/components/Interfaces';
import Slider from './subViews/Slider/Slider';

class View extends Observer {
  root?: Element;

  slider?: Slider;

  protected isRange?: boolean;

  constructor(root: Element, protected readonly state: SliderOptions) {
    super();
    this.init(root, state);
  }

  public updateSlider(data: SliderOptions): void {
    if (this.slider === undefined) return;
    this.slider.setState(data);
  }

  public update(data: SliderOptions, event: string): void {
    if (event === SLIDER_EVENTS.DATA_COLLECTED) {
      this.emit(SLIDER_EVENTS.VALUE_CHANGED, data);
    }
    if (event === SLIDER_EVENTS.VALUE_CHANGED) {
      this.updateSlider(data);
    }
  }

  private init(root: Element, state: SliderOptions): void {
    const { isRange } = state;
    this.root = root;
    this.isRange = isRange;
    this.slider = new Slider(root, state);
    this.addSubscribeSlider();
  }

  private addSubscribeSlider(): void {
    if (this.slider === undefined) return;
    if (this.slider.classElements.thumbFrom !== undefined) {
      this.slider.classElements.thumbFrom.addSubscriber(
        SLIDER_EVENTS.VALUE_START_CHANGE,
        this.slider,
      );
      this.slider.classElements.thumbFrom.addSubscriber(SLIDER_EVENTS.KEY_DOWN, this.slider);
    }

    if (this.isRange && this.slider.classElements.thumbTo) {
      this.slider.classElements.thumbTo.addSubscriber(
        SLIDER_EVENTS.VALUE_START_CHANGE,
        this.slider,
      );
      this.slider.classElements.thumbTo.addSubscriber(SLIDER_EVENTS.KEY_DOWN, this.slider);
    }

    if (this.slider.classElements.scale !== undefined) {
      this.slider.classElements.scale.addSubscriber(SLIDER_EVENTS.SCALE_CLICKED, this.slider);
      if (this.slider.booleanVariables.isScaleMarks
        && this.slider.classElements.scaleMarks !== undefined) {
        this.slider.classElements.scaleMarks.addSubscriber(SLIDER_EVENTS.MARK_CLICKED, this.slider);
      }
    }
    this.slider.addSubscriber(SLIDER_EVENTS.SCALE_CLICKED, this);
    this.slider.addSubscriber(SLIDER_EVENTS.DATA_COLLECTED, this);
  }
}

export default View;
