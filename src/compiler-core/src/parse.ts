// export function baseParse(content: string) {
//   const context = createParserContext(content);
//   return createRoot(parseChildren(context))
// }
// function createRoot(children) {
//   return {
//     children,
//   }
// }

import { NodeTypes } from "./ast";

// function parseChildren(context) {
//   return {
//     type: "interpolation",
//     content: {
//       type: "simple_expression",
//       content: "message",
//     },
//   }
// }

// function createParserContext(content) {
//   console.log("创建 paserContext");
//   return {
//     source: content,
//   };
// }

export function baseParse(content: string) {
  const context = createParseContext(content);
  return createRoot(parseChildren(context));
}

function parseChildren(context) {
  const nodes: any = [];
  let node;

  if(context.source.startsWith("{{")) {
    node = parseInterpolation(context)
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
  console.log("content------------", content)
  advanceBy(context, rawContextLength + closeDelimiter.length)
  
  console.log("context.source---------", context.source)
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

