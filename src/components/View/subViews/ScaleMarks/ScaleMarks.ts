import SliderComponents from '../SliderComponents/SliderComponents';

class ScaleMarks extends SliderComponents {
  marks: Map<number, number>;

  constructor(root: HTMLDivElement, marks: Map<number, number>, isVertical: boolean) {
    super(root, isVertical);
    this.marks = marks;
    this.init();
  }

  private init() {
    this.createMarks();
  }

  private createMarks() {
    this.marks.forEach((value: number, percent: number) => this.createMark(value, percent));
  }

  private createMark(value: number, percent: number) {
    const mark = this.createElement('slider__mark');
    mark.classList.add(`slider__mark_${this.mod}`);
    mark.style[this.startPoint] = `${percent}%`;

    const markValue = document.createElement('span');
    markValue.className = 'slider__mark-value';
    markValue.classList.add(`slider__mark-value_${this.mod}`);
    markValue.innerText = `${value}`;
    mark.append(markValue);

    this.root.append(mark);
  }
}

export default ScaleMarks;
