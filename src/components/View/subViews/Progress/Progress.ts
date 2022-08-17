import SliderComponents from "../SliderComponents/SliderComponents";

class Progress extends SliderComponents {
  positionStart: number;
  positionEnd: number;
  progress: HTMLDivElement;

  constructor(root: HTMLDivElement, positionStart: number = 0, positionEnd: number = 100) {
    super(root);
    this.positionStart = positionStart;
    this.positionEnd = positionEnd;
    this.progress = this.createElement('slider__progress');
    this.setProgressPosition(this.positionStart, this.positionEnd);
  }

  public setProgressPosition(positionStart: number = 0, positionEnd: number = 100): void {
    this.progress.style.left = `${positionStart}%`
    this.progress.style.width = `${positionEnd}%`
    this.root.append(this.progress);
  }

}

export default Progress