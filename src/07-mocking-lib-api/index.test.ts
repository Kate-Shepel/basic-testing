import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios');
jest.mock('lodash', () => ({
  throttle: jest.fn((fn) => fn),
}));

describe('throttledGetDataFromApi', () => {
  const baseURL = 'https://jsonplaceholder.typicode.com';
  const mockResponseData = [
    { id: 1, title: 'Test 1st Post', content: 'Small text' },
    { id: 2, title: 'Test 2nd Post', content: 'Huge text' },
  ];
  const testPath = '/posts';

  beforeEach(() => {
    jest.clearAllMocks();

    (axios.create as jest.Mock).mockReturnValue({
      get: jest.fn(() => Promise.resolve({ data: mockResponseData })),
    });
  });

  test('should create instance with provided base url', async () => {
    const axiosCreateSpy = jest.spyOn(axios, 'create');

    await throttledGetDataFromApi(testPath);
    expect(axiosCreateSpy).toHaveBeenCalledWith({ baseURL });
  });

  test('should perform request to correct provided url', async () => {
    const axiosGetSpy = jest.spyOn(axios.create(), 'get');

    await throttledGetDataFromApi(testPath);
    expect(axiosGetSpy).toHaveBeenCalledWith(testPath);
  });

  test('should return response data', async () => {
    const res = await throttledGetDataFromApi(testPath);
    expect(res).toEqual(mockResponseData);
  });
});
