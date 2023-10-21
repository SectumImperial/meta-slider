import { SLIDER_EVENTS } from '@src/Observer/events';
import SliderComponents from '../SliderComponents/SliderComponents';
import './scale.scss';

class Scale extends SliderComponents {
  public scale: HTMLDivElement;

  constructor(root: HTMLDivElement, isVertical: boolean) {
    super(root, isVertical);

    this.scale = SliderComponents.createElement('plugin-slider__scale js-plugin-slider__scale');
    this.handleScalePointerDown = this.handleScalePointerDown.bind(this);
    this.init();
  }

  public getScale(): HTMLDivElement {
    if (!this.scale) {
      this.scale = SliderComponents.createElement('plugin-slider__scale');
    }
    return this.scale;
  }

  private init(): void {
    const scaleClass = this.isVertical ? 'plugin-slider__scale_vertical' : 'plugin-slider__scale_horizontal';
    this.scale.classList.add(scaleClass);
    this.addScale();
    this.addListeners();
  }

  private addScale(): void {
    this.root.append(this.scale);
  }

  private addListeners(): void {
    this.scale.addEventListener('pointerdown', this.handleScalePointerDown);
  }

  private handleScalePointerDown(e: PointerEvent): void {
    const target = e.target as Element;

    if (!target.closest('.plugin-slider__scale') || target.classList.contains('plugin-slider__mark-value')) {
      return;
    }

    const scaleRect = this.scale.getBoundingClientRect();
    const scaleSize = scaleRect[this.size];
    const scaleStart = scaleRect[this.startPoint];
    const coordsMove = e[this.direction] - scaleStart;

    if (coordsMove > scaleSize || coordsMove < 0) return;

    this.emitData(coordsMove, scaleSize);
  }

  private emitData(coordsMove: number, scaleSize: number) {
    const data = {
      coordsMove,
      scaleSize,
    };

    this.emit(SLIDER_EVENTS.SCALE_CLICKED, data);
  }
}

export default Scale;
