import { Component } from '../../utils/component';
import { ICar, IWinner, IWinnerCar } from '../../interfaces/index';
import { WinnersItem } from './winners-item';
import { getCar } from '../../api/api';
import { Pagination } from '../pagination/pagination';

import './index.scss';

export class WinnersContainer extends Component {
  updatePage: (pageNumber: number) => void = () => { };
  sortWinners: (type: string, order: string) => void = () => { };
  private title: Component;
  private container: Component;
  pagination: Pagination;
  winnersList: Array<IWinner> = [];

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', ['winners-container']);

    this.title = new Component(this.element, 'h2', ['winners-title']);

    this.pagination = new Pagination(this.element);
    this.pagination.updatePage = (pageNumber) => this.updatePage(pageNumber);

    const itemsTitle = new Component(this.element, 'div', [
      'winner-item',
      'winner-items-title',
    ]);

    itemsTitle.element.innerHTML = `
      <div class="winner-item-id">№</div>
      <div class="winner-item-image">Car Image</div>
      <div class="winner-item-name">Name</div>
      <div class="winner-item-wins">
        <span>Total Wins</span>
        <img class="winner-item-arrow" src="./assets/arrow.svg" />
      </div>
      <div class="winner-item-time">
        <span>Time (sec)</span>
        <img class="winner-item-arrow" src="./assets/arrow.svg" />
      </div>
    `;

    const winnerTotal = itemsTitle.element.querySelector('.winner-item-wins');
    winnerTotal?.addEventListener('click', () =>
      this.handleSortWinners(winnerTotal, 'wins'),
    );

    const winnerTime = itemsTitle.element.querySelector('.winner-item-time');
    winnerTime?.addEventListener('click', () =>
      this.handleSortWinners(winnerTime, 'time'),
    );

    this.container = new Component(this.element, 'div');
  }

  private handleSortWinners(element: Element, type: string) {
    element.classList.toggle('winner-item-active');

    if (element.classList.contains('winner-item-active')) {
      this.sortWinners(type, 'ASC');
    } else {
      this.sortWinners(type, 'DESC');
    }
  }

  private updateTitle(winnersLength: string) {
    this.title.element.innerHTML = `Winners - (${winnersLength} cars)`;
  }

  private async getCar(carId: number) {
    const data = await getCar(carId);

    return data;
  }

  addWinners(winners: {
    result: Array<IWinner>;
    totalCount: string | null;
  }): void {
    this.container.element.innerHTML = '';
    this.winnersList = winners.result;
    let id = 1;

    if (winners.totalCount) this.updateTitle(winners.totalCount);

    this.winnersList.forEach(async (winner) => {
      const winnerCar: ICar | null = await this.getCar(winner.id);

      if (winnerCar) {
        const carData: IWinnerCar = {
          id: id++,
          name: winnerCar.name,
          color: winnerCar.color,
          wins: winner.wins,
          time: winner.time,
        };

        const winnerItem = new WinnersItem(this.container.element, carData);
      }
    });
  }
}