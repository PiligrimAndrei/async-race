import { Component } from '../../utils/component';
import './header.scss';

export class Header extends Component {
  private navItems: Component[] = [];
  private linkToGarage: Component;
  private linkToWinners: Component;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', ['header']);

    this.linkToGarage = new Component(
      this.element,
      'a',
      ['nav__item'],
      'Garage',
    );
    /*const img = document.createElement('img');
    img.classList.add('header-logo');
    img.src = './assets/logo.svg';

    this.element.append(img);*/
    this.linkToWinners = new Component(
      this.element,
      'a',
      ['nav__item'],
      'Winners',
    );

    this.linkToGarage.element.setAttribute('href', '#/');
    this.linkToWinners.element.setAttribute('href', '#/winners');

    this.navItems = [this.linkToGarage, this.linkToWinners];

    window.addEventListener('hashchange', () =>
      this.updateActive(this.navItems),
    );
    window.addEventListener('load', () => this.updateActive(this.navItems));
  }

  private updateActive(navItems: Component[]): void {
    this.navItems = navItems.map((item) => {
      item.element.classList.remove('nav__item--active');
      if (item.element.getAttribute('href') === window.location.hash) {
        item.element.classList.add('nav__item--active');
      }

      return item;
    });
  }
}