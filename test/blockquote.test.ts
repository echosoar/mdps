import Mdps from '../src';
import { writeFileSync } from 'fs';
import { resolve } from 'path';
describe('Blockquote', () => {
  it('common', () => {
    const mdps = new Mdps();
    mdps.parse(`
> bq1
> bq2
> bq3
    `);
    const result = mdps.getResult();
    writeFileSync(resolve(__dirname, './json/blockquote_common.json'), JSON.stringify(result, null, '  '));
    expect(
      result[0].type === 'blockquote' &&
      result[0].childs[0].type === 'item' &&
      result[0].childs[0].childs[0].type === 'line' &&
      result[0].childs[0].childs[0].childs[0].type === 'text' &&
      result[0].childs[0].childs[0].childs[0].value === 'bq1' &&
      result[0].childs[1].type === 'item' &&
      result[0].childs[1].childs[0].type === 'line' &&
      result[0].childs[1].childs[0].childs[0].type === 'text' &&
      result[0].childs[1].childs[0].childs[0].value === 'bq2' &&
      result[0].childs[2].type === 'item' &&
      result[0].childs[2].childs[0].type === 'line' &&
      result[0].childs[2].childs[0].childs[0].type === 'text' &&
      result[0].childs[2].childs[0].childs[0].value === 'bq3',
    ).toBeTruthy();
  });

  it('multi level', () => {
    const mdps = new Mdps();
    mdps.parse(`
> bq1
>> bq2
>>> bq3
> bq1-item2
    `);
    const result = mdps.getResult();
    writeFileSync(resolve(__dirname, './json/blockquote_multi_level.json'), JSON.stringify(result, null, '  '));
    expect(
      result[0].type === 'blockquote' &&
      result[0].childs[0].type === 'item' &&
      result[0].childs[0].childs[0].type === 'line' &&
      result[0].childs[0].childs[0].childs[0].type === 'text' &&
      result[0].childs[0].childs[0].childs[0].value === 'bq1' &&
      result[0].childs[0].childs[1].type === 'blockquote' &&
      result[0].childs[0].childs[1].childs[0].type === 'item' &&
      result[0].childs[1].type === 'item' &&
      result[0].childs[1].childs[0].type === 'line' &&
      result[0].childs[1].childs[0].childs[0].type === 'text' &&
      result[0].childs[1].childs[0].childs[0].value === 'bq1-item2',
    ).toBeTruthy();
  });
});
