import SliderComponents from "../SliderComponents/SliderComponents";

class Tip extends SliderComponents {
  tip: HTMLDivElement;
  percentPosition: number;
  valueTip: number | string

  constructor(root: HTMLDivElement, percentPosition: number, valueTip: number | string) {
    super(root);
    this.percentPosition = percentPosition;
    this.valueTip = valueTip;
    this.tip = this.createTip();
    this.addTip();
  }

  public setValueTip(valueTip: number | string): void {
    this.tip.innerText = `${valueTip}`;
  }

  public hideTip() {
    this.tip.style.display = 'none';
  }

  public showTip() {
    this.tip.style.display = '';
  }

  private createTip(): HTMLDivElement {
    const tip = this.createElement('slider__tip')
    tip.innerText = `${this.valueTip}`;
    tip.style.left = `${this.percentPosition}%`;
    return tip;
  }

  private addTip() {
    this.root.append(this.tip);
  }

  public setPosition(percentPosition: number, value: number): void {
    this.tip.style.left = `${percentPosition}%`;
    this.tip.innerText = `${value}`;
  }
}

export default Tip