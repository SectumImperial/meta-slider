import $ from 'jquery';
import { ModelInputState, ModelVal } from '../src/components/Interfaces';
import '../src/slider';
import './styles.scss';

interface ElementListener {
  addEventListener(type: 'change', listener: (event: InputEvent) => void): void;
}

interface ElementPress {
  addEventListener(type: 'keydown' | 'touchmove', listener: (event: KeyboardEvent) => void, options?: { passive: boolean }): void;
}

class DemoSlider {
  root: Element;

  indicator!: Element | null;

  form!: Element | null;

  min!: number;

  max!: number;

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

  mapElements!: Map<string, ModelVal>;

  slider!: import('../src/components/Presenter/Presenter').default;

  thumb?: ElementPress | null;

  stateObject!: {
    min: number;
    max: number;
    valueFrom: number;
    valueTo: number;
    step: number;
    scalePercentGap: number;
    scaleMarks: boolean;
    isTip: boolean;
    isProgress: boolean;
    isRange: boolean;
    isVertical: boolean;
  };

  constructor(root: Element) {
    this.root = root;
    this.init();
  }

  private init() {
    this.findElements();
    this.stateObject = {
      min: this.min,
      max: this.max,
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

    this.addSlider(this.stateObject);
    this.updateForm();

    this.addListeners();
  }

  private addListeners() {
    if (this.form) {
      const Elements: ElementListener[] = [];
      this.form.querySelectorAll('.slider__input').forEach((e) => {
        if (e) {
          Elements.push(e);
        }
      });

      Elements.forEach((e) => e.addEventListener('change', this.handleItemChange.bind(this)));
    }

    this.content?.addEventListener('mousedown', this.handleContentMouseDown.bind(this));
    this.content?.addEventListener('click', this.handleContentClick.bind(this));
    if (this.thumb) {
      this.thumb?.addEventListener('keydown', this.handleThumbKeyPress.bind(this));
      this.thumb?.addEventListener(
        'touchmove',
        this.handleThumbTouchMove.bind(this),
        { passive: true },
      );
    }
  }

  private handleItemChange(e: InputEvent): void {
    this.toggleIndicator();

    const { target } = e;
    if (target instanceof HTMLInputElement) {
      const { role } = target.dataset;
      const param = this.mapElements.get(`${role}`);
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
        if (param !== 'valueFrom' && param !== 'valueTo') {
          if (this.content) this.content.innerHTML = '';
          this.addSlider(this.slider.getState());
        }
        this.updateForm();
      }
    }

    this.toggleIndicator();
  }

  private toggleIndicator() {
    if (this.indicator !== null) {
      this.indicator.classList.toggle('main__slider-indicator_active');
    }
  }

  private addSlider(options: ModelInputState) {
    if (!this.content) return;
    this.slider = $(this.content).sliderPlugin(options);
  }

  private findElements() {
    this.indicator = this.root.querySelector('.main__slider-indicator');
    this.mapElements = new Map();

    this.content = this.root.querySelector('.slider__content');
    this.form = this.root.querySelector('.slider__form');
    if (!this.form) return;
    const min = <HTMLInputElement>
      this.form.querySelector('.slider__input[data-role = min]');
    this.min = Number(min.value);
    this.mapElements.set('min', 'min');

    const max = <HTMLInputElement>
      this.form.querySelector('.slider__input[data-role = max]');
    this.max = Number(max.value);
    this.mapElements.set('max', 'max');

    const step = <HTMLInputElement>
      this.form.querySelector('.slider__input[data-role = step]');
    this.step = Number(step.value);
    this.mapElements.set('step', 'step');

    const from = <HTMLInputElement>
      this.form.querySelector('.slider__input[data-role = from]');
    this.from = Number(from.value);
    from.step = `${this.step}`;
    this.mapElements.set('from', 'valueFrom');

    const to = <HTMLInputElement>
      this.form.querySelector('.slider__input[data-role = to]');
    this.to = Number(to.value);
    to.step = `${this.step}`;
    this.mapElements.set('to', 'valueTo');

    const gap = <HTMLInputElement>
      this.form.querySelector('.slider__input[data-role = gap]');
    if (gap.value) this.gap = Number(gap.value);
    this.mapElements.set('gap', 'scalePercentGap');

    const range = <HTMLInputElement>
      this.form.querySelector('.slider__input[data-role = range]');
    this.range = range.checked;
    if (this.range) to.disabled = false;
    if (!this.range) to.disabled = true;
    this.mapElements.set('range', 'isRange');

    const marks = <HTMLInputElement>
      this.form.querySelector('.slider__input[data-role = marks]');
    this.marks = marks.checked;
    if (this.marks) gap.disabled = false;
    if (!this.marks) gap.disabled = true;
    this.mapElements.set('marks', 'scaleMarks');

    const tip = <HTMLInputElement>
      this.form.querySelector('.slider__input[data-role = tip]');
    this.tip = tip.checked;
    this.mapElements.set('tip', 'isTip');

    const progress = <HTMLInputElement>
      this.form.querySelector('.slider__input[data-role = progress]');
    this.progress = progress.checked;
    this.mapElements.set('progress', 'isProgress');

    const vertical = <HTMLInputElement>
      this.form.querySelector('.slider__input[data-role = vertical]');
    this.vertical = vertical.checked;
    this.mapElements.set('vertical', 'isVertical');

    if (this.content?.querySelector('.plugin-slider__thumb')) {
      this.thumb = this.content?.querySelector('.plugin-slider__thumb');
    }
  }

  private updateForm() {
    this.mapElements.forEach((key: ModelVal, value: string) => {
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

        this.findElements();
      }
    });
  }

  private handleContentClick() {
    this.toggleIndicator();
    this.updateForm();
    this.toggleIndicator();
  }

  private handleContentMouseDown() {
    this.toggleIndicator();
    const update = () => {
      this.updateForm();
    };
    const mouseUp = () => {
      this.content?.removeEventListener('mousemove', update);
      this.content?.removeEventListener('mouseup', mouseUp);
      this.toggleIndicator();
    };

    this.content?.addEventListener('mousemove', update);
    this.content?.addEventListener('mouseup', mouseUp);
  }

  private handleThumbKeyPress(e: KeyboardEvent): void {
    this.toggleIndicator();

    const { key } = e;
    if (key === 'ArrowLeft' || key === 'ArrowUp' || key === 'ArrowRight' || key === 'ArrowDown') {
      this.updateForm();
    }

    this.toggleIndicator();
  }

  private handleThumbTouchMove() {
    this.toggleIndicator();
    const handleThumbTouchMoveStart = (e: TouchEvent) => {
      e.stopImmediatePropagation();
      this.updateForm();
    };

    const handleThumbTouchMoveStartEnd = () => {
      document.removeEventListener('touchmove', handleThumbTouchMoveStart);
      document.removeEventListener('touchend', handleThumbTouchMoveStartEnd);
      this.toggleIndicator();
    };

    document.addEventListener('touchmove', handleThumbTouchMoveStart);
    document.addEventListener('touchend', handleThumbTouchMoveStartEnd);
  }
}

document.querySelectorAll('.main__slider').forEach((e) => new DemoSlider(e));
