import React, { useState } from 'react';
import axios from 'axios';

// Imagens temáticas estáveis
const mascoteSnake = "https://images.unsplash.com/photo-1531804055935-76f44d7c3621?w=400&auto=format&fit=crop&q=60";
const bgPattern = "https://www.transparenttextures.com/patterns/dark-matter.png";

const API_URL = 'http://127.0.0.1:5000/api';

const cardSuits = {
  'Copas': { symbol: '♥', color: 'text-red-500' },
  'Ouros': { symbol: '♦', color: 'text-red-500' },
  'Espada': { symbol: '♠', color: 'text-slate-900' },
  'Paus': { symbol: '♣', color: 'text-slate-900' },
};

const statusMessages = {
  'em_andamento': { text: 'Sua vez, Apostador!', color: 'text-yellow-400' },
  'estourou': { text: '💥 Você Estourou! A Serpente Venceu.', color: 'text-red-500' },
  'jogador_ganhou': { text: '🏆 VITÓRIA! Você domou a Pitão.', color: 'text-emerald-400' },
  'banca_ganhou': { text: '🐍 A Banca Ganhou! Tente novamente.', color: 'text-purple-400' },
  'empate': { text: '🤝 Empate na Mesa!', color: 'text-slate-300' },
};

export default function App() {
  const [jogo, setJogo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const realizarAcao = async (endpoint, metodo = 'POST') => {
    setLoading(true);
    setErro('');
    try {
      const response = await axios({
        method: metodo,
        url: `${API_URL}${endpoint}`,
        headers: { 'Content-Type': 'application/json' },
      });
      setJogo(response.data);
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro na comunicação com o Cassino Python.');
    } finally {
      setLoading(false);
    }
  };

  const iniciarJogo = () => realizarAcao('/jogar', 'GET');
  const pedirCarta = () => realizarAcao('/pedir-carta');
  const pararJogo = () => realizarAcao('/parar');

  const renderCarta = (cartaTexto, hidden = false) => {
    if (hidden) {
      return (
        <div className="w-24 h-36 bg-gradient-to-br from-purple-900 to-indigo-950 border-2 border-yellow-500 rounded-2xl shadow-2xl flex items-center justify-center m-2 border-dashed animate-pulse">
          <span className="text-yellow-500 text-4xl font-black">?</span>
        </div>
      );
    }

    const [valor, , naipe] = cartaTexto.split(' ');
    const suitInfo = cardSuits[naipe] || { symbol: '?', color: 'text-slate-500' };

    return (
      <div className={`w-24 h-36 bg-white border-2 border-slate-100 rounded-2xl shadow-xl flex flex-col justify-between p-3 m-2 font-black ${suitInfo.color} transform transition hover:-translate-y-2 duration-300`}>
        <div className="text-left text-xl">{valor}</div>
        <div className="text-center text-5xl my-auto">{suitInfo.symbol}</div>
        <div className="text-right text-xl rotate-180">{valor}</div>
      </div>
    );
  };

  return (
    <div 
      className="min-h-screen bg-purple-950 text-white flex flex-col items-center p-6 font-sans selection:bg-yellow-500 selection:text-purple-950"
      style={{ backgroundImage: `url(${bgPattern})` }}
    >
      {/* Header Premium */}
      <header className="w-full max-w-4xl flex items-center justify-between py-4 border-b border-purple-800/60 mb-12">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-yellow-400 shadow-md">
            <img src={mascoteSnake} alt="Mascote" className="w-full h-full object-cover scale-125" />
          </div>
          <h1 className="text-3xl font-black tracking-tight uppercase">
            Python<span className="text-yellow-400">Blackjack</span>
          </h1>
        </div>
        <div className="bg-purple-900/80 border border-yellow-600/40 px-4 py-1.5 rounded-full text-xs font-mono text-yellow-400 shadow-inner">
          🎰 slots_style.py active
        </div>
      </header>

      {/* Alerta de Erro */}
      {erro && (
        <div className="w-full max-w-2xl bg-red-500/90 text-white font-bold px-6 py-3 rounded-xl shadow-2xl mb-6 border border-red-600 text-center">
          ⚠️ {erro}
        </div>
      )}

      {/* Main Container */}
      <main className="w-full max-w-3xl bg-purple-900/30 border border-purple-800/80 rounded-3xl p-8 shadow-2xl backdrop-blur-md flex-grow flex flex-col justify-center">
        
        {!jogo ? (
          /* --- LOBBY INICIAL (Estilo Tigrinho) --- */
          <div className="text-center py-12 flex flex-col items-center">
            <div className="w-56 h-56 rounded-full overflow-hidden border-4 border-yellow-400 shadow-2xl mb-8 animate-bounce duration-1000">
              <img src={mascoteSnake} alt="Serpente Dourada" className="w-full h-full object-cover scale-110" />
            </div>
            <p className="text-2xl font-extrabold text-purple-100 mb-8 max-w-md leading-relaxed">
              A Serpente de Ouro te desafia! Domine o baralho e multiplique seus <span className="text-yellow-400 underline decoration-wavy">PY Chips</span>!
            </p>
            <button
              onClick={iniciarJogo}
              disabled={loading}
              className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-purple-950 font-black text-xl py-4 px-12 rounded-full shadow-[0_0_30px_rgba(234,179,8,0.4)] transform transition hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {loading ? 'EMBARALHANDO...' : 'APOSTAR AGORA 🚀'}
            </button>
          </div>
        ) : (
          /* --- TELA DE JOGO --- */
          <div className="space-y-8">
            {/* Banca */}
            <div className="bg-purple-950/60 border border-purple-800 p-5 rounded-2xl text-center">
              <h2 className="text-sm font-bold uppercase tracking-widest text-purple-300 mb-3">Mão da Banca (Serpente)</h2>
              <div className="flex justify-center flex-wrap">
                {jogo.status === 'em_andamento' ? (
                  <>
                    {renderCarta(jogo.carta_visivel_banca)}
                    {renderCarta('', true)}
                  </>
                ) : (
                  jogo.mao_banca?.map((c, i) => <div key={i}>{renderCarta(c)}</div>)
                )}
              </div>
            </div>

            {/* Placar e Status Central */}
            <div className="bg-gradient-to-r from-purple-950 via-slate-950 to-purple-950 border-2 border-yellow-500 p-5 rounded-2xl text-center shadow-2xl">
              <p className={`text-2xl font-black uppercase tracking-wide ${statusMessages[jogo.status]?.color}`}>
                {statusMessages[jogo.status]?.text}
              </p>
              <p className="text-sm text-slate-400 mt-1 font-medium">
                Sua Pontuação: <span className="text-white text-lg font-black">{jogo.pontos_jogador}</span> / 21
              </p>
            </div>

            {/* Jogador */}
            <div className="bg-purple-950/60 border border-purple-800 p-5 rounded-2xl text-center">
              <h2 className="text-sm font-bold uppercase tracking-widest text-emerald-400 mb-3">Sua Mão</h2>
              <div className="flex justify-center flex-wrap">
                {jogo.mao_jogador.map((c, i) => <div key={i}>{renderCarta(c)}</div>)}
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex justify-center gap-4 pt-4 border-t border-purple-800/50">
              {jogo.status === 'em_andamento' ? (
                <>
                  <button
                    onClick={pedirCarta}
                    disabled={loading}
                    className="bg-emerald-500 hover:bg-emerald-400 text-purple-950 font-black py-3 px-8 rounded-xl shadow-lg transition transform active:scale-95 disabled:opacity-50"
                  >
                    + Pedir Carta
                  </button>
                  <button
                    onClick={pararJogo}
                    disabled={loading}
                    className="bg-amber-500 hover:bg-amber-400 text-purple-950 font-black py-3 px-8 rounded-xl shadow-lg transition transform active:scale-95 disabled:opacity-50"
                  >
                    ✋ Parar (Stand)
                  </button>
                </>
              ) : (
                <button
                  onClick={iniciarJogo}
                  className="bg-gradient-to-r from-yellow-400 to-amber-500 text-purple-950 font-black text-lg py-4 px-10 rounded-full shadow-xl transition transform hover:scale-105 active:scale-95"
                >
                  🔄 NOVA RODADA (+500 PY)
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="mt-12 text-xs text-purple-500 font-medium">
        Python Casino Pro © 2026 | Responsabilidade de Software
      </footer>
    </div>
  );
}