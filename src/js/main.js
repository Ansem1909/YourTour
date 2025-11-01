import '../scss/main.scss';

import HeaderSticky from './modules/HeaderSticky';
import TabsCollection from "./modules/Tabs";
import FormValidator from "./modules/FormValidator";

document.addEventListener('DOMContentLoaded', () => {
  new HeaderSticky();
});
new TabsCollection();
new FormValidator();
