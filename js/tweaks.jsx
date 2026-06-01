/* Tweaks app — colors + typography + motion. Mutates :root CSS variables. */
const HERA_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#6D1F3A",
  "headingFont": "Sora",
  "bg": "#F8F5F1",
  "motion": "padrão",
  "radius": 18
}/*EDITMODE-END*/;

function HeraTweaksApp() {
  const [t, setTweak] = useTweaks(HERA_TWEAK_DEFAULTS);

  React.useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--accent', t.accent);
    root.style.setProperty('--font-head', `'${t.headingFont}', sans-serif`);
    root.style.setProperty('--bg', t.bg);
    root.style.setProperty('--radius', t.radius + 'px');
    root.style.setProperty('--radius-sm', (t.radius - 6) + 'px');
    root.style.setProperty('--radius-lg', (t.radius + 8) + 'px');
    root.style.setProperty('--radius-xl', (t.radius + 16) + 'px');

    document.body.classList.toggle('reduce-motion', t.motion === 'desligado');
    const dur = t.motion === 'suave' ? '1100ms' : t.motion === 'desligado' ? '1ms' : '720ms';
    root.style.setProperty('--reveal-dur', dur);
  }, [t]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Cores" />
      <TweakColor
        label="Cor de destaque"
        value={t.accent}
        options={['#6D1F3A', '#202B5C', '#9A3D2E', '#1F6E55', '#7A4DA8', '#B07B2C']}
        onChange={(v) => setTweak('accent', v)}
      />
      <TweakColor
        label="Fundo da página"
        value={t.bg}
        options={['#F8F5F1', '#FFFFFF', '#F2ECE4', '#EFF1F6']}
        onChange={(v) => setTweak('bg', v)}
      />

      <TweakSection label="Tipografia" />
      <TweakRadio
        label="Fonte dos títulos"
        value={t.headingFont}
        options={['Sora', 'Manrope']}
        onChange={(v) => setTweak('headingFont', v)}
      />

      <TweakSection label="Forma & movimento" />
      <TweakSlider
        label="Arredondamento"
        value={t.radius}
        min={6} max={28} step={2} unit="px"
        onChange={(v) => setTweak('radius', v)}
      />
      <TweakRadio
        label="Animações"
        value={t.motion}
        options={['suave', 'padrão', 'desligado']}
        onChange={(v) => setTweak('motion', v)}
      />
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById('tweaks-root')).render(<HeraTweaksApp />);
