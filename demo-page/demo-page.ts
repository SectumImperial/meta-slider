import $ from 'jquery';
import { ModelInputState, ModelValue } from 'Src/components/Interfaces';
import '../src/slider';
import './styles.scss';

interface ElementListener {
  addEventListener(type: 'change', listener: (event: InputEvent) => void): void;
}

interface ElementPress {
  addEventListener(type: 'keydown' | 'touchmove', listener: (event: KeyboardEvent) => void, options?: { passive: boolean }): void;
}

class DemoSlider {
  dom: {
    root: Element;
    indicator: Element | null;
    form?: Element | null;
    content?: Element | null;
    thumb?: ElementPress | null;
  };

  booleanVariables: {
    range: boolean;
    marks: boolean;
    tip: boolean;
    progress: boolean;
    vertical: boolean;
  };

  numericVariables: {
    min: number;
    max: number;
    step: number;
    from: number | null;
    to?: number | null;
    gap?: number | null;
  };

  mapElements?: Map<string, ModelValue>;

  slider?: import('../src/components/Presenter/Presenter').default;

  stateObject?: {
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
    this.dom = {
      root,
      indicator: null,
      form: null,
      content: null,
      thumb: null,
    };

    this.numericVariables = {
      min: 0,
      max: 10,
      step: 1,
      from: 1,
      to: null,
      gap: null,
    };

    this.booleanVariables = {
      range: false,
      marks: false,
      tip: false,
      progress: false,
      vertical: false,
    };

    if (this.dom !== undefined) this.dom.root = root;

    this.handleItemChange = this.handleItemChange.bind(this);
    this.handleContentPointerDown = this.handleContentPointerDown.bind(this);
    this.handleContentClick = this.handleContentClick.bind(this);
    this.handleThumbKeyPress = this.handleThumbKeyPress.bind(this);
    this.handleThumbTouchMove = this.handleThumbTouchMove.bind(this);
    this.init();
  }

  private init() {
    this.findElements();

    this.stateObject = {
      min: this.numericVariables.min,
      max: this.numericVariables.max,
      valueFrom: this.numericVariables.from || 0,
      valueTo: this.numericVariables.to || 0,
      step: this.numericVariables.step || 1,
      scalePercentGap: this.numericVariables.gap || 1,
      scaleMarks: this.booleanVariables.marks,
      isTip: this.booleanVariables.tip,
      isProgress: this.booleanVariables.progress,
      isRange: this.booleanVariables.range,
      isVertical: this.booleanVariables.vertical,
    };

    this.addSlider(this.stateObject);
    this.updateForm();

    this.addListeners();
  }

  private addListeners() {
    if (this.dom === undefined) return;
    if (this.dom.form !== undefined && this.dom.form !== null) {
      const elements: ElementListener[] = [];
      this.dom.form.querySelectorAll('.js-slider__input').forEach((e) => {
        if (e) {
          elements.push(e);
        }
      });

      elements.forEach((e) => e.addEventListener('change', this.handleItemChange));
    }

    this.dom.content?.addEventListener('pointerdown', this.handleContentPointerDown);
    this.dom.content?.addEventListener('click', this.handleContentClick);
    if (this.dom.thumb !== null) {
      this.dom.thumb?.addEventListener('keydown', this.handleThumbKeyPress);
      this.dom.thumb?.addEventListener(
        'touchmove',
        this.handleThumbTouchMove,
        { passive: true },
      );
    }
  }

