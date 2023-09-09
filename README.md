# Mdps
[![npm](https://img.shields.io/npm/v/mdps.svg?style=flat)](https://www.npmjs.org/package/mdps) [![travis](https://travis-ci.org/echosoar/mdps.svg?branch=master)](https://travis-ci.org/echosoar/mdps)

The full-featured markdown parser, converts Markdown text into JSON objects, which can be used to produce HTML, PDF and other content.

---
### Usage
```shell
$ npm i mdps --save
```

```javascript
const Mdps = require('mdps');
const mdps = new Mdps();
    mdps.parse(`
# h1
[ ] tesk not complete
[x] tesk complete
`);
const result = mdps.getResult();
```

### Feature Supported

- [x] 一级标题 ~ 六级标题
- [x] 有序列表
- [x] 无序列表
- [x] 引用内容
- [x] 图片
- [x] 超链接
- [x] 代码段
- [x] 行内代码
- [x] 分割线
- [x] 任务列表
- [x] 加粗
- [x] 斜体
- [x] 删除线
- [x] 高亮
- [x] 上标、下标
- [x] 挖空
- [x] 加密文本

### Data after this readme parsed
```JSON
[
  {
    "type": "head",
    "level": 1,
    "value": "Mdps",
    "childs": [
      {
        "type": "line",
        "childs": [
          {
            "type": "link",
            "childs": [
              {
                "type": "img",
                "alt": "npm",
                "src": "https://img.shields.io/npm/v/mdps.svg?style=flat"
              }
            ],
            "href": "https://www.npmjs.org/package/mdps"
          },
          {
            "type": "text",
            "value": " "
          },
          {
            "type": "link",
            "childs": [
              {
                "type": "img",
                "alt": "travis",
                "src": "https://travis-ci.org/echosoar/mdps.svg?branch=master"
              }
            ],
            "href": "https://travis-ci.org/echosoar/mdps"
          }
        ]
      },
      {
        "type": "empty"
      },
      {
        "type": "line",
        "childs": [
          {
            "type": "text",
            "value": "The full-featured markdown parser, converts Markdown text into JSON objects, which can be used to produce HTML, PDF and other content."
          }
        ]
      },
      {
        "type": "empty"
      },
      {
        "type": "hr"
      },
      {
        "type": "head",
        "level": 3,
        "value": "Usage",
        "childs": [
          {
            "type": "code",
            "lang": "shell",
            "childs": [
              {
                "type": "line",
                "childs": [
                  {
                    "type": "text",
                    "value": "$ npm i mdps --save"
                  }
                ]
              }
            ]
          },
          {
            "type": "empty"
          },
          {
            "type": "code",
            "lang": "javascript",
            "childs": [
              {
                "type": "line",
                "childs": [
                  {
                    "type": "text",
                    "value": "const Mdps = require('mdps');"
                  }
                ]
              },
              {
                "type": "line",
                "childs": [
                  {
                    "type": "text",
                    "value": "const mdps = new Mdps();"
                  }
                ]
              },
              {
                "type": "line",
                "childs": [
                  {
                    "type": "text",
                    "value": "    mdps.parse(`"
                  }
                ]
              },
              {
                "type": "line",
                "childs": [
                  {
                    "type": "text",
                    "value": "# h1"
                  }
                ]
              },
              {
                "type": "line",
                "childs": [
                  {
                    "type": "text",
                    "value": "[ ] tesk not complete"
                  }
                ]
              },
              {
                "type": "line",
                "childs": [
                  {
                    "type": "text",
                    "value": "[x] tesk complete"
                  }
                ]
              },
              {
                "type": "line",
                "childs": [
                  {
                    "type": "text",
                    "value": "`);"
                  }
                ]
              },
              {
                "type": "line",
                "childs": [
                  {
                    "type": "text",
                    "value": "const result = mdps.getResult();"
                  }
                ]
              }
            ]
          },
          {
            "type": "empty"
          }
        ]
      },
      {
        "type": "head",
        "level": 3,
        "value": "Feature Supported",
        "childs": [
          {
            "type": "task",
            "level": 0,
            "childs": [
              {
                "type": "item",
                "complete": true,
                "childs": [
                  {
                    "type": "line",
                    "childs": [
                      {
                        "type": "text",
                        "value": "一级标题 ~ 六级标题"
                      }
                    ]
                  }
                ]
              },
              {
                "type": "item",
                "complete": true,
                "childs": [
                  {
                    "type": "line",
                    "childs": [
                      {
                        "type": "text",
                        "value": "有序列表"
                      }
                    ]
                  }
                ]
              },
              {
                "type": "item",
                "complete": true,
                "childs": [
                  {
                    "type": "line",
                    "childs": [
                      {
                        "type": "text",
                        "value": "无序列表"
                      }
                    ]
                  }
                ]
              },
              {
                "type": "item",
                "complete": true,
                "childs": [
                  {
                    "type": "line",
                    "childs": [
                      {
                        "type": "text",
                        "value": "引用内容"
                      }
                    ]
                  }
                ]
              },
              {
                "type": "item",
                "complete": true,
                "childs": [
                  {
                    "type": "line",
                    "childs": [
                      {
                        "type": "text",
                        "value": "代码段"
                      }
                    ]
                  }
                ]
              },
              {
                "type": "item",
                "complete": true,
                "childs": [
                  {
                    "type": "line",
                    "childs": [
                      {
                        "type": "text",
                        "value": "分割线"
                      }
                    ]
                  }
                ]
              },
              {
                "type": "item",
                "complete": true,
                "childs": [
                  {
                    "type": "line",
                    "childs": [
                      {
                        "type": "text",
                        "value": "任务列表"
                      }
                    ]
                  }
                ]
              },
              {
                "type": "item",
                "complete": true,
                "childs": [
                  {
                    "type": "line",
                    "childs": [
                      {
                        "type": "text",
                        "value": "加粗"
                      }
                    ]
                  }
                ]
              },
              {
                "type": "item",
                "complete": true,
                "childs": [
                  {
                    "type": "line",
                    "childs": [
                      {
                        "type": "text",
                        "value": "斜体"
                      }
                    ]
                  }
                ]
              },
              {
                "type": "item",
                "complete": true,
                "childs": [
                  {
                    "type": "line",
                    "childs": [
                      {
                        "type": "text",
                        "value": "图片"
                      }
                    ]
                  }
                ]
              },
              {
                "type": "item",
                "complete": true,
                "childs": [
                  {
                    "type": "line",
                    "childs": [
                      {
                        "type": "text",
                        "value": "超链接"
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "type": "empty"
          }
        ]
      },
      {
        "type": "head",
        "level": 3,
        "value": "Data after this readme parsed",
        "childs": [
          {
            "type": "code",
            "lang": "JSON",
            "childs": [
              {
                "type": "line",
                "childs": [
                  {
                    "type": "text",
                    "value": ""
                  }
                ]
              }
            ]
          },
          {
            "type": "empty"
          }
        ]
      },
      {
        "type": "head",
        "level": 3,
        "value": "License",
        "childs": [
          {
            "type": "line",
            "childs": [
              {
                "type": "text",
                "value": "MIT"
              }
            ]
          },
          {
            "type": "empty"
          }
        ]
      }
    ]
  }
]
```

### License
MIT by @echosoar