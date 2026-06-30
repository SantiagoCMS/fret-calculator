# 🎸 Fret Calculator

Uma aplicação full-stack para calcular a posição de cada traste de uma guitarra com base no comprimento de escala do instrumento. O projeto separa responsabilidades entre um backend em Clojure, responsável pelos cálculos, e um frontend em React + TypeScript, responsável pela interface e pela experiência do usuário.

O projeto foi desenvolvido como atividade acadêmica no Instituto Mauá de Tecnologia e também pode servir como exemplo de portfólio técnico.

---

## 🧩 Visão geral

- Backend: Clojure + Leiningen + Ring + Compojure
- Frontend: React + TypeScript + Vite + Tailwind + shadcn/ui
- API: REST, com endpoints para cálculo de trastes, listas de escalas e afinações
- Porta do backend: 3000
- Porta do frontend: 5173

---

## 📐 Fórmula utilizada

A API usa a fórmula padrão de lutheria para calcular a distância dos trastes:

```text
Distância até a ponte = escala ÷ 2^(n/12)
Distância até a pestana = escala − distância até a ponte
```

Onde `n` é o número do traste e `escala` é o comprimento da escala em milímetros.

---

## 🛠️ Requisitos

### Backend
- Java 11+
- Leiningen

### Frontend
- Node.js 18+
- npm

---

## ▶️ Como executar

### 1. Backend (Clojure)

```bash
cd fret-calculator
lein deps
lein run
```

O servidor ficará disponível em `http://localhost:3000`.

### 2. Frontend (React)

```bash
cd fret-calculator/frontend
npm install
npm run dev
```

A aplicação ficará disponível em `http://localhost:5173`.

### 3. Testes

```bash
cd fret-calculator
lein test
```

### 4. Build do backend

```bash
cd fret-calculator
lein uberjar
java -jar target/uberjar/fret-calculator-0.1.0-SNAPSHOT-standalone.jar
```

### 5. Build do frontend

```bash
cd fret-calculator/frontend
npm run build
```

---

## 📡 Endpoints da API

### GET /frets

Calcula os trastes para uma escala pré-definida ou para um comprimento de escala customizado.

Parâmetros query:
- `scale`: nome da escala pré-definida, como `fender` ou `gibson`
- `scale_length`: comprimento da escala em mm, como `648`
- `tuning`: afinação pré-definida, como `standard` ou `drop-d`
- `num_frets`: quantidade de trastes desejada (padrão: `22`)

Exemplos:

```bash
curl "http://localhost:3000/frets?scale=fender&tuning=standard&num_frets=22"
curl "http://localhost:3000/frets?scale_length=660&num_frets=24"
```

Resposta exemplo:

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

Erro comum:

```json
{ "error": "Informe 'scale' (ex: fender) ou 'scale_length' em mm (ex: 660)" }
```

### GET /scales

Retorna as escalas pré-definidas disponíveis.

### GET /tunings

Retorna as afinações pré-definidas disponíveis.

---

## 📁 Estrutura do projeto

```text
fret-calculator/
├── src/
│   └── fret_calculator/
│       ├── calculator.clj
│       ├── core.clj
│       ├── handler.clj
│       └── scales.clj
├── test/
│   └── fret_calculator/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── services/
│   │   └── styles/
│   ├── package.json
│   └── vite.config.ts
├── README.md
├── BACKEND_API.md
├── INTEGRATION.md
└── project.clj
```

---

## 🔗 Documentação complementar

- [BACKEND_API.md](BACKEND_API.md)
- [INTEGRATION.md](INTEGRATION.md)
- [frontend/README.md](frontend/README.md)

---

## 📄 Licença

MIT License — sinta-se livre para usar, estudar, modificar e adaptar o projeto.
