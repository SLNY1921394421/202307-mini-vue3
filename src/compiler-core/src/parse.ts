export function baseParse(content: string) {
  const context = createParserContext(content);
  return createRoot(parseChildren(context))
}
function createRoot(children) {
  return {
    children,
  }
}

function parseChildren(context) {
  return {
    type: "interpolation",
    content: {
      type: "simple_expression",
      content: "message",
    },
  }
}

function createParserContext(content) {
  console.log("创建 paserContext");
  return {
    source: content,
  };
}
