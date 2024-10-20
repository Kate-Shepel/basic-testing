import {
  getBankAccount,
  InsufficientFundsError,
  TransferFailedError,
  SynchronizationFailedError,
} from '.';

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const newAccount = getBankAccount(1415);
    expect(newAccount.getBalance()).toBe(1415);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const newAccount = getBankAccount(5000);
    expect(() => newAccount.withdraw(6000)).toThrow(InsufficientFundsError);
    expect(() => newAccount.withdraw(6000)).toThrow(
      'Insufficient funds: cannot withdraw more than 50',
    );
  });

  test('should throw error when transferring more than balance', () => {
    const firstNewAccount = getBankAccount(5000);
    const secondNewAccount = getBankAccount(3000);
    expect(() => firstNewAccount.transfer(6000, secondNewAccount)).toThrow(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring to the same account', () => {
    const newAccount = getBankAccount(5000);
    expect(() => newAccount.transfer(50, newAccount)).toThrow(
      TransferFailedError,
    );
    expect(() => newAccount.transfer(50, newAccount)).toThrow(
      'Transfer failed',
    );
  });

  test('should deposit money', () => {
    const newAccount = getBankAccount(5000);
    newAccount.deposit(500);
    expect(newAccount.getBalance()).toBe(5500);
  });

  test('should withdraw money', () => {
    const account = getBankAccount(5000);
    account.withdraw(500);
    expect(account.getBalance()).toBe(4500);
  });

  test('should transfer money', () => {
    const sponsorAccount = getBankAccount(15000);
    const needyAccount = getBankAccount(3000);
    sponsorAccount.transfer(3000, needyAccount);
    expect(sponsorAccount.getBalance()).toBe(12000);
    expect(needyAccount.getBalance()).toBe(6000);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const newAccount = getBankAccount(100);
    const serverBalanceData = await newAccount.fetchBalance();
    if (serverBalanceData !== null) {
      expect(typeof serverBalanceData).toBe('number');
    }
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const newAccount = getBankAccount(5000);
    const mockedFetchBalance = jest
      .spyOn(newAccount, 'fetchBalance')
      .mockResolvedValue(2500);
    await newAccount.synchronizeBalance();
    expect(newAccount.getBalance()).toBe(2500);
    mockedFetchBalance.mockRestore();
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const newAccount = getBankAccount(5000);
    const mockedFetchBalance = jest
      .spyOn(newAccount, 'fetchBalance')
      .mockResolvedValue(null);
    await expect(newAccount.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
    mockedFetchBalance.mockRestore();
  });
});
