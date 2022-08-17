import SliderComponents from "../SliderComponents/SliderComponents";

class Thumb extends SliderComponents {
  shiftX!: number;
  thumbPercent: number;
  thumbElement!: HTMLDivElement;

  constructor(root: HTMLElement, thumbPercent: number = 0) {
    super(root);
    this.thumbPercent = thumbPercent;
    this.initThumb();
  }

  public setPosition(thumbPercent: number): void {
    this.thumbElement.style.left = thumbPercent + '%';
  }

  public getThumb(): HTMLDivElement {
    return this.thumbElement;
  }

  private initThumb(): void {
    this.thumbElement = this.createElement('slider__thumb');
    this.root.append(this.thumbElement);
    this.setPosition(this.thumbPercent);
    this.addListeners();
  }

  private addListeners() {
    this.thumbElement.addEventListener('mousedown', this.mouseDown.bind(this));
  }



  private mouseDown(e: MouseEvent): void {
    this.shiftX = e.clientX - this.thumbElement.getBoundingClientRect().left;
    super.performMouseMove(this.shiftX);
  }
}

export default Thumb;