(() => {
  const projectId = '98td4sc6';
  const dataset = 'production';
  const apiVersion = '2026-11-05';
  const endpoint = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`;
  const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);
  const localTestMode = isLocal ? new URLSearchParams(window.location.search).get('cms-test') : null;

  const fetchQuery = async query => {
    if (localTestMode === 'empty') return [];
    if (localTestMode === 'error') throw new Error('Fallo simulado para control local.');
    const url = new URL(endpoint);
    url.searchParams.set('query', query);
    url.searchParams.set('perspective', 'published');
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch(url, {
        cache: 'no-store',
        headers: {Accept: 'application/json'},
        signal: controller.signal
      });
      if (!response.ok) throw new Error(`Sanity respondió ${response.status}`);
      const payload = await response.json();
      if (!Array.isArray(payload.result)) throw new Error('Sanity devolvió un formato inesperado.');
      return payload.result;
    } finally {
      window.clearTimeout(timeout);
    }
  };

  const getAgents = () => fetchQuery(`
    *[_type == "agente" && activo == true]
      | order(nombre asc) {
        _id, nombre, instagram, email
      }
  `);

  const getPromotions = () => fetchQuery(`
    *[_type == "promocion" && activa == true]
      | order(orden asc) {
        _id, titulo, descripcion, etiqueta, subtitulo, categoria, orden,
        "imagenUrl": imagen.asset->url,
        "imagenAlt": coalesce(imagen.alt, titulo)
      }
  `);

  window.MagicalDreamersSanity = Object.freeze({getAgents, getPromotions});
})();
