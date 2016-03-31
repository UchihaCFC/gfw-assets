'use strict';

/**
 * Main file:
 * In this we are going to initialize all modules
 * @param  {window} root
 */

import Header from './scripts/modules/header';
import Footer from './scripts/modules/footer';
import Feedback from './scripts/modules/feedback';

// Add styles
import './styles/fonts.css';
import './styles/global.scss';

document.addEventListener('DOMContentLoaded', function() {
  // Adding header
  new Header();

  // Adding footer
  new Footer();

  // Adding feedback
  new Feedback();
});