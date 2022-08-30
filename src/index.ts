import Presenter from './components/Presenter/Presenter';
import initialState from './state';
import './styles.scss';

const element = document.querySelector('.page__slider') as HTMLAnchorElement;
const slider = new Presenter(element, initialState);
export default slider;
