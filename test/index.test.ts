import Mdps from '../src';

describe('Base', () => {
  it('Mdps is class', () => {
    expect(typeof Mdps).toBe('function');
    expect(/^class/.test(Mdps.toString())).toBeTruthy();
  });
});
