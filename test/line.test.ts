import Mdps from '../src';
import { writeFileSync } from 'fs';
import { resolve } from 'path';

describe('Line', () => {
  it('mix text link bold itelic and img', () => {
    const mdps = new Mdps();
    mdps.parse(`
    as[d](link)[![编组.png](imgsrc)](123)[d**asd**](link)**as**_**d**a_sd~~ha~~==xxx==
    `);
    const result = mdps.getResult();
    writeFileSync(resolve(__dirname, './json/line.json'), JSON.stringify(result, null, '  '));
    expect(
      result[0].type === 'line' &&
      result[0].childs[1].type === 'link' &&  // [d](link)
      result[0].childs[2].type === 'link' &&  // [![编组.png](imgsrc)](123)
      result[0].childs[2].childs[0].type === 'img' &&  // ![编组.png](imgsrc)
      result[0].childs[3].type === 'link' &&  // [d**asd**](link)
      result[0].childs[3].childs[0].type === 'text' &&  // dß
      result[0].childs[3].childs[0].value === 'd' &&  // d
      result[0].childs[3].childs[1].type === 'bold' &&  // **asd**
      result[0].childs[4].type === 'bold' &&  // **as**
      result[0].childs[4].childs[0].value === 'as' &&  // **as**
      result[0].childs[5].type === 'italic' &&  // _**d**a_
      result[0].childs[5].childs[0].type === 'bold' &&  // **d**
      result[0].childs[5].childs[0].childs[0].value === 'd' &&  // d
      result[0].childs[5].childs[1].type === 'text' &&  // d
      result[0].childs[5].childs[1].value === 'a' &&// a
      result[0].childs[7].type === 'delete' &&  //~~ha~~
      result[0].childs[7].childs[0].value === 'ha' &&  // ~~ha~~
      result[0].childs[8].type === 'highLight',  // ==ha==
    ).toBeTruthy();
  });
});
