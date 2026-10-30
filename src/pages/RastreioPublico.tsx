import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import { Package, MapPin, Truck, CheckCircle2, Calendar } from 'lucide-react';

interface Frete {
  id: string;
  origem: string;
  destino: string;
  status: string;
  dataColeta: string;
  motorista?: { nome: string };
  veiculo?: { modelo: string; placa: string };
}

export function RastreioPublico() {
  const { id } = useParams<{ id: string }>();
  const [frete, setFrete] = useState<Frete | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarFrete() {
      try {
        setLoading(true);
        const res = await api.get(`/fretes/${id}`).catch(() => null);
        
        if (res?.data) {
          setFrete(res.data);
        } else {
          const fretesSalvos = JSON.parse(localStorage.getItem('@taperto:fretes') || '[]');
          const encontrado = fretesSalvos.find((f: Frete) => String(f.id) === String(id));
          setFrete(encontrado || null);
        }
      } catch (err) {
        console.error('Erro ao carregar rastreio:', err);
      } finally {
        setLoading(false);
      }
    }
    carregarFrete();
  }, [id]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#94a3b8' }}>A carregar informações de rastreamento...</p>
      </div>
    );
  }

  if (!frete) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <Package size={48} color="#ef4444" />
        <h2 style={{ marginTop: '16px' }}>Frete não encontrado</h2>
        <p style={{ color: '#94a3b8' }}>Verifique o código informado e tente novamente.</p>
      </div>
    );
  }

  const statusAtual = frete.status || 'Pendente';
  const etapas = ['Pendente', 'Em Trânsito', 'Entregue'];
  const indiceEtapaAtual = etapas.findIndex(e => e.toLowerCase() === statusAtual.toLowerCase());

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', padding: '24px 16px', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '600px', backgroundColor: '#1e293b', borderRadius: '16px', border: '1px solid #334155', padding: '24px', alignSelf: 'flex-start' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #334155', paddingBottom: '16px', marginBottom: '20px' }}>
          <div style={{ backgroundColor: '#2563eb20', padding: '10px', borderRadius: '12px' }}>
            <Package color="#2563eb" size={28} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold' }}>TáPerto Logística</span>
            <h1 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 'bold' }}>Rastreamento de Carga</h1>
          </div>
        </div>

        <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '12px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem' }}>
            <MapPin size={18} color="#3b82f6" />
            <span><strong>Origem:</strong> {frete.origem}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem' }}>
            <MapPin size={18} color="#22c55e" />
            <span><strong>Destino:</strong> {frete.destino}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px' }}>
            <Calendar size={16} />
            <span>Data de Coleta: {frete.dataColeta}</span>
          </div>
        </div>

        <h3 style={{ fontSize: '1rem', color: '#94a3b8', marginBottom: '16px' }}>Status da Entrega</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginBottom: '32px' }}>
          {etapas.map((etapa, idx) => {
            const concluida = idx <= (indiceEtapaAtual === -1 ? 0 : indiceEtapaAtual);
            return (
              <div key={etapa} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, zIndex: 1 }}>
                <div style={{ 
                  width: '36px', 
                  height: '36px', 
                  borderRadius: '50%', 
                  backgroundColor: concluida ? '#2563eb' : '#0f172a', 
                  border: `2px solid ${concluida ? '#3b82f6' : '#334155'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  color: concluida ? 'white' : '#64748b',
                  marginBottom: '8px'
                }}>
                  {concluida ? <CheckCircle2 size={20} /> : idx + 1}
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: concluida ? 'bold' : 'normal', color: concluida ? '#f8fafc' : '#64748b' }}>
                  {etapa}
                </span>
              </div>
            );
          })}
        </div>

        {(frete.motorista || frete.veiculo) && (
          <div style={{ borderTop: '1px solid #334155', paddingTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.85rem', color: '#94a3b8' }}>
            {frete.motorista && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Truck size={16} color="#3b82f6" />
                <span>Motorista: <strong style={{ color: 'white' }}>{frete.motorista.nome}</strong></span>
              </div>
            )}
            {frete.veiculo && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Truck size={16} color="#3b82f6" />
                <span>Veículo: <strong style={{ color: 'white' }}>{frete.veiculo.modelo} ({frete.veiculo.placa})</strong></span>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}