interface ModelInterface {
  min: number,
  max: number,
  value: number,
  step: number,
  thumbPercent: number,
  scaleMarks: boolean,
}

type modelVal = 'min' | 'max' | 'value' | 'step';

interface SliderInterface extends ModelInterface {
  scaleMap?: Map<number, number>
}

interface ValidateSliderData {
  coordsMove: number,
  scaleWidth: number,
}


export { ModelInterface, modelVal, SliderInterface, ValidateSliderData };
