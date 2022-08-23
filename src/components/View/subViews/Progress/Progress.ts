import SliderComponents from "../SliderComponents/SliderComponents";
import { ProgressData } from '../../../Interfaces'

class Progress extends SliderComponents {
  positionStart: number;
  positionEnd: number;
  isVertical: boolean;
  progress: HTMLDivElement;

  constructor(data: ProgressData) {
    const {
      root,
      positionStart,
      positionEnd,
      isVertical
    } = data;

    super(root);
    this.positionStart = positionStart;
    this.positionEnd = positionEnd;
    this.isVertical = isVertical;
    this.progress = this.createElement('slider__progress');
    this.setProgressPosition(this.positionStart, this.positionEnd);
  }

  public setProgressPosition(positionStart: number = 0, positionEnd: number = 100): void {
    const startPoint = this.isVertical ? 'top' : 'left';
    const size = this.isVertical ? 'height' : 'width';

    this.progress.style[startPoint] = `${positionStart}%`
    this.progress.style[size] = `${positionEnd}%`
    this.root.append(this.progress);
  }

}

export default Progress