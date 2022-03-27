import Mdps from '../src';
import { writeFileSync } from 'fs';
import { resolve } from 'path';
describe('Hr', () => {
  it('common', () => {
    const mdps = new Mdps();
    mdps.parse(`
---
    ---
  not ---
not ---
    `);
    const result = mdps.getResult();
    writeFileSync(resolve(__dirname, './json/hr_common.json'), JSON.stringify(result, null, '  '));
    expect(
      result[0].type === 'hr' &&
      result[1].type === 'hr' &&
      result[2].type === 'line' &&
      result[2].childs[0].type === 'text' &&
      result[2].childs[0].value === '  not ---' &&
      result[3].type === 'line' &&
      result[3].childs[0].type === 'text' &&
      result[3].childs[0].value === 'not ---',
    ).toBeTruthy();
  });
});
