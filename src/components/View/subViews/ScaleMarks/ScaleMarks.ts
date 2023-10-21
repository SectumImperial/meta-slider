import { Marks, MarkValue, MarkPercent } from '@src/components/Interfaces';
import SliderComponents from '../SliderComponents/SliderComponents';
import { MIN_SPACE, MARKS_HIDDEN } from './constants';
import './scaleMarks.scss';

class ScaleMarks extends SliderComponents {
  public marks: Marks;

  constructor(root: HTMLDivElement, marks: Marks, isVertical: boolean) {
    super(root, isVertical);
    this.marks = marks;
    this.init();
  }

  private init(): void {
    this.createMarks();
    this.addListeners();
    this.adjustMarkVisibility();
  }

  private addListeners(): void {
    this.root.addEventListener('click', this.handleRootClick.bind(this));
  }

  private handleRootClick(e: Event): void {
    const target = e.target as HTMLElement;
    const { value, percent } = target.dataset;

    if (target.classList.contains('plugin-slider__mark-value') && percent !== undefined) {
      this.performClickMark(Number(percent), Number(value));
    }
  }

  private createMarks(): void {
    this.marks.forEach((percent: MarkValue, value: MarkPercent) => {
      this.createMark(value, percent);
    });
  }

  private createMark(value: MarkValue, percent: MarkPercent): void {
    const mark = this.createMarkElement(percent);
    const markValue = this.createMarkValueElement(value, percent);
    mark.append(markValue);
    this.root.append(mark);
  }

  private createMarkElement(percent: MarkPercent): HTMLDivElement {
    const mark = SliderComponents.createElement('plugin-slider__mark js-plugin-slider__mark');
    mark.classList.add(`plugin-slider__mark_${this.mod}`);
    mark.style[this.startPoint] = `${percent}%`;
    return mark;
  }

  private createMarkValueElement(value: MarkValue, percent: MarkPercent): HTMLSpanElement {
    const markValue = document.createElement('span');
    markValue.className = `plugin-slider__mark-value plugin-slider__mark-value_${this.mod}`;
    markValue.dataset.value = `${value}`;
    markValue.dataset.percent = `${percent}`;
    markValue.innerText = `${value}`;
    return markValue;
  }

  private adjustMarkVisibility(): void {
    const markElements = Array.from(this.root.querySelectorAll('.plugin-slider__mark'));
    let lastVisibleMarkPosition: number | null = null;

    markElements.forEach((mark) => {
      const markValueElement = mark.querySelector('.plugin-slider__mark-value');
      const markPercent = markValueElement ? Number(markValueElement.getAttribute('data-percent')) : null;

      if (lastVisibleMarkPosition === null) {
        mark.classList.remove(MARKS_HIDDEN);
        lastVisibleMarkPosition = markPercent;
        return;
      }

      const distanceToLast = markPercent !== null ? markPercent - lastVisibleMarkPosition : 0;

      if (distanceToLast < MIN_SPACE) {
        mark.classList.add(MARKS_HIDDEN);
      } else {
        mark.classList.remove(MARKS_HIDDEN);
        lastVisibleMarkPosition = markPercent;
      }
    });
  }
}

export default ScaleMarks;
