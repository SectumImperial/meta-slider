import { ProgressData } from '@src/components/Interfaces';
import SliderComponents from '../SliderComponents/SliderComponents';
import './progress.scss';

class Progress extends SliderComponents {
  private positionStart: number;

  private positionEnd: number;

  private progress: HTMLDivElement;

  constructor(data: ProgressData) {
    const {
      root,
      positionStart,
      positionEnd,
      isVertical,
    } = data;

    super(root, isVertical);
    this.positionStart = positionStart;
    this.positionEnd = positionEnd;
    this.progress = SliderComponents.createElement('plugin-slider__progress js-plugin-slider__progress');
    this.setProgress();
  }

  public setProgress(): void {
    this.progress.style[this.startPoint] = `${this.positionStart}%`;
    this.progress.style[this.size] = `${this.positionEnd}%`;
    this.root.append(this.progress);
  }

  public setProgressPosition(positionStart = 0, positionEnd = 100): void {
    this.progress.style[this.startPoint] = `${positionStart}%`;
    this.progress.style[this.size] = `${positionEnd}%`;
  }
}

export default Progress;
