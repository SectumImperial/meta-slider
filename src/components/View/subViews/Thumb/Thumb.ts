import SliderComponents from '../SliderComponents/SliderComponents';
import { ThumbArgs, ThumbID } from '../../../Interfaces';

class Thumb extends SliderComponents {
  moved!: number;

  thumbPercent: number;

  thumbElement!: HTMLDivElement;

  thumbId: ThumbID;

  constructor(values: ThumbArgs) {
    const {
      root,
      thumbPercent = 0,
      id = 'valueFrom',
      isVertical,
    } = values;

    super(root, isVertical);
    this.thumbPercent = thumbPercent;
    this.thumbId = id;
    this.initThumb();
  }

  private initThumb(): void {
    this.thumbElement = this.createElement('slider__thumb');
    this.thumbElement.id = this.thumbId;
    this.root.append(this.thumbElement);
    this.setPosition(this.thumbPercent);
    this.addListeners();
  }

  public setPosition(thumbPercent: number): void {
    this.thumbPercent = thumbPercent;
    this.checkZInd();
    this.thumbElement.style[this.startPoint] = `${this.thumbPercent}%`;
  }

  public getThumb(): HTMLDivElement {
    return this.thumbElement;
  }

  public getThumbId(): ThumbID {
    return this.thumbId;
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
    this.thumbElement.addEventListener(
      'touchstart',
      this.touchDown.bind(this),
      { passive: true },
    );
  }

  private touchDown(e: TouchEvent) {
    const sizeElement = this.thumbElement.getBoundingClientRect()[this.startPoint];
    this.moved = e.touches[0][this.direction] - sizeElement;
    super.performToucMove(this.moved, this.thumbId);
  }

  private mouseDown(e: MouseEvent): void {
    this.moved = e[this.direction] - this.thumbElement.getBoundingClientRect()[this.startPoint];
    this.checkZInd();
    super.performMouseMove(this.moved, this.thumbId);
  }
}

export default Thumb;
