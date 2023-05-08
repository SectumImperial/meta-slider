import Observer from 'Src/Observer/Observer';
import { SLIDER_EVENTS } from 'Src/Observer/events';
import {
  SliderInterface,
  SliderEventValChangedData,
  ScaleClickData,
  ThumbID,
} from 'Src/components/Interfaces';
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

  sliderComponents!: SliderComponents;

  isScaleMarks!: boolean;

  constructor(root: Element, protected readonly state: SliderInterface) {
    super();
    this.createVariables(root, state);
    this.initSlider();
    this.setState(state);
  }

  static createSlider(): HTMLDivElement {
    const sliderWrapper = document.createElement('div');
    sliderWrapper.className = 'plugin-slider';
    return sliderWrapper;
  }

  public update(
    data: SliderEventValChangedData | ScaleClickData,
    event: string,
  ): void {
    const { size } = this.sliderComponents;
    const scaleSize = this.scaleElement.getBoundingClientRect()[size];

    if (event === SLIDER_EVENTS.VALUE_START_CHANGE) {
      const sliderData = { ...data, scaleSize };
      this.emit(SLIDER_EVENTS.DATA_COLLECTED, sliderData);
    } else {
      this.emit(SLIDER_EVENTS.DATA_COLLECTED, data);
    }
  }

  public setState(data: SliderInterface): void {
    const {
      thumbPercentFrom,
      valueFrom,
      isRange,
      thumbPercentTo,
      valueTo,
    } = data;

    this.setThumbs(thumbPercentFrom, thumbPercentTo, isRange);
    this.setTips(valueFrom, valueTo, isRange);
    this.setProgress(thumbPercentFrom, thumbPercentTo, isRange);
  }

  private setThumbs(
    thumbPercentFrom: number,
    thumbPercentTo: number | undefined,
    isRange: boolean,
  ) {
    this.thumbPercentFrom = thumbPercentFrom;
    this.thumbFrom.setPosition(this.thumbPercentFrom);

    if (isRange) {
      const secondThumb = this.slider.querySelector('#valueTo');
      if (secondThumb === null && thumbPercentTo !== undefined) {
        this.setThumb('valueTo', thumbPercentTo);
      }
    }

    if (isRange && thumbPercentTo !== undefined && this.thumbTo) {
      this.thumbPercentTo = thumbPercentTo;
      this.thumbTo.setPosition(this.thumbPercentTo);
    }
  }

  private setThumb(id: ThumbID, thumbPercent: number) {
    const thumb = id === 'valueTo' ? 'thumbTo' : 'thumbFrom';
    this[thumb] = new Thumb({
      root: this.scaleElement,
      thumbPercent,
      id,
      isVertical: this.isVertical,
    });
  }

  private setTips(valueFrom: number, valueTo: number | undefined, isRange: boolean) {
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
  }

  private setTip(valueDirection = 'valueFrom') {
    const tipValue = valueDirection === 'valueFrom' ? 'tipValueFrom' : 'tipValueTo';
    const tip = valueDirection === 'valueFrom' ? 'tipFrom' : 'tipTo';
    const percentPosition = valueDirection === 'valueFrom' ? 'thumbPercentFrom' : 'thumbPercentTo';

    if (valueDirection === 'valueTo' && this[percentPosition] === undefined) return;

    this[tip] = new Tip({
      root: this.scaleElement,
      percentPosition: this[percentPosition] as number,
      valueTip: tipValue,
      isVertical: this.isVertical,
    });
  }

  private setProgress(
    thumbPercentFrom: number,
    thumbPercentTo: number | undefined,
    isRange: boolean,
  ) {
    const progress = this.slider.querySelector('.plugin-slider__progress');
    if (progress === null) {
      const positionEnd = typeof thumbPercentTo === 'number' ? thumbPercentTo : 0;
      this.progress = new Progress({
        root: this.scaleElement,
        positionStart: this.thumbPercentFrom,
        positionEnd,
        isVertical: this.isVertical,
      });
    }
    if (this.isProgress && isRange && thumbPercentTo) {
      this.progress?.setProgressPosition(this.thumbPercentFrom, thumbPercentTo - thumbPercentFrom);
    }
    if (this.isProgress && thumbPercentTo === thumbPercentFrom) {
      this.progress?.setProgressPosition(0, 0);
    }
    if (this.isProgress && !isRange) {
      this.progress?.setProgressPosition(0, this.thumbPercentFrom);
    }
  }

  private initSlider(): void {
    this.slider = Slider.createSlider();
    this.createElements();
    this.addSlider();
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
      scaleMarks,
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
    this.isScaleMarks = scaleMarks;
    this.root = root;
  }

  private createElements(): void {
    this.sliderComponents = new SliderComponents(this.slider, this.isVertical);
    this.scale = new Scale(this.slider, this.isVertical);
    this.scaleElement = this.scale.getScale();
    this.setThumb('valueFrom', this.thumbPercentFrom);

    if (this.isRange && this.thumbPercentTo !== undefined) {
      this.setThumb('valueTo', this.thumbPercentTo);
    }

    if (this.isTip) {
      this.setTip('valueFrom');
    }

    if (this.isTip && this.thumbPercentTo && this.isRange && this.tipValueTo !== undefined) {
      this.setTip('valueTo');
    }

    this.setProgress(this.thumbPercentFrom, 0, this.isRange);

    if (this.scaleMap && this.isScaleMarks) {
      this.scaleMarks = new ScaleMarks(this.scaleElement, this.scaleMap, this.isVertical);
    }
  }

  private addSlider(): void {
    this.root.append(this.slider);
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
