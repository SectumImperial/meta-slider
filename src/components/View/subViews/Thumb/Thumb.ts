import { ThumbArgs, ThumbID } from 'Src/components/Interfaces';
import SliderComponents from '../SliderComponents/SliderComponents';
import './thumb.scss';

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
    this.thumbElement = SliderComponents.createElement('plugin-slider__thumb');
    this.thumbElement.id = this.thumbId;
    this.thumbElement.tabIndex = 1;
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

  private addListeners(): void {
    this.thumbElement.addEventListener('mousedown', this.handleThumbMouseDown.bind(this));
    this.thumbElement.addEventListener('keydown', this.handleThumbKeyDown.bind(this));
    this.thumbElement.addEventListener(
      'touchstart',
      this.handleThumbTouch.bind(this),
    );
  }

  private handleThumbTouch(e: TouchEvent): void {
    e.preventDefault();
    const sizeElement = this.thumbElement.getBoundingClientRect()[this.startPoint];
    this.moved = e.touches[0][this.direction] - (sizeElement
      + (this.thumbElement.getBoundingClientRect()[this.size] / 2));
    super.performTouchMove(this.moved, this.thumbId);
  }

  private handleThumbMouseDown(e: MouseEvent): void {
    e.preventDefault();
    this.moved = e[this.direction] - (this.thumbElement.getBoundingClientRect()[this.startPoint]
      + (this.thumbElement.getBoundingClientRect()[this.size] / 2));
    this.checkZInd();
    super.performMouseMove(this.moved, this.thumbId);
  }

  private handleThumbKeyDown(e: KeyboardEvent): void {
    e.preventDefault();
    const { key } = e;
    if (key === 'ArrowLeft' || key === 'ArrowUp' || key === 'ArrowRight' || key === 'ArrowDown') e.preventDefault();
    if ((key === 'ArrowLeft' && !this.isVertical) || (key === 'ArrowUp' && this.isVertical)) {
      super.performKeyDown('decrement', this.thumbId);
    }

    if ((key === 'ArrowRight' && !this.isVertical) || (key === 'ArrowDown' && this.isVertical)) {
      super.performKeyDown('increment', this.thumbId);
    }
  }
}

export default Thumb;
