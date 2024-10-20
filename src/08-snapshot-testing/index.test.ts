import { generateLinkedList } from './index';

describe('generateLinkedList', () => {
  test('should generate linked list from a mix of numbers, booleans, and strings', () => {
    const testArr = [42, true, 'hello', false];
    const expectedTestList = {
      value: 42,
      next: {
        value: true,
        next: {
          value: 'hello',
          next: {
            value: false,
            next: {
              value: null,
              next: null,
            },
          },
        },
      },
    };
    const generatedTestList = generateLinkedList(testArr);

    expect(generatedTestList).toStrictEqual(expectedTestList);
  });

  test('should generate linked list from values 2', () => {
    const testArr = [{ id: 1 }, null, { id: 2 }, { name: 'test' }];
    const generatedTestList = generateLinkedList(testArr);

    expect(generatedTestList).toMatchSnapshot();
  });
});
