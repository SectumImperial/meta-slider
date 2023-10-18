import Validator from './Validator';

const initialStateOneThumb = {
  min: 0,
  max: 10,
  valueFrom: 0,
  valueTo: undefined,
  step: 1,
  scalePercentGap: 5,
  scaleMarks: true,
  isTip: true,
  isProgress: true,
  isVertical: false,
  isRange: false,
  thumbPercentFrom: 0,
  thumbPercentTo: undefined,
};

const initialStateTwoThumb = {
  min: 0,
  max: 10,
  valueFrom: 0,
  valueTo: 5,
  step: 1,
  scalePercentGap: 5,
  scaleMarks: true,
  isTip: true,
  isProgress: true,
  isVertical: false,
  isRange: true,
  thumbPercentFrom: 0,
  thumbPercentTo: 5,
};


describe('Validator', () => {
  let validator: Validator;

  beforeEach(() => {
    validator = new Validator(initialStateOneThumb);
  });

  describe('Single thumb tests', () => {
    const testCases = [
        {
          name: 'Step cannot be bigger than all range',
          input: { ...initialStateOneThumb, step: 11 },
          expected: { ...initialStateOneThumb, step: 10 }
        },
        {
          name: 'Value cannot be bigger than max',
          input: { ...initialStateOneThumb, valueFrom: 11 },
          expected: { ...initialStateOneThumb, valueFrom: 10, thumbPercentFrom: 100 }
        },
        {
          name: 'Value cannot be smaller than min',
          input: { ...initialStateOneThumb, valueFrom: -1 },
          expected: { ...initialStateOneThumb, valueFrom: 0, thumbPercentFrom: 0 }
        },
        {
          name: 'Min and max cannot be the same',
          input: { ...initialStateOneThumb, min: 0, max: 0 },
          expected: { ...initialStateOneThumb, min: 0, max: 1 }
        },
        {
          name: 'Min cannot be bigger than max',
          input: { ...initialStateOneThumb, min: 10, max: 0 },
          expected: { ...initialStateOneThumb, min: 0, max: 10 }
        }
      ];
  
      testCases.forEach(({ name, input, expected }) => {
        it(name, () => {
          expect(validator.validateData(input)).toEqual(expected);
        });
      });
    });

    describe('Two thumb tests', () => {
      beforeEach(() => {
        validator = new Validator(initialStateTwoThumb);
      });
  
      it('Value from cannot be bigger than value to', () => {
        const input = { ...initialStateTwoThumb, valueFrom: 10, valueTo: 8 };
        const expected = { ...initialStateTwoThumb, valueFrom: 8, valueTo: 10, thumbPercentFrom: 80, thumbPercentTo: 100};
        expect(validator.validateData(input)).toEqual(expected);
      });
  
    });

  })
