import Observer from '../../../../Observer/Observer';
import {
  KeyEvent,
  SizeType,
  StartPointType,
  ThumbID,
} from '../../../Interfaces';
import { SLIDER_EVENTS } from '../../../../Observer/events';

class SliderComponents extends Observer {
  protected scaleElement!: HTMLDivElement;

  protected readonly root: Element;

  protected readonly direction: 'clientY' | 'clientX';

  protected readonly startPoint: StartPointType;

  readonly size: SizeType;

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
      });
    };

    const mouseUp = () => {
      document.removeEventListener('mousemove', mouseMove);
      document.removeEventListener('mouseup', mouseUp);
    };

    document.addEventListener('mousemove', mouseMove);
    document.addEventListener('mouseup', mouseUp);
  }

  protected performToucMove(thumbPos: number, id: ThumbID): void {
    const touchMove = (e: TouchEvent) => {
      e.stopImmediatePropagation();
      const elemSize = this.root.getBoundingClientRect()[this.startPoint];
      const newPos = e.touches[0][this.direction] - thumbPos - elemSize;
      this.emit(SLIDER_EVENTS.VALUE_START_CHANGE, {
        coordsMove: newPos,
        thumbId: id,
      });
    };

    const touchEnd = () => {
      document.removeEventListener('touchmove', touchMove);
      document.removeEventListener('touchend', touchEnd);
    };

    document.addEventListener('touchmove', touchMove);
    document.addEventListener('touchend', touchEnd);
  }

  protected performKeyDown(keyEvent: KeyEvent, id: ThumbID): void {
    this.emit(SLIDER_EVENTS.KEY_DOWN, {
      keyEvent,
      thumbId: id,
    });
  }
}

export default SliderComponents;
