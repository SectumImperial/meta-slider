import $ from 'jquery';
import { ModelInputState } from './components/Interfaces';
import Presenter from './components/Presenter/Presenter';
import './styles.scss';

declare global {
  interface JQuery {
    sliderPlugin(options: ModelInputState): Presenter
  }
}

$.fn.sliderPlugin = function sliderPlugin(options: ModelInputState) {
  const slider = new Presenter(this[0], options);
  return slider;
};
