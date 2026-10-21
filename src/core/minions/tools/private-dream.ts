import { parseMarkdown, serializeMarkdown } from '../../markdown.ts';
import type { ToolDef } from '../types.ts';

export function privateDreamTools(tools: ToolDef[], enabled: boolean): ToolDef[] {
  if (!enabled) return tools;
  return tools.map(tool => tool.name !== 'brain_put_page' ? tool : {
    ...tool,
    execute: async (input, context) => {
      if (!input || typeof input !== 'object' || typeof (input as Record<string, unknown>).content !== 'string') {
        return tool.execute(input, context);
      }
      const params = input as Record<string, unknown>;
      const parsed = parseMarkdown(params.content as string);
      const content = serializeMarkdown(
        { ...parsed.frontmatter, visibility: 'private', confidentiality: 'private' },
        parsed.compiled_truth, parsed.timeline ?? '',
        { type: parsed.type, title: parsed.title, tags: parsed.tags },
      );
      return tool.execute({ ...params, content }, context);
    },
  });
}
