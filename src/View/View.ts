import './view.scss'

class View {
  root: Element;
  thumb: HTMLDivElement;
  scale: HTMLDivElement;
  shiftX: number;

  constructor(root: Element) {
    this.root = root;
    this.createSlider(root);
    this.scale = document.querySelector('.slider__scale') as HTMLDivElement;
    this.thumb = document.querySelector('.slider__thumb') as HTMLDivElement;
    this.shiftX = 0;
    this.addListenners();
  }

  private createSlider(root: Element): void {

    const slider = this.createSliderWrapper();
    this.createSliderElem(slider, 'slider__scale');
    this.createSliderElem(slider, 'slider__thumb');

    root.append(slider);
  }

  private createSliderWrapper(): HTMLDivElement {
    const sliderWrapper = document.createElement('div');
    sliderWrapper.className = 'slider';
    return sliderWrapper;
  }

  private createSliderElem(slider: HTMLDivElement, sliderClass = ''): void {
    const element = document.createElement('div');
    element.className = sliderClass
    slider.append(element);
  }


  private addListenners() {
    this.thumb.addEventListener('mousedown', this.moveToggle.bind(this));
    this.thumb.addEventListener('dragstart', () => {
      return false;
    });
  }

  private moveToggle(event: MouseEvent) {
    event.preventDefault()


    this.shiftX = event.clientX - this.thumb.getBoundingClientRect().left;

    const onMouseMove = (event: MouseEvent) => {
      let newLeft = event.clientX - this.shiftX - this.scale.getBoundingClientRect().left;
      if (newLeft < 0) {
        newLeft = 0;
      }
      let rightEdge = this.scale.offsetWidth - this.thumb.offsetWidth;
      if (newLeft > rightEdge) {
        newLeft = rightEdge;
      }

      this.thumb.style.left = newLeft + 'px';
    }

    const onMouseUp = () => {
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mousemove', onMouseMove);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }


}

export default View;