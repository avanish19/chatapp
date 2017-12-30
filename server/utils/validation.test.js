const expect = require('expect');

const {isRealstring} = require('./validation');

describe('isRealstring', () => {
  it('should reject non-string values', () => {
    var res = isRealstring(98);
    expect(res).toBe(false);
  });

  it('should reject string with only spaces', () => {
    var res = isRealstring('    ');
    expect(res).toBe(false);
  });

  it('should allow string with non-space characters', () => {
    var res = isRealstring('D');
    expect(res).toBe(true);
  });
});