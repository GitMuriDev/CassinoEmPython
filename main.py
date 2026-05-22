from flask import Flask, jsonify, request
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

naipes = ['Copas', 'Ouros', 'Espada', 'Paus']
cartas = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
valores = {'2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 10, 'Q': 10, 'K': 10, 'A': 11}

partida = {
    "baralho": [],
    "mao_jogador": [],
    "mao_branca": []
}

def criarBaralho():
    baralho = [f'{carta} de {naipe}' for carta in cartas for naipe in naipes]
    random.shuffle(baralho)
    return baralho


def calcularPontos(mao):
    pontos = 0
    ases = 0
    for carta in mao:
        valorCarta = carta.split(" ")[0]
        pontos += valores[valorCarta]
        if valorCarta == 'A':
            ases += 1

    while pontos > 21 and ases > 0:
        pontos -= 10
        ases -= 1
        
    return pontos




@app.route('/api/jogar', methods=['GET'])
def iniciarJogo():

    partida["baralho"] = criarBaralho()
    partida["mao_jogador"] = [partida["baralho"].pop(), partida["baralho"].pop()]
    partida["mao_banca"] = [partida["baralho"].pop(), partida["baralho"].pop()]
    
    pontos_j = calcularPontos(partida["mao_jogador"])
    
    return jsonify({
        "status": "em_andamento",
        "mao_jogador": partida["mao_jogador"],
        "pontos_jogador": pontos_j,
        "carta_visivel_banca": partida["mao_banca"][0] 
    })



@app.route('/api/pedir-carta', methods=['POST'])
def pedirCarta():
    if not partida["baralho"]:
        return jsonify({"erro": "O jogo não foi iniciado"}), 400
        
    partida["mao_jogador"].append(partida["baralho"].pop())
    pontos_j = calcularPontos(partida["mao_jogador"])
    
    status = "em_andamento"
    if pontos_j > 21:
        status = "estourou"
        
    return jsonify({
        "status": status,
        "mao_jogador": partida["mao_jogador"],
        "pontos_jogador": pontos_j
    })


if __name__ == '__main__':
    app.run(debug=True, port=5000)