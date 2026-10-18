import { readFile, readdir, stat, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import MarkdownIt from 'markdown-it';
import { parseDocument } from 'yaml';
import { parse, render } from 'pele';
import { buildHero, buildDocumentPreview } from './build-hero.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const parser = new MarkdownIt({html: true});
const skillDir = path.join(root, 'skills/rich-md-first');
const source = await readFile(path.join(skillDir, 'SKILL.md'), 'utf8');
const frontmatter = source.match(/^---\n([\s\S]*?)\n---\n/);
assert(frontmatter, 'SKILL.md requires frontmatter');
const document = parseDocument(frontmatter[1], {uniqueKeys: true});
assert.equal(document.errors.length, 0, 'Frontmatter must be valid YAML');
const metadata = document.toJS();
assert.equal(metadata.name, path.basename(skillDir));
assert.match(metadata.name, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
assert(metadata.name.length <= 64);
assert(typeof metadata.description === 'string' && metadata.description.trim().length > 0 && metadata.description.length <= 1024);
assert.equal(metadata.license, 'MIT');

async function markdownFiles(dir) {
  const files = [];
  for (const entry of await readdir(dir, {withFileTypes: true})) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await markdownFiles(full));
    else if (entry.name.endsWith('.md')) files.push(full);
  }
  return files;
}
const files = await markdownFiles(root);
let mermaidBlocks = 0, localLinks = 0;
await mkdir(path.join(root, '.checks'), {recursive: true});
async function checkLink(value, file) {
  if (!value || /^[a-z][a-z0-9+.-]*:|^#|^\/\//i.test(value)) return;
  const clean = decodeURIComponent(value.split('#')[0]);
  const target = path.resolve(path.dirname(file), clean);
  assert(!path.relative(root, target).startsWith('..'), `Link outside package: ${value}`);
  await stat(target);
  localLinks++;
}
async function walkTokens(tokens, file) {
  for (const token of tokens) {
    if (token.type === 'link_open') await checkLink(token.attrGet('href'), file);
    if (token.type === 'image') await checkLink(token.attrGet('src'), file);
    if (token.type === 'html_block' || token.type === 'html_inline') {
      for (const match of token.content.matchAll(/(?:href|src|srcset)="([^"]+)"/g)) await checkLink(match[1], file);
    }
    if (token.type === 'fence' && token.info.trim() === 'mermaid') {
      const result = render(token.content);
      assert(typeof result.svg === 'string' && result.svg.includes('<svg'), `No SVG: ${file}`);
      mermaidBlocks++;
      await writeFile(path.join(root, '.checks', `diagram-${mermaidBlocks}.svg`), result.svg);
    }
    if (token.children) await walkTokens(token.children, file);
  }
}
for (const file of files) {
  const text = await readFile(file, 'utf8');
  if (file.startsWith(skillDir + path.sep)) assert(!/\/Users\/|\/home\/[^/]+\//.test(text), 'Personal path in installed instructions');
  await walkTokens(parser.parse(text.replace(/^---\n[\s\S]*?\n---\n/, ''), {}), file);
}

const comparison = JSON.parse(await readFile(path.join(root, 'examples/comparison.json'), 'utf8'));
const tokens = parser.parse(await readFile(path.join(root, 'examples/comparison.md'), 'utf8'), {});
const tableValues = [];
let inCell = false;
for (const token of tokens) {
  if (token.type === 'td_open' || token.type === 'th_open') inCell = true;
  else if (token.type === 'td_close' || token.type === 'th_close') inCell = false;
  else if (inCell && token.type === 'inline') tableValues.push(token.content);
}
assert.deepEqual(tableValues, [...comparison.criteria, ...comparison.options.flat()], 'Comparison data drift');
const workflow = await readFile(path.join(root, 'examples/document/after.md'), 'utf8');
const workflowModel = parse(workflow.match(/```mermaid\n([\s\S]*?)```/)[1]);
const expectedNodes = [...workflowModel.nodes].map(([id,node])=>[id,node.text]).sort();
const expectedEdges = workflowModel.edges.map(edge=>[edge.start,edge.end,edge.text]).sort();
for (const [filename, mobile] of [['before-after.svg', false], ['before-after-mobile.svg', true]]) {
  const svg = await readFile(path.join(root, 'assets', filename), 'utf8');
  assert.equal(svg, buildHero(mobile), `${filename}: run node scripts/build-hero.mjs`);
  const nodes = [...svg.matchAll(/class="workflow-node" data-id="([^"]+)" data-label="([^"]+)"/g)].map(match=>[match[1],match[2]]).sort();
  const edges = [...svg.matchAll(/class="workflow-edge" data-start="([^"]+)" data-end="([^"]+)" data-label="([^"]*)"/g)].map(match=>[match[1],match[2],match[3]]).sort();
  assert.deepEqual(nodes,expectedNodes,`${filename}: workflow nodes or labels changed`);
  assert.deepEqual(edges,expectedEdges,`${filename}: workflow transitions or conditions changed`);
}
for (const [filename, kind] of [['plain-reply.svg', 'before'], ['structured-review.svg', 'after']]) {
  assert.equal(await readFile(path.join(root, 'assets', filename), 'utf8'), buildDocumentPreview(kind), `${filename}: run node scripts/build-hero.mjs`);
}
const result = {markdownFiles: files.length, mermaidBlocksRendered: mermaidBlocks, localLinksChecked: localLinks, comparisonData: 'consistent', heroAssets: 'reproducible', documentPreviews: 'reproducible', heroWorkflow: {nodes: expectedNodes.length, transitions: expectedEdges.length, matchesMermaidSource: true}};
await writeFile(path.join(root, '.checks/results.json'), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify(result, null, 2));
