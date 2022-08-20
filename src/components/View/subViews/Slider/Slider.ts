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
  thumbFrom!: Thumb;
  thumbTo?: Thumb;
  scale!: Scale;
  scaleElement!: HTMLDivElement;
  thumbPercentFrom: number;
  scaleMap: Map<number, number> | undefined;
  tipValueFrom: number;

  scaleMarks!: ScaleMarks;
  protected readonly isTip: boolean;
  tipFrom?: Tip;
  isProgress: boolean;
  progress?: Progress;
  isRange: boolean;
  thumbPercentTo?: number;
  tipTo?: Tip;
  tipValueTo?: number;

  constructor(root: Element, protected readonly state: SliderInterface) {
    super()
    const {
      isTip,
      valueFrom,
      thumbPercentFrom,
      thumbPercentTo,
      isProgress,
      isRange,
      scaleMap
    } = state;
    this.thumbPercentFrom = thumbPercentFrom;
    if (thumbPercentTo) this.thumbPercentTo = thumbPercentTo;

    this.isTip = isTip;
    this.tipValueFrom = valueFrom;
    this.isProgress = isProgress;
    this.isRange = isRange;
    this.root = root;
    this.init();
    this.setState(state);
    if (scaleMap) {
      this.scaleMarks = new ScaleMarks(this.scaleElement, scaleMap)
    }
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
      thumbPercentFrom,
      valueFrom,
      isRange,
      thumbPercentTo,
      valueTo,
    } = data;
    this.thumbPercentFrom = thumbPercentFrom;
    this.thumbFrom.setPosition(this.thumbPercentFrom);

    if (isRange && typeof thumbPercentTo === 'number' && this.thumbTo) {
      this.thumbPercentTo = thumbPercentTo;
      this.thumbTo.setPosition(this.thumbPercentTo);
    }

    if (this.isTip && this.tipFrom) {
      this.tipValueFrom = valueFrom;
      this.tipFrom.setPosition(this.thumbPercentFrom, this.tipValueFrom);
    }

    if (isRange && this.tipTo && valueTo && this.thumbPercentTo) {
      this.tipValueTo = valueTo;
      this.tipTo.setPosition(this.thumbPercentTo, this.tipValueTo);
    }

    if (this.isTip && isRange && valueTo && valueTo - valueFrom <= 2) {
      this.tipFrom?.setValueTip(`${valueFrom} - ${valueTo}`);
      this.tipTo?.hideTip();
    } else {
      this.tipTo?.showTip();
    }

    if (this.isProgress && this.progress) {
      this.progress.setProgressPosition(0, this.thumbPercentFrom)
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
    this.thumbFrom = new Thumb(this.scaleElement, this.thumbPercentFrom, 'valueFrom');

    if (this.isRange) this.thumbTo = new Thumb(this.scaleElement, 95, 'valueTo');
    if (this.isTip, this.thumbPercentTo, this.isRange) this.tipTo = new Tip(this.scaleElement, this.thumbPercentTo!, this.tipValueTo!);
    if (this.isTip) this.tipFrom = new Tip(this.scaleElement, this.thumbPercentFrom, this.tipValueFrom);
    if (this.isProgress) this.progress = new Progress(this.scaleElement, 0, this.thumbPercentFrom);
  }
}

export default Slider;