import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const data = await req.json();

    const { nome, empresa, whatsapp, email, segmento, atendentes, dificuldade, origem } = data;

    if (!nome || !empresa || !whatsapp || !email) {
      return new Response(
        JSON.stringify({ error: 'Campos obrigatórios faltando.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    /* ── 1. Salvar no Supabase ─────────────────────────────── */
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { error: dbError } = await supabase.from('demo_requests').insert([{
      nome, empresa, whatsapp, email,
      segmento:   segmento   || null,
      atendentes: atendentes || null,
      dificuldade: dificuldade || null,
      origem:     origem     || null,
    }]);

    if (dbError) throw new Error('DB: ' + dbError.message);

    /* ── 2. Enviar e-mail via Resend ──────────────────────── */
    const resendKey = Deno.env.get('RESEND_API_KEY');

    if (resendKey) {
      const emailBody = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'HeraChat <noreply@digitalhera.com.br>',
          to:   ['herachat@digitalhera.com.br'],
          subject: `🟢 Novo lead: ${nome} — ${empresa}`,
          html: `
            <div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#f8f5f1;border-radius:12px;overflow:hidden;">
              <div style="background:#202B5C;padding:28px 32px;">
                <h1 style="color:#fff;margin:0;font-size:22px;">HeraChat — Novo Lead</h1>
              </div>
              <div style="padding:28px 32px;background:#fff;">
                <table style="width:100%;border-collapse:collapse;font-size:15px;">
                  <tr><td style="padding:8px 0;color:#5a5e69;width:140px;">Nome</td><td style="padding:8px 0;font-weight:600;">${nome}</td></tr>
                  <tr><td style="padding:8px 0;color:#5a5e69;">Empresa</td><td style="padding:8px 0;font-weight:600;">${empresa}</td></tr>
                  <tr><td style="padding:8px 0;color:#5a5e69;">WhatsApp</td><td style="padding:8px 0;"><a href="https://wa.me/55${whatsapp.replace(/\D/g,'')}" style="color:#6D1F3A;">${whatsapp}</a></td></tr>
                  <tr><td style="padding:8px 0;color:#5a5e69;">E-mail</td><td style="padding:8px 0;"><a href="mailto:${email}" style="color:#6D1F3A;">${email}</a></td></tr>
                  <tr><td style="padding:8px 0;color:#5a5e69;">Segmento</td><td style="padding:8px 0;">${segmento || '—'}</td></tr>
                  <tr><td style="padding:8px 0;color:#5a5e69;">Atendentes</td><td style="padding:8px 0;">${atendentes || '—'}</td></tr>
                  <tr><td style="padding:8px 0;color:#5a5e69;vertical-align:top;">Dificuldade</td><td style="padding:8px 0;">${dificuldade || '—'}</td></tr>
                  <tr><td style="padding:8px 0;color:#5a5e69;">Origem</td><td style="padding:8px 0;font-size:13px;color:#999;">${origem || '—'}</td></tr>
                </table>
                <div style="margin-top:24px;">
                  <a href="https://wa.me/55${whatsapp.replace(/\D/g,'')}" style="display:inline-block;background:#6D1F3A;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">
                    Responder no WhatsApp
                  </a>
                </div>
              </div>
              <div style="padding:16px 32px;background:#f8f5f1;font-size:12px;color:#999;text-align:center;">
                HeraChat · Digital Hera · ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}
              </div>
            </div>
          `,
        }),
      });

      if (!emailBody.ok) {
        const errText = await emailBody.text();
        console.error('[submit-lead] Resend error:', errText);
      }
    }

    return new Response(
      JSON.stringify({ ok: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    console.error('[submit-lead] Erro:', err);
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
