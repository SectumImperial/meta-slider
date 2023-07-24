import $ from 'jquery';
import { ModelInputState, ModelValue } from '@src/components/Interfaces';
import '../src/slider';
import './styles.scss';

class DemoSlider {
  private dom: {
    root: Element;
    indicator: Element | null;
    form?: Element | null;
    content?: Element | null;
    thumb?: Element | null;
  };

  private booleanVariables: {
    range: boolean;
    marks: boolean;
    tip: boolean;
    progress: boolean;
    vertical: boolean;
  };

  private numericVariables: {
    min: number;
    max: number;
    step: number;
    from: number | null;
    to?: number | null;
    gap?: number | null;
  };

  private mapElements: Map<string, ModelValue> | undefined;
  private slider: import('../src/components/Presenter/Presenter').default | undefined;
  private formValues: Map<string, string>;

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

    this.handleItemChange = this.handleItemChange.bind(this);
    this.handleContentPointerDown = this.handleContentPointerDown.bind(this);
    this.handleContentClick = this.handleContentClick.bind(this);
    this.handleThumbKeyPress = this.handleThumbKeyPress.bind(this);
    this.handleThumbTouchMove = this.handleThumbTouchMove.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.init();

    this.formValues = DemoSlider.getFormValues(this.dom.form as HTMLFormElement);
  }

  public init() {
    this.findElements();
    this.createSlider(this.getSliderOptions());
    this.addListeners();
  }

  public static getFormValues(form: HTMLFormElement): Map<string, string> {
    const formValues = new Map<string, string>();
    const formElements = Array.from(form.querySelectorAll('.js-slider__input[data-role]'));
    formElements.forEach((element: Element) => {
      const key = element.getAttribute('data-role');
      if (key !== null && element instanceof HTMLInputElement) {
        formValues.set(key, element.value);
      }
    });
    return formValues;
  }

  private addListeners() {
    if (this.dom.form === undefined || this.dom.form === null) return;

    const elements = Array.from(this.dom.form.querySelectorAll('.js-slider__input'));
    elements.forEach((element: Element) => {
      if (element instanceof HTMLElement) {
        const { role } = element.dataset;
        if (role) {
          element.addEventListener('change ', (e: Event) => {
            const inputEvent = e as InputEvent;
            this.handleItemChange(inputEvent);
          });
        }
      }
    });

    this.dom.content?.addEventListener('pointerdown', this.handleContentPointerDown);
    this.dom.content?.addEventListener('click', this.handleContentClick);
    if (this.dom.thumb) {
      this.dom.thumb.addEventListener('keydown', (e: Event) => this.handleThumbKeyPress(e as KeyboardEvent));
      this.dom.thumb.addEventListener('touchmove', this.handleThumbTouchMove, { passive: true });
    }
  }

  private toggleIndicator() {
    if (this.dom.indicator) {
      this.dom.indicator.classList.toggle('main__slider-indicator_active');
      setTimeout(() => {
        if (this.dom.indicator) {
          this.dom.indicator.classList.toggle('main__slider-indicator_active');
        }
      }, 100);
    }
  }

  private handleItemChange(e: InputEvent): void {
    const { target } = e;

    if (target instanceof HTMLInputElement) {
      const { role } = target.dataset;
      const param = this.mapElements?.get(`${role}`);
      if (param === undefined || this.slider === undefined) return;
      const valueParam = this.slider.getValue(param);

      let value: number | boolean | undefined;
      if (typeof valueParam === 'boolean') {
        value = target.checked;
      } else if (typeof valueParam === 'number') {
        value = Number(target.value);
      }

      if (value !== undefined) {
        this.slider.setValue(`${param}`, value);
        if (param !== 'valueFrom' && param !== 'valueTo') {
          if (this.dom.content !== null && this.dom.content !== undefined) {
            this.dom.content.innerHTML = '';
            this.createSlider(this.slider.getState());
          }
        }
        this.handleFormChange();
      }
    }
  }

  private hasFormChanged(form: HTMLFormElement): boolean {
    const newFormValues = DemoSlider.getFormValues(form);
    if (newFormValues.size !== this.formValues.size) {
      this.formValues = newFormValues;
      return true;
    }
    for (const [key, value] of this.formValues.entries()) {
      if (newFormValues.get(key) !== value) {
        this.formValues = newFormValues;
        return true;
      }
    }
    return false;
  }

  private handleFormChange() {
    this.updateForm();
    if (this.hasFormChanged(this.dom.form as HTMLFormElement)) {
      this.toggleIndicator();
    }
    this.findElements();
  }

  private createSlider(options: ModelInputState) {
    if (this.dom.content === undefined || this.dom.content === null) return;
    this.slider = $(this.dom.content).sliderPlugin(options);
    this.handleFormChange();
  }

  private findElements() {
    this.dom.indicator = this.dom.root.querySelector('.js-main__slider-indicator');
    this.dom.form = this.dom.root.querySelector('.js-slider__form');
    if (!this.dom.form) return;

    const selector = (role: string) => {
      return this.dom.form?.querySelector(`.js-slider__input[data-role="${role}"]`);
    };

    this.mapElements = new Map<string, ModelValue>();
    this.numericVariables.min = Number((selector('min') as HTMLInputElement)?.value);
    this.mapElements.set('min', 'min');

    this.numericVariables.max = Number((selector('max') as HTMLInputElement)?.value);
    this.mapElements.set('max', 'max');

    this.numericVariables.step = Number((selector('step') as HTMLInputElement)?.value);
    this.mapElements.set('step', 'step');

    const from = selector('from') as HTMLInputElement;
    this.numericVariables.from = Number(from.value);
    from.step = `${this.numericVariables.step}`;
    this.mapElements.set('from', 'valueFrom');

    const to = selector('to') as HTMLInputElement;
    this.numericVariables.to = Number(to.value);
    to.step = `${this.numericVariables.step}`;
    this.mapElements.set('to', 'valueTo');

    const gap = selector('gap') as HTMLInputElement;
    this.numericVariables.gap = gap.value !== undefined ? Number(gap.value) : null;
    this.mapElements.set('gap', 'scalePercentGap');

    const range = selector('range') as HTMLInputElement;
    this.booleanVariables.range = range.checked;
    to.disabled = !this.booleanVariables.range;
    this.mapElements.set('range', 'isRange');

    const marks = selector('marks') as HTMLInputElement;
    this.booleanVariables.marks = marks.checked;
    gap.disabled = !this.booleanVariables.marks;
    this.mapElements.set('marks', 'scaleMarks');

    const tip = selector('tip') as HTMLInputElement;
    this.booleanVariables.tip = tip.checked;
    this.mapElements.set('tip', 'isTip');

    const progress = selector('progress') as HTMLInputElement;
    this.booleanVariables.progress = progress.checked;
    this.mapElements.set('progress', 'isProgress');

    const vertical = selector('vertical') as HTMLInputElement;
    this.booleanVariables.vertical = vertical.checked;
    this.mapElements.set('vertical', 'isVertical');

    this.dom.content = this.dom.root.querySelector('.js-slider__content');
    this.dom.thumb = this.dom.content?.querySelector('.js-plugin-slider__thumb') || null;

    if (this.dom.form !== undefined) {
      this.formValues = DemoSlider.getFormValues(this.dom.form as HTMLFormElement);
    }
  }

  private updateForm() {
    if (this.mapElements === undefined || this.dom.form === undefined || this.slider === undefined) return;

    this.mapElements.forEach((value: string, key: string) => {
      const element = this.dom.form?.querySelector(`.js-slider__input[data-role="${key}"]`) as HTMLInputElement | null;
      if (element === null) return;

      const sliderValue = this.slider?.getValue(value as ModelValue);
      if (typeof sliderValue === 'number') {
        element.value = `${sliderValue}`;
      } else if (typeof sliderValue === 'boolean') {
        element.checked = sliderValue;
      }
    });
  }

  private handleContentClick: EventListener = (e: Event) => {
    const target = e.target as Element;
    if (target !== undefined && !target.classList.contains('js-plugin-slider')) {
      this.handleFormChange();
    }
  };

  private handleContentPointerDown() {
    const handlePointerMove = () => {
      this.handleFormChange();
    };

    const handlePointerUp = () => {
      this.dom.content?.removeEventListener('pointermove', handlePointerMove);
      this.dom.content?.removeEventListener('pointerup', handlePointerUp);
    };

    this.dom.content?.addEventListener('pointermove', handlePointerMove);
    this.dom.content?.addEventListener('pointerup', handlePointerUp);
  }

  private handleThumbKeyPress(e: KeyboardEvent): void {
    const { key } = e;
    if (['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'].includes(key)) {
      this.handleFormChange();
    }
  }

  private handleThumbTouchMove() {
    const handleThumbTouchMoveStart = (e: TouchEvent) => {
      e.stopImmediatePropagation();
      this.handleFormChange();
    };

    const handleThumbTouchMoveStartEnd = () => {
      document.removeEventListener('touchmove', handleThumbTouchMoveStart);
      document.removeEventListener('touchend', handleThumbTouchMoveStartEnd);
    };

    document.addEventListener('touchmove', handleThumbTouchMoveStart);
    document.addEventListener('touchend', handleThumbTouchMoveStartEnd);
  }

  private getSliderOptions(): ModelInputState {
    return {
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
  }
}

document.querySelectorAll('.js-main__slider').forEach((e) => new DemoSlider(e));

export default DemoSlider;
