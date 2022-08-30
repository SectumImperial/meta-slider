interface ModelInterface {
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

interface SliderInterface extends ModelInterface {
  scaleMap?: Map<number, number>
}

type ModelVal = 'min' | 'max' | 'valueFrom' | 'step' | 'valueTo' | 'scaleMarks' | 'scalePercentGap'
  | 'isTip' | 'isProgress' | 'isRange' | 'isVertical';
type ThumbID = 'valueFrom' | 'valueTo'
type StartPointType = 'top' | 'left';
type SizeType = 'height' | 'width';

const ThumbValPercent = {
  valueFrom: 'thumbPercentFrom',
  valueTo: 'thumbPercentTo',
};

interface HandleMoveModel {
  val: number | undefined,
  thumb: ThumbID,
  percent: number,
}

interface HandleMoveModelFrom {
  val: number | undefined,
  thumb: ThumbID,
  percent: number,
}

interface HandleMoveModelTo {
  val: number | undefined,
  thumb: ThumbID,
  percent: number,
}

type KeyEvent = 'decrement' | 'increment';

interface SliderEventValChangedData {
  coordsMove: number,
  thumbId: ThumbID,
  isVertical: boolean,
  keyEvent?: KeyEvent,
}

interface ValidateSliderData {
  coordsMove: number,
  scaleSize: number,
  thumbId?: string,
  keyEvent?: KeyEvent,
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
  val: number | undefined,
  valueAnotherThumb: number | undefined,
  thumbPercent: number | undefined,
  thumb: string,
  idVal: ThumbID;
}

type StepsMap = Map<number, number>;

interface ThumbArgs {
  root: HTMLElement,
  thumbPercent: number,
  id: ThumbID,
  isVertical: boolean,
}

interface ModelSetVal {
  halfMove: number,
  halfStep: number,
  nearStepPercent: number,
  thumb: ThumbID
}

export {
  ModelInterface,
  ModelVal,
  SliderInterface,
  ValidateSliderData,
  ThumbID,
  ThumbValPercent,
  HandleMoveModel,
  HandleMoveModelFrom,
  HandleMoveModelTo,
  SliderEventValChangedData,
  ProgressData,
  TipData,
  isValTheSamePos,
  StepsMap,
  StartPointType,
  SizeType,
  ThumbArgs,
  ScaleClickData,
  ModelSetVal,
  ModelInputState,
  KeyEvent,
};
