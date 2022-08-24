import SliderComponents from '../SliderComponents/SliderComponents';

class Scale extends SliderComponents {
  scale!: HTMLDivElement;

  isVertical: boolean;

  constructor(root: HTMLDivElement, isVertical = false) {
    super(root);
    this.isVertical = isVertical;
    this.init();
  }

  private init(): void {
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
