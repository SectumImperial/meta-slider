import { SLIDER_EVENTS } from '../../../Presenter/events';
import SliderComponents from '../SliderComponents/SliderComponents';
import './scale.scss';

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
    this.addListenners();
  }

  public getScale(): HTMLDivElement {
    if (!this.scale) this.scale = this.createElement('slider__scale');
    return this.scale;
  }

  private addScale(): void {
    this.root.append(this.scale);
  }

  private addListenners(): void {
    document.addEventListener('click', this.handleClick.bind(this));
  }

  private handleClick(e: MouseEvent): void {
    const { target } = e;
    if (!(target as Element).closest('.slider__scale')) return;

    const scaleSize = this.scale.getBoundingClientRect()[this.size];
    const scaleStart = this.scale.getBoundingClientRect()[this.startPoint];
    const coordsMove = e[this.direction] - scaleStart;

    if (coordsMove > scaleSize || coordsMove < 0) return;
    const data = {
      coordsMove,
      scaleSize,
    };

    this.emit(SLIDER_EVENTS.SCALE_CLICKED, data);
  }
}

export default Scale;
