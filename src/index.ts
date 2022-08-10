import './styles.scss';
import './Model/ModelFacade';
import View from './View/View';

const sliderCont = document.querySelector('.page__slider');
new View(sliderCont as Element);