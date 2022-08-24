import Observer from '../../../../Observer/Observer';
import { SizeType, StartPointType } from '../../../Interfaces';
import { SLIDER_EVENTS } from '../../../Presenter/events';

class SliderComponents extends Observer {
  protected scaleElement!: HTMLDivElement;

  protected readonly root: Element;

  protected readonly direction: 'clientY' | 'clientX';

  protected readonly startPoint: StartPointType;

  protected readonly size: SizeType;

  protected readonly mod: 'vertical' | 'horizontal';

  protected readonly isVertical: boolean;

  constructor(root: Element, isVertical: boolean) {
    super();
    this.isVertical = isVertical;
    this.direction = this.isVertical ? 'clientY' : 'clientX';
    this.startPoint = this.isVertical ? 'top' : 'left';
    this.size = this.isVertical ? 'height' : 'width';
    this.mod = this.isVertical ? 'vertical' : 'horizontal';
    this.root = root;
  }

  // eslint-disable-next-line class-methods-use-this
  protected createElement(className: string): HTMLDivElement {
    const element = document.createElement('div');
    element.className = className;
    return element;
  }

  protected performMouseMove(thumbPos: number, id: string): void {
    const mouseMove = (e: MouseEvent) => {
      e.preventDefault();
      const elemSize = this.root.getBoundingClientRect()[this.startPoint];
      const newPos = e[this.direction] - thumbPos - elemSize;
      this.emit(SLIDER_EVENTS.VALUE_START_CHANGE, {
        coordsMove: newPos,
        thumbId: id,
        isVertical: this.isVertical,
      });
    };

    const mouseUp = () => {
      document.removeEventListener('mousemove', mouseMove);
      document.removeEventListener('mouseup', mouseUp);
    };

    document.addEventListener('mousemove', mouseMove);
    document.addEventListener('mouseup', mouseUp);
  }

  // protected performToucMove(thumbPos: number, id: string, isVertical = false) {
  //   const touchMove = (e: TouchEvent) => {
  //     e.preventDefault();
  //     const direction = isVertical ? 'clientY' : 'clientX';
  //     const newPos = e.touches[0][direction]
  // - thumbPos - this.root.getBoundingClientRect()[startPoint];;
  //   }

  //   document.addEventListener('touchmove', touchMove);
  // }
}

export default SliderComponents;
