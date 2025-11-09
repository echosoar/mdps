import Mdps from '../src';
import { writeFileSync } from 'fs';
import { resolve } from 'path';

describe('Table', () => {
  it('common table', () => {
    const mdps = new Mdps();
    mdps.parse(`
| 左对齐 | 右对齐 | 居中对齐 |
| :-----| ----: | :----: |
| 单元格 | 单元格 | 单元格 |
| 单元格 | 单元格 | 单元格 |
    `);
    const result = mdps.getResult();
    writeFileSync(resolve(__dirname, './json/table_common.json'), JSON.stringify(result, null, '  '));

    expect(result[0].type).toBe('table');
    expect(result[0].tableHead).toBeDefined();
    expect(result[0].tableHead.length).toBe(3);
    expect(result[0].tableHead[0].value).toBe('左对齐');
    expect(result[0].tableHead[0].align).toBe('left');
    expect(result[0].tableHead[1].value).toBe('右对齐');
    expect(result[0].tableHead[1].align).toBe('right');
    expect(result[0].tableHead[2].value).toBe('居中对齐');
    expect(result[0].tableHead[2].align).toBe('center');
    expect(result[0].childs.length).toBe(2);
    expect(result[0].childs[0].type).toBe('tableLine');
    expect(result[0].childs[0].childs[0].type).toBe('tableItem');
    expect(result[0].childs[0].childs[0].childs[0].value).toBe('单元格');
  });

  it('table with different alignments', () => {
    const mdps = new Mdps();
    mdps.parse(`
| Left | Right | Center | Default |
| :--- | ---: | :---: | --- |
| L1 | R1 | C1 | D1 |
| L2 | R2 | C2 | D2 |
    `);
    const result = mdps.getResult();
    writeFileSync(resolve(__dirname, './json/table_alignment.json'), JSON.stringify(result, null, '  '));

    expect(result[0].type).toBe('table');
    expect(result[0].tableHead[0].align).toBe('left');
    expect(result[0].tableHead[1].align).toBe('right');
    expect(result[0].tableHead[2].align).toBe('center');
    expect(result[0].tableHead[3].align).toBe('left'); // default is left
    expect(result[0].childs.length).toBe(2);
  });

  it('simple table', () => {
    const mdps = new Mdps();
    mdps.parse(`
| Header 1 | Header 2 |
| --- | --- |
| Cell 1 | Cell 2 |
    `);
    const result = mdps.getResult();
    writeFileSync(resolve(__dirname, './json/table_simple.json'), JSON.stringify(result, null, '  '));

    expect(result[0].type).toBe('table');
    expect(result[0].tableHead.length).toBe(2);
    expect(result[0].childs.length).toBe(1);
    expect(result[0].childs[0].childs.length).toBe(2);
  });

  it('table followed by other content', () => {
    const mdps = new Mdps();
    mdps.parse(`
| Header |
| --- |
| Cell |

Some text after table
    `);
    const result = mdps.getResult();

    expect(result[0].type).toBe('table');
    expect(result[1].type).toBe('empty');
    expect(result[2].type).toBe('line');
  });

  it('not a table - missing separator', () => {
    const mdps = new Mdps();
    mdps.parse(`
| This is not a table |
| Because no separator |
    `);
    const result = mdps.getResult();

    // Should be treated as regular lines, not a table
    expect(result[0].type).toBe('line');
    expect(result[1].type).toBe('line');
  });
});
