/* ============================================================
   HeraChat — Envio de lead via Supabase Edge Function
   A Edge Function cuida do insert + email via Resend (server-side).
   ============================================================ */
(function () {
  'use strict';

  var EDGE_URL     = window.HERA_EDGE_FN_URL     || '';
  var ANON_KEY     = window.HERA_SUPABASE_ANON_KEY || '';

  if (!EDGE_URL) {
    console.warn('[HeraChat] HERA_EDGE_FN_URL não configurado em config.js');
    window._heraSubmit = function () { return Promise.resolve(); };
    return;
  }

  window._heraSubmit = function (data) {
    return fetch(EDGE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + ANON_KEY,
        'apikey': ANON_KEY,
      },
      body: JSON.stringify(data),
    })
    .then(function (res) {
      if (!res.ok) {
        return res.json().then(function (body) {
          console.error('[HeraChat] Edge Function error:', body);
        });
      }
    })
    .catch(function (err) {
      console.error('[HeraChat] Erro na requisição:', err);
    });
  };

})();
