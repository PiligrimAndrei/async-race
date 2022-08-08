import { Component } from '../../utils/component';
import './index.scss';
import { Button } from '../../components/button/button';
import { ICar, ICarEngine } from '../../interfaces';
import { carImage } from '../../components/car-image/car-image';
import {
  startEngineCar,
  stopEngineCar,
  switchToDriveMode,
} from '../../api/api';

const carImageWidth = 100;

export class GarageItem extends Component {
  startEngine: (carId: number) => void = () => { };
  stopEngine: () => void = () => { };
  removeCar: (carId: number) => void = () => { };
  updateCar: (carId: number) => void = () => { };

  private startEngineButton: Button;
  private stopEngineButton: Button;
  private imageCar: Component;
  public car: ICar;
  public speed = 0;
  private carAnimation: Animation | undefined;

  constructor(parentNode: HTMLElement, car: ICar) {
    super(parentNode, 'div', ['garage-item']);
    this.car = car;

    const carTop = new Component(this.element, 'div', ['garage-item-top']);

    const selectBtn = new Button(carTop.element, ['btn-small'], 'select');
    selectBtn.onClickButton = () => {
      if (car.id) this.updateCar(car.id);
    };

    const removeBtn = new Button(carTop.element, ['btn-small'], 'remove');
    removeBtn.onClickButton = () => {
      if (car.id) this.removeCar(car.id);
      this.destroy();
    };

    const carName = new Component(carTop.element, 'span', [], car.name);

    const carField = new Component(this.element, 'div', ['garage-item-field']);

    const controlBlock = new Component(carField.element, 'div', [
      'garage-item-control-block',
    ]);

    this.startEngineButton = new Button(
      controlBlock.element,
      ['btn-small'],
      'A',
    );
    this.startEngineButton.onClickButton = () => {
      if (car.id) this.startCarEngine(car.id);
    };

    this.stopEngineButton = new Button(
      controlBlock.element,
      ['btn-small'],
      'B',
      true,
    );
    this.stopEngineButton.onClickButton = () => {
      if (car.id) this.stopCarEngine(car.id);
    };

    this.imageCar = new Component(carField.element, 'div', ['car-image']);
    this.imageCar.element.innerHTML = carImage(car.color);

    const finishFlag = new Component(carField.element, 'img', ['finish-flag']);
    finishFlag.element.setAttribute('src', './assets/red-flag.svg');
  }

  updateButtons(type = false): void {
    this.startEngineButton.setDisabled(type);
    this.stopEngineButton.setDisabled(!type);
  }

  async stopCarEngine(carId: number): Promise<void> {
    const res = await stopEngineCar(carId);

    if (res.status === 200) {
      this.updateButtons();
      this.speed = 0;
      this.carAnimation?.cancel();
      this.imageCar.element.style.left = `${carImageWidth}px`;
    }
  }

  async startCarEngine(carId: number): Promise<void> {
    const data = await startEngineCar(carId);

    if (data.status === 200) {
      this.updateButtons(true);

      const { result } = data;
      const time = result.distance / result.velocity;

      this.animationCar(time);
      await this.switchToDriveMode(result);
    }
  }

  private animationCar(time: number): void {
    this.carAnimation = this.imageCar.element.animate(
      [{ left: '100px' }, { left: `calc(100% - ${carImageWidth}px)` }],
      {
        duration: time,
        easing: 'ease-in-out',
      },
    );
    this.carAnimation.play();
    this.carAnimation.onfinish = () => {
      this.imageCar.element.style.left = `calc(100% - ${carImageWidth}px)`;
    };
  }

  private async switchToDriveMode(car: ICarEngine): Promise<void> {
    const driveMode = await switchToDriveMode(this.car.id);
    return new Promise((resolve) => {
      if (driveMode === 500) {
        this.carAnimation?.pause();
      }

      if (driveMode === 200) {
        this.speed = Math.floor(car.distance / car.velocity);
        resolve();
      }
    });
  }

  disableAllButtons(): void {
    this.startEngineButton.setDisabled(true);
    this.stopEngineButton.setDisabled(false);
  }
}