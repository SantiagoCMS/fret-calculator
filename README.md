# 🎸 Fret Calculator API

Uma API REST desenvolvida em **Clojure** que calcula a distância de cada traste de uma guitarra até a pestana (nut) e até a ponte (bridge), com base no comprimento de escala do instrumento.

Projeto acadêmico desenvolvido no **Instituto Mauá de Tecnologia**, também utilizado como projeto de portfólio profissional.

---

## 🛠️ Tecnologias

| Tecnologia | Uso |
|---|---|
| [Clojure 1.11](https://clojure.org/) | Linguagem principal |
| [Leiningen](https://leiningen.org/) | Gerenciador de dependências e build |
| [Ring](https://github.com/ring-clojure/ring) | Servidor HTTP |
| [Compojure](https://github.com/weavejester/compojure) | Roteamento |
| [Cheshire](https://github.com/dakrone/cheshire) | Serialização JSON |

---

## 📐 A Fórmula

A API utiliza a fórmula padrão de lutheria para calcular a posição dos trastes:

```
Distância até a ponte  =  escala ÷ 2^(n/12)
Distância até a pestana =  escala − distância até a ponte
```

Onde `n` é o número do traste e `escala` é o comprimento de escala em milímetros.

---

## 🚀 Como Rodar

### Pré-requisitos
- Java 11+
- Leiningen instalado → [leiningen.org](https://leiningen.org/)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/fret-calculator.git
cd fret-calculator

# Instale as dependências
lein deps
```

### Rodando em desenvolvimento

```bash
lein run
```

O servidor sobe em `http://localhost:3000`.

### Rodando os testes

```bash
lein test
```

### Build (uberjar)

```bash
lein uberjar
java -jar target/uberjar/fret-calculator-0.1.0-SNAPSHOT-standalone.jar
```

---

## 📡 Endpoints

### `GET /frets`

Calcula as distâncias de todos os trastes.

**Query params:**

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `scale` | string | Sim* | Nome de uma escala pré-definida (ex: `fender`) |
| `scale_length` | number | Sim* | Comprimento de escala customizado em mm (ex: `660`) |
| `tuning` | string | Não | Afinação pré-definida (ex: `standard`) |
| `num_frets` | integer | Não | Quantidade de trastes. Padrão: `22` |

*Informe `scale` **ou** `scale_length` — não é necessário os dois.

**Exemplos:**

```bash
# Com escala pré-definida
GET /frets?scale=fender&tuning=standard&num_frets=22

# Com escala customizada
GET /frets?scale_length=660&num_frets=24

# Com afinação
GET /frets?scale=gibson&tuning=drop-d
```

**Resposta (`200 OK`):**

```json
{
  "scale-length-mm": 648.0,
  "num-frets": 3,
  "tuning": {
    "name": "Standard",
    "notes": ["E2", "A2", "D3", "G3", "B3", "E4"]
  },
  "frets": [
    { "fret": 1, "distance-to-nut": 36.35, "distance-to-bridge": 611.65 },
    { "fret": 2, "distance-to-nut": 70.67, "distance-to-bridge": 577.33 },
    { "fret": 3, "distance-to-nut": 103.05, "distance-to-bridge": 544.95 }
  ]
}
```

**Resposta de erro (`400 Bad Request`):**

```json
{ "error": "Informe 'scale' (ex: fender) ou 'scale_length' em mm (ex: 660)" }
```

---

### `GET /scales`

Retorna todas as escalas pré-definidas.

**Resposta (`200 OK`):**

```json
{
  "scales": [
    { "id": "gibson",   "name": "Gibson",        "length": 628.0 },
    { "id": "fender",   "name": "Fender / Strat", "length": 648.0 },
    { "id": "prs",      "name": "PRS",            "length": 635.0 },
    { "id": "baritone", "name": "Baritone",       "length": 686.0 }
  ]
}
```

---

### `GET /tunings`

Retorna todas as afinações pré-definidas.

**Resposta (`200 OK`):**

```json
{
  "tunings": [
    { "id": "standard",       "name": "Standard",           "notes": ["E2","A2","D3","G3","B3","E4"] },
    { "id": "drop-d",         "name": "Drop D",             "notes": ["D2","A2","D3","G3","B3","E4"] },
    { "id": "half-step-down", "name": "Half Step Down (Eb)","notes": ["Eb2","Ab2","Db3","Gb3","Bb3","Eb4"] },
    { "id": "open-g",         "name": "Open G",             "notes": ["D2","G2","D3","G3","B3","D4"] },
    { "id": "drop-c",         "name": "Drop C",             "notes": ["C2","G2","C3","F3","A3","D4"] },
    { "id": "dadgad",         "name": "DADGAD",             "notes": ["D2","A2","D3","G3","A3","D4"] }
  ]
}
```

---

## 📁 Estrutura do Projeto

```
fret-calculator/
├── project.clj                        ← dependências e configuração
├── src/
│   └── fret_calculator/
│       ├── core.clj                   ← entry point / servidor
│       ├── handler.clj                ← rotas e validações
│       ├── calculator.clj             ← lógica dos cálculos
│       └── scales.clj                 ← escalas e afinações pré-definidas
├── test/
│   └── fret_calculator/
│       └── calculator_test.clj        ← testes unitários
└── README.md
```

---

## 📄 Licença

MIT License — sinta-se livre para usar, estudar e modificar.
