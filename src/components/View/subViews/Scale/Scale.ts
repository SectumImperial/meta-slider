import { SLIDER_EVENTS } from '../../../../Observer/events';
import SliderComponents from '../SliderComponents/SliderComponents';
import './scale.scss';

class Scale extends SliderComponents {
  scale!: HTMLDivElement;

  constructor(root: HTMLDivElement, isVertical: boolean) {
    super(root, isVertical);
    this.initScale();
  }

  public getScale(): HTMLDivElement {
    if (!this.scale) this.scale = this.createElement('plugin-slider__scale');
    return this.scale;
  }

  private initScale(): void {
    this.scale = this.createElement('plugin-slider__scale');
    if (this.isVertical) this.scale.classList.add('plugin-slider__scale_vertical');
    if (!this.isVertical) this.scale.classList.add('plugin-slider__scale_horizontal');
    this.addScale();
    this.addListenners();
  }

  private addScale(): void {
    this.root.append(this.scale);
  }

  private addListenners(): void {
    this.scale.addEventListener('click', this.handleScaleClick.bind(this));
  }

  private handleScaleClick(e: MouseEvent): void {
    const { target } = e;
    if (!(target as Element).closest('.plugin-slider__scale')) return;

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
