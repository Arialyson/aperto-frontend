import React, { useState, useEffect } from 'react';
import { Plus, Trash2, QrCode, DollarSign, TrendingUp, TrendingDown, Download, FileText } from 'lucide-react';
import QRCode from 'react-qr-code';

interface Frete {
  id: string;
  origem: string;
  destino: string;
  valorFrete: number;
  custoCombustivel: number;
  custoPedagio: number;
  outrosCustos: number;
  status: string;
  dataColeta: string;
  motorista?: string;
  veiculo?: string;
}

export function Fretes() {
  const [fretes, setFretes] = useState<Frete[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [qrModalFrete, setQrModalFrete] = useState<Frete | null>(null);

  // Campos do formulário
  const [origem, setOrigem] = useState('');
  const [destino, setDestino] = useState('');
  const [valorFrete, setValorFrete] = useState('');
  const [custoCombustivel, setCustoCombustivel] = useState('');
  const [custoPedagio, setCustoPedagio] = useState('');
  const [outrosCustos, setOutrosCustos] = useState('');
  const [status, setStatus] = useState('Pendente');
  const [dataColeta, setDataColeta] = useState('');
  const [motorista, setMotorista] = useState('');
  const [veiculo, setVeiculo] = useState('');

  useEffect(() => {
    const salvos = localStorage.getItem('@taperto:fretes');
    if (salvos) {
      setFretes(JSON.parse(salvos));
    } else {
      const iniciais: Frete[] = [
        {
          id: '1',
          origem: 'São Paulo, SP',
          destino: 'Rio de Janeiro, RJ',
          valorFrete: 4500,
          custoCombustivel: 1200,
          custoPedagio: 250,
          outrosCustos: 150,
          status: 'Em Trânsito',
          dataColeta: '2026-10-28',
          motorista: 'Carlos Silva',
          veiculo: 'Volvo FH 540 (ABC-1234)'
        }
      ];
      setFretes(iniciais);
      localStorage.setItem('@taperto:fretes', JSON.stringify(iniciais));
    }
  }, []);

  function salvarFretes(novosFretes: Frete[]) {
    setFretes(novosFretes);
    localStorage.setItem('@taperto:fretes', JSON.stringify(novosFretes));
  }

  function handleCriarFrete(e: React.FormEvent) {
    e.preventDefault();

    const vFrete = Number(valorFrete) || 0;
    const cComb = Number(custoCombustivel) || 0;
    const cPed = Number(custoPedagio) || 0;
    const cOutros = Number(outrosCustos) || 0;

    const novoFrete: Frete = {
      id: String(Date.now()),
      origem,
      destino,
      valorFrete: vFrete,
      custoCombustivel: cComb,
      custoPedagio: cPed,
      outrosCustos: cOutros,
      status,
      dataColeta,
      motorista,
      veiculo
    };

    salvarFretes([novoFrete, ...fretes]);
    setModalAberto(false);
    limparFormulario();
  }

  function handleExcluirFrete(id: string) {
    const filtrados = fretes.filter(f => f.id !== id);
    salvarFretes(filtrados);
  }

  function limparFormulario() {
    setOrigem('');
    setDestino('');
    setValorFrete('');
    setCustoCombustivel('');
    setCustoPedagio('');
    setOutrosCustos('');
    setStatus('Pendente');
    setDataColeta('');
    setMotorista('');
    setVeiculo('');
  }

  // --- Função de Exportação CSV ---
  function exportarCSV() {
    if (fretes.length === 0) return;

    const cabecalho = 'ID,Origem,Destino,Motorista,Data Coleta,Valor Frete (R$),Custo Operacional (R$),Lucro (R$),Margem (%),Status\n';
    
    const linhas = fretes.map(f => {
      const custoTotal = (f.custoCombustivel || 0) + (f.custoPedagio || 0) + (f.outrosCustos || 0);
      const lucro = f.valorFrete - custoTotal;
      const margem = f.valorFrete > 0 ? ((lucro / f.valorFrete) * 100).toFixed(1) : '0';

      return `"${f.id}","${f.origem}","${f.destino}","${f.motorista || ''}","${f.dataColeta || ''}",${f.valorFrete},${custoTotal},${lucro},${margem}%,"${f.status}"`;
    }).join('\n');

    const blob = new Blob(['\uFEFF' + cabecalho + linhas], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `relatorio_fretes_taperto_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // --- Função de Exportação PDF / Impressão ---
  function exportarPDF() {
    window.print();
  }

  const valFreteNum = Number(valorFrete) || 0;
  const custoTotalForm = (Number(custoCombustivel) || 0) + (Number(custoPedagio) || 0) + (Number(outrosCustos) || 0);
  const lucroForm = valFreteNum - custoTotalForm;
  const margemForm = valFreteNum > 0 ? ((lucroForm / valFreteNum) * 100).toFixed(1) : '0.0';

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Estilos para impressão / PDF limpo */}
      <style>{`
        @media print {
          body { background-color: #ffffff !important; color: #000000 !important; }
          .sidebar-container, .mobile-menu-btn, button { display: none !important; }
          main { padding: 0 !important; }
          table { border: 1px solid #000 !important; color: #000 !important; }
          th, td { border-bottom: 1px solid #ccc !important; color: #000 !important; }
        }
      `}</style>

      {/* Cabeçalho com Botões de Ação */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', margin: 0 }}>Gestão de Fretes</h1>
          <p style={{ color: '#94a3b8', marginTop: '4px', fontSize: '0.95rem' }}>
            Controlo operacional, rastreabilidade e análise de rentabilidade.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={exportarCSV}
            style={{
              backgroundColor: '#1e293b',
              color: '#38bdf8',
              border: '1px solid #334155',
              padding: '10px 14px',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Download size={18} /> Exportar CSV
          </button>

          <button
            onClick={exportarPDF}
            style={{
              backgroundColor: '#1e293b',
              color: '#a855f7',
              border: '1px solid #334155',
              padding: '10px 14px',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <FileText size={18} /> Imprimir / PDF
          </button>

          <button
            onClick={() => setModalAberto(true)}
            style={{
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              padding: '10px 18px',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Plus size={18} /> Novo Frete
          </button>
        </div>
      </div>

      {/* Tabela de Fretes */}
      <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #334155', color: '#94a3b8', whiteSpace: 'nowrap' }}>
              <th style={{ padding: '16px' }}>Rota</th>
              <th style={{ padding: '16px' }}>Data Coleta</th>
              <th style={{ padding: '16px' }}>Valor do Frete</th>
              <th style={{ padding: '16px' }}>Custo Operacional</th>
              <th style={{ padding: '16px' }}>Margem de Lucro</th>
              <th style={{ padding: '16px' }}>Status</th>
              <th style={{ padding: '16px', textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {fretes.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>
                  Nenhum frete registado até ao momento.
                </td>
              </tr>
            ) : (
              fretes.map(frete => {
                const custoTotal = (frete.custoCombustivel || 0) + (frete.custoPedagio || 0) + (frete.outrosCustos || 0);
                const lucro = frete.valorFrete - custoTotal;
                const margem = frete.valorFrete > 0 ? (lucro / frete.valorFrete) * 100 : 0;
                const eLucrativo = margem > 0;

                return (
                  <tr key={frete.id} style={{ borderBottom: '1px solid #33415540' }}>
                    <td style={{ padding: '16px', minWidth: '200px' }}>
                      <strong style={{ color: 'white', display: 'block' }}>{frete.origem} → {frete.destino}</strong>
                      <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                        {frete.motorista ? `Mot: ${frete.motorista}` : 'Sem motorista'}
                      </span>
                    </td>
                    <td style={{ padding: '16px', color: '#94a3b8', whiteSpace: 'nowrap' }}>{frete.dataColeta || '-'}</td>
                    <td style={{ padding: '16px', fontWeight: 'bold', color: 'white', whiteSpace: 'nowrap' }}>
                      R$ {frete.valorFrete.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ padding: '16px', color: '#ef4444', whiteSpace: 'nowrap' }}>
                      R$ {custoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ padding: '16px', whiteSpace: 'nowrap' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        backgroundColor: eLucrativo ? '#22c55e15' : '#ef444415',
                        color: eLucrativo ? '#22c55e' : '#ef4444'
                      }}>
                        {eLucrativo ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        {margem.toFixed(1)}% (R$ {lucro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})
                      </span>
                    </td>
                    <td style={{ padding: '16px', whiteSpace: 'nowrap' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        backgroundColor: frete.status === 'Entregue' ? '#22c55e20' : frete.status === 'Em Trânsito' ? '#2563eb20' : '#eab30820',
                        color: frete.status === 'Entregue' ? '#22c55e' : frete.status === 'Em Trânsito' ? '#3b82f6' : '#eab308'
                      }}>
                        {frete.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
                        <button
                          onClick={() => setQrModalFrete(frete)}
                          title="Gerar QR Code de Rastreamento"
                          style={{ backgroundColor: '#2563eb20', color: '#3b82f6', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <QrCode size={16} />
                        </button>
                        <button
                          onClick={() => handleExcluirFrete(frete.id)}
                          title="Eliminar Frete"
                          style={{ backgroundColor: '#ef444420', color: '#ef4444', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Cadastro */}
      {modalAberto && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '16px' }}>
          <div style={{ backgroundColor: '#1e293b', width: '100%', maxWidth: '650px', borderRadius: '16px', border: '1px solid #334155', padding: '24px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '1.25rem', margin: '0 0 20px 0', borderBottom: '1px solid #334155', paddingBottom: '12px' }}>
              Novo Cadastro de Frete
            </h2>

            <form onSubmit={handleCriarFrete} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Origem *</label>
                  <input
                    required
                    type="text"
                    placeholder="Ex: São Paulo, SP"
                    value={origem}
                    onChange={e => setOrigem(e.target.value)}
                    style={{ width: '100%', padding: '10px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: 'white' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Destino *</label>
                  <input
                    required
                    type="text"
                    placeholder="Ex: Curitiba, PR"
                    value={destino}
                    onChange={e => setDestino(e.target.value)}
                    style={{ width: '100%', padding: '10px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: 'white' }}
                  />
                </div>
              </div>

              <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '12px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <DollarSign size={16} /> Análise Financeira & Custos
                </span>

                <div>
                  <label style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Valor Bruto do Frete (R$) *</label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={valorFrete}
                    onChange={e => setValorFrete(e.target.value)}
                    style={{ width: '100%', padding: '10px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: 'white', fontWeight: 'bold' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Combustível (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={custoCombustivel}
                      onChange={e => setCustoCombustivel(e.target.value)}
                      style={{ width: '100%', padding: '8px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: 'white' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Pedágio (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={custoPedagio}
                      onChange={e => setCustoPedagio(e.target.value)}
                      style={{ width: '100%', padding: '8px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: 'white' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Outros (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={outrosCustos}
                      onChange={e => setOutrosCustos(e.target.value)}
                      style={{ width: '100%', padding: '8px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: 'white' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1e293b', padding: '12px', borderRadius: '8px', marginTop: '4px' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Custo Total: R$ {custoTotalForm.toFixed(2)}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: lucroForm >= 0 ? '#22c55e' : '#ef4444' }}>
                      Lucro: R$ {lucroForm.toFixed(2)}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Margem Prevista</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: lucroForm >= 0 ? '#22c55e' : '#ef4444' }}>
                      {margemForm}%
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Data Coleta</label>
                  <input
                    type="date"
                    value={dataColeta}
                    onChange={e => setDataColeta(e.target.value)}
                    style={{ width: '100%', padding: '10px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: 'white' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Motorista</label>
                  <input
                    type="text"
                    placeholder="Nome do motorista"
                    value={motorista}
                    onChange={e => setMotorista(e.target.value)}
                    style={{ width: '100%', padding: '10px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: 'white' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Status</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                    style={{ width: '100%', padding: '10px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: 'white' }}
                  >
                    <option value="Pendente">Pendente</option>
                    <option value="Em Trânsito">Em Trânsito</option>
                    <option value="Entregue">Entregue</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  style={{ backgroundColor: 'transparent', color: '#94a3b8', border: '1px solid #334155', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Salvar Frete
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal QR Code */}
      {qrModalFrete && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '16px' }}>
          <div style={{ backgroundColor: '#1e293b', width: '100%', maxWidth: '400px', borderRadius: '16px', border: '1px solid #334155', padding: '24px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', margin: '0 0 8px 0' }}>QR Code de Rastreamento</h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '20px' }}>
              {qrModalFrete.origem} → {qrModalFrete.destino}
            </p>

            <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px', display: 'inline-block' }}>
              <QRCode value={`${window.location.origin}/rastreio/${qrModalFrete.id}`} size={180} />
            </div>

            <button
              onClick={() => setQrModalFrete(null)}
              style={{ width: '100%', marginTop: '20px', backgroundColor: '#334155', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Fechar
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default Fretes;