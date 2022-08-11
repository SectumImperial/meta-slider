import Thumb from "../Thumb/Thumb";
import Scale from "../Scale/Scale";

class Slider {
  root: Element;
  slider!: HTMLDivElement;
  thumb!: Thumb;
  scale!: Scale;
  scaleElement!: HTMLDivElement;

  constructor(root: Element) {
    this.root = root;
    this.init();
  }

  private init(): void {
    this.slider = this.createSlider();
    this.createElements();
    this.addElements();
    this.addSlider();
  }

  private createElements(): void {
    this.scale = new Scale(this.slider);
    this.scaleElement = this.scale.getScale() as HTMLDivElement;
    this.thumb = new Thumb(this.scaleElement, 50);
  }

  private addElements(): void {
    // this.scale.append(this.thumb);
  }

  private addSlider(): void {
    this.root.append(this.slider);
  }

  private createSlider(): HTMLDivElement {
    const sliderWrapper = document.createElement('div');
    sliderWrapper.className = 'slider';
    return sliderWrapper;
  }
}

export default Slider;