import { databaseSchema } from './database-schema';

describe('databaseSchema', () => {
  it('should work', () => {
    expect(databaseSchema()).toEqual('database-schema');
  });
});
