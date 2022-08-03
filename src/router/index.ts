import { IRoute } from '../interfaces';
import { Component } from '../utils/component';
import { Garage } from '../pages/garage/garage';

export class Router {
  private readonly routes: Array<IRoute>;
  private defaultRoute: IRoute;

  // Pages
  garagePage: Component;
  winnersPage: Component | undefined;

  constructor(private rootElement: HTMLElement) {
    this.garagePage = new Garage(this.rootElement);

    this.routes = [
      {
        name: '/',
        component: () => {
          this.rootElement.append(this.garagePage.element);
        },
      },
    ];

    this.defaultRoute = {
      name: 'Default router',
      component: () => {
        this.rootElement.innerHTML = 'Default Page';
      },
    };
  }

  updateRouter(): void {
    this.rootElement.innerHTML = '';
    const currentRouteName = window.location.hash.slice(1);
    const currentRoute = this.routes.find(
      (page) => page.name === currentRouteName,
    );

    (currentRoute || this.defaultRoute).component();
  }

  initRouter(): void {
    if (window.location.hash === '') {
      window.location.hash = '#/';
    }

    window.onpopstate = () => this.updateRouter();
    this.updateRouter();
  }
}