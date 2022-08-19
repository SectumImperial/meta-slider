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


export { ModelInterface, modelVal, SliderInterface, ValidateSliderData, ThumbID, ThumbValPercent };
