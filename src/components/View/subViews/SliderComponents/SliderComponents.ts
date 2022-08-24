import Observer from '../../../../Observer/Observer';
import { StartPointType } from '../../../Interfaces';
import { SLIDER_EVENTS } from '../../../Presenter/events';

class SliderComponents extends Observer {
  protected scaleElement!: HTMLDivElement;

  protected readonly root: Element;

  constructor(root: Element) {
    super();
    this.root = root;
  }

  // eslint-disable-next-line class-methods-use-this
  protected createElement(className: string): HTMLDivElement {
    const element = document.createElement('div');
    element.className = className;
    return element;
  }

  protected performMouseMove(thumbPos: number, id: string, isVertical = false) {
    const direction = isVertical ? 'clientY' : 'clientX';
    const startPoint: StartPointType = isVertical ? 'top' : 'left';
    const mouseMove = (e: MouseEvent) => {
      e.preventDefault();
      const newPos = e[direction] - thumbPos - this.root.getBoundingClientRect()[startPoint];
      this.emit(SLIDER_EVENTS.VALUE_START_CHANGE, {
        coordsMove: newPos,
        thumbId: id,
        isVertical,
      });
    };

    const mouseUp = () => {
      document.removeEventListener('mousemove', mouseMove);
      document.removeEventListener('mouseup', mouseUp);
    };

    document.addEventListener('mousemove', mouseMove);
    document.addEventListener('mouseup', mouseUp);
  }
}

export default SliderComponents;
