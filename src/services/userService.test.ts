import { fetchUser } from '@/services/userService';

describe('user service', () => {
  it('fetches user data', async () => {
    expect(fetchUser()).resolves.not.toThrow();
  });
});
