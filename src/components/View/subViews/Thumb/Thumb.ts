import SliderComponents from '../SliderComponents/SliderComponents';
import { StartPointType, ThumbID } from '../../../Interfaces';

interface thumbArgs {
  root: HTMLElement,
  thumbPercent: number,
  id: ThumbID,
  isVertical: boolean,
}

class Thumb extends SliderComponents {
  moved!: number;

  thumbPercent: number;

  thumbElement!: HTMLDivElement;

  thumbId: ThumbID;

  isVertical: boolean;

  constructor(values: thumbArgs) {
    const {
      root,
      thumbPercent = 0,
      id = 'valueFrom',
      isVertical = false,
    } = values;

    super(root);
    this.thumbPercent = thumbPercent;
    this.thumbId = id;
    this.isVertical = isVertical;
    this.initThumb();
  }

  public setPosition(thumbPercent: number): void {
    const startPoint: StartPointType = this.isVertical ? 'top' : 'left';
    this.thumbPercent = thumbPercent;
    this.checkZInd();
    this.thumbElement.style[startPoint] = `${this.thumbPercent}%`;
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
    if (!this.isVertical) this.moved = e.clientX - this.thumbElement.getBoundingClientRect().left;
    if (this.isVertical) this.moved = e.clientY - this.thumbElement.getBoundingClientRect().top;

    this.checkZInd();
    super.performMouseMove(this.moved, this.thumbId, this.isVertical);
  }
}

export default Thumb;
