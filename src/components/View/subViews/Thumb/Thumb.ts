import { SliderInterface } from "../../../Interfaces";
import SliderComponents from "../SliderComponents/SliderComponents";

class Thumb extends SliderComponents {
  shiftX!: number;
  thumbPercent!: number;
  thumbElement!: HTMLDivElement;

  constructor(root: HTMLElement, state: SliderInterface) {
    super(root, state);
    this.thumbPercent = state.thumbPercent;
    this.initThumb();
  }

  public setPosition(thumbPercent: number): void {
    this.thumbElement.style.left = thumbPercent + '%';
  }

  private initThumb(): void {
    this.thumbElement = this.createThumbElement();
    this.root.append(this.thumbElement);
    this.setPosition(this.thumbPercent);
    this.addListeners();
  }

  private addListeners() {
    this.thumbElement.addEventListener('mousedown', this.mouseDown.bind(this));
  }

  private createThumbElement(): HTMLDivElement {
    const element = document.createElement('div');
    element.className = 'slider__thumb'
    return element;
  }

  private mouseDown(e: MouseEvent): void {
    this.shiftX = e.clientX - this.thumbElement.getBoundingClientRect().left;
    super.performMouseMove(this.shiftX);
  }
}

export default Thumb;