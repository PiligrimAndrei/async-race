import { Component } from '../../utils/component';
import { IWinnerCar } from '../../interfaces';
import { carImage } from '../car-image/car-image';

export class WinnersItem extends Component {
  constructor(parentNode: HTMLElement, winner: IWinnerCar) {
    super(parentNode, 'div', ['winners-item']);

    const { id, name, color, wins, time } = winner;

    const item = new Component(this.element, 'div', ['winner-item']);
    item.element.innerHTML = `
      <div class="winner-item-id">${id}</div>
      <div class="winner-item-image">${carImage(color)}</div>
      <div class="winner-item-name">${name}</div>
      <div class="winner-item-wins">${wins}</div>
      <div class="winner-item-time">${time}</div>
    `;
  }
}