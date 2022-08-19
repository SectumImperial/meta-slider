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
    this.thumbElement.style.left = thumbPercent + '%';
  }

  public getThumb(): HTMLDivElement {
    return this.thumbElement;
  }

  public getThumbId(): ThumbID {
    return this.thumbId;
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
    super.performMouseMove(this.shiftX, this.thumbId);
  }
}

export default Thumb;