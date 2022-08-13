// import Thumb from "../Thumb/Thumb";
import Observer from "../../../../Observer/Observer";
import { SliderInterface } from "../../../Interfaces";

class SliderComponents extends Observer {
  protected scaleElement!: HTMLDivElement;
  protected readonly root: Element;
  protected readonly state: SliderInterface;

  constructor(root: Element, state: SliderInterface) {
    super()
    this.root = root;
    this.state = state;
  }


  public update(data: object) {
    console.log(`Get data ${data}`)
  }


  protected performMouseMove(thumbPos: number) {
    console.log(this.root.getBoundingClientRect());
    const mouseMove = (e: MouseEvent) => {
      e.preventDefault();
      const newLeft = e.clientX - thumbPos - this.root.getBoundingClientRect().left;
      console.log(newLeft);
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