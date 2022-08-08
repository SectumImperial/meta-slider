import { max, add } from './index';

test('test methods', () => {
  expect(max.getData()).toBe(`Max is 24`);
});

test('test properties', () => {
  expect(max.name).toBe('Max');
});

test('test sum', () => {
  expect(add(2, 6)).toBe(8);
});
