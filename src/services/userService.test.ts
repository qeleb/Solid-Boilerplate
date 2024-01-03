import { fetchUser } from '@/services/userService';

describe('user service', () => {
  it('fetches user data', () => {
    expect(fetchUser()).resolves.not.toThrow();
  });
});
