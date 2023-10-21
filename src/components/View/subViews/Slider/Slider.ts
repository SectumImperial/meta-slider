import Observer from '@src/Observer/Observer';
import { SLIDER_EVENTS } from '@src/Observer/events';
import {
  SliderOptions,
  SliderEventValChangedData,
  ScaleClickData,
  ThumbAttr,
} from '@src/components/Interfaces';
import Progress from '../Progress/Progress';
import Scale from '../Scale/Scale';
import ScaleMarks from '../ScaleMarks/ScaleMarks';
import SliderComponents from '../SliderComponents/SliderComponents';
import Thumb from '../Thumb/Thumb';
import Tip from '../Tip/Tip';
import './slider.scss';

class Slider extends Observer {

  public classElements: {
    thumbFrom: Thumb | undefined;
    thumbTo: Thumb | undefined;
    scale: Scale | undefined;
    scaleMarks: ScaleMarks | undefined;
    tipFrom: Tip | undefined;
    tipTo: Tip | undefined;
    progress: Progress | undefined;
    sliderComponents: SliderComponents | undefined;
  };

  public booleanVariables: {
    isProgress: boolean;
    isRange: boolean;
    isVertical: boolean;
    isTip: boolean;
    isScaleMarks: boolean;
  };

  private numberVariables: {
    tipValueFrom: number | undefined;
    thumbPercentFrom: number | undefined;
    thumbPercentTo: number | undefined;
    tipValueTo: number | undefined;
  };

  private dom: {
    slider: undefined | HTMLDivElement;
    scaleElement: undefined | HTMLDivElement;
    root?: Element;
  };

  private scaleMap: Map<number, number> | undefined;

  constructor(root: Element, protected readonly state: SliderOptions) {
    super();

    this.dom = {
      slider: undefined,
      scaleElement: undefined,
      root,
    };

    this.numberVariables = {
      tipValueFrom: 0,
      thumbPercentFrom: 0,
      thumbPercentTo: undefined,
      tipValueTo: undefined,
    };

    this.booleanVariables = {
      isProgress: false,
      isRange: false,
      isVertical: false,
      isTip: false,
      isScaleMarks: false,
    };

    this.classElements = {
      thumbFrom: undefined,
      thumbTo: undefined,
      scale: undefined,
      scaleMarks: undefined,
      tipFrom: undefined,
      tipTo: undefined,
      progress: undefined,
      sliderComponents: undefined,
    };

    this.createVariables(root, state);
    this.init();
    this.setState(state);
  }

  static createSlider(): HTMLDivElement {
    const sliderWrapper = document.createElement('div');
    sliderWrapper.className = 'plugin-slider js-plugin-slider';
    return sliderWrapper;
  }

  public update(
    data: SliderEventValChangedData | ScaleClickData,
    event: string,
  ): void {
    if (this.dom === undefined) return;
    if (this.classElements.sliderComponents === undefined
      || this.dom.scaleElement === undefined) return;
    const { size } = this.classElements.sliderComponents;
    const scaleSize = this.dom.scaleElement.getBoundingClientRect()[size];

    if (event === SLIDER_EVENTS.VALUE_START_CHANGE) {
      const sliderData = { ...data, scaleSize };
      this.emit(SLIDER_EVENTS.DATA_COLLECTED, sliderData);
    } else {
      this.emit(SLIDER_EVENTS.DATA_COLLECTED, data);
    }
  }

  public setState(data: SliderOptions): void {
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
    if (this.classElements.thumbFrom === undefined) return;
    if (this.numberVariables === undefined) return;
    if (this.dom === undefined) return;

    this.numberVariables.thumbPercentFrom = thumbPercentFrom;
    this.classElements.thumbFrom.setPosition(this.numberVariables.thumbPercentFrom);

    if (isRange && this.dom.slider !== undefined) {
      const secondThumb = this.dom.slider.querySelector('#valueTo');
      if (secondThumb === null && thumbPercentTo !== undefined) {
        this.setThumb('valueTo', thumbPercentTo);
      }
    }

    if (isRange && thumbPercentTo !== undefined && this.classElements.thumbTo) {
      this.numberVariables.thumbPercentTo = thumbPercentTo;
      this.classElements.thumbTo.setPosition(this.numberVariables.thumbPercentTo);
    }
  }

