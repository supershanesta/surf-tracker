'use client';
interface GetParams {
  name: string;
  value: string;
}

interface GetType {
  path: string;
  params?: GetParams[];

}

const get = async <T>(path: string, params?: GetParams[]): Promise<T | null> => {
  console.log('hello world')
  try {
    const url = new URL(`${process.env.NEXT_PUBLIC_URL}/api/${path}`);
    if (params) {
      params.forEach((param) => {
        url.searchParams.append(param.name, param.value);
      });
    }
    const response = await fetch(
      url.toString(),
    );
    const responseData = await response.json();
    return responseData as T;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

export interface SurfRatingType {
  id: string;
  surfActivityId: string;
  userId: string;
  rating: number;
  size: number;
  shape: number;
}

const API = {
  get,
};

export default API;