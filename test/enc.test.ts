import Mdps from '../src';
import { writeFileSync } from 'fs';
import { resolve } from 'path';
describe('Task', () => {
  it('common', () => {
    const mdps = new Mdps();
    mdps.parse(`
>enc:title
1111
enc<

>enc:title2
2222
enc<
    `);
    const result = mdps.getResult();
    writeFileSync(resolve(__dirname, './json/enc_common.json'), JSON.stringify(result, null, '  '));
    expect(
      result[0].type === 'enc' &&
      result[0].childs[0].type === 'line' &&
      result[0].childs[0].childs[0].type === 'text' &&
      result[0].childs[0].childs[0].value === '1111'
    ).toBeTruthy();
  });
});
