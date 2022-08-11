class Thumb {
  root: HTMLDivElement;
  positionPercent: number;
  thumb!: HTMLDivElement;

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
  }

  private createThumb(): HTMLDivElement {
    const element = document.createElement('div');
    element.className = 'slider__thumb'
    return element;
  }
}

export default Thumb;