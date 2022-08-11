import './styles.scss';
import Presenter from './components/Presenter/Presenter';
import state from './state'


const contianer = document.querySelector('.page__slider') as HTMLElement;
const presenter = new Presenter(contianer, state);
console.log(presenter);
