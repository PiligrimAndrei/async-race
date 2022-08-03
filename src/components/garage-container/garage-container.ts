import { ICar } from '../../interfaces';
import { Component } from '../../utils/component';
import { GarageItem } from './garage-item';
import { Pagination } from '../pagination/pagination';

import './index.scss';

export class GarageContainer extends Component {
  removeCar: (carId: number) => void = () => { };
  updateCar: (carId: number) => void = () => { };
  updatePage: (page: number) => void = () => { };
  private container: Component;
  private title: Component;
  pagination: Pagination;
  cars: Array<GarageItem>;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', ['garage-container']);
    this.cars = [];

    this.title = new Component(this.element, 'h2');
    this.pagination = new Pagination(this.element);
    this.container = new Component(this.element, 'div', ['garage-container']);

    this.pagination.updatePage = (page) => this.updatePage(page);
  }

  private updateTitle(carsLength: string) {
    this.title.element.innerHTML = `Garage - (${carsLength} cars)`;
  }

  private clear() {
    this.container.element.innerHTML = '';
    this.cars = [];
  }

  addItems(cars: Array<ICar>, carsLength: string): void {
    this.clear();

    this.updateTitle(carsLength);
    this.cars = cars.map((car) => {
      const item = new GarageItem(this.container.element, car);
      item.removeCar = (carId) => this.removeCar(carId);
      item.updateCar = (carId) => this.updateCar(carId);

      return item;
    });
  }
}