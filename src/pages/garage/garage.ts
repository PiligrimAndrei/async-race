import { GarageContainer } from '../../components/garage-container/garage-container';
import { Component } from '../../utils/component';
import { GarageOptions } from '../../components/garage-options/index';
import {
  createCar,
  deleteCar,
  getAllCars,
  getCar,
  updateCar,
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
import { randomRGBColor } from '../../components/generate-rgb/generate-rgb';


export class Garage extends Component {
  private garageOptions: GarageOptions;
  private garageContainer: GarageContainer;
  page = 1;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', ['garage']);
    this.getAllCars(this.page);

    this.garageOptions = new GarageOptions(this.element);
    this.garageOptions.createCar = async (state) => {
      await this.createCar(state);
      await this.getAllCars(this.page);
    };
    this.garageOptions.updateCar = (state) => this.updateCar(state);
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

}