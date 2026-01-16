import { fetchUser } from '@/services/userService';

describe('user service', () => {
  it('fetches user data', async () => {
    await expect(fetchUser()).resolves.not.toThrowError();
  });
});
