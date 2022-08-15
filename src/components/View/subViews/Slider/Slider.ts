import Observer from "../../../../Observer/Observer";
import initialState from "../../../../state";
import { SliderInterface } from "../../../Interfaces";
import { SLIDER_EVENTS } from "../../../Presenter/events";
import Scale from "../Scale/Scale";
import Thumb from "../Thumb/Thumb";

class Slider extends Observer {
  root: Element;
  slider!: HTMLDivElement;
  thumb!: Thumb;
  scale!: Scale;
  protected readonly testState: SliderInterface;
  scaleElement!: HTMLDivElement;


  constructor(root: Element) {
    super()
    this.root = root;
    // this.state = state;
    this.testState = initialState;
    this.init();
  }

  public update(data: object, event: string): void {
    if (event === SLIDER_EVENTS.VALUE_START_CHANGE) {
      const scaleWidth = this.scaleElement.getBoundingClientRect().width;
      const sliderData = { ...data, scaleWidth: scaleWidth };
      this.emit(SLIDER_EVENTS.DATA_COLLECTED, sliderData);
    }
  }

  private init(): void {
    this.slider = this.createSlider();
    this.createlements();

    this.addSlider();
  }

  private addSlider(): void {
    this.root.append(this.slider);
  }

  private createSlider(): HTMLDivElement {
    const sliderWrapper = document.createElement('div');
    sliderWrapper.className = 'slider';
    return sliderWrapper;
  }

  private createlements() {
    this.scale = new Scale(this.slider, this.testState);
    this.scaleElement = this.scale.getScale()
    this.thumb = new Thumb(this.scaleElement, this.testState);
    this.addElements(this.scaleElement);
  }


  private addElements(scaleElement: HTMLDivElement) {
    this.slider.append(scaleElement);
  }
}

export default Slider;