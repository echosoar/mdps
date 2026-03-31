import Mdps from '../src';

describe('Inline HTML', () => {
  it('self-closing tag <br/>', () => {
    const mdps = new Mdps();
    mdps.parse(`text<br/>more`);
    const result = mdps.getResult();
    expect(
      result[0].type === 'line' &&
      result[0].childs[1].type === 'html' &&
      result[0].childs[1].value === '<br/>'
    ).toBeTruthy();
  });

  it('self-closing tag with space <br />', () => {
    const mdps = new Mdps();
    mdps.parse(`text<br />more`);
    const result = mdps.getResult();
    expect(
      result[0].type === 'line' &&
      result[0].childs[1].type === 'html' &&
      result[0].childs[1].value === '<br />'
    ).toBeTruthy();
  });

  it('paired tag <span>text</span>', () => {
    const mdps = new Mdps();
    mdps.parse(`This is <span>inline html</span>.`);
    const result = mdps.getResult();
    expect(
      result[0].type === 'line' &&
      result[0].childs[1].type === 'html' &&
      result[0].childs[1].value === '<span>inline html</span>'
    ).toBeTruthy();
  });

  it('paired tag with attributes', () => {
    const mdps = new Mdps();
    mdps.parse(`This is <span style="color:red">red text</span>.`);
    const result = mdps.getResult();
    expect(
      result[0].type === 'line' &&
      result[0].childs[1].type === 'html' &&
      result[0].childs[1].value === '<span style="color:red">red text</span>'
    ).toBeTruthy();
  });

  it('inline html mixed with markdown bold', () => {
    const mdps = new Mdps();
    mdps.parse(`**bold** and <em>emphasis</em>`);
    const result = mdps.getResult();
    expect(
      result[0].type === 'line' &&
      result[0].childs[0].type === 'bold' &&
      result[0].childs[2].type === 'html' &&
      result[0].childs[2].value === '<em>emphasis</em>'
    ).toBeTruthy();
  });

  it('self-closing tag with attributes <img src="url" />', () => {
    const mdps = new Mdps();
    mdps.parse(`before <img src="test.png" /> after`);
    const result = mdps.getResult();
    expect(
      result[0].type === 'line' &&
      result[0].childs[1].type === 'html' &&
      result[0].childs[1].value === '<img src="test.png" />'
    ).toBeTruthy();
  });
});
