import { GarageContainer } from '../../components/garage-container/garage-container';
import { Component } from '../../utils/component';
import { GarageOptions } from '../../components/garage-options/index';
import {
  createCar,
  deleteCar,
  getAllCars,
  getCar,
  updateCar,
  createWinner,
  deleteWinner,
  getWinner,
  updateWinner,
} from '../../api/api';
import {
  ICar,
  ICarData,
  ICreateCar,
  IUpdateCar,
  IWinner,
} from '../../interfaces';
import { cars } from '../../config/config';
import { GarageItem } from '../../components/garage-container/garage-item';
import { WinnerPopup } from '../../components/popup/winner-popup';
import { randomRGBColor } from '../../components/generate-rgb/generate-rgb';

export class Garage extends Component {
  private garageOptions: GarageOptions;
  private garageContainer: GarageContainer;
  page = 1;
  private winnerPopup: WinnerPopup | undefined;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', ['garage']);
    this.getAllCars(this.page);

    this.garageOptions = new GarageOptions(this.element);
    this.garageOptions.createCar = async (state) => {
      await this.createCar(state);
      await this.getAllCars(this.page);
    };
    this.garageOptions.updateCar = (state) => this.updateCar(state);
    this.garageOptions.startRaceAllCars = () => this.startRaceAllCars();
    this.garageOptions.resetAllCars = () => this.resetAllCars();
    this.garageOptions.generateCars = () => this.generateRandomCars();

    this.garageContainer = new GarageContainer(this.element);
    this.garageContainer.removeCar = (carId) => this.removeCar(carId);
    this.garageContainer.updateCar = (carId) => this.getCar(carId);
    this.garageContainer.updatePage = (page) => {
      this.page = page;
      this.getAllCars(page);
    };
  }

  private async getAllCars(page: number): Promise<void> {
    const data = await getAllCars(page);

    if (data) {
      const carsArr: Array<ICar> = data.cars;
      const carLength: string = data.count;
      this.garageContainer.addItems(carsArr, carLength);

      this.garageContainer.pagination.updateNextButton(
        this.page,
        +carLength,
        7,
      );
    }
  }
  private async startRaceAllCars(): Promise<void> {
    this.garageOptions.optionsButtons.buttonRace.setDisabled(true);
    this.garageOptions.optionsButtons.buttonGenerateCars.setDisabled(true);

    const res: Promise<GarageItem>[] = this.garageContainer.cars.map(
      async (car) => {
        await car.startCarEngine(car.car.id);
        car.disableAllButtons();
        return car;
      },
    );

    const winnerCar = await Promise.race(res);

    const carData: ICarData = {
      id: winnerCar.car.id,
      name: winnerCar.car.name,
      color: winnerCar.car.color,
      speed: +(winnerCar.speed / 1000).toFixed(2),
      wins: 1,
    };

    this.winnerPopup = new WinnerPopup(this.element, carData);
    this.garageOptions.optionsButtons.buttonReset.removeDisabled();
    setTimeout(() => this.winnerPopup?.destroy(), 5000);

    await this.createOrUpdateWinner(carData)
  }

  private async getCar(carId: number): Promise<void> {
    const car = await getCar(carId);

    if (car) this.garageOptions.updateState(car);
  }

  private async updateCar(car: IUpdateCar): Promise<void> {
    await updateCar(car);
    await this.getAllCars(this.page);
  }

  private async createCar(car: ICreateCar): Promise<void> {
    await createCar(car);
  }

  private async removeCar(carId: number): Promise<void> {
    await deleteCar(carId);
    await deleteWinner(carId);
    await this.getAllCars(this.page);
  }
  private async generateRandomCars(): Promise<void> {
    this.garageOptions.optionsButtons.buttonRace.setDisabled(true);
    this.garageOptions.optionsButtons.buttonGenerateCars.setDisabled(true);

    const { mark, model } = cars;

    for (let i = 0; i <= 100; i -= -1) {
      const generateName = `${mark[Math.floor(Math.random() * mark.length)]} ${model[Math.floor(Math.random() * model.length)]
        }`;

      await this.createCar({
        name: generateName,
        color: randomRGBColor(),
      });
    }
    await this.getAllCars(this.page);

    this.garageOptions.optionsButtons.buttonRace.setDisabled(false);
    this.garageOptions.optionsButtons.buttonGenerateCars.setDisabled(false);
  }

  private async createOrUpdateWinner(winnerCar: ICarData): Promise<void> {
    const carData = await getWinner(winnerCar.id);

    if (carData.status === 200) {
      carData.result.wins++;
      winnerCar.wins = carData.result.wins;

      await this.updateWinner(winnerCar);
    } else {
      await this.createWinner(winnerCar);
    }
  }

  private async createWinner(winnerData: ICarData): Promise<void> {
    const carObj = {
      id: winnerData.id,
      wins: 1,
      time: winnerData.speed,
    };

    await createWinner(carObj);
  }

  private async updateWinner(winnerData: ICarData): Promise<void> {
    const carObj: IWinner = {
      id: winnerData.id,
      wins: winnerData.wins,
      time: winnerData.speed,
    };

    await updateWinner(carObj);
  }
  private resetAllCars(): void {
    this.garageOptions.optionsButtons.buttonReset.setDisabled(true);

    const allCarsToReset = this.garageContainer.cars?.map(async (car) => {
      await car.stopCarEngine(car.car.id);
    });

    Promise.all(allCarsToReset).then(() => {
      this.garageOptions.optionsButtons.buttonRace.removeDisabled();
      this.garageOptions.optionsButtons.buttonGenerateCars.removeDisabled();
    });
  }
}
