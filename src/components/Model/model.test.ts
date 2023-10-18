import Model from './Model';
import { ModelOptions } from '../Interfaces';

const initialState: ModelOptions = {
  min: 0,
  max: 100,
  valueFrom: 10,
  valueTo: 90,
  step: 1,
  isRange: true,
  thumbPercentFrom: 10,
  thumbPercentTo: 90,
  scaleMarks: false,  
  isTip: false,      
  isProgress: false,  
  isVertical: false  
};

let model: Model;

describe('Model Class Tests', () => {
  beforeEach(() => {
    model = new Model(initialState);
  });

  it('should initialize with the correct state', () => {
    expect(model.getState()).toEqual(initialState);
  });

  it('should update the state correctly', () => {
    model.setState({ valueFrom: 20 });
    expect(model.getState().valueFrom).toBe(20);
  });

  it('should handle slider click correctly', () => {
    model.handleSliderClick(50, 'valueFrom');
    expect(model.getState().valueFrom).toBeCloseTo(50);
  });

  it('should handle mouse move correctly', () => {
    model.handleMouseMove(60, 'valueFrom');
    expect(model.getState().valueFrom).toBeCloseTo(60);
  });

  it('should return the correct value', () => {
    expect(model.getValue('valueFrom')).toBe(10);
  });

  it('should return the correct percent value', () => {
    expect(model.getPercentVal()).toBeCloseTo(10);
  });

});