import Presenter from './components/Presenter/Presenter';
import initialState from './state';
import './styles.scss';


let element = document.querySelector('.page__slider') as HTMLAnchorElement;
let slider = new Presenter(element, initialState);
console.log(slider);