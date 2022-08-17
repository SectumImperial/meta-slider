import Observer from "../../../../Observer/Observer";
import { SliderInterface } from "../../../Interfaces";
import { SLIDER_EVENTS } from "../../../Presenter/events";
import Progress from "../Progress/Progress";
import Scale from "../Scale/Scale";
import ScaleMarks from "../ScaleMarks/ScaleMarks";
import Thumb from "../Thumb/Thumb";
import Tip from "../Tip/Tip";

class Slider extends Observer {
  root: Element;
  slider!: HTMLDivElement;
  thumb!: Thumb;
  scale!: Scale;
  scaleElement!: HTMLDivElement;
  thumbPercent: number;
  scaleMap: Map<number, number> | undefined;
  tipValue: number;

  scaleMarks!: ScaleMarks;
  protected readonly state!: SliderInterface;
  protected readonly isTip: boolean;
  thumbElement!: HTMLDivElement;
  tip?: Tip;
  isProgress: boolean;
  progress?: Progress;




  constructor(root: Element, state: SliderInterface) {
    super()
    const { isTip, value, thumbPercent, isProgress } = state;
    this.thumbPercent = thumbPercent;
    this.isTip = isTip;
    this.tipValue = value;
    this.isProgress = isProgress;
    this.root = root;
    this.init();
    this.setState(state);
  }

  private init(): void {

    this.slider = this.createSlider();
    this.createlements();

    this.addSlider();
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
      value
    } = data;
    this.thumbPercent = thumbPercent;
    this.thumb.setPosition(this.thumbPercent);
    if (this.isTip && this.tip) {
      this.tipValue = value;
      this.tip.setPosition(this.thumbPercent, this.tipValue);
    }

    if (this.isProgress && this.progress) {
      this.progress.setProgressPosition(0, this.thumbPercent)
    }
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
    this.thumbElement = this.thumb.getThumb();
    if (this.isTip) this.tip = new Tip(this.scaleElement, this.thumbPercent, this.tipValue);
    if (this.isProgress) this.progress = new Progress(this.scaleElement, 0, this.thumbPercent);
  }
}

export default Slider;