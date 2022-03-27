import Mdps from '../src';
import { writeFileSync } from 'fs';
import { resolve } from 'path';
describe('Task', () => {
  it('common', () => {
    const mdps = new Mdps();
    mdps.parse(`
- [ ] task1 not complete
- [  ] task2 not complete
- [x] task3 complete
- [ x] task4 complete
- [x ] task5 complete
- [ x ] task6 complete
    `);
    const result = mdps.getResult();
    writeFileSync(resolve(__dirname, './json/task_common.json'), JSON.stringify(result, null, '  '));
    expect(
      result[0].type === 'task' &&
      result[0].childs[0].type === 'item' &&
      result[0].childs[0].complete === false &&
      result[0].childs[1].type === 'item' &&
      result[0].childs[1].complete === false &&
      result[0].childs[2].type === 'item' &&
      result[0].childs[2].complete === true &&
      result[0].childs[3].type === 'item' &&
      result[0].childs[3].complete === true &&
      result[0].childs[4].type === 'item' &&
      result[0].childs[4].complete === true &&
      result[0].childs[5].type === 'item' &&
      result[0].childs[5].complete === true,
    ).toBeTruthy();
  });
});
