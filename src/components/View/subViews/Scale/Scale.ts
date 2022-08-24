import SliderComponents from '../SliderComponents/SliderComponents';

class Scale extends SliderComponents {
  scale!: HTMLDivElement;

  constructor(root: HTMLDivElement, isVertical: boolean) {
    super(root, isVertical);
    this.initScale();
  }

  private initScale(): void {
    this.scale = this.createElement('slider__scale');
    if (this.isVertical) this.scale.classList.add('slider__scale_vertical');
    if (!this.isVertical) this.scale.classList.add('slider__scale_horizontal');
    this.addScale();
  }

  public getScale() {
    if (!this.scale) this.scale = this.createElement('slider__scale');
    return this.scale;
  }

  private addScale() {
    this.root.append(this.scale);
  }
}

export default Scale;
