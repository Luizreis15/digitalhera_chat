/* ============================================================
   HeraChat — Configuração pública
   Apenas a anon key vai aqui (é pública por design no Supabase).
   Nunca coloque service_role ou chaves do Resend neste arquivo.
   ============================================================ */

window.HERA_SUPABASE_URL      = 'https://sbtdtiuijiombxegmizh.supabase.co';
window.HERA_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNidGR0aXVpamlvbWJ4ZWdtaXpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzNDAwNzksImV4cCI6MjA5NTkxNjA3OX0.Qgm0ky535r8gKE9vnbCQogNf0a0YV1b937TE3FNULA4';

/* URL da Edge Function (gerada automaticamente pelo Supabase) */
window.HERA_EDGE_FN_URL = window.HERA_SUPABASE_URL + '/functions/v1/submit-lead';
