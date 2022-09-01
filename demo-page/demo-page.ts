import $ from 'jquery';
import { ModelInputState, ModelVal } from '../src/components/Interfaces';
import '../src/slider';
import './styles.scss';

interface ElementListener {
  addEventListener(type: 'change', listener: (event: InputEvent) => void): void;
}

class DemoSlider {
  root: Element;

  form!: Element | null;

  min!: number | null;

  max!: number | null;

  step!: number | null;

  from!: number | null;

  to!: number | null;

  gap!: number | null;

  range!: boolean;

  marks!: boolean;

  tip!: boolean;

  progress!: boolean;

  vertical!: boolean;

  content!: Element | null;

  mapElems!: Map<string, ModelVal>;

  slider!: import('c:/Code/Meta Slider/src/components/Presenter/Presenter').default;

  constructor(root: Element) {
    this.root = root;
    this.content = root.querySelector('.slider__content');
    this.init();
  }

  private init() {
    this.findElems();
    const sateObject = {
      min: this.min || 0,
      max: this.max || 10,
      valueFrom: this.from || 0,
      valueTo: this.to || 0,
      step: this.step || 1,
      scalePercentGap: this.gap || 1,
      scaleMarks: this.marks,
      isTip: this.tip,
      isProgress: this.progress,
      isRange: this.range,
      isVertical: this.vertical,
    };

    this.addSlider(sateObject);
    this.updateForm();

    this.addListeners();
  }

  private addListeners() {
    if (this.form) {
      const elems: ElementListener[] = [];
      this.form.querySelectorAll('.slider__input').forEach((e) => {
        if (e) {
          elems.push(e);
        }
      });

      elems.forEach((e) => e.addEventListener('change', this.updateState.bind(this)));
    }
  }

  private updateState(e: InputEvent): void {
    const { target } = e;
    if (target instanceof HTMLInputElement) {
      const { role } = target.dataset;
      const param = this.mapElems.get(`${role}`);
      if (param === undefined) return;
      const valueParam = this.slider.getValue(param);
      let valueForm: number | boolean | undefined;
      if (typeof valueParam === 'boolean') {
        valueForm = target.checked;
      } else if (typeof valueParam === 'number') {
        valueForm = Number(target.value);
      } else {
        valueForm = undefined;
      }
      if (valueForm !== undefined) {
        this.slider.setValue(`${param}`, valueForm);
        if (this.content) this.content.innerHTML = '';
        this.addSlider(this.slider.getState());
        this.updateForm();
      }
    }
  }

  private addSlider(options: ModelInputState) {
    if (!this.content) return;
    this.slider = $(this.content).sliderPlugin(options);
  }

  private findElems() {
    this.mapElems = new Map();

    this.form = this.root.querySelector('.slider__form');
    if (!this.form) return;
    const min = <HTMLInputElement>
      this.form.querySelector('.slider__input[data-role = min]');
    this.min = Number(min.value);
    this.mapElems.set('min', 'min');

    const max = <HTMLInputElement>
      this.form.querySelector('.slider__input[data-role = max]');
    this.max = Number(max.value);
    this.mapElems.set('max', 'max');

    const step = <HTMLInputElement>
      this.form.querySelector('.slider__input[data-role = step]');
    this.step = Number(step.value);
    this.mapElems.set('step', 'step');

    const from = <HTMLInputElement>
      this.form.querySelector('.slider__input[data-role = from]');
    this.from = Number(from.value);
    this.mapElems.set('from', 'valueFrom');

    const to = <HTMLInputElement>
      this.form.querySelector('.slider__input[data-role = to]');
    this.to = Number(to.value);
    this.mapElems.set('to', 'valueTo');

    const gap = <HTMLInputElement>
      this.form.querySelector('.slider__input[data-role = gap]');
    if (gap.value) this.gap = Number(gap.value);
    this.mapElems.set('gap', 'scalePercentGap');

    const range = <HTMLInputElement>
      this.form.querySelector('.slider__input[data-role = range]');
    this.range = range.checked;
    if (this.range) to.disabled = false;
    if (!this.range) to.disabled = true;
    this.mapElems.set('range', 'isRange');

    const marks = <HTMLInputElement>
      this.form.querySelector('.slider__input[data-role = marks]');
    this.marks = marks.checked;
    if (this.marks) gap.disabled = false;
    if (!this.marks) gap.disabled = true;
    this.mapElems.set('marks', 'scaleMarks');

    const tip = <HTMLInputElement>
      this.form.querySelector('.slider__input[data-role = tip]');
    this.tip = tip.checked;
    this.mapElems.set('tip', 'isTip');

    const progress = <HTMLInputElement>
      this.form.querySelector('.slider__input[data-role = progress]');
    this.progress = progress.checked;
    this.mapElems.set('progress', 'isProgress');

    const vertical = <HTMLInputElement>
      this.form.querySelector('.slider__input[data-role = vertical]');
    this.vertical = vertical.checked;
    this.mapElems.set('vertical', 'isVertical');
  }

  private updateForm() {
    this.mapElems.forEach((key: ModelVal, value: string) => {
      const element = this.form?.querySelector(`.slider__input[data-role = ${value}]`);
      if (element instanceof HTMLInputElement) {
        if (element && typeof this.slider.getValue(key) === 'number') {
          element.value = `${this.slider.getValue(`${key}`)}`;
        }

        if (element && typeof this.slider.getValue(key) === 'boolean') {
          if (this.slider.getValue(`${key}`)) {
            element.checked = true;
          } else {
            element.checked = false;
          }
        }
      }
    });
  }
}

document.querySelectorAll('.slider').forEach((e) => new DemoSlider(e));
