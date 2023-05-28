import $ from 'jquery';
import Presenter from './components/Presenter/Presenter';
import initialState from './state';

declare global {
  interface JQuery {
    sliderPlugin(options: object): Presenter
  }
}

$.fn.sliderPlugin = function sliderPlugin(options: object): Presenter {
  const state = { ...initialState, ...options };
  const slider = new Presenter(this[0], state);
  return slider;
};