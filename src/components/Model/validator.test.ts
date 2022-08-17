import initialState from '../../state';
import Validator from './Validator'



describe('The validation of data tests', () => {

  let validator: Validator;

  //  Wrong cases
  const dataStepWrong = {
    ...initialState,
    min: 0,
    max: 10,
    value: 0,
    step: 11,
  }
  const dataValWrong = {
    ...initialState,
    min: 0,
    max: 10,
    value: 11,
    step: 1,
  }

  const dataValSmallWrong = {
    ...initialState,
    min: 0,
    max: 10,
    value: -1,
    step: 1,
  }

  const dataRangeWrong = {
    ...initialState,
    min: 0,
    max: 0,
    value: 0,
    step: 1,
  }

  const dataMinMaxWrong = {
    ...initialState,
    min: 10,
    max: 0,
    value: 0,
    step: 1,
  }


  // Correct cases
  const dataStepCorrect = {
    ...initialState,
    min: 0,
    max: 10,
    value: 0,
    step: 10,
  }

  const dataValCorrect = {
    ...initialState,
    min: 0,
    max: 10,
    value: 10,
    step: 1,
  }

  const dataValSmallCorrect = {
    ...initialState,
    min: 0,
    max: 10,
    value: 0,
    step: 1,
  }

  const dataRangeCorrect = {
    ...initialState,
    min: 0,
    max: 1,
    value: 0,
    step: 1,
  }

  const dataMinMaxCorrect = {
    ...initialState,
    min: 0,
    max: 10,
    value: 0,
    step: 1,
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