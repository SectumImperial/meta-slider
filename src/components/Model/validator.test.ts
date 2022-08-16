import Validator from './Validator'


describe('The validation of data tests', () => {

  let validator: Validator;

  //  Wrong cases
  const dataStepWrong = {
    min: 0,
    max: 10,
    value: 0,
    step: 11,
    thumbPercent: 0,
    scaleMarks: false,
  }
  const dataValWrong = {
    min: 0,
    max: 10,
    value: 11,
    step: 1,
    thumbPercent: 110,
    scaleMarks: false,
  }

  const dataValSmallWrong = {
    min: 0,
    max: 10,
    value: -1,
    step: 1,
    thumbPercent: -10,
    scaleMarks: false,
  }

  const dataRangeWrong = {
    min: 0,
    max: 0,
    value: 0,
    step: 1,
    thumbPercent: 0,
    scaleMarks: false,
  }

  const dataMinMaxWrong = {
    min: 10,
    max: 0,
    value: 0,
    step: 1,
    thumbPercent: 0,
    scaleMarks: false,
  }


  // Correct cases
  const dataStepCorrect = {
    min: 0,
    max: 10,
    value: 0,
    step: 10,
    thumbPercent: 0,
    scaleMarks: false,
  }

  const dataValCorrect = {
    min: 0,
    max: 10,
    value: 10,
    step: 1,
    thumbPercent: 100,
    scaleMarks: false,
  }

  const dataValSmallCorrect = {
    min: 0,
    max: 10,
    value: 0,
    step: 1,
    thumbPercent: 0,
    scaleMarks: false,
  }

  const dataRangeCorrect = {
    min: 0,
    max: 1,
    value: 0,
    step: 1,
    thumbPercent: 0,
    scaleMarks: false,
  }

  const dataMinMaxCorrect = {
    min: 0,
    max: 10,
    value: 0,
    step: 1,
    thumbPercent: 0,
    scaleMarks: false,
  }

  test('Step can not be bigger than all range', () => {
    validator = new Validator(dataStepWrong);
    expect(validator.validateData()).toEqual(dataStepCorrect)
  })

  test('Value can not be bigger than max', () => {
    validator = new Validator(dataValWrong);
    expect(validator.validateData()).toEqual(dataValCorrect)
  })

  test('Value can not be smaller than min', () => {
    validator = new Validator(dataValWrong);
    expect(validator.validateData()).toEqual(dataValCorrect)
  })

  test('Value can not be smaller than min', () => {
    validator = new Validator(dataValSmallWrong);
    expect(validator.validateData()).toEqual(dataValSmallCorrect)
  })

  test('Min and max canot be the same', () => {
    validator = new Validator(dataRangeWrong);
    expect(validator.validateData()).toEqual(dataRangeCorrect)
  })

  test('Min can not be bigger than max', () => {
    validator = new Validator(dataMinMaxWrong);
    expect(validator.validateData()).toEqual(dataMinMaxCorrect)
  })

})