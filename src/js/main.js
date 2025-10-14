import '../scss/main.scss';

import HeaderSticky from './modules/HeaderSticky';
import TabsCollection from "./modules/Tabs";

document.addEventListener('DOMContentLoaded', () => {
  new HeaderSticky();
});
new TabsCollection();