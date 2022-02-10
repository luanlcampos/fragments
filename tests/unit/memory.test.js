const {
  writeFragment,
  writeFragmentData,
  readFragment,
  readFragmentData,
  listFragments,
  deleteFragment,
} = require('../../src/model/data/memory/index');
const { Fragment } = require('../../src/model/fragment');

describe('backend memory db', () => {
  let fragment;
  beforeEach(() => {
    // create a new valid fragment before each test
    fragment = new Fragment({
      id: '111333',
      ownerId: '11d4c22e',
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      type: 'text/plain',
      size: 20,
    });
  });

  describe('test writeFragment(fragment)', () => {
    test('should write a fragment', async () => {
      const result = await writeFragment(fragment);
      expect(result).toBe();
    });

    test('should return a rejected promisse', () => {
      // invalidate fragment ownerId
      fragment.ownerId = null;
      expect(async () => await writeFragment(fragment)).rejects.toThrow();
    });
  });

  describe('test readFragment(ownerId, id)', () => {
    test('should return a promise with fragment metadata', async () => {
      writeFragment(fragment);
      const result = await readFragment(fragment.ownerId, fragment.id);
      expect(result).toBe(fragment);
    });

    test('should throw an error', () => {
      expect(async () => await readFragment()).rejects.toThrow();
    });

    test('should throw an error: just one valid key', () => {
      expect(async () => await readFragment(fragment.ownerId)).rejects.toThrow();
    });
  });

  describe('test writeFragmentData()', () => {
    test('should return a resolved promise', () => {
      expect(
        writeFragmentData(fragment.ownerId, fragment.id, Buffer.from('testing'))
      ).resolves.toBe();
    });

    test('should throw an error: no keys passed', () => {
      expect(async () => await writeFragment()).rejects.toThrow();
    });

    test('should throw an error: just one key passed', () => {
      expect(async () => await writeFragment(fragment.ownerId)).rejects.toThrow();
    });
  });

  describe('test readFragmentData()', () => {
    test('should return fragment data', async () => {
      const bufferData = Buffer.from('testing');
      writeFragmentData(fragment.ownerId, fragment.id, bufferData);
      const result = await readFragmentData(fragment.ownerId, fragment.id);
      expect(result).toBe(bufferData);
      deleteFragment(fragment.ownerId, fragment.id);
    });

    test('should throw: keys not found, return undefined', async () => {
      const result = await readFragmentData('safdasf', '123sar1');
      expect(result).toBeUndefined();
    });

    test('should throw: keys found, no data returns undefined', async () => {
      const result = await readFragmentData(fragment.ownerId, fragment.id);
      // console.debug(result.toString());
      expect(result).toBe(undefined);
    });

    test('should throw: no keys passed', () => {
      expect(async () => await readFragmentData()).rejects.toThrow();
    });

    test('should throw: just one key passed', () => {
      expect(async () => await readFragmentData(fragment.ownerId)).rejects.toThrow();
    });
  });

  describe('test listFragments()', () => {
    test('should return a list of fragments', async () => {
      writeFragment(fragment);
      const bufferData = Buffer.from('testing');
      writeFragmentData(fragment.ownerId, fragment.id, bufferData);
      const result = await listFragments(fragment.ownerId, true);
      expect(Array.isArray(result)).toBe(true);
      expect(...result).toBe(fragment);
      deleteFragment(fragment.ownerId, fragment.id);
    });

    test('should return an empty array', async () => {
      const result = await listFragments(fragment.ownerId, true);
      console.debug(result);
      expect(Array.isArray(result)).toBe(true);
      expect(result).toStrictEqual([]);
    });
  });

  describe('test deleteFragment()', () => {
    test('should delete fragment data and metada', async () => {
      // write a new fragment
      writeFragment(fragment);
      const bufferData = Buffer.from('testing');
      writeFragmentData(fragment.ownerId, fragment.id, bufferData);

      // delete the recent added fragment
      await deleteFragment(fragment.ownerId, fragment.id);
      const result = await readFragment(fragment.ownerId, fragment.id);
      expect(result).toBe(undefined);
    });

    test('should throw: wrong id', async () => {
      expect(deleteFragment('1231234', 'aosf12_as')).rejects.toThrow();
    });
  });
});
