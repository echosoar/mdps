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
    expect(result[0].headers).toEqual([]);
    // First 3 childs are tableHeader nodes
    expect(result[0].childs[0].type).toBe('tableHeader');
    expect(result[0].childs[0].align).toBe('left');
    expect(result[0].childs[0].childs[0].value).toBe('左对齐');
    expect(result[0].childs[1].type).toBe('tableHeader');
    expect(result[0].childs[1].align).toBe('right');
    expect(result[0].childs[1].childs[0].value).toBe('右对齐');
    expect(result[0].childs[2].type).toBe('tableHeader');
    expect(result[0].childs[2].align).toBe('center');
    expect(result[0].childs[2].childs[0].value).toBe('居中对齐');
    // Remaining childs are tableLine nodes
    expect(result[0].childs[3].type).toBe('tableLine');
    expect(result[0].childs[3].childs[0].type).toBe('tableCell');
    expect(result[0].childs[3].childs[0].childs[0].value).toBe('单元格');
    expect(result[0].childs[4].type).toBe('tableLine');
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
    expect(result[0].childs[0].type).toBe('tableHeader');
    expect(result[0].childs[0].align).toBe('left');
    expect(result[0].childs[1].align).toBe('right');
    expect(result[0].childs[2].align).toBe('center');
    expect(result[0].childs[3].align).toBe('left'); // default is left
    // 4 headers + 2 data rows
    expect(result[0].childs.length).toBe(6);
    expect(result[0].childs[4].type).toBe('tableLine');
    expect(result[0].childs[5].type).toBe('tableLine');
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
    // 2 tableHeader + 1 tableLine
    expect(result[0].childs.length).toBe(3);
    expect(result[0].childs[0].type).toBe('tableHeader');
    expect(result[0].childs[0].childs[0].value).toBe('Header 1');
    expect(result[0].childs[1].type).toBe('tableHeader');
    expect(result[0].childs[1].childs[0].value).toBe('Header 2');
    expect(result[0].childs[2].type).toBe('tableLine');
    expect(result[0].childs[2].childs.length).toBe(2);
    expect(result[0].childs[2].childs[0].type).toBe('tableCell');
    expect(result[0].childs[2].childs[0].childs[0].value).toBe('Cell 1');
    expect(result[0].childs[2].childs[1].childs[0].value).toBe('Cell 2');
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

  it('single column table', () => {
    const mdps = new Mdps();
    mdps.parse(`
| header1 |
| :--- |
| value |
    `);
    const result = mdps.getResult();

    expect(result[0].type).toBe('table');
    expect(result[0].headers).toEqual([]);
    expect(result[0].childs[0].type).toBe('tableHeader');
    expect(result[0].childs[0].childs[0].type).toBe('text');
    expect(result[0].childs[0].childs[0].value).toBe('header1');
    expect(result[0].childs[0].align).toBe('left');
    expect(result[0].childs[1].type).toBe('tableLine');
    expect(result[0].childs[1].childs[0].type).toBe('tableCell');
    expect(result[0].childs[1].childs[0].childs[0].value).toBe('value');
  });

  it('table with inline styles in cells', () => {
    const mdps = new Mdps();
    mdps.parse(`
| Header |
| --- |
| **bold** |
    `);
    const result = mdps.getResult();

    expect(result[0].type).toBe('table');
    expect(result[0].childs[1].type).toBe('tableLine');
    const cell = result[0].childs[1].childs[0];
    expect(cell.type).toBe('tableCell');
    // Bold inline style should be parsed inside cell
    expect(cell.childs[0].type).toBe('bold');
  });

  it('table with center-aligned header', () => {
    const mdps = new Mdps();
    mdps.parse(`
| Name | Score |
| :---: | :---: |
| Alice | 100 |
    `);
    const result = mdps.getResult();

    expect(result[0].type).toBe('table');
    expect(result[0].childs[0].align).toBe('center');
    expect(result[0].childs[1].align).toBe('center');
    expect(result[0].childs[0].childs[0].value).toBe('Name');
    expect(result[0].childs[1].childs[0].value).toBe('Score');
    expect(result[0].childs[2].type).toBe('tableLine');
    expect(result[0].childs[2].childs[0].childs[0].value).toBe('Alice');
    expect(result[0].childs[2].childs[1].childs[0].value).toBe('100');
  });

  it('table with right-aligned columns', () => {
    const mdps = new Mdps();
    mdps.parse(`
| Item | Price |
| --- | ---: |
| Apple | 1.5 |
    `);
    const result = mdps.getResult();

    expect(result[0].childs[0].align).toBe('left');
    expect(result[0].childs[1].align).toBe('right');
    expect(result[0].childs[2].childs[1].childs[0].value).toBe('1.5');
  });

  it('table with multiple data rows', () => {
    const mdps = new Mdps();
    mdps.parse(`
| A | B |
| --- | --- |
| 1 | 2 |
| 3 | 4 |
| 5 | 6 |
    `);
    const result = mdps.getResult();

    expect(result[0].type).toBe('table');
    // 2 headers + 3 data rows
    expect(result[0].childs.length).toBe(5);
    expect(result[0].childs[2].type).toBe('tableLine');
    expect(result[0].childs[3].type).toBe('tableLine');
    expect(result[0].childs[4].type).toBe('tableLine');
    expect(result[0].childs[4].childs[0].childs[0].value).toBe('5');
    expect(result[0].childs[4].childs[1].childs[0].value).toBe('6');
  });
});
