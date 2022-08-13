import { SliderInterface } from "../../../Interfaces";
import Scale from "../Scale/Scale";
import Thumb from "../Thumb/Thumb";

const testState = {
  min: 0,
  max: 100,
  value: 0,
  step: 1,
  thumbPercent: 0,
}

class Slider {
  root: Element;
  slider!: HTMLDivElement;
  thumb!: Thumb;
  scale!: Scale;
  protected readonly testState: SliderInterface;


  constructor(root: Element) {
    this.root = root;
    // this.state = state;
    this.testState = testState;
    this.init();
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
    const scaleElement = this.scale.getScale()
    this.thumb = new Thumb(scaleElement, this.testState);
    this.addElements(scaleElement);
  }

  private addElements(scaleElement: HTMLDivElement) {
    this.slider.append(scaleElement);
  }
}

export default Slider;