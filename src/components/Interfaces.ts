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

type ModelVal = 'min' | 'max' | 'valueFrom' | 'step' | 'valueTo' | 'scaleMarks' | 'scalePercentGap'
  | 'isTip' | 'isProgress' | 'isRange' | 'isVertical';
type ThumbId = 'valueFrom' | 'valueTo'
type StartPoint = 'top' | 'left';
type SizePoint = 'height' | 'width';

const ThumbValPercent = {
  valueFrom: 'thumbPercentFrom',
  valueTo: 'thumbPercentTo',
};

interface HandleMoveModel {
  value: number | undefined,
  thumb: ThumbId,
  percent: number,
}

interface HandleMoveModelFrom {
  value: number | undefined,
  thumb: ThumbId,
  percent: number,
}

interface HandleMoveModelTo {
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

interface ValidateSliderData {
  coordsMove: number,
  scaleSize: number,
  thumbId?: string,
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

interface isValTheSamePos {
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
}

interface ModelSetVal {
  halfMove: number,
  halfStep: number,
  nearStepPercent: number,
  thumb: ThumbId
}

export {
  ModelOptions,
  ModelVal,
  SliderOptions,
  ValidateSliderData,
  ThumbId,
  ThumbValPercent,
  HandleMoveModel,
  HandleMoveModelFrom,
  HandleMoveModelTo,
  SliderEventValChangedData,
  ProgressData,
  TipData,
  isValTheSamePos,
  StepsMap,
  StartPoint,
  SizePoint,
  ThumbArgs,
  ScaleClickData,
  ModelSetVal,
  ModelInputState,
  KeyEvent,
};
