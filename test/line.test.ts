import Mdps from '../src';
import { writeFileSync } from 'fs';
import { resolve } from 'path';

describe('Line', () => {
  it('pure number content', () => {
    const mdps = new Mdps();
    mdps.parse(`123`);
    const result = mdps.getResult();
    expect(
      result[0].type === 'line' &&
      result[0].childs[0].type === 'text' && 
      result[0].childs[0].value === '123'
    ).toBeTruthy();
  });
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
  it('mix link and bold', () => {
    const mdps = new Mdps();
    mdps.parse(`
    **[userscloud](https://userscloud.com/)**
    `);
    const result = mdps.getResult();
    expect(
      result[0].type === 'line' &&
      result[0].childs[1].type === 'bold' &&  // **xxx**
      result[0].childs[1].childs[0].type === 'link' &&  // [userscloud](https://userscloud.com/)
      result[0].childs[1].childs[0].href === 'https://userscloud.com/' &&  // [userscloud](https://userscloud.com/)
      result[0].childs[1].childs[0].childs[0].type === 'text'  &&  // userscloud
      result[0].childs[1].childs[0].childs[0].value === 'userscloud'
    ).toBeTruthy();
  })
  it('mix hollow and bold', () => {
    const mdps = new Mdps();
    mdps.parse(`
    **{{213}}**{{\`code\`}}
    `);
    const result = mdps.getResult();
    expect(
      result[0].type === 'line' &&
      result[0].childs[1].type === 'bold' &&  // **xxx**
      result[0].childs[1].childs[0].type === 'hollow' &&  // {{213}}
      result[0].childs[1].childs[0].childs[0].type === 'text'  &&  // 213
      result[0].childs[1].childs[0].childs[0].value === '213' && 
      result[0].childs[2].type === 'hollow' &&  // {{xxx}}
      result[0].childs[2].childs[0].type === 'inlineCode' &&  // `code`
      result[0].childs[2].childs[0].value === 'code'  // code
    ).toBeTruthy();
  })
});
