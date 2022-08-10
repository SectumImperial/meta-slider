import View from "./View";


describe('The View component tests', () => {
  const root = document.querySelector('.page__slider') as HTMLElement;
  const view = new View(root);

  test('The view must be istance of the View', () => {
    expect(view).toBeInstanceOf(View);
  })


  test('Slider should exist', () => {
    const slider = root.querySelectorAll('.slider');
    expect(slider.length).toBe(1);
  })

  test('Scale should exist', () => {
    const scale = root.querySelectorAll('.slider__scale');
    expect(scale.length).toBe(1);
  })

  test('Thumb should exist', () => {
    const thumb = root.querySelectorAll('.slider__thumb');
    expect(thumb.length).toBe(1);
  })
})