/* @refresh reload */
import { render } from 'solid-js/web'

import './index.css'
import App from './App'

const body = document.querySelector('body');

render(() => <App />, body!);
