import SliderComponents from '../SliderComponents/SliderComponents';
import { ProgressData, SizeType, StartPointType } from '../../../Interfaces';

class Progress extends SliderComponents {
  positionStart!: number;

  positionEnd!: number;

  isVertical!: boolean;

  progress: HTMLDivElement;

  constructor(protected readonly data: ProgressData) {
    const {
      root,
    } = data;

    super(root);
    this.createVriables(data);
    this.progress = this.createElement('slider__progress');
    this.setProgressPosition(this.positionStart, this.positionEnd);
  }

  private createVriables(data: ProgressData) {
    const {
      positionStart,
      positionEnd,
      isVertical,
    } = data;

    this.positionStart = positionStart || 0;
    this.positionEnd = positionEnd || 100;
    this.isVertical = isVertical;
    this.progress = this.createElement('slider__progress');
    this.setProgressPosition(this.positionStart, this.positionEnd);
  }

  public setProgressPosition(positionStart = 0, positionEnd = 100): void {
    const startPoint: StartPointType = this.isVertical ? 'top' : 'left';
    const size: SizeType = this.isVertical ? 'height' : 'width';

    this.progress.style[startPoint] = `${positionStart}%`;
    this.progress.style[size] = `${positionEnd}%`;
    this.root.append(this.progress);
  }
}

export default Progress;
