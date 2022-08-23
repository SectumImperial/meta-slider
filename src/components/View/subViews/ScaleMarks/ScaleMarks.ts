import SliderComponents from "../SliderComponents/SliderComponents";

class ScaleMarks extends SliderComponents {
  marks: Map<number, number>
  isVertical: boolean;
  constructor(root: HTMLDivElement, marks: Map<number, number>, isVertical: boolean) {
    super(root);
    this.marks = marks;
    this.isVertical = isVertical;
    this.init();
  }

  private init() {
    this.createMarks();
  }

  private createMarks() {
    for (let [percent, value] of this.marks) {
      this.createMark(value, percent);
    }
  }

  private createMark(value: number, percent: number) {
    const startPoint = this.isVertical ? 'top' : 'left';
    const mod = this.isVertical ? 'vertical' : 'horizontal';
    const mark = this.createElement('slider__mark');
    mark.classList.add(`slider__mark_${mod}`)
    mark.style[startPoint] = `${percent}%`;

    const markValue = document.createElement('span');
    markValue.className = 'slider__mark-value';
    markValue.classList.add(`slider__mark-value_${mod}`)
    markValue.innerText = `${value}`;
    mark.append(markValue);

    this.root.append(mark);
  }
}

export default ScaleMarks;