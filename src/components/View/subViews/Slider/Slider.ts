import Observer from "../../../../Observer/Observer";
import { SliderInterface } from "../../../Interfaces";
import { SLIDER_EVENTS } from "../../../Presenter/events";
import Scale from "../Scale/Scale";
import ScaleMarks from "../ScaleMarks/ScaleMarks";
import Thumb from "../Thumb/Thumb";

class Slider extends Observer {
  root: Element;
  slider!: HTMLDivElement;
  thumb!: Thumb;
  scale!: Scale;
  scaleElement!: HTMLDivElement;
  thumbPercent!: number;
  scaleMarks!: ScaleMarks;
  protected readonly state!: SliderInterface;
  scaleMap: Map<number, number> | undefined;


  constructor(root: Element) {
    super()
    this.root = root;
    this.init();
  }

  public update(data: object, event: string): void {
    if (event === SLIDER_EVENTS.VALUE_START_CHANGE) {
      const scaleWidth = this.scaleElement.getBoundingClientRect().width;
      const sliderData = { ...data, scaleWidth: scaleWidth };
      this.emit(SLIDER_EVENTS.DATA_COLLECTED, sliderData);
    }
  }

  public setState(data: SliderInterface) {
    const {
      thumbPercent,
      scaleMap
    } = data;

    this.thumbPercent = thumbPercent;
    this.scaleMap = scaleMap;

    if (scaleMap) {
      this.scaleMarks = new ScaleMarks(this.scaleElement, scaleMap)
    }

    this.thumb.setPosition(this.thumbPercent);
  }

  public getNewState(data: SliderInterface) {
    const {
      thumbPercent,
    } = data;
    this.thumbPercent = thumbPercent;
    this.thumb.setPosition(this.thumbPercent);
  }


  private init(): void {

    this.slider = this.createSlider();
    this.createlements();

    this.addSlider();
  }

  private addSlider(): void {
    this.root.append(this.slider);
  }

  private createSlider(): HTMLDivElement {
    const sliderWrapper = document.createElement('div');
    sliderWrapper.className = 'slider';
    return sliderWrapper;
  }

  private createlements() {
    this.scale = new Scale(this.slider);
    this.scaleElement = this.scale.getScale()
    this.thumb = new Thumb(this.scaleElement, this.thumbPercent);
    this.addElements(this.scaleElement);
  }


  private addElements(scaleElement: HTMLDivElement) {
    this.slider.append(scaleElement);
  }
}

export default Slider;