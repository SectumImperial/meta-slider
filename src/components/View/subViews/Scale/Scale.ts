class Scale {
  root: HTMLDivElement;
  scale!: HTMLDivElement;

  constructor(root: HTMLDivElement) {
    this.root = root;
    this.init();
  }

  private init(): void {
    this.scale = this.createScale();
    this.addScale()
  }

  public getScale() {
    if (this.scale) return this.scale;
    return this.createScale();
  }

  private createScale(): HTMLDivElement {
    const element = document.createElement('div');
    element.className = 'slider__scale'
    return element;
  }

  private addScale() {
    this.root.append(this.scale);
  }
}

export default Scale;