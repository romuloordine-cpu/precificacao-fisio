import { useState, useMemo } from "react";

const formatBRL = (v) =>
  Number(v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const Input = ({ label, value, onChange, prefix = "R$", suffix, hint, min = 0 }) => (
  <div className="input-group">
    <label>{label}</label>
    {hint && <span className="hint">{hint}</span>}
    <div className="input-wrap">
      {prefix && <span className="prefix">{prefix}</span>}
      <input
        type="number"
        min={min}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      {suffix && <span className="suffix">{suffix}</span>}
    </div>
  </div>
);

const Card = ({ title, icon, children, accent }) => (
  <div className={`card ${accent ? "card--accent" : ""}`}>
    <div className="card-header">
      <span className="card-icon">{icon}</span>
      <h2>{title}</h2>
    </div>
    <div className="card-body">{children}</div>
  </div>
);

const ResultRow = ({ label, value, highlight, sub }) => (
  <div className={`result-row ${highlight ? "result-row--highlight" : ""} ${sub ? "result-row--sub" : ""}`}>
    <span>{label}</span>
    <strong>{value}</strong>
  </div>
);

export default function App() {
  // Custos Fixos
  const [aluguel, setAluguel] = useState(1500);
  const [energia, setEnergia] = useState(200);
  const [internet, setInternet] = useState(100);
  const [contador, setContador] = useState(250);
  const [salarios, setSalarios] = useState(0);
  const [outrosFixos, setOutrosFixos] = useState(200);

  // Custos VariÃ¡veis por consulta
  const [materiais, setMateriais] = useState(15);
  const [impostos, setImpostos] = useState(8);
  const [cartao, setCartao] = useState(3);
  const [outrosVar, setOutrosVar] = useState(5);

  // Operacional
  const [horasDia, setHorasDia] = useState(8);
  const [diasSemana, setDiasSemana] = useState(5);
  const [ocupacao, setOcupacao] = useState(70);
  const [duracaoConsulta, setDuracaoConsulta] = useState(60);
  const [margemLucro, setMargemLucro] = useState(30);

  const [tab, setTab] = useState("custos");

  const calc = useMemo(() => {
    const diasMes = (diasSemana / 7) * 30;
    const minutosDia = horasDia * 60;
    const consultasPorDia = Math.floor(minutosDia / duracaoConsulta);
    const consultasMes = Math.floor(consultasPorDia * diasMes * (ocupacao / 100));

    const totalFixo = aluguel + energia + internet + contador + salarios + outrosFixos;
    const fixoPorConsulta = consultasMes > 0 ? totalFixo / consultasMes : 0;

    const varPorConsulta = materiais + (materiais * impostos) / 100 + (materiais * cartao) / 100 + outrosVar;
    let preco = 0;
    for (let i = 0; i < 20; i++) {
      const custoVar = materiais + (preco * impostos) / 100 + (preco * cartao) / 100 + outrosVar;
      const custoTotal = fixoPorConsulta + custoVar;
      preco = custoTotal / (1 - margemLucro / 100);
    }

    const custoVarFinal = materiais + (preco * impostos) / 100 + (preco * cartao) / 100 + outrosVar;
    const custoTotalConsulta = fixoPorConsulta + custoVarFinal;
    const lucroConsulta = preco - custoTotalConsulta;
    const faturamentoMes = preco * consultasMes;
    const lucroMes = lucroConsulta * consultasMes;
    const pontoEquilibrio = totalFixo > 0 ? Math.ceil(totalFixo / (preco - custoVarFinal)) : 0;

    return {
      consultasMes,
      consultasPorDia,
      diasMes: diasMes.toFixed(1),
      totalFixo,
      fixoPorConsulta,
      custoVarFinal,
      custoTotalConsulta,
      preco,
      lucroConsulta,
      faturamentoMes,
      lucroMes,
      pontoEquilibrio,
      margemReal: preco > 0 ? (lucroConsulta / preco) * 100 : 0,
    };
  }, [aluguel, energia, internet, contador, salarios, outrosFixos, materiais, impostos, cartao, outrosVar, horasDia, diasSemana, ocupacao, duracaoConsulta, margemLucro]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #0f0f0f;
          --surface: #191919;
          --surface2: #222222;
          --border: #2e2e2e;
          --accent: #c8f55a;
          --accent2: #7dd3fc;
          --text: #f0f0f0;
          --muted: #888;
          --danger: #f87171;
          --radius: 16px;
        }

        body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; min-height: 100vh; }

        .app { max-width: 960px; margin: 0 auto; padding: 32px 20px 80px; }

        .hero { text-align: center; margin-bottom: 48px; }
        .hero-badge { display: inline-block; background: var(--accent); color: #000; font-family: 'Syne', sans-serif; font-weight: 700; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; padding: 6px 16px; border-radius: 100px; margin-bottom: 20px; }
        .hero h1 { font-family: 'Syne', sans-serif; font-size: clamp(28px, 5vw, 48px); font-weight: 800; line-height: 1.1; margin-bottom: 12px; }
        .hero h1 span { color: var(--accent); }
        .hero p { color: var(--muted); font-size: 16px; max-width: 500px; margin: 0 auto; }

        .banner { background: linear-gradient(135deg, #1a2a0a 0%, #0d1f1a 100%); border: 1px solid var(--accent); border-radius: var(--radius); padding: 28px 32px; margin-bottom: 40px; display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 24px; position: relative; overflow: hidden; }
        .banner::before { content: ''; position: absolute; top: -40px; right: -40px; width: 200px; height: 200px; background: radial-gradient(circle, rgba(200,245,90,0.12) 0%, transparent 70%); pointer-events: none; }
        .banner-item label { display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: var(--muted); margin-bottom: 6px; font-weight: 500; }
        .banner-item .val { font-family: 'Syne', sans-serif; font-size: clamp(20px, 3vw, 28px); font-weight: 800; color: var(--accent); }
        .banner-item .val.danger { color: var(--danger); }
        .banner-item .val.blue { color: var(--accent2); }

        .tabs { display: flex; gap: 4px; background: var(--surface); border-radius: 12px; padding: 4px; margin-bottom: 32px; }
        .tab { flex: 1; padding: 10px; border: none; background: transparent; color: var(--muted); font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; border-radius: 10px; cursor: pointer; transition: all 0.2s; }
        .tab.active { background: var(--accent); color: #000; font-weight: 700; }

        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }
        .card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
        .card--accent { border-color: rgba(200,245,90,0.3); background: linear-gradient(160deg, #181f0b 0%, #191919 60%); }
        .card-header { display: flex; align-items: center; gap: 10px; padding: 20px 24px 16px; border-bottom: 1px solid var(--border); }
        .card-icon { font-size: 20px; }
        .card-header h2 { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; }
        .card-body { padding: 20px 24px; display: flex; flex-direction: column; gap: 16px; }

        .input-group { display: flex; flex-direction: column; gap: 4px; }
        .input-group label { font-size: 12px; font-weight: 500; color: var(--muted); text-transform: uppercase; letter-spacing: 0.8px; }
        .hint { font-size: 11px; color: #555; }
        .input-wrap { display: flex; align-items: center; background: var(--surface2); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; transition: border-color 0.2s; }
        .input-wrap:focus-within { border-color: var(--accent); }
        .prefix, .suffix { padding: 0 12px; font-size: 13px; color: var(--muted); background: #1f1f1f; white-space: nowrap; height: 100%; display: flex; align-items: center; }
        .prefix { border-right: 1px solid var(--border); }
        .suffix { border-left: 1px solid var(--border); }
        input[type=number] { flex: 1; background: transparent; border: none; outline: none; color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 500; padding: 10px 14px; width: 100%; }
        input[type=number]::-webkit-inner-spin-button { opacity: 0; }

        .result-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid var(--border); font-size: 14px; }
        .result-row:last-child { border-bottom: none; }
        .result-row span { color: var(--muted); }
        .result-row strong { font-weight: 600; }
        .result-row--highlight { background: rgba(200,245,90,0.06); margin: 0 -24px; padding: 14px 24px; border-radius: 8px; border-bottom: none; }
        .result-row--highlight span { color: var(--accent); font-weight: 600; }
        .result-row--highlight strong { color: var(--accent); font-size: 18px; font-family: 'Syne', sans-serif; }
        .result-row--sub span, .result-row--sub strong { font-size: 12px; color: #555; }

        .sim-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 8px; }
        .sim-box { background: var(--surface2); border: 1px solid var(--border); border-radius: 12px; padding: 16px; text-align: center; }
        .sim-box label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: var(--muted); display: block; margin-bottom: 8px; }
        .sim-box .big { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 800; }
        .sim-box .big.green { color: var(--accent); }
        .sim-box .big.blue { color: var(--accent2); }
        .sim-box .sub { font-size: 11px; color: #555; margin-top: 4px; }

        .progress-bar { background: var(--surface2); border-radius: 100px; height: 8px; margin-top: 16px; overflow: hidden; }
        .progress-fill { height: 100%; background: var(--accent); border-radius: 100px; transition: width 0.4s ease; }

        .info-box { background: rgba(125,211,252,0.06); border: 1px solid rgba(125,211,252,0.2); border-radius: 12px; padding: 14px 18px; font-size: 13px; color: var(--accent2); line-height: 1.6; }

        .section-title { font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: var(--muted); margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid var(--border); }

        footer { text-align: center; margin-top: 60px; font-size: 12px; color: #444; }
        footer span { color: var(--accent); }
      `}</style>

      <div className="app">
        <div className="hero">
          <div className="hero-badge">Ferramenta do Curso</div>
          <h1>PrecificaÃ§Ã£o de <span>Consultas</span></h1>
          <p>Calcule o preÃ§o ideal das suas consultas com base nos seus custos reais e metas de faturamento.</p>
        </div>

        <div className="banner">
          <div className="banner-item">
            <label>PreÃ§o Sugerido</label>
            <div className="val">{formatBRL(calc.preco)}</div>
          </div>
          <div className="banner-item">
            <label>Faturamento/mÃªs</label>
            <div className="val blue">{formatBRL(calc.faturamentoMes)}</div>
          </div>
          <div className="banner-item">
            <label>PreÃ§o Sugerido</label>
            <div className={`val ${calc.lucroMes < 0 ? "danger" : ""}`}>{formatBRL(calc.lucroMes)}</div>
          </div>
          <div className="banner-item">
            <label>Ponto de EquilÃ­brio</label>
            <div className="val">{calc.pontoEquilibrio} consultas</div>
          </div>
        </div>

        <div className="tabs">
          {[["custos", "ð° Custos"], ["operacional", "âìï¸ Operacional"], ["resultado", "ð Resultado"], ["simulacao", "ð SimulaÃ§Ã£o"]].map(([k, l]) => (
            <button key={k} className={`tab ${tab === k ? "active" : ""}`} onClick={() => setTab(k)}>{l</button>
          ))}
        </div>

        {tab === "custos" && (
          <div className="grid">
            <Card title="Custos Fixos Mensais" icon="ð¢">
              <Input label="Aluguel / sala" value={aluguel} onChange={setAluguel} />
              <Input label="Energia elÃ©trica" value={energia} onChange={setEnergia} />
              <Input label="Internet e telefone" value={internet} onChange={setInternet} />
              <Input label="Contador / MEI" value={contador} onChange={setContador} />
              <Input label="SalÃ¡rios / assistentes" value={salarios} onChange={setSalarios} />
              <Input label="Outros fixos" value={outrosFixos} onChange={setOutrosFixos} />
              <ResultRow label="Total fixos/mÃªs" value={formatBRL(calc.totalFixo)} highlight />
            </Card>
            <Card title="Custos VariÃ¡veis por Consulta" icon="ð¦">
              <Input label="Materiais e insumos" value={materiais} onChange={setMateriais} />
              <Input label="Impostos sobre faturamento" prefix="" suffix="%" value={impostos} onChange={setImpostos} hint="Simples Nacional MEI: ~6-10%" />
              <Input label="Taxa de cartÃ£o/maquininha" prefix="" suffix="%" value={cartao} onChange={setCartao} hint="MÃ©dia: 2-4%" />
              <Input label="Outros variÃ¡veis" value={outrosVar} onChange={setOutrosVar} />
              <div className="info-box">ð¡ Impostos e taxas de cartÃ£o sÃ£o calculados sobre o preÃ§o final.</div>
            </Card>
          </div>
        )}

        {tab === "operacional" && (
          <div className="grid">
            <Card title="Capacidade de Atendimento" icon="ð">
              <Input label="Horas de trabalho por dia" prefix="" suffix="h" value={horasDia} onChange={setHorasDia} />
              <Input label="Dias de trabalho por semana" prefix="" suffix="dias" value={diasSemana} onChange={setDiasSemana} min={1} />
              <Input label="Taxa de ocupaÃ§Ã£o esperada" prefix="" suffix="%" value={ocupacao} onChange={setOcupacao} hint="Realista: 60-80% (faltas, encaixes, etc.)" />
              <Input label="DuraÃ§Ã£o da consulta" prefix="" suffix="min" value={duracaoConsulta} onChange={setDuracaoConsulta} />
              <div className="result-row"><span>Consultas por dia</span><strong>{calc.consultasPorDia}</strong></div>
              <div className="result-row"><span>Dias Ãºteis no mÃªs</span><strong>{calc.diasMes}</strong></div>
              <ResultRow label="Consultas produtivas/mÃªs" value={`${calc.consultasMes} consultas`} highlight />
            </Card>
            <Card title="Margem de Lucro Desejada" icon="ð¯">
              <Input label="Margem de lucro lÃ­quida" prefix="" suffix="%" value={margemLucro} onChange={setMargemLucro} hint="Recomendado: 20-35%" />
              <div className="progress-bar"><div className="progress-fill" style={{ width: `${Math.min(margemLucro, 100)}%` }} /></div>
              <div className="info-box">ð2 Margem de <strong>{margemLucro}%</strong> significa que, para cada {formatBRL(calc.preco)}, vocÃª retÃ©m {formatBRL(calc.lucroConsulta)} de lucro lÃ­quido por consulta.</div>
            </Card>
          </div>
        )}

        {tab === "resultado" && (
          <div className="grid">
            <Card title="ComposiÃ§Ã£o do PreÃ§o" icon="ð" accent>
              <ResultRow label="Custo fixo por consulta" value={formatBRL(calc.fixoPorConsulta)} />
              <ResultRow label="Custo variÃ¡vel por consulta" value={formatBRL(calc.custoVarFinal)} />
              <ResultRow label="Custo total por consulta" value={formatBRL(calc.custoTotalConsulta)} />
              <ResultRow label="Margem de lucro aplicada" value={`${margemLucro}%`} />
              <ResultRow label="ð° PreÃ§o sugerido" value={formatBRL(calc.preco)} highlight />
              <ResultRow label="Lucro por consulta" value={formatBRL(calc.lucroConsulta)} />
              <ResultRow label="Margem real" value={`${calc.margemReal.toFixed(1)}%`} sub />
            </Card>
            <Card title="AnÃ¡lise de Viabilidade" icon="ð">
              <ResultRow label="Ponto de equilÃ­brio" value={`${calc.pontoEquilibrio} consultas/mÃªs`} />
              <ResultRow label="VocÃª tem capacidade para" value={`${calc.consultasMes} consultas`} />
              <div className="info-box">{calc.consultasMes >= calc.pontoEquilibrio ? `â ViÃ¡vel! Sua capacidade (${calc.consultasMes}) Ã© maior que o ponto de equilÃ­brio (${calc.pontoEquilibrio}).` : `â ï¸ AtenÃ§Ã£o! Sua capacidade (${calc.consultasMes}) Ã© menor que o necessÃ¡rio (${calc.pontoEquilibrio}).`}</div>
            </Card>
          </div>
        )}

        {tab === "simulacao" && (
          <div>
            <p className="section-title">SimulaÃ§Ã£o de Faturamento Mensal</p>
            <div className="sim-grid">
              {[{ label: "CenÃ¡rio Pessimista", pct: 50 }, { label: "CenÃ¡rio Realista", pct: ocupacao }, { label: "CenÃ¡rio Otimista", pct: 90 }].map(({ label, pct }) => {
                const cons = Math.floor(calc.consultasMes / (ocupacao / 100) * (pct / 100));
                const fat = cons * calc.preco;
                const luc = cons * calc.lucroConsulta;
                return (
                  <div className="sim-box" key={label}>
                    <label>{label}</label>
                    <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 12 }}>{pct}% de ocupaÃ§Ã£o</div>
                    <div className="big blue">{formatBRL(fat)}</div>
                    <div className="sub">faturamento</div>
                    <div style={{ marginTop: 12, fontSize: 13, color: luc >= 0 ? "var(--accent)" : "var(--danger)", fontWeight: 700 }}>{formatBRL(luc)}</div>
                    <div className="sub">lucro lÃ­quido</div>
                    <div style={{ marginTop: 8, fontSize: 11, color: "#555" }}>{cons} consultas</div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 32 }}>
              <Card title="Resumo Financeiro Mensal" icon="ð">
                <ResultRow label="Consultas produtivas" value={`${calc.consultasMes} / mÃªs`} />
                <ResultRow label="Faturamento bruto" value={formatBRL(calc.faturamentoMes)} />
                <ResultRow label="Total de custos fixos" value={formatBRL(calc.totalFixo)} />
                <ResultRow label="Total de custos variÃ¡veis" value={formatBRL(calc.custoVarFinal * calc.consultasMes)} />
                <ResultRow label="ð° Lucro lÃ­quido mensal" value={formatBRL(calc.lucroMes)} highlight />
                <ResultRow label="Lucro anual projetado" value={formatBRL(calc.lucroMes * 12)} />
              </Card>
            </div>
          </div>
        )}

        <footer>
          <p>Desenvolvido para o Mentoring <span>RÃ´mulo Ordine</span> Â· Fisioterapia & NegÃ³cios</p>
        </footer>
      </div>
    </>
  );
}
