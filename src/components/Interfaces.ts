interface ModelInterface {
  min: number,
  max: number,
  value: number,
  step: number,
  thumbPercent: number;
}

type modelVal = 'min' | 'max' | 'value' | 'step';

interface SliderInterface extends ModelInterface {
  thumbPercent: number;
}

interface ValidateSliderData {
  coordsMove: number,
  scaleWidth: number,
}


export { ModelInterface, modelVal, SliderInterface, ValidateSliderData };
