interface ModelInterface {
  min: number,
  max: number,
  valueFrom: number,
  valueTo?: number,
  thumbPercentFrom: number,
  thumbPercentTo?: number,
  step: number,
  scaleMarks: boolean,
  scalePercentGap?: number,
  isTip: boolean,
  isProgress: boolean,
  isRange: boolean,
  isVertical: boolean,
}

interface SliderInterface extends ModelInterface {
  scaleMap?: Map<number, number>
}

interface ValidateSliderData {
  coordsMove: number,
  scaleSize: number,
  thumbId: string,
}

interface ValidateSliderDataClicked {
  clickPos: number,
  scaleSize: number,
}

type modelVal = 'min' | 'max' | 'valueFrom' | 'step' | 'valueTo';
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

interface SliderEventValChangedData {
  coordsMove: number,
  thumbId: ThumbID,
  isVertical: boolean
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

interface isValCorrectInRangeArgs {
  val: number | undefined,
  value: number | undefined,
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
  modelVal,
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
  isValCorrectInRangeArgs,
  StepsMap,
  StartPointType,
  SizeType,
  ThumbArgs,
  ScaleClickData,
  ValidateSliderDataClicked,
  ModelSetVal,
};
