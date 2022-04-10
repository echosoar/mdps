import Mdps from '../src';
import { writeFileSync } from 'fs';
import { resolve } from 'path';
describe('Code', () => {
  it('common', () => {
    const mdps = new Mdps();
    mdps.parse(`
\`\`\`ts
### not head
+ not ol
+ not ol2
\`\`\`
    `);
    const result = mdps.getResult();
    writeFileSync(resolve(__dirname, './json/code_common.json'), JSON.stringify(result, null, '  '));
    expect(
      result[0].type === 'code' &&
      result[0].lang === 'ts' &&
      result[0].childs.length === 3 &&
      result[0].childs[0].type === 'line' &&
      result[0].childs[1].type === 'line' &&
      result[0].childs[2].type === 'line',
    ).toBeTruthy();
  });
  it('inline', () => {
    const mdps = new Mdps();
    mdps.parse(`
\`test\` abc **b**`);
    const result = mdps.getResult();
    writeFileSync(resolve(__dirname, './json/code_inline.json'), JSON.stringify(result, null, '  '));
    expect(
      result[0].type === 'line' &&
      result[0].childs.length === 3 &&
      result[0].childs[0].type === 'inlineCode' &&
      result[0].childs[0].value === 'test' &&
      result[0].childs[1].type === 'text' &&
      result[0].childs[2].type === 'bold',
    ).toBeTruthy();
  });
});
