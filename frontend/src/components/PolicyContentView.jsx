const parseSections = (body) => {
  if (!body) return [];

  return body
    .split('\n\n')
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      if (chunk.startsWith('## ')) {
        return { type: 'heading', content: chunk.replace(/^##\s+/, '').trim() };
      }
      return { type: 'paragraph', content: chunk };
    });
};

const PolicyContentView = ({ body }) => {
  const sections = parseSections(body);

  return (
    <div className="space-y-6">
      {sections.map((item, index) => (
        item.type === 'heading' ? (
          <h2 key={`${item.content}-${index}`} className="font-display mt-6 text-2xl font-semibold text-slate-900 border-b border-slate-200 pb-2">
            {item.content}
          </h2>
        ) : (
          <p
            key={`${item.content.slice(0, 40)}-${index}`}
            className="text-sm leading-7 text-slate-700"
          >
            {item.content}
          </p>
        )
      ))}
    </div>
  );
};

export default PolicyContentView;
