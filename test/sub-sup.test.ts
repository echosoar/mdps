import Mdps from '../src';
import { writeFileSync } from 'fs';
import { resolve } from 'path';
describe('sub-sup', () => {
  it('sub', () => { // 下标
    const mdps = new Mdps();
    mdps.parse(`~2~`);
    const result = mdps.getResult();
    writeFileSync(resolve(__dirname, './json/sub.json'), JSON.stringify(result, null, '  '));
    expect(
      result[0].type === 'line' &&
      result[0].childs.length === 1 &&
      result[0].childs[0].type === 'sub' &&
      result[0].childs[0].value === '2'
    ).toBeTruthy();
  });
  it('sup', () => { // 上标
    const mdps = new Mdps();
    mdps.parse(`^th^`);
    const result = mdps.getResult();
    writeFileSync(resolve(__dirname, './json/sup.json'), JSON.stringify(result, null, '  '));
    expect(
      result[0].type === 'line' &&
      result[0].childs.length === 1 &&
      result[0].childs[0].type === 'sup' &&
      result[0].childs[0].value === 'th'
    ).toBeTruthy();
  });
});
