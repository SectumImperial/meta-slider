import Observer from '@src/Observer/Observer';
import { SLIDER_EVENTS } from '@src/Observer/events';
import {
  KeyEvent,
  SizePoint,
  StartPoint,
  ThumbAttr,
} from '@src/components/Interfaces';

class SliderComponents extends Observer {
  readonly size: SizePoint;

  protected scaleElement?: HTMLDivElement;

  protected readonly root: Element;

  protected readonly direction: 'clientY' | 'clientX';

  protected readonly startPoint: StartPoint;

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

  static createElement(className: string): HTMLDivElement {
    const element = document.createElement('div');
    element.className = className;
    return element;
  }

  public performPointerMove(thumbPos: number, attr: string): void {
    const handleThumbPointerMove = (e: PointerEvent) => {
      e.preventDefault();
      const elemSize = this.root.getBoundingClientRect()[this.startPoint];
      const newPos = e[this.direction] - thumbPos - elemSize;
      this.emit(SLIDER_EVENTS.VALUE_START_CHANGE, {
        coordsMove: newPos,
        ThumbAttr: attr,
      });
    };

    const handleThumbPointerUp = () => {
      document.removeEventListener('pointermove', handleThumbPointerMove);
      document.removeEventListener('pointerup', handleThumbPointerUp);
    };

    document.addEventListener('pointermove', handleThumbPointerMove);
    document.addEventListener('pointerup', handleThumbPointerUp);
  }

  public performTouchMove(thumbPos: number, id: ThumbAttr): void {
    const handleThumbTouchMove = (e: TouchEvent) => {
      e.stopImmediatePropagation();
      const elemSize = this.root.getBoundingClientRect()[this.startPoint];
      const newPos = e.touches[0][this.direction] - thumbPos - elemSize;
      this.emit(SLIDER_EVENTS.VALUE_START_CHANGE, {
        coordsMove: newPos,
        ThumbAttr: id,
      });
    };

    const handleThumbTouchEnd = () => {
      document.removeEventListener('touchmove', handleThumbTouchMove);
      document.removeEventListener('touchend', handleThumbTouchEnd);
    };

    document.addEventListener('touchmove', handleThumbTouchMove);
    document.addEventListener('touchend', handleThumbTouchEnd);
  }

  public performKeyDown(keyEvent: KeyEvent, id: ThumbAttr): void {
    this.emit(SLIDER_EVENTS.KEY_DOWN, {
      keyEvent,
      ThumbAttr: id,
    });
  }

  protected performClickMark(percent: number, value: number) {
    this.emit(SLIDER_EVENTS.MARK_CLICKED, {
      percent,
      value,
    });
  }
}

export default SliderComponents;
