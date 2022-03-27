import Mdps from '../src';
import { writeFileSync } from 'fs';
import { resolve } from 'path';
describe('Readme', () => {
  it('common', () => {
    const mdps = new Mdps();
    mdps.parse(`
# Mdps
[![npm](https://img.shields.io/npm/v/mdps.svg?style=flat)](https://www.npmjs.org/package/mdps) [![travis](https://travis-ci.org/echosoar/mdps.svg?branch=master)](https://travis-ci.org/echosoar/mdps)

The full-featured markdown parser, converts Markdown text into JSON objects, which can be used to produce HTML, PDF and other content.

---
### Usage
\`\`\`shell
$ npm i mdps --save
\`\`\`

\`\`\`javascript
const Mdps = require('mdps');
const mdps = new Mdps();
    mdps.parse(\`
# h1
[ ] tesk not complete
[x] tesk complete
\`);
const result = mdps.getResult();
\`\`\`

### Feature Supported

- [x] 一级标题 ~ 六级标题
- [x] 有序列表
- [x] 无序列表
- [x] 引用内容
- [x] 代码段
- [x] 分割线
- [x] 任务列表
- [x] 加粗
- [x] 斜体
- [x] 图片
- [x] 超链接

### Data after this readme parsed
\`\`\`JSON

\`\`\`

### License
MIT
    `);
    const result = mdps.getResult();
    writeFileSync(resolve(__dirname, './json/readme_common.json'), JSON.stringify(result, null, '  '));
    expect(true).toBeTruthy();
  });
});
