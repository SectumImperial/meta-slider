import Observer from "../../../../Observer/Observer";
import { SLIDER_EVENTS } from "../../../Presenter/events";

class SliderComponents extends Observer {
  protected scaleElement!: HTMLDivElement;
  protected readonly root: Element;

  constructor(root: Element) {
    super()
    this.root = root;
  }

  public update(data: object) {
    console.log(`SC Get data ${data}`)
  }

  protected createElement(className: string): HTMLDivElement {
    const element = document.createElement('div');
    element.className = className;
    return element;
  }


  protected performMouseMove(thumbPos: number, id: string) {
    const mouseMove = (e: MouseEvent) => {
      e.preventDefault();
      const newLeft = e.clientX - thumbPos - this.root.getBoundingClientRect().left;
      this.emit(SLIDER_EVENTS.VALUE_START_CHANGE, {
        coordsMove: newLeft,
        thumbId: id,
      })
    }

    const mouseUp = () => {
      document.removeEventListener('mousemove', mouseMove)
      document.removeEventListener('mouseup', mouseUp);
    }

    document.addEventListener('mousemove', mouseMove)
    document.addEventListener('mouseup', mouseUp);
  }
}

export default SliderComponents;