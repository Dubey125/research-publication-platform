const parseSections = (body) => {
  if (!body) return [];

  const lines = body.split('\n').map(l => l.trim());
  const parsed = [];
  
  let currentBullets = null;
  let currentParagraph = null;

  lines.forEach(line => {
    if (!line) return;

    if (line.startsWith('## ')) {
      if (currentBullets) { parsed.push(currentBullets); currentBullets = null; }
      if (currentParagraph) { parsed.push(currentParagraph); currentParagraph = null; }
      parsed.push({ type: 'heading', content: line.replace(/^##\s+/, '').trim() });
    } 
    else if (/^[\-\•\*]\s/.test(line)) {
      if (currentParagraph) { parsed.push(currentParagraph); currentParagraph = null; }
      if (!currentBullets) { currentBullets = { type: 'bullets', items: [] }; }
      currentBullets.items.push(line.replace(/^[\-\•\*]\s+/, '').trim());
    } 
    else {
      if (currentBullets) { parsed.push(currentBullets); currentBullets = null; }
      if (!currentParagraph) { currentParagraph = { type: 'paragraph', content: line }; } 
      else { currentParagraph.content += ' ' + line; }
    }
  });

  if (currentBullets) parsed.push(currentBullets);
  if (currentParagraph) parsed.push(currentParagraph);

  return parsed;
};

const PolicyContentView = ({ body }) => {
  const sections = parseSections(body);

  return (
    <div className="space-y-4">
      {sections.map((item, index) =>
        item.type === 'heading' ? (
          <h2
            key={`h-${index}`}
            className="font-display mt-5 text-[15px] font-semibold text-slate-900 border-b border-slate-200 pb-1.5"
          >
            {item.content}
          </h2>
        ) : item.type === 'bullets' ? (
          <ul key={`ul-${index}`} className="ml-4 list-disc space-y-1.5 marker:text-indigo-400">
            {item.items.map((li, li_i) => (
              <li
                key={`li-${index}-${li_i}`}
                className="text-[12px] leading-[1.7] text-slate-700 pl-1"
              >
                {li}
              </li>
            ))}
          </ul>
        ) : (
          <p
            key={`p-${index}`}
            className="text-[12px] leading-[1.7] text-slate-700"
          >
            {item.content}
          </p>
        )
      )}
    </div>
  );
};

export default PolicyContentView;
