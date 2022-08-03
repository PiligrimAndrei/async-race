import { Component } from '../../utils/component';
import { Button } from '../button/button';
import { UIInput } from '../input/input';
import { ICreateCar } from '../../interfaces/index';

export class OptionsInputs extends Component {
  createCar: (state: ICreateCar) => void = () => { };
  private input: UIInput;
  private inputColor: UIInput;
  private button: Button;
  state = {
    name: '',
    color: '#000000',
  };

  constructor(
    parentNode: HTMLElement,
    buttonText: string,
    styles: string[] = [],
  ) {
    super(parentNode, 'div', ['garage-inputs']);

    const inputWrapper = new Component(this.element, 'div', ['garage-input']);
    this.input = new UIInput(inputWrapper.element, 'text', ['garage-input']);
    this.input.getInputValue = (event) => this.updateState('name', event);

    this.inputColor = new UIInput(
      this.element,
      'color',
      ['garage-color-input'],
      '#000000',
    );
    this.inputColor.getInputValue = (event) => this.updateState('color', event);

    this.button = new Button(this.element, ['garage-button'], buttonText);
    this.button.element.setAttribute('disabled', '');
    this.button.onClickButton = () => {
      this.createCar(this.state);
      this.resetSettings();
    };

    this.element.classList.add(...styles);
  }

  updateState(key: keyof ICreateCar, event: Event): void {
    const input = event.target as HTMLInputElement;
    this.state[key] = input.value;

    this.button.element.toggleAttribute('disabled', this.state.name === '');
  }

  resetSettings(): void {
    this.state = {
      name: '',
      color: '#000000',
    };

    this.updateInputs();
  }

  updateInputs(): void {
    (this.input.element as HTMLInputElement).value = this.state.name;
    (this.inputColor.element as HTMLInputElement).value = this.state.color;

    this.button.element.setAttribute('disabled', '');
  }
}