class Thumb {
  root: HTMLDivElement;
  positionPercent: number;
  thumb!: HTMLDivElement;
  shiftX!: number;

  constructor(root: HTMLDivElement, positionPercent: number) {
    this.root = root;
    this.positionPercent = positionPercent;
    this.init();
  }

  public setPosition(positionPercent: number): void {
    this.positionPercent = positionPercent;
    this.thumb.style.left = this.positionPercent + '%';
  }

  private init(): void {
    this.thumb = this.createThumb();
    this.root.append(this.thumb);
    this.setPosition(this.positionPercent);
    this.addListeners();
  }

  private addListeners() {
    this.thumb.addEventListener('mousedown', this.mouseDown.bind(this));
    this.thumb.addEventListener('mousemove', this.mouseMove.bind(this));
  }

  private createThumb(): HTMLDivElement {
    const element = document.createElement('div');
    element.className = 'slider__thumb'
    return element;
  }

  private mouseDown(e: MouseEvent): void {
    this.shiftX = e.clientX - this.thumb.getBoundingClientRect().left;
  }

  private mouseMove(e: MouseEvent) {
    let newLeft = e.clientX - this.shiftX - this.root.getBoundingClientRect().left;
    console.log(newLeft);
  }
}

export default Thumb;