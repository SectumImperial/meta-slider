import { ThumbArgs, ThumbId } from '@src/components/Interfaces';
import SliderComponents from '../SliderComponents/SliderComponents';
import './thumb.scss';

class Thumb extends SliderComponents {
  private moved?: number;
  thumbPercent: number;
  thumbElement?: HTMLDivElement;
  thumbId: ThumbId;
  minValue: number;
  maxValue: number;

  constructor(values: ThumbArgs) {
    const {
      root,
      thumbPercent = 0,
      id = 'valueFrom',
      isVertical,
      minValue,
      maxValue
    } = values;

    super(root, isVertical);
    this.thumbPercent = thumbPercent;
    this.thumbId = id;
    this.minValue = minValue;
    this.maxValue = maxValue;

    this.handleThumbPointerDown = this.handleThumbPointerDown.bind(this);
    this.handleThumbKeyDown = this.handleThumbKeyDown.bind(this);
    this.handleThumbTouch = this.handleThumbTouch.bind(this);
    this.init();
  }

  private init(): void {
    this.thumbElement = this.createThumb();
    this.thumbElement.id = this.thumbId;
    this.thumbElement.tabIndex = 1;
    this.root.append(this.thumbElement);
    this.setPosition(this.thumbPercent);
    this.addListeners();
  }

  public setPosition(thumbPercent: number): void {
    this.thumbPercent = thumbPercent;
    this.checkZInd();
    if (this.thumbElement !== undefined) {
      this.thumbElement.style[this.startPoint] = `${this.thumbPercent}%`;

      const scaleValue = this.minValue + (this.thumbPercent / 100) * (this.maxValue - this.minValue);
      this.thumbElement.setAttribute('aria-valuenow', scaleValue.toString());
    }
  }

  public getThumb(): HTMLDivElement | undefined {
    return this.thumbElement;
  }

  public getThumbId(): ThumbId {
    return this.thumbId;
  }

  private addListeners(): void {
    if (this.thumbElement === undefined) return;
    this.thumbElement.addEventListener('pointerdown', this.handleThumbPointerDown);
    this.thumbElement.addEventListener('keydown', this.handleThumbKeyDown);
    this.thumbElement.addEventListener(
      'touchstart',
      this.handleThumbTouch,
    );
  }

  private createThumb(): HTMLDivElement {
    const thumbElement = SliderComponents.createElement('plugin-slider__thumb js-plugin-slider__thumb');
    thumbElement.setAttribute('role', 'slider');
    thumbElement.setAttribute('aria-valuemin', this.minValue.toString());
    thumbElement.setAttribute('aria-valuemax', this.maxValue.toString());
    thumbElement.setAttribute('aria-valuenow', this.thumbPercent.toString());
    thumbElement.setAttribute('aria-label', 'Value slider');
    return thumbElement;
  }

  private checkZInd(): void {
    if (this.thumbElement === undefined) return;
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

  private handleThumbTouch(e: TouchEvent): void {
    e.preventDefault();
    if (this.thumbElement === undefined) return;
    const sizeElement = this.thumbElement.getBoundingClientRect()[this.startPoint];
    this.moved = e.touches[0][this.direction] - (sizeElement
      + (this.thumbElement.getBoundingClientRect()[this.size] / 2));
    super.performTouchMove(this.moved, this.thumbId);
  }

  private handleThumbPointerDown(e: PointerEvent): void {
    e.preventDefault();
    if (this.thumbElement === undefined) return;
    this.moved = e[this.direction] - (this.thumbElement.getBoundingClientRect()[this.startPoint]
      + (this.thumbElement.getBoundingClientRect()[this.size] / 2));
    this.checkZInd();
    super.performPointerMove(this.moved, this.thumbId);
  }

  private handleThumbKeyDown(e: KeyboardEvent): void {
    if(e.key === 'Tab') return;
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
