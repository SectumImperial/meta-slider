import { TipData } from "../../../Interfaces";
import SliderComponents from "../SliderComponents/SliderComponents";

type startPointType = 'top' | 'left';

class Tip extends SliderComponents {
  tip: HTMLDivElement;
  percentPosition: number;
  valueTip: number | string
  isVertical: boolean;
  startPoint: startPointType;

  constructor(data: TipData) {
    const {
      root,
      percentPosition,
      valueTip,
      isVertical,
    } = data;

    super(root);
    this.percentPosition = percentPosition;
    this.valueTip = valueTip;
    this.isVertical = isVertical;
    this.startPoint = isVertical ? 'top' : 'left';

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
    const mod = this.isVertical ? 'vertical' : 'horizontal';
    const tip = this.createElement('slider__tip');
    tip.classList.add(`slider__tip_${mod}`);
    tip.innerText = `${this.valueTip}`;
    tip.style[this.startPoint] = `${this.percentPosition}%`;
    return tip;
  }

  private addTip() {
    this.root.append(this.tip);
  }

  public setPosition(percentPosition: number, value: number): void {
    this.tip.style[this.startPoint] = `${percentPosition}%`;
    this.tip.innerText = `${value}`;
  }
}

export default Tip