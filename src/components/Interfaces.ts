interface ModelInterface {
  min: number,
  max: number,
  valueFrom: number,
  valueTo?: number,
  step: number,
  thumbPercent: number,
  scaleMarks: boolean,
  scaleGap?: number,
  isTip: boolean,
  isProgress: boolean,
  isRange: boolean,
}

type modelVal = 'min' | 'max' | 'valueFrom' | 'step' | 'valueTo';

interface SliderInterface extends ModelInterface {
  scaleMap?: Map<number, number>
}

interface ValidateSliderData {
  coordsMove: number,
  scaleWidth: number,
}


export { ModelInterface, modelVal, SliderInterface, ValidateSliderData };
