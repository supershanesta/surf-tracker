'use client';
interface GetParams {
  name: string;
  value: string;
}

const get = async <T>(
  path: string,
  params?: GetParams[]
): Promise<T | null> => {
  try {
    const url = new URL(`${process.env.NEXT_PUBLIC_URL}/api/${path}`);
    if (params) {
      params.forEach((param) => {
        url.searchParams.append(param.name, param.value);
      });
    }
    const response = await fetch(url.toString());
    const responseData = await response.json();
    return responseData as T;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
};

const API = {
  get,
};

export default API;