  private setThumb(attr: ThumbAttr, thumbPercent: number) {
    const thumb = attr === 'valueTo' ? 'thumbTo' : 'thumbFrom';
    if (this.dom === undefined || this.booleanVariables === undefined) return;
    if (this.dom.scaleElement === undefined
      || this.booleanVariables.isVertical === undefined) return;
    this.classElements[thumb] = new Thumb({
      root: this.dom.scaleElement,
      thumbPercent,
      attr: attr,
      isVertical: this.booleanVariables.isVertical,
      minValue: this.state.min,
      maxValue: this.state.max,
    });
  }

  private setTips(valueFrom: number, valueTo: number | undefined, isRange: boolean) {
    if (this.booleanVariables === undefined) return;
    if (this.numberVariables === undefined) return;

    const { isTip } = this.booleanVariables;
    if (isTip && this.classElements.tipFrom) {
      this.numberVariables.tipValueFrom = valueFrom;
      if (this.numberVariables.thumbPercentFrom === undefined) return;
      this.classElements.tipFrom.setPosition(
        this.numberVariables.thumbPercentFrom,
        this.numberVariables.tipValueFrom,
      );
    }

    if (this.isNeedDoubleTip()) {
      this.classElements.tipFrom?.setValueTip(`${valueFrom} - ${valueTo}`);
      this.classElements.tipTo?.hideTip();
    } else {
      this.classElements.tipTo?.showTip();
    }

    if (isRange
      && this.classElements.tipTo && valueTo !== undefined && this.numberVariables.thumbPercentTo) {
      this.numberVariables.tipValueTo = valueTo;
      this.classElements.tipTo.setPosition(
        this.numberVariables.thumbPercentTo,
        this.numberVariables.tipValueTo,
      );
    }
  }

  private setTip(valueDirection = 'valueFrom') {
    const tipValue = valueDirection === 'valueFrom' ? 'tipValueFrom' : 'tipValueTo';
    const tip = valueDirection === 'valueFrom' ? 'tipFrom' : 'tipTo';
    const percentPosition = valueDirection === 'valueFrom' ? 'thumbPercentFrom' : 'thumbPercentTo';

    if (this.numberVariables === undefined) return;
    if (this.dom === undefined) return;
    if (this.booleanVariables === undefined) return;

    if (valueDirection === 'valueTo' && this.numberVariables[percentPosition] === undefined) return;
    if (this.dom.scaleElement === undefined
      || this.booleanVariables.isVertical === undefined) return;

    this.classElements[tip] = new Tip({
      root: this.dom.scaleElement,
      percentPosition: this.numberVariables[percentPosition]  ?? 0,
      valueTip: tipValue,
      isVertical: this.booleanVariables.isVertical,
    });
  }

  private setProgress(
    thumbPercentFrom: number,
    thumbPercentTo: number | undefined,
    isRange: boolean,
  ) {
    if (this.dom === undefined) return;
    if (this.booleanVariables === undefined) return;
    if (this.numberVariables === undefined) return;
    if (this.dom.slider === undefined) return;

    const progress = this.dom.slider.querySelector('.js-plugin-slider__progress');
    if (progress === null) {
      const positionEnd = typeof thumbPercentTo === 'number' ? thumbPercentTo : 0;

      if (this.dom.scaleElement === undefined
        || this.booleanVariables.isVertical === undefined
        || this.numberVariables.thumbPercentFrom === undefined) return;
      this.classElements.progress = new Progress({
        root: this.dom.scaleElement,
        positionStart: this.numberVariables.thumbPercentFrom,
        positionEnd,
        isVertical: this.booleanVariables.isVertical,
      });
    }
    if (this.booleanVariables.isProgress && isRange && thumbPercentTo) {
      this.classElements.progress?.setProgressPosition(
        this.numberVariables.thumbPercentFrom,
        thumbPercentTo - thumbPercentFrom,
      );
    }
    if (this.booleanVariables.isProgress && thumbPercentTo === thumbPercentFrom) {
      this.classElements.progress?.setProgressPosition(0, 0);
    }
    if (this.booleanVariables.isProgress && !isRange) {
      this.classElements.progress?.setProgressPosition(0, this.numberVariables.thumbPercentFrom);
    }
  }

