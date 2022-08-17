import SliderComponents from "../SliderComponents/SliderComponents";

class Scale extends SliderComponents {
  scale!: HTMLDivElement;

  constructor(root: HTMLDivElement) {
    super(root);
    this.init();
  }

  private init(): void {
    this.scale = this.createElement('slider__scale');
    this.addScale()
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