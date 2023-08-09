import { NodeTypes } from "./ast";

export const enum TagType {
  Start,
  End,
}

export function baseParse(content: string) {
  const context = createParseContext(content);
  return createRoot(parseChildren(context));
}

function parseChildren(context) {
  const nodes: any = [];
  let node;
  const s = context.source;

  if(s.startsWith("{{")) {
    node = parseInterpolation(context)
  } else if (s[0] === '<') {
    // element 类型
    if (/[a-z]/i.test(s[1])) {
      node = parseElement(context)
    }
  }


  nodes.push(node);
  return nodes;
}

function parseInterpolation(context) {
  const openDelimiter = "{{";
  const closeDelimiter = "}}";

  const closeIndex = context.source.indexOf(
    closeDelimiter,
    openDelimiter.length
  );

  advanceBy(context, openDelimiter.length)
  const rawContextLength = closeIndex - openDelimiter.length;
  const rawContent = context.source.slice(0, rawContextLength);
  const content = rawContent.trim();

  advanceBy(context, rawContextLength + closeDelimiter.length);

  return {
    type: NodeTypes.INTERPOLATION,
    content: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      content: content
    },
  }
}

function createRoot(children) {
  return {
    children,
  }
}

function createParseContext(content: string) {
  return {
    source: content,
  }
}
function advanceBy(context: any, length: number) {
  context.source = context.source.slice(length);
}

function parseElement(context: any) {
  const element: any = parseTag(context, TagType.Start) // 解析出tag，并删除标签左边部分（<div>），并推进
  
  

  // 当前结束标签和开始标签一样，那就消费这个tag
  // if (startsWithEndTagOpen(context.source, element.tag)) {
    parseTag(context, TagType.End) // 删除标签右边部分（</div>），并推进
  // } else {
  //   // 如果不相等，说明缺少结束标签
  //   throw new Error(`缺少结束标签：${element.tag}`)
  // }
  return element
}

function parseTag(context: any, type: TagType) {
  // 1.解析元素tag
  const match: any = /^<\/?([a-z]*)/i.exec(context.source)
  const tag = match[1] // 先默认都是能解析出来的正确代码

  // 2.删除处理完成的代码，并推进
  advanceBy(context, match[0].length) // 删除左边并推进
  advanceBy(context, 1) // 删除右尖括号

  // 如果是结束标签的话不需要返回element
  if (type === TagType.End) {
    return
  }
  return {
    type: NodeTypes.ELEMENT,
    tag,
  }
}

