import { Component } from '../../utils/component';
import { WinnersContainer } from '../../components/winners-conteiner/index';
import { getAllWinners } from '../../api/api';

export class Winners extends Component {
  winnersContainer = new WinnersContainer(this.element);
  page = 1;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', ['winners']);
    this.getAllWinners();

    this.winnersContainer.updatePage = (pageNumber) => {
      this.page = pageNumber;
      this.getAllWinners(this.page);
    };
    this.winnersContainer.sortWinners = (type, order) => {
      this.getAllWinners(this.page, type, order);
    };
  }

  async getAllWinners(page = 0, sort = 'id', order = 'ASC'): Promise<void> {
    const winners = await getAllWinners(page, sort, order);
    const totalCount = +winners.totalCount;

    this.winnersContainer.pagination.updateNextButton(
      this.page,
      totalCount,
      10,
    );
    this.winnersContainer.addWinners(winners);
  }
}