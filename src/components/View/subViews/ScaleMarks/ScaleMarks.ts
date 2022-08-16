import SliderComponents from "../SliderComponents/SliderComponents";

class ScaleMarks extends SliderComponents {
  marks: Map<number, number>
  constructor(root: HTMLDivElement, marks: Map<number, number>) {
    super(root);
    this.marks = marks;
    this.init();
  }

  private init() {
    this.createMarks();
  }

  private createMarks() {
    for (let [value, percent] of this.marks) {
      this.createMark(value, percent);
    }
  }

  private createMark(value: number, percent: number) {
    const mark = document.createElement('div');
    mark.className = 'slider__mark';
    mark.style.left = `${percent}%`;

    const line = document.createElement('div');
    line.className = 'slider__mark-line';
    mark.append(line);

    const markValue = document.createElement('span');
    markValue.className = 'slider__mark-value';
    markValue.innerText = `${value}`;
    mark.append(markValue);

    this.root.append(mark);
  }
}

export default ScaleMarks;