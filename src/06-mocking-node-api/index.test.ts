import * as path from 'path';
import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';

jest.mock('fs', () => ({
  existsSync: jest.fn(),
}));

jest.mock('fs/promises', () => ({
  readFile: jest.fn(),
}));

jest.mock('path', () => ({
  join: jest.fn(),
}));

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const callbackFunc = jest.fn();
    const timePeriod = 2200;
    const spySetTimeout = jest.spyOn(global, 'setTimeout');

    doStuffByTimeout(callbackFunc, timePeriod);

    expect(spySetTimeout).toHaveBeenCalledWith(callbackFunc, timePeriod);
    spySetTimeout.mockRestore();
  });

  test('should call callback only after timeout', () => {
    const callbackFunc = jest.fn();
    const timePeriod = 2200;

    doStuffByTimeout(callbackFunc, timePeriod);

    jest.advanceTimersByTime(timePeriod);
    expect(callbackFunc).toHaveBeenCalled();
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const callbackFunc = jest.fn();
    const timePeriod = 1200;
    const spySetInterval = jest.spyOn(global, 'setInterval');

    doStuffByInterval(callbackFunc, timePeriod);

    expect(spySetInterval).toHaveBeenCalledWith(callbackFunc, timePeriod);
    spySetInterval.mockRestore();
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callbackFunc = jest.fn();
    const timePeriod = 1500;

    doStuffByInterval(callbackFunc, timePeriod);

    jest.advanceTimersByTime(timePeriod * 3);
    expect(callbackFunc).toHaveBeenCalledTimes(3);
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    const pathToTestFile = 'trial.txt';
    const spyForPathJoin = jest.spyOn(path, 'join');

    await readFileAsynchronously(pathToTestFile);

    expect(spyForPathJoin).toHaveBeenCalledWith(__dirname, pathToTestFile);
  });

  test('should return null if file does not exist', async () => {
    const mockExistsSync = jest.spyOn(fs, 'existsSync').mockReturnValue(false);
    const res = await readFileAsynchronously('absent-file.txt');

    expect(res).toBeNull();
    mockExistsSync.mockRestore();
  });

  test('should return file content if file exists', async () => {
    const mockExistsSync = jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    const mockReadFile = jest
      .spyOn(fsPromises, 'readFile')
      .mockResolvedValue(Buffer.from('File content'));

    const res = await readFileAsynchronously('trial.txt');

    expect(res).toBe('File content');
    mockExistsSync.mockRestore();
    mockReadFile.mockRestore();
  });
});
