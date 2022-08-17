import SliderComponents from "../SliderComponents/SliderComponents";

class Tip extends SliderComponents {
  tip: HTMLDivElement;
  percentPosition: number;
  valueTip: number

  constructor(root: HTMLDivElement, percentPosition: number, valueTip: number) {
    super(root);
    this.percentPosition = percentPosition;
    this.valueTip = valueTip;
    this.tip = this.createTip();
    this.addTip();
  }

  private createTip(): HTMLDivElement {
    const tip = document.createElement('div');
    tip.className = 'slider__tip';
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