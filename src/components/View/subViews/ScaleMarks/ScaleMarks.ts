import { Marks } from '@src/components/Interfaces';
import SliderComponents from '../SliderComponents/SliderComponents';
import './scaleMarks.scss';

class ScaleMarks extends SliderComponents {
  public marks: Marks;

  constructor(root: HTMLDivElement, marks: Map<number, number>, isVertical: boolean) {
    super(root, isVertical);
    this.marks = marks;

    this.handleRootClick = this.handleRootClick.bind(this);
    this.init();
  }

  private init(): void {
    this.createMarks();
    this.addListeners();
  }

  private addListeners(): void {
    this.root.addEventListener('click', this.handleRootClick);
  }

  private handleRootClick(e: Event): void {
    const target = e.target as HTMLElement;
    if (target === null) return;
    const { value, percent } = target.dataset;
    if (target.classList.contains('plugin-slider__mark-value')) {
      if (percent !== undefined) {
        this.performClickMark(Number(percent), Number(value));
      }
    }
  }

  private createMarks(): void {
    this.marks.forEach((value: number, percent: number) => this.createMark(value, percent));
  }

  private createMark(percent: number, value: number): void {
    const mark = SliderComponents.createElement('plugin-slider__mark js-plugin-slider__mark');
    mark.classList.add(`plugin-slider__mark_${this.mod}`);
    mark.style[this.startPoint] = `${percent}%`;

    const markValue = document.createElement('span');
    markValue.className = 'plugin-slider__mark-value';
    markValue.classList.add(`plugin-slider__mark-value_${this.mod}`);
    markValue.dataset.value = `${value}`;
    markValue.dataset.percent = `${percent}`;
    markValue.innerText = `${value}`;
    mark.append(markValue);

    this.root.append(mark);
  }
}

export default ScaleMarks;
