import { Marks } from '@src/components/Interfaces';
import SliderComponents from '../SliderComponents/SliderComponents';
import  { MIN_SPACE, MARKS_HIDDEN } from './constants'
import './scaleMarks.scss';

class ScaleMarks extends SliderComponents {
  public marks: Marks;

  constructor(root: HTMLDivElement, marks: Map<number, number>, isVertical: boolean) {
    super(root, isVertical);
    this.marks = marks;

    this.handleRootClick = this.handleRootClick.bind(this);
    this.adjustMarkVisibility = this.adjustMarkVisibility.bind(this);
    this.init();
  }

  private init(): void {
    this.createMarks();
    this.addListeners();
    this.adjustMarkVisibility(); 
  }

  private addListeners(): void {
    this.root.addEventListener('click', this.handleRootClick);
  }

  private handleRootClick(e: Event): void {
    const target = e.target as HTMLElement;
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

  private adjustMarkVisibility(): void {
    const markElements = Array.from(this.root.querySelectorAll('.plugin-slider__mark'));
    let lastVisibleMarkPosition: number | null = null;

    markElements.forEach((mark) => {
      const markPercent = Number(mark.querySelector('.plugin-slider__mark-value')?.getAttribute('data-percent'));

      if (lastVisibleMarkPosition === null) {
        mark.classList.remove(`${MARKS_HIDDEN}`); 
        lastVisibleMarkPosition = markPercent;
        return;
      }

      const distanceToLast = markPercent - lastVisibleMarkPosition;

      if (distanceToLast < MIN_SPACE) {
        mark.classList.add(`${MARKS_HIDDEN}`);
      } else {
        mark.classList.remove(`${MARKS_HIDDEN}`);
        lastVisibleMarkPosition = markPercent;
      }
    });
  }
}

export default ScaleMarks;