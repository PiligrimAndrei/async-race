import {
  ICar,
  ICarEngine,
  ICreateCar,
  IUpdateCar,
  IWinner,
} from '../interfaces';

const baseUrl = 'http://localhost:3000';

export const getAllCars = async (
  page = 1,
  limit = 7,
): Promise<{ cars: Array<ICar>; count: string } | null> => {
  try {
    const data = await fetch(`${baseUrl}/garage?_limit=${limit}&_page=${page}`);
    const res: ICar[] = await data.json();

    if (data.status === 200) {
      return {
        cars: res,
        count: data.headers.get('X-Total-Count') || '0',
      };
    }

    return null;
  } catch (err) {
    throw new Error("Error");
  }
};

export const getCar = async (carId: number): Promise<ICar | null> => {
  try {
    const data = await fetch(`${baseUrl}/garage/${carId}`);
    const res: ICar = await data.json();

    if (data.status === 200) {
      return res;
    }

    return null;
  } catch (err) {
    throw new Error(err);
  }
};

export const updateCar = async (car: IUpdateCar): Promise<void> => {
  try {
    await fetch(`${baseUrl}/garage/${car.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(car),
    });
  } catch (err) {
    throw new Error(err);
  }
};

export const createCar = async (car: ICreateCar): Promise<void> => {
  try {
    await fetch(`${baseUrl}/garage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(car),
    });
  } catch (err) {
    throw new Error(err);
  }
};

export const deleteCar = async (carId: number): Promise<void> => {
  try {
    await fetch(`${baseUrl}/garage/${carId}`, {
      method: 'DELETE',
    });
  } catch (err) {
    throw new Error(err);
  }
};
export const startEngineCar = async (
  carId: number,
): Promise<{ status: number; result: ICarEngine }> => {
  try {
    const data = await fetch(`${baseUrl}/engine?id=${carId}&status=started`,
      {
        method: 'PATCH',
      });
    const res: ICarEngine = await data.json();

    return {
      status: data.status,
      result: res,
    };
  } catch (err) {
    throw new Error(err);
  }
};

export const stopEngineCar = async (
  carId: number,
): Promise<{ status: number; result: ICarEngine }> => {
  try {
    const data = await fetch(`${baseUrl}/engine?id=${carId}&status=stopped`,
      {
        method: 'PATCH',
      });
    const res: ICarEngine = await data.json();

    return {
      status: data.status,
      result: res,
    };
  } catch (err) {
    throw new Error(err);
  }
};
export const switchToDriveMode = async (carId: number): Promise<number> => {
  try {
    const data = await fetch(`${baseUrl}/engine?id=${carId}&status=drive`,
      {
        method: 'PATCH',
      });

    return data.status;
  } catch (err) {
    throw new Error(err);
  }
};
export const getWinner = async (
  winnerId: number,
): Promise<{ status: number; result: IWinner }> => {
  try {
    const data = await fetch(`${baseUrl}/winners/${winnerId}`);
    const res: IWinner = await data.json();

    return {
      status: data.status,
      result: res,
    };
  } catch (err) {
    throw new Error(err);
  }
};

export const createWinner = async (carData: IWinner): Promise<number> => {
  try {
    const data = await fetch(`${baseUrl}/winners`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(carData),
    });

    return data.status;
  } catch (err) {
    throw new Error(err);
  }
};

export const updateWinner = async (carData: IWinner): Promise<void> => {
  try {
    await fetch(`${baseUrl}/winners/${carData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(carData),
    });
  } catch (err) {
    throw new Error(err);
  }
};

export const deleteWinner = async (carId: number): Promise<void> => {
  try {
    await fetch(`${baseUrl}/winners/${carId}`, {
      method: 'DELETE',
    });
  } catch (err) {
    throw new Error(err);
  }
};
export const getAllWinners = async (
  page: number,
  sort = 'time',
  order = 'ASC',
  limit = 10,
): Promise<{ result: Array<IWinner>; totalCount: string }> => {
  try {
    const data = await fetch(
      `${baseUrl}/winners?_page=${page}&_limit=${limit}&_sort=${sort}&_order=${order}`,
    );
    const res: Array<IWinner> = await data.json();

    return {
      result: res,
      totalCount: data.headers.get('X-Total-Count') || '0',
    };
  } catch (err) {
    throw new Error(err);
  }
};