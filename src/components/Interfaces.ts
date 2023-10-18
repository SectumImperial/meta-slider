interface ModelOptions {
  min: number,
  max: number,
  valueFrom: number,
  valueTo: number | undefined,
  thumbPercentFrom: number,
  thumbPercentTo: number | undefined,
  step: number,
  scaleMarks: boolean,
  scalePercentGap?: number,
  isTip: boolean,
  isProgress: boolean,
  isRange: boolean,
  isVertical: boolean,
}

interface ModelInputState {
  min: number,
  max: number,
  valueFrom: number,
  valueTo: number | undefined,
  step: number,
  scaleMarks: boolean,
  scalePercentGap?: number,
  isTip: boolean,
  isProgress: boolean,
  isRange: boolean,
  isVertical: boolean
}

interface SliderOptions extends ModelOptions {
  scaleMap?: Map<number, number>
}

type ModelValue = 'min' | 'max' | 'valueFrom' | 'step' | 'valueTo' | 'scaleMarks' | 'scalePercentGap'
  | 'isTip' | 'isProgress' | 'isRange' | 'isVertical';
type ThumbId = 'valueFrom' | 'valueTo'
type StartPoint = 'top' | 'left';
type SizePoint = 'height' | 'width';

const ThumbValPercent = {
  valueFrom: 'thumbPercentFrom',
  valueTo: 'thumbPercentTo',
};

interface HandledMoveModel {
  value: number | undefined,
  thumb: ThumbId,
  percent: number,
}

interface HandledMoveModelFrom {
  value: number | undefined,
  thumb: ThumbId,
  percent: number,
}

interface HandledMoveModelTo {
  value: number | undefined,
  thumb: ThumbId,
  percent: number,
}

type KeyEvent = 'decrement' | 'increment';

interface SliderEventValChangedData {
  coordsMove: number,
  thumbId: ThumbId,
  isVertical: boolean,
  keyEvent?: KeyEvent,
}

interface ValidSliderData {
  coordsMove: number,
  scaleSize: number,
  thumbId?: ThumbId,
  keyEvent?: KeyEvent,
  percent?: number,
  value?: number,
}

interface ScaleClickData {
  clickPos: number,
  scaleSize: number,
}

interface ProgressData {
  root: Element,
  positionStart: number,
  positionEnd: number,
  isVertical: boolean;
}

interface TipData {
  root: HTMLDivElement,
  percentPosition: number,
  valueTip: number | string,
  isVertical: boolean,
}

interface isValueTheSamePos {
  value: number | undefined,
  valueAnotherThumb: number | undefined,
  thumbPercent: number | undefined,
  thumb: string,
  idVal: ThumbId;
}

type StepsMap = Map<number, number>;

interface ThumbArgs {
  root: HTMLElement,
  thumbPercent: number,
  id: ThumbId,
  isVertical: boolean,
  minValue: number,
  maxValue: number,
}

interface ModelSetVal {
  halfMove: number,
  halfStep: number,
  nearStepPercent: number,
  thumb: ThumbId
}

type MarkValue = number;
type MarkPercent = number;
type Marks = Map<MarkPercent, MarkValue>;



interface SliderBooleans {
  isProgress: boolean;
  isRange: boolean;
  isVertical: boolean;
  isTip: boolean;
  isScaleMarks: boolean;
}

interface SliderNumbers {
  tipValueFrom: number;
  thumbPercentFrom: number;
  thumbPercentTo: number | undefined;
  tipValueTo: number | undefined;
}

interface SliderDOM {
  slider?: HTMLDivElement;
  scaleElement?: HTMLDivElement;
  root?: Element;
}


export {
  ModelOptions,
  ModelValue,
  SliderOptions,
  ValidSliderData,
  ThumbId,
  ThumbValPercent,
  HandledMoveModel,
  HandledMoveModelFrom,
  HandledMoveModelTo,
  SliderEventValChangedData,
  ProgressData,
  TipData,
  isValueTheSamePos,
  StepsMap,
  StartPoint,
  SizePoint,
  ThumbArgs,
  ScaleClickData,
  ModelSetVal,
  ModelInputState,
  KeyEvent,
  Marks,
  MarkPercent,
  MarkValue,
  SliderBooleans,
  SliderNumbers,
  SliderDOM,
};
