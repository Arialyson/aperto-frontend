import React, { useState, useEffect } from 'react';
import { Plus, Trash2, QrCode, DollarSign, TrendingUp, TrendingDown, Download, FileText, Search, Filter } from 'lucide-react';
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

  // Filtros de busca
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('Todos');

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
      try {
        setFretes(JSON.parse(salvos));
      } catch {
        setFretes([]);
      }
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

    const novoFrete: Frete = {
      id: String(Date.now()),
      origem,
      destino,
      valorFrete: Number(valorFrete) || 0,
      custoCombustivel: Number(custoCombustivel) || 0,
      custoPedagio: Number(custoPedagio) || 0,
      outrosCustos: Number(outrosCustos) || 0,
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

  // Lógica de Filtro em Tempo Real
  const fretesFiltrados = fretes.filter(f => {
    const termo = busca.toLowerCase();
    const atendeBusca = 
      f.origem.toLowerCase().includes(termo) ||
      f.destino.toLowerCase().includes(termo) ||
      (f.motorista && f.motorista.toLowerCase().includes(termo));
    
    const atendeStatus = filtroStatus === 'Todos' || f.status === filtroStatus;

    return atendeBusca && atendeStatus;
  });

  // Exportação CSV
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
    link.setAttribute('download', `relatorio_fretes_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Cálculos dinâmicos do formulário
  const valFreteNum = Number(valorFrete) || 0;
  const custoTotalForm = (Number(custoCombustivel) || 0) + (Number(custoPedagio) || 0) + (Number(outrosCustos) || 0);
  const lucroForm = valFreteNum - custoTotalForm;
  const margemForm = valFreteNum > 0 ? ((lucroForm / valFreteNum) * 100).toFixed(1) : '0.0';

  return (
    <div style={{ maxWidth: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      <style>{`
        @media print {
          body { background-color: #ffffff !important; color: #000000 !important; }
          .sidebar-container, .mobile-menu-btn, button, .filtros-container { display: none !important; }
          main { padding: 0 !important; }
          table { border: 1px solid #000 !important; color: #000 !important; width: 100% !important; }
          th, td { border-bottom: 1px solid #ccc !important; color: #000 !important; }
        }
      `}</style>

      {/* Cabeçalho */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 'bold', margin: 0 }}>Gestão de Fretes</h1>
          <p style={{ color: '#94a3b8', marginTop: '4px', fontSize: '0.9rem' }}>
            Controlo operacional, rastreabilidade e rentabilidade.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={exportarCSV}
            style={{ backgroundColor: '#1e293b', color: '#38bdf8', border: '1px solid #334155', padding: '8px 12px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
          >
            <Download size={16} /> Exportar CSV
          </button>

          <button
            onClick={() => window.print()}
            style={{ backgroundColor: '#1e293b', color: '#a855f7', border: '1px solid #334155', padding: '8px 12px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
          >
            <FileText size={16} /> Imprimir/PDF
          </button>

          <button
            onClick={() => setModalAberto(true)}
            style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
          >
            <Plus size={16} /> Novo Frete
          </button>
        </div>
      </div>

      {/* Barra de Filtros e Busca Recuperada */}
      <div className="filtros-container" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', backgroundColor: '#1e293b', padding: '12px', borderRadius: '10px', border: '1px solid #334155' }}>
        <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
          <Search size={16} color="#64748b" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Buscar por rota ou motorista..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            style={{ width: '100%', padding: '8px 10px 8px 34px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: 'white', fontSize: '0.85rem' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={16} color="#64748b" />
          <select
            value={filtroStatus}
            onChange={e => setFiltroStatus(e.target.value)}
            style={{ padding: '8px 12px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: 'white', fontSize: '0.85rem' }}
          >
            <option value="Todos">Todos os Status</option>
            <option value="Pendente">Pendente</option>
            <option value="Em Trânsito">Em Trânsito</option>
            <option value="Entregue">Entregue</option>
          </select>
        </div>
      </div>

      {/* Tabela de Fretes sem Barra Lateral de Rolar Excessiva */}
      <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #334155', color: '#94a3b8' }}>
              <th style={{ padding: '12px 14px' }}>Rota / Motorista</th>
              <th style={{ padding: '12px 14px' }}>Data</th>
              <th style={{ padding: '12px 14px' }}>Valor Frete</th>
              <th style={{ padding: '12px 14px' }}>Custo Oper.</th>
              <th style={{ padding: '12px 14px' }}>Margem de Lucro</th>
              <th style={{ padding: '12px 14px' }}>Status</th>
              <th style={{ padding: '12px 14px', textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {fretesFiltrados.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>
                  Nenhum frete encontrado.
                </td>
              </tr>
            ) : (
              fretesFiltrados.map(frete => {
                const custoTotal = (frete.custoCombustivel || 0) + (frete.custoPedagio || 0) + (frete.outrosCustos || 0);
                const lucro = frete.valorFrete - custoTotal;
                const margem = frete.valorFrete > 0 ? (lucro / frete.valorFrete) * 100 : 0;
                const eLucrativo = margem > 0;

                return (
                  <tr key={frete.id} style={{ borderBottom: '1px solid #33415540' }}>
                    <td style={{ padding: '12px 14px' }}>
                      <strong style={{ color: 'white', display: 'block' }}>{frete.origem} → {frete.destino}</strong>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {frete.motorista ? `Mot: ${frete.motorista}` : 'Sem motorista'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', color: '#94a3b8', whiteSpace: 'nowrap' }}>{frete.dataColeta || '-'}</td>
                    <td style={{ padding: '12px 14px', fontWeight: 'bold', color: 'white', whiteSpace: 'nowrap' }}>
                      R$ {frete.valorFrete.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ padding: '12px 14px', color: '#ef4444', whiteSpace: 'nowrap' }}>
                      R$ {custoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 8px',
                        borderRadius: '16px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        backgroundColor: eLucrativo ? '#22c55e15' : '#ef444415',
                        color: eLucrativo ? '#22c55e' : '#ef4444'
                      }}>
                        {eLucrativo ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {margem.toFixed(1)}% (R$ {lucro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        backgroundColor: frete.status === 'Entregue' ? '#22c55e20' : frete.status === 'Em Trânsito' ? '#2563eb20' : '#eab30820',
                        color: frete.status === 'Entregue' ? '#22c55e' : frete.status === 'Em Trânsito' ? '#3b82f6' : '#eab308'
                      }}>
                        {frete.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          onClick={() => setQrModalFrete(frete)}
                          title="Gerar QR Code de Rastreamento"
                          style={{ backgroundColor: '#2563eb20', color: '#3b82f6', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}
                        >
                          <QrCode size={16} />
                        </button>
                        <button
                          onClick={() => handleExcluirFrete(frete.id)}
                          title="Eliminar Frete"
                          style={{ backgroundColor: '#ef444420', color: '#ef4444', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}
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

      {/* Modal Cadastro de Frete */}
      {modalAberto && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '16px' }}>
          <div style={{ backgroundColor: '#1e293b', width: '100%', maxWidth: '600px', borderRadius: '16px', border: '1px solid #334155', padding: '24px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '1.2rem', margin: '0 0 16px 0', borderBottom: '1px solid #334155', paddingBottom: '10px' }}>
              Novo Cadastro de Frete
            </h2>

            <form onSubmit={handleCriarFrete} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Origem *</label>
                  <input
                    required
                    type="text"
                    placeholder="Ex: São Paulo, SP"
                    value={origem}
                    onChange={e => setOrigem(e.target.value)}
                    style={{ width: '100%', padding: '8px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: 'white' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Destino *</label>
                  <input
                    required
                    type="text"
                    placeholder="Ex: Curitiba, PR"
                    value={destino}
                    onChange={e => setDestino(e.target.value)}
                    style={{ width: '100%', padding: '8px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: 'white' }}
                  />
                </div>
              </div>

              <div style={{ backgroundColor: '#0f172a', padding: '14px', borderRadius: '10px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <DollarSign size={15} /> Análise Financeira
                </span>

                <div>
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Valor Bruto do Frete (R$) *</label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={valorFrete}
                    onChange={e => setValorFrete(e.target.value)}
                    style={{ width: '100%', padding: '8px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: 'white', fontWeight: 'bold' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                  <div>
                    <label style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', marginBottom: '2px' }}>Combustível</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={custoCombustivel}
                      onChange={e => setCustoCombustivel(e.target.value)}
                      style={{ width: '100%', padding: '6px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: 'white' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', marginBottom: '2px' }}>Pedágio</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={custoPedagio}
                      onChange={e => setCustoPedagio(e.target.value)}
                      style={{ width: '100%', padding: '6px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: 'white' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', marginBottom: '2px' }}>Outros</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={outrosCustos}
                      onChange={e => setOutrosCustos(e.target.value)}
                      style={{ width: '100%', padding: '6px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: 'white' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1e293b', padding: '10px', borderRadius: '6px', marginTop: '2px' }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block' }}>Custo Total: R$ {custoTotalForm.toFixed(2)}</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: lucroForm >= 0 ? '#22c55e' : '#ef4444' }}>
                      Lucro: R$ {lucroForm.toFixed(2)}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block' }}>Margem Prevista</span>
                    <span style={{ fontSize: '1rem', fontWeight: 'bold', color: lucroForm >= 0 ? '#22c55e' : '#ef4444' }}>
                      {margemForm}%
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Data Coleta</label>
                  <input
                    type="date"
                    value={dataColeta}
                    onChange={e => setDataColeta(e.target.value)}
                    style={{ width: '100%', padding: '8px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: 'white' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Motorista</label>
                  <input
                    type="text"
                    placeholder="Nome motorista"
                    value={motorista}
                    onChange={e => setMotorista(e.target.value)}
                    style={{ width: '100%', padding: '8px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: 'white' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Status</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                    style={{ width: '100%', padding: '8px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: 'white' }}
                  >
                    <option value="Pendente">Pendente</option>
                    <option value="Em Trânsito">Em Trânsito</option>
                    <option value="Entregue">Entregue</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  style={{ backgroundColor: 'transparent', color: '#94a3b8', border: '1px solid #334155', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '8px 18px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
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
          <div style={{ backgroundColor: '#1e293b', width: '100%', maxWidth: '380px', borderRadius: '16px', border: '1px solid #334155', padding: '20px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1rem', margin: '0 0 6px 0' }}>QR Code de Rastreamento</h3>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '16px' }}>
              {qrModalFrete.origem} → {qrModalFrete.destino}
            </p>

            <div style={{ backgroundColor: 'white', padding: '14px', borderRadius: '10px', display: 'inline-block' }}>
              <QRCode value={`${window.location.origin}/rastreio/${qrModalFrete.id}`} size={160} />
            </div>

            <button
              onClick={() => setQrModalFrete(null)}
              style={{ width: '100%', marginTop: '16px', backgroundColor: '#334155', color: 'white', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
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