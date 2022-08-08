import { Component } from '../../utils/component';
import { Button } from '../../components/button/button';

export class OptionsButtons extends Component {
  startRaceAllCars: () => void = () => { };
  resetAllCars: () => void = () => { };
  generateCars: () => void = () => { };
  buttonRace: Button;
  buttonReset: Button;
  buttonGenerateCars: Button;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', ['garage-buttons']);

    this.buttonRace = new Button(
      this.element,
      ['garage-race-button'],
      'race',
    );
    this.buttonRace.onClickButton = () => this.startRaceAllCars();

    this.buttonReset = new Button(
      this.element,
      ['garage-reset-button'],
      'reset',
      true,
    );
    this.buttonReset.onClickButton = () => this.resetAllCars();

    this.buttonGenerateCars = new Button(
      this.element,
      ['garage-generate-button'],
      'generate cars',
    );
    this.buttonGenerateCars.onClickButton = () => this.generateCars();
  }
}