  private handleItemChange(e: InputEvent): void {
    if (this.dom === undefined) return;

    this.toggleIndicator();
    if (this.mapElements === undefined || this.slider === undefined) return;
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
          if (this.dom.content) this.dom.content.innerHTML = '';
          this.addSlider(this.slider.getState());
        }
        this.updateForm();
      }
    }

    this.toggleIndicator();
  }

  private toggleIndicator() {
    if (this.dom === undefined) return;
    if (this.dom.indicator !== undefined && this.dom.indicator !== null) {
      this.dom.indicator.classList.toggle('main__slider-indicator_active');
    }
  }

  private addSlider(options: ModelInputState) {
    if (this.dom === undefined) return;
    if (!this.dom.content) return;
    this.slider = $(this.dom.content).sliderPlugin(options);
  }

  private findElements() {
    if (this.dom === undefined) return;
    if (this.dom.root === undefined) return;
    this.dom.indicator = this.dom.root.querySelector('.js-main__slider-indicator');
    this.mapElements = new Map();

    this.dom.content = this.dom.root.querySelector('.js-slider__content');
    this.dom.form = this.dom.root.querySelector('.js-slider__form');
    if (!this.dom.form) return;
    const min = <HTMLInputElement>
      this.dom.form.querySelector('.js-slider__input[data-role = min]');
    if (this.numericVariables === undefined) return;
    this.numericVariables.min = Number(min.value);
    this.mapElements.set('min', 'min');

    const max = <HTMLInputElement>
      this.dom.form.querySelector('.js-slider__input[data-role = max]');
    this.numericVariables.max = Number(max.value);
    this.mapElements.set('max', 'max');

    const step = <HTMLInputElement>
      this.dom.form.querySelector('.js-slider__input[data-role = step]');
    this.numericVariables.step = Number(step.value);
    this.mapElements.set('step', 'step');

    const from = <HTMLInputElement>
      this.dom.form.querySelector('.js-slider__input[data-role = from]');
    this.numericVariables.from = Number(from.value);

    from.step = `${this.numericVariables.step}`;
    this.mapElements.set('from', 'valueFrom');

    const to = <HTMLInputElement>
      this.dom.form.querySelector('.js-slider__input[data-role = to]');
    this.numericVariables.to = Number(to.value);
    to.step = `${this.numericVariables.step}`;
    this.mapElements.set('to', 'valueTo');

    const gap = <HTMLInputElement>
      this.dom.form.querySelector('.js-slider__input[data-role = gap]');
    if (gap.value) this.numericVariables.gap = Number(gap.value);
    this.mapElements.set('gap', 'scalePercentGap');

    const range = <HTMLInputElement>
      this.dom.form.querySelector('.js-slider__input[data-role = range]');

    if (this.booleanVariables === undefined) return;
    this.booleanVariables.range = range.checked;
    if (this.booleanVariables.range) to.disabled = false;
    if (!this.booleanVariables.range) to.disabled = true;
    this.mapElements.set('range', 'isRange');

    const marks = <HTMLInputElement>
      this.dom.form.querySelector('.js-slider__input[data-role = marks]');
    this.booleanVariables.marks = marks.checked;
    if (this.booleanVariables.marks) gap.disabled = false;
    if (!this.booleanVariables.marks) gap.disabled = true;
    this.mapElements.set('marks', 'scaleMarks');

    const tip = <HTMLInputElement>
      this.dom.form.querySelector('.js-slider__input[data-role = tip]');
    this.booleanVariables.tip = tip.checked;
    this.mapElements.set('tip', 'isTip');

    const progress = <HTMLInputElement>
      this.dom.form.querySelector('.js-slider__input[data-role = progress]');
    this.booleanVariables.progress = progress.checked;
    this.mapElements.set('progress', 'isProgress');

    const vertical = <HTMLInputElement>
      this.dom.form.querySelector('.js-slider__input[data-role = vertical]');
    this.booleanVariables.vertical = vertical.checked;
    this.mapElements.set('vertical', 'isVertical');

    if (this.dom.content?.querySelector('.js-plugin-slider__thumb')) {
      this.dom.thumb = this.dom.content?.querySelector('.js-plugin-slider__thumb');
    }
  }

  private updateForm() {
    if (this.mapElements === undefined) return;
    this.mapElements.forEach((key: ModelValue, value: string) => {
      if (this.dom === undefined) return;
      const element = this.dom.form?.querySelector(`.js-slider__input[data-role = ${value}]`);
      if (element instanceof HTMLInputElement) {
        if (this.slider === undefined) return;
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

  private handleContentPointerDown() {
    if (this.dom === undefined) return;
    this.toggleIndicator();
    const handlePointerMove = () => {
      this.updateForm();
    };
    const handlePointerUp = () => {
      if (this.dom === undefined) return;
      this.dom.content?.removeEventListener('pointermove', handlePointerMove);
      this.dom.content?.removeEventListener('pointerup', handlePointerUp);
      this.toggleIndicator();
    };

    this.dom.content?.addEventListener('pointermove', handlePointerMove);
    this.dom.content?.addEventListener('pointerup', handlePointerUp);
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

document.querySelectorAll('.js-main__slider').forEach((e) => new DemoSlider(e));
