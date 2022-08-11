interface ModelInterface {
  min: number;
  max: number;
  value: number,
  step: number,
}

type modelVal = 'min' | 'max' | 'value' | 'step';


export { ModelInterface, modelVal };