  private init(): void {
    if (this.dom === undefined) return;
    this.dom.slider = Slider.createSlider();
    this.createElements();
    this.addSlider();
  }

  private createVariables(root: Element, state: SliderOptions): void {
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

    if (this.numberVariables === undefined) return;
    this.numberVariables.thumbPercentFrom = thumbPercentFrom;
    if (thumbPercentTo) this.numberVariables.thumbPercentTo = thumbPercentTo;

    if (this.booleanVariables === undefined) return;
    this.booleanVariables.isTip = isTip || false;
    this.numberVariables.tipValueFrom = valueFrom || 0;
    this.numberVariables.tipValueTo = valueTo || 0;
    this.booleanVariables.isProgress = isProgress || false;
    this.booleanVariables.isRange = isRange || false;
    this.booleanVariables.isVertical = isVertical || false;
    this.scaleMap = scaleMap;
    this.booleanVariables.isScaleMarks = scaleMarks;

    if (this.dom === undefined) return;
    this.dom.root = root;
  }

  private createElements(): void {
    if (this.dom === undefined || this.booleanVariables === undefined
      || this.numberVariables === undefined) return;
    if (this.dom.slider === undefined || this.booleanVariables.isVertical === undefined) return;
    if (this.numberVariables.thumbPercentFrom === undefined) return;

    this.classElements.sliderComponents = new SliderComponents(
      this.dom.slider,
      this.booleanVariables.isVertical,
    );

    this.classElements.scale = new Scale(this.dom.slider, this.booleanVariables.isVertical);
    this.dom.scaleElement = this.classElements.scale.getScale();
    this.setThumb('valueFrom', this.numberVariables.thumbPercentFrom);

    if (this.booleanVariables.isRange && this.numberVariables.thumbPercentTo !== undefined) {
      this.setThumb('valueTo', this.numberVariables.thumbPercentTo);
    }

    if (this.booleanVariables.isTip) {
      this.setTip('valueFrom');
    }

    if (this.booleanVariables.isTip && this.numberVariables.thumbPercentTo
      && this.booleanVariables.isRange && this.numberVariables.tipValueTo !== undefined) {
      this.setTip('valueTo');
    }

    if (this.booleanVariables.isRange !== undefined) {
      this.setProgress(this.numberVariables.thumbPercentFrom, 0, this.booleanVariables.isRange);
    }

    if (this.scaleMap && this.booleanVariables.isScaleMarks) {
      this.classElements.scaleMarks = new ScaleMarks(
        this.dom.scaleElement,
        this.scaleMap,
        this.booleanVariables.isVertical,
      );
    }
  }

  private addSlider(): void {
    if (this.dom === undefined) return;
    if (this.dom.root === undefined || this.dom.slider === undefined) return;
    this.dom.root.append(this.dom.slider);
  }

  private isNeedDoubleTip(): boolean {
    if (this.booleanVariables === undefined || this.numberVariables === undefined) return false;
    if (this.numberVariables.thumbPercentTo === undefined
      || this.booleanVariables.isRange === undefined
      || this.numberVariables.thumbPercentFrom === undefined
      || this.booleanVariables.isTip === undefined) return false;

    return ((this.numberVariables.thumbPercentTo - this.numberVariables.thumbPercentFrom <= 2)
      || (this.numberVariables.thumbPercentTo === 0
        && this.numberVariables.thumbPercentFrom === 0));
  }
}

export default Slider;