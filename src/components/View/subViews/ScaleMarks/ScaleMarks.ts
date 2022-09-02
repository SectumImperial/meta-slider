import SliderComponents from '../SliderComponents/SliderComponents';
import './scaleMarks.scss';

class ScaleMarks extends SliderComponents {
  marks: Map<number, number>;

  constructor(root: HTMLDivElement, marks: Map<number, number>, isVertical: boolean) {
    super(root, isVertical);
    this.marks = marks;
    this.init();
  }

  private init(): void {
    this.createMarks();
  }

  private createMarks(): void {
    this.marks.forEach((value: number, percent: number) => this.createMark(value, percent));
  }

  private createMark(value: number, percent: number): void {
    const mark = this.createElement('plugin-slider__mark');
    mark.classList.add(`plugin-slider__mark_${this.mod}`);
    mark.style[this.startPoint] = `${percent}%`;

    const markValue = document.createElement('span');
    markValue.className = 'plugin-slider__mark-value';
    markValue.classList.add(`plugin-slider__mark-value_${this.mod}`);
    markValue.innerText = `${value}`;
    mark.append(markValue);

    this.root.append(mark);
  }
}

export default ScaleMarks;
