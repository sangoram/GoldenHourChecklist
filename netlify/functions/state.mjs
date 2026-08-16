import { getStore } from '@netlify/blobs';

function mergeAdm(a, b) {
  const am = a.metaAt || 0, bm = b.metaAt || 0;
  const base = bm > am ? { ...a, ...b } : { ...a };
  const mrg = (x, y) => {
    const o = { ...(x || {}) };
    for (const k of Object.keys(y || {})) {
      const bv = y[k];
      if (!o[k] || (bv.at || 0) > (o[k].at || 0)) o[k] = bv;
    }
    return o;
  };
  base.data = mrg(a.data, b.data);
  base.debrief = mrg(a.debrief, b.debrief);
  base.long = mrg(a.long, b.long);
  return base;
}

export default async (req) => {
  const store = getStore('ghaptt');
  let doc = (await store.get('state', { type: 'json' })) || { admissions: {} };
  if (req.method === 'POST') {
    const inc = await req.json();
    const admissions = { ...doc.admissions };
    for (const id of Object.keys(inc.admissions || {})) {
      const b = inc.admissions[id];
      if (!b) continue;
      admissions[id] = admissions[id] ? mergeAdm(admissions[id], b) : b;
    }
    doc = { admissions };
    await store.setJSON('state', doc);
  }
  return new Response(JSON.stringify(doc), {
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });
};
