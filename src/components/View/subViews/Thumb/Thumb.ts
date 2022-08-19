import SliderComponents from "../SliderComponents/SliderComponents";
import { ThumbID } from '../../../Interfaces'

class Thumb extends SliderComponents {
  shiftX!: number;
  thumbPercent: number;
  thumbElement!: HTMLDivElement;
  thumbId: ThumbID;

  constructor(root: HTMLElement, thumbPercent: number = 0, id: ThumbID = 'valueFrom') {
    super(root);
    this.thumbPercent = thumbPercent;
    this.thumbId = id
    this.initThumb();
  }

  public setPosition(thumbPercent: number): void {
    this.thumbPercent = thumbPercent;
    this.checkZInd();
    this.thumbElement.style.left = this.thumbPercent + '%';
  }

  public getThumb(): HTMLDivElement {
    return this.thumbElement;
  }

  public getThumbId(): ThumbID {
    return this.thumbId;
  }

  private initThumb(): void {
    this.thumbElement = this.createElement('slider__thumb');
    this.thumbElement.id = this.thumbId;
    this.root.append(this.thumbElement);
    this.setPosition(this.thumbPercent);
    this.addListeners();
  }

  private checkZInd(): void {

    if (this.thumbId === 'valueFrom' && this.thumbPercent === 100) {
      this.thumbElement.style.zIndex = '10';
    }

    if (this.thumbId === 'valueFrom' && this.thumbPercent < 100) {
      this.thumbElement.style.zIndex = '5';
    }

    if (this.thumbId === 'valueTo' && this.thumbPercent === 0) {
      this.thumbElement.style.zIndex = '10';
    }

    if (this.thumbId === 'valueTo' && this.thumbPercent > 0) {
      this.thumbElement.style.zIndex = '5';
    }
  }

  private addListeners() {
    this.thumbElement.addEventListener('mousedown', this.mouseDown.bind(this));
  }



  private mouseDown(e: MouseEvent): void {
    this.shiftX = e.clientX - this.thumbElement.getBoundingClientRect().left;
    this.checkZInd();
    super.performMouseMove(this.shiftX, this.thumbId);
  }
}

export default Thumb;