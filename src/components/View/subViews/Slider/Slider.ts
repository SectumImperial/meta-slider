import Observer from '../../../../Observer/Observer';
import { SliderInterface, SliderEventValChangedData, ScaleClickData } from '../../../Interfaces';
import { SLIDER_EVENTS } from '../../../Presenter/events';
import Progress from '../Progress/Progress';
import Scale from '../Scale/Scale';
import ScaleMarks from '../ScaleMarks/ScaleMarks';
import SliderComponents from '../SliderComponents/SliderComponents';
import Thumb from '../Thumb/Thumb';
import Tip from '../Tip/Tip';
import './slider.scss';

class Slider extends Observer {
  tipValueFrom!: number;

  thumbPercentFrom!: number;

  thumbPercentTo?: number;

  tipValueTo?: number;

  root!: Element;

  slider!: HTMLDivElement;

  scaleElement!: HTMLDivElement;

  isProgress!: boolean;

  isRange!: boolean;

  isVertical!: boolean;

  isTip!: boolean;

  scaleMap: Map<number, number> | undefined;

  thumbFrom!: Thumb;

  thumbTo?: Thumb;

  scale!: Scale;

  scaleMarks!: ScaleMarks;

  tipFrom?: Tip;

  tipTo?: Tip;

  progress?: Progress;

  sliderCompnents!: SliderComponents;

  constructor(root: Element, protected readonly state: SliderInterface) {
    super();
    this.createVariables(root, state);
    this.initSlider();
    this.setState(state);
  }

  private initSlider(): void {
    this.slider = this.createSlider();
    this.createlements();
    this.addSlider();
  }

  public update(data: SliderEventValChangedData | ScaleClickData, event: string): void {
    if (event === SLIDER_EVENTS.VALUE_START_CHANGE) {
      const { size } = this.sliderCompnents;
      const scaleSize = this.scaleElement.getBoundingClientRect()[size];
      const sliderData = { ...data, scaleSize };
      this.emit(SLIDER_EVENTS.DATA_COLLECTED, sliderData);
    }

    if (event === SLIDER_EVENTS.SCALE_CLICKED) {
      this.emit(SLIDER_EVENTS.DATA_COLLECTED, data);
    }
  }

  private createVariables(root: Element, state: SliderInterface): void {
    const {
      isTip,
      valueFrom,
      valueTo,
      thumbPercentFrom,
      thumbPercentTo,
      isProgress,
      isRange,
      scaleMap,
      isVertical,
    } = state;

    this.thumbPercentFrom = thumbPercentFrom;
    if (thumbPercentTo) this.thumbPercentTo = thumbPercentTo;

    this.isTip = isTip || false;
    this.tipValueFrom = valueFrom || 0;
    this.tipValueTo = valueTo || 0;
    this.isProgress = isProgress || false;
    this.isRange = isRange || false;
    this.isVertical = isVertical || false;
    this.scaleMap = scaleMap;
    this.root = root;
  }

  private createlements(): void {
    this.sliderCompnents = new SliderComponents(this.slider, this.isVertical);
    this.scale = new Scale(this.slider, this.isVertical);
    this.scaleElement = this.scale.getScale();

    this.thumbFrom = new Thumb({
      root: this.scaleElement,
      thumbPercent: this.thumbPercentFrom,
      id: 'valueFrom',
      isVertical: this.isVertical,
    });

    if (this.isRange && this.thumbPercentTo) {
      this.thumbTo = new Thumb({
        root: this.scaleElement,
        thumbPercent: this.thumbPercentTo,
        id: 'valueTo',
        isVertical: this.isVertical,
      });
    }

    if (this.isTip) {
      this.tipFrom = new Tip({
        root: this.scaleElement,
        percentPosition: this.thumbPercentFrom,
        valueTip: this.tipValueFrom,
        isVertical: this.isVertical,
      });
    }

    if (this.isTip && this.thumbPercentTo && this.isRange && this.tipValueTo !== undefined) {
      this.tipTo = new Tip({
        root: this.scaleElement,
        percentPosition: this.thumbPercentTo,
        valueTip: this.tipValueTo,
        isVertical: this.isVertical,
      });
    }

    if (this.isProgress && !this.isRange) {
      this.progress = new Progress({
        root: this.scaleElement,
        positionStart: this.thumbPercentFrom,
        positionEnd: 0,
        isVertical: this.isVertical,
      });
    }

    if (this.isProgress && this.isRange) {
      const widthProgress = this.thumbPercentTo ? this.thumbPercentTo - this.thumbPercentFrom : 0;
      this.progress = new Progress({
        root: this.scaleElement,
        positionStart: this.thumbPercentFrom,
        positionEnd: widthProgress,
        isVertical: this.isVertical,
      });
    }

    if (this.scaleMap) {
      this.scaleMarks = new ScaleMarks(this.scaleElement, this.scaleMap, this.isVertical);
    }
  }

  private addSlider(): void {
    this.root.append(this.slider);
  }

  // eslint-disable-next-line class-methods-use-this
  private createSlider(): HTMLDivElement {
    const sliderWrapper = document.createElement('div');
    sliderWrapper.className = 'slider';
    return sliderWrapper;
  }

  public setState(data: SliderInterface): void {
    const {
      thumbPercentFrom,
      valueFrom,
      isRange,
      thumbPercentTo,
      valueTo,
    } = data;

    // Thumb percents
    this.thumbPercentFrom = thumbPercentFrom;
    this.thumbFrom.setPosition(this.thumbPercentFrom);

    if (isRange && thumbPercentTo !== undefined && this.thumbTo) {
      this.thumbPercentTo = thumbPercentTo;
      this.thumbTo.setPosition(this.thumbPercentTo);
    }

    //  Tips
    const { isTip } = this;
    if (isTip && this.tipFrom) {
      this.tipValueFrom = valueFrom;
      this.tipFrom.setPosition(this.thumbPercentFrom, this.tipValueFrom);
    }

    if (this.isNeedDoubleTip()) {
      this.tipFrom?.setValueTip(`${valueFrom} - ${valueTo}`);
      this.tipTo?.hideTip();
    } else {
      this.tipTo?.showTip();
    }

    if (isRange && this.tipTo && valueTo !== undefined && this.thumbPercentTo) {
      this.tipValueTo = valueTo;
      this.tipTo.setPosition(this.thumbPercentTo, this.tipValueTo);
    }

    // Progress
    if (this.isProgress && !isRange) {
      this.progress?.setProgressPosition(0, this.thumbPercentFrom);
    }
    if (this.isProgress && isRange && thumbPercentTo) {
      this.progress?.setProgressPosition(this.thumbPercentFrom, thumbPercentTo - thumbPercentFrom);
    }
    if (this.isProgress && thumbPercentTo === thumbPercentFrom) {
      this.progress?.setProgressPosition(0, 0);
    }
  }

  private isNeedDoubleTip(): boolean {
    return this.isTip
      && this.isRange
      && this.thumbPercentTo !== undefined
      && ((this.thumbPercentTo - this.thumbPercentFrom <= 2)
        || (this.thumbPercentTo === 0 && this.thumbPercentFrom === 0));
  }
}

export default Slider;
