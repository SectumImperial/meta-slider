interface ModelInterface {
  min: number;
  max: number;
  value: number,
  step: number,
}

type modelVal = 'min' | 'max' | 'value' | 'step';

interface SliderInterface extends ModelInterface {
  thumbPercent: number;
}


export { ModelInterface, modelVal, SliderInterface };
