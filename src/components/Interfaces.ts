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
}

interface SliderInterface extends ModelInterface {
  scaleMap?: Map<number, number>
}

interface ValidateSliderData {
  coordsMove: number,
  scaleWidth: number,
  thumbId: string,
}

type modelVal = 'min' | 'max' | 'valueFrom' | 'step' | 'valueTo';

type ThumbID = 'valueFrom' | 'valueTo'

const ThumbValPercent = {
  valueFrom: 'thumbPercentFrom',
  valueTo: 'thumbPercentTo',
}

interface HandleMoveModel {
  isRange: boolean,
  val: number | undefined,
  valueFrom: number,
  valueTo: number | undefined,
  thumb: ThumbID,
  percent: number,
  thumbPercentTo: number | undefined,
  thumbPercentFrom: number,
}

interface HandleMoveModelFrom {
  isRange: boolean,
  val: number | undefined,
  valueTo: number | undefined,
  thumb: ThumbID,
  percent: number,
  thumbPercentTo: number | undefined,
}

interface HandleMoveModelTo {
  isRange: boolean,
  val: number | undefined,
  valueFrom: number | undefined,
  thumb: ThumbID,
  percent: number,
  thumbPercentFrom: number,
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
};
