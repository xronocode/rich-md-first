import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { parse } from 'pele';

const root = fileURLToPath(new URL('../', import.meta.url));
const workflow = await readFile(path.join(root, 'examples/document/after.md'), 'utf8');
const plainReply = await readFile(path.join(root, 'examples/document/before.md'), 'utf8');
const ownersRows = workflow.match(/## Owners\n\n([\s\S]*?)\n\n## Activation workflow/)[1].split('\n').filter(line=>line.startsWith('|')&&!/^\|[- :|]+\|$/.test(line)).map(line=>line.split('|').slice(1,-1).map(cell=>cell.trim()));
const actions = workflow.match(/## Next steps\n\n([\s\S]*?)\n\n## Open decisions/)[1].split('\n').filter(line=>line.startsWith('- [ ] ')).map(line=>line.slice(6).replaceAll('**','').replace(/\.$/,''));
const model = parse(workflow.match(/```mermaid\n([\s\S]*?)```/)[1]);
const ink = '#17191E', yellow = '#FFCF1A', paper = '#FAF6EE', muted = '#615D54';
const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
const text = (x, y, value, size = 20, weight = 400, fill = ink, anchor = 'start') =>
  `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}">${esc(value)}</text>`;
const rect = (x, y, width, height, fill, radius = 12, stroke = 'none', strokeWidth = 1) =>
  `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>`;
function wrap(value, max) {
  const lines = [''];
  for (const word of value.split(/\s+/)) {
    const last = lines.length - 1;
    if (lines[last] && lines[last].length + 1 + word.length > max) lines.push(word);
    else lines[last] += (lines[last] ? ' ' : '') + word;
  }
  return lines;
}
function frame(width, height, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc">
<title id="title">Readable by default: one long reply, a structured document</title>
<desc id="desc">One shared brief produces a long plain chat reply or a structured onboarding rollout review with navigation, a launch gate, team ownership, a workflow, and next steps. Complete source and result files are included.</desc>
<defs>
  <marker id="arrow" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="12" markerHeight="12" orient="auto" markerUnits="userSpaceOnUse"><path d="M1 1L11 6L1 11Z" fill="${ink}"/></marker>
  <pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#DCD5C7"/></pattern>
</defs>
<style>text{font-family:Arial,Helvetica,sans-serif}.edge{stroke-linejoin:round;stroke-linecap:round}</style>
${rect(0, 0, width, height, paper, 24)}
${body}
</svg>\n`;
}
function brand(x, y, scale = 1) {
  return `<g transform="translate(${x} ${y}) scale(${scale})">${rect(0, 0, 44, 44, yellow, 11, ink, 2)}${text(5, 30, 'md', 24, 800)}${text(60, 30, 'Rich Markdown First', 25, 800)}</g>`;
}
function node(id, x, y, width, height, size = 22, maxChars = 13) {
  const value = model.nodes.get(id);
  const fill = id === 'D' ? yellow : id === 'E' ? ink : '#FFFFFF';
  const shape = value.type === 'diamond'
    ? `<polygon points="${x},${y-height/2} ${x+width/2},${y} ${x},${y+height/2} ${x-width/2},${y}" fill="${fill}" stroke="${ink}" stroke-width="2.4"/>`
    : rect(x-width/2, y-height/2, width, height, fill, 14, ink, 2.4);
  const lines = wrap(value.text, maxChars), lineHeight = size * 1.16;
  const baseline = y - (lines.length - 1) * lineHeight / 2 + size * .34;
  return `<g class="workflow-node" data-id="${id}" data-label="${esc(value.text)}">${shape}${lines.map((line,i)=>text(x,baseline+i*lineHeight,line,size,id==='D'||id==='E'?700:500,id==='E'?'#FFFFFF':ink,'middle')).join('')}</g>`;
}
function edge(start, end, route, label, labelX, labelY) {
  const source = model.edges.find(edge => edge.start === start && edge.end === end);
  if (!source || source.text !== label) throw new Error(`Workflow edge mismatch: ${start} -> ${end}`);
  const highlight = label !== 'No'
    ? `<path class="edge" d="${route}" fill="none" stroke="${yellow}" stroke-width="12"/>` : '';
  return `<g class="workflow-edge" data-start="${start}" data-end="${end}" data-label="${label}">${highlight}<path class="edge" d="${route}" fill="none" stroke="${ink}" stroke-width="2.8" marker-end="url(#arrow)"/>${label?text(labelX,labelY,label,21,700):''}</g>`;
}

function diagram(mobile = false) {
  let body = '';
  if (mobile) {
    body += edge('A','B','M141 48H212','');
    body += edge('B','C','M352 48H426','Yes',366,27);
    body += edge('C','D','M500 81V140','');
    body += edge('D','E','M500 250V323H361','Yes',516,292);
    body += edge('E','F','M203 323H141','');
    body += edge('B','G','M282 96V118Q282 130 270 130H112Q100 130 100 142V160','No',299,126);
    body += edge('D','G','M415 195H188','No',290,176);
    body += node('A',76,48,130,66,21,10);
    body += node('B',282,48,140,96,21,10);
    body += node('C',500,48,148,66,21,10);
    body += node('D',500,195,170,110,21,12);
    body += node('E',282,323,158,72,21,12);
    body += node('F',76,323,130,66,21,12);
    body += node('G',100,195,176,70,21,18);
    return body;
  }
  body += edge('A','B','M732 418H796','');
  body += edge('B','C','M932 418H1012','Yes',954,398);
  body += edge('C','D','M1164 418H1256','');
  body += edge('D','E','M1344 476V576','Yes',1362,533);
  body += edge('E','F','M1252 616H1184','');
  body += edge('B','G','M864 472V582Q864 602 844 602H838V629','No',882,548);
  body += edge('D','G','M1432 418H1454Q1472 418 1472 436V742Q1472 760 1454 760H856Q838 760 838 742V701','No',1483,468);
  body += node('A',664,418,136,70,21,10);
  body += node('B',864,418,136,108,21,10);
  body += node('C',1088,418,152,78,22,10);
  body += node('D',1344,418,176,116,21,12);
  body += node('E',1344,616,184,80,23,12);
  body += node('F',1104,616,160,80,22,12);
  body += node('G',838,665,214,72,22,18);
  return body;
}

function ownersTable(x, y, width, mobile = false) {
  const font = mobile ? 23 : 18, rowHeight = mobile ? 36 : 36;
  const firstWidth = mobile ? 152 : 178;
  const rows = ownersRows;
  let body = rect(x,y,width,rowHeight,yellow,7);
  rows.forEach((row,i)=>{
    const top = y+i*rowHeight;
    if(i>0&&i%2===0)body += rect(x,top,width,rowHeight,paper,0);
    body += text(x+12,top+rowHeight*.69,row[0],font,i===0?700:600);
    const label = mobile ? row[1].replace('Request validation and triage','Validation + triage').replace('Payment-status reconciliation','Payment reconciliation').replace('Receipt resend and customer communication','Receipts + communication') : row[1];
    body += text(x+firstWidth,top+rowHeight*.69,label,font,i===0?700:400);
    if(i>0)body += `<line x1="${x}" y1="${top+rowHeight}" x2="${x+width}" y2="${top+rowHeight}" stroke="#E4DDD0"/>`;
  });
  return body;
}

function actionRows(x, y, mobile = false) {
  let body = '';
  const font = mobile ? 23 : 18, step = mobile ? 36 : 33;
  actions.forEach((action,i)=>{
    const baseline = y+i*step;
    body += rect(x,baseline-15,16,16,'#FFFFFF',3,ink,1.8);
    const label = mobile ? action.replace('verify invalid-request cases','Check invalid requests').replace('test unconfirmed payments','Test unconfirmed payments').replace('rehearse rollback','Rehearse rollback').replace('prepare receipt recovery','Prepare receipt recovery').replace('Operations: ','Ops: ').replace('Platform: ','Platform: ').replace('October','Oct') : action;
    body += text(x+28,baseline,label,font);
  });
  return body;
}

export function buildHero(mobile = false) {
  if (mobile) {
    let body=brand(36,32,1.05);
    body += text(36,149,'Readable answers.',51,800);
    body += rect(27,166,327,63,yellow,10)+text(36,213,'By default.',51,800);
    body += rect(28,262,664,100,'#FFFFFF',14,'#DDD4C3');
    body += text(48,295,'ONE SHARED BRIEF',19,700,muted);
    body += text(48,331,'Prepare an onboarding rollout review.',27,600);
    body += rect(28,396,664,470,ink,18);
    body += text(52,437,'WITHOUT THE SKILL',23,700,yellow);
    body += text(52,469,'Long chat reply · excerpt',21,400,'#C6C0B5');
    const lines=wrap(plainReply.replace(/\s+/g,' '),56).slice(0,11);
    body += lines.map((line,i)=>text(52,510+i*27,line,21,400,'#DCD7CB')).join('');
    body += text(52,836,'… full reply linked below',21,400,'#C6C0B5');
    body += rect(28,902,664,1230,'#FFFFFF',18,'#DDD4C3');
    body += rect(52,928,252,34,yellow,17)+text(68,952,'WITH THE SKILL',22,700);
    body += text(52,1011,'Onboarding rollout review',31,800);
    body += text(52,1048,'20 invited accounts · 2 November',23,400,muted);
    body += text(52,1085,'Decision · Owners · Workflow · Actions',21,400,muted);
    body += rect(52,1110,616,101,'#FFF4B5',9);
    body += rect(52,1110,6,101,yellow,0);
    body += text(70,1140,'LAUNCH GATE',18,700);
    body += text(70,1173,'Operations AND Billing must',24,700);
    body += text(70,1200,'approve before invitations.',24,700);
    body += text(52,1260,'Owners & handoffs',26,700);
    body += ownersTable(52,1283,616,true);
    body += text(52,1518,'Activation workflow',26,700);
    body += `<g transform="translate(67 1558)">${diagram(true)}</g>`;
    body += text(52,1970,'Next steps',26,700);
    body += actionRows(52,2010,true);
    body += text(28,2170,'Document previews · Complete versions linked below',21,400,muted);
    return frame(720,2200,body);
  }
  let body=brand(56,40);
  body += text(1250,70,'ONE BRIEF. TWO PRESENTATIONS.',16,700,muted);
  body += rect(48,108,356,77,yellow,12);
  body += text(56,165,'Readable',72,800);
  body += text(426,165,'by default.',72,800);
  body += text(59,220,'The agent chooses the structure before it answers.',27,400,muted);
  body += rect(56,258,1488,64,'#FFFFFF',14,'#DDD4C3');
  body += text(78,298,'YOUR QUESTION',17,700,muted);
  body += text(265,298,'Prepare an onboarding rollout review for our operations team.',24,600);
  body += rect(56,354,620,1248,ink,22);
  body += text(86,395,'WITHOUT THE SKILL',19,700,yellow);
  body += text(608,395,'CHAT',16,700,'#C6C0B5','end');
  body += `<line x1="86" y1="417" x2="646" y2="417" stroke="#444342"/>`;
  let cursor=456;
  for(const paragraph of plainReply.trim().split(/\n\s*\n/)) {
    const lines=wrap(paragraph,72);
    body += lines.map((line,i)=>text(86,cursor+i*21,line,16.5,400,'#DCD7CB')).join('');
    cursor += lines.length*21+12;
  }
  if(cursor>1580) throw new Error(`Plain document exceeds preview: ${cursor}`);
  body += rect(704,354,840,1248,'#FFFFFF',22,'#DDD4C3');
  body += rect(732,378,206,32,yellow,16)+text(749,401,'WITH THE SKILL',18,700);
  body += text(1512,401,'onboarding-review.md',17,400,muted,'end');
  body += text(738,462,'Onboarding rollout review',35,800);
  body += text(738,501,'Pilot: 20 invited accounts · Launch: 2 Nov · Review: 5 Nov',18,400,muted);
  body += text(738,535,'Decision  /  Owners  /  Workflow  /  Rollout  /  Next steps',17,400,muted);
  body += rect(738,558,772,90,'#FFF4B5',10)+rect(738,558,6,90,yellow,0);
  body += text(759,587,'LAUNCH GATE',15,700);
  body += text(759,620,'Operations AND Billing must both approve.',23,700);
  body += text(738,696,'Owners & handoffs',27,700);
  body += ownersTable(738,720,772);
  body += text(738,947,'Activation workflow',27,700);
  body += rect(738,968,772,318,'url(#dots)',8);
  body += `<g transform="translate(748 972) scale(.80) translate(-596 -360)">${diagram()}</g>`;
  body += rect(738,1307,772,74,'#FAF6EE',10)+rect(738,1307,5,74,yellow,0);
  body += text(757,1337,'Receipt failure: keep the account active; Support resends it.',18,600);
  body += text(757,1362,'Do not charge or provision again.',18);
  body += text(738,1426,'Next steps',27,700);
  body += actionRows(738,1467);
  body += text(56,1641,'Document previews · Same brief and facts · Complete plain reply and structured document linked below',18,400,muted);
  return frame(1600,1672,body);
}

// Separate, equally sized pages let the README show small linked previews.
// Keep the detailed comparison available without making it the default view.
export function buildDocumentPreview(kind) {
  if (kind === 'after') {
    return buildHero(false)
      .replace('width="1600" height="1672" viewBox="0 0 1600 1672"', 'width="840" height="1248" viewBox="704 354 840 1248"')
      .replace('Readable by default: one long reply, a structured document', 'Structured rollout review: document preview')
      .replace(/<desc id="desc">[\s\S]*?<\/desc>/, '<desc id="desc">Illustrative structured review with navigation, a launch gate, an ownership table, a workflow diagram, and next steps. The complete Markdown document is linked from the README.</desc>');
  }
  if (kind !== 'before') throw new Error(`Unknown document preview: ${kind}`);
  let body = rect(0,0,840,1248,ink,22);
  body += text(36,49,'WITHOUT THE SKILL',19,700,yellow);
  body += text(804,49,'CHAT',16,700,'#C6C0B5','end');
  body += '<line x1="36" y1="72" x2="804" y2="72" stroke="#444342"/>';
  let cursor = 116;
  for (const paragraph of plainReply.trim().split(/\n\s*\n/)) {
    const lines = wrap(paragraph,88);
    body += lines.map((line,i)=>text(36,cursor+i*25,line,18.5,400,'#DCD7CB')).join('');
    cursor += lines.length*25+19;
  }
  if (cursor > 1220) throw new Error(`Plain document exceeds page: ${cursor}`);
  return frame(840,1248,body)
    .replace('Readable by default: one long reply, a structured document', 'Plain rollout review: long chat reply')
    .replace(/<desc id="desc">[\s\S]*?<\/desc>/, '<desc id="desc">Illustrative 454-word chat reply in paragraphs. The complete Markdown text is linked from the README.</desc>');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await mkdir(path.join(root,'assets'),{recursive:true});
  for (const [name,mobile] of [['before-after.svg',false],['before-after-mobile.svg',true]]) {
    await writeFile(path.join(root,'assets',name),buildHero(mobile));
  }
  for (const [name,kind] of [['plain-reply.svg','before'],['structured-review.svg','after']]) {
    await writeFile(path.join(root,'assets',name),buildDocumentPreview(kind));
  }
  console.log('Built full comparisons and separate document previews from the examples.');
}
