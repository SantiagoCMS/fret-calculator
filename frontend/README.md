# Frontend - Calculadora de Trastes

Uma aplicação moderna de React + TypeScript para calcular a posição de trastes em instrumentos de corda.

## 🚀 Quick Start

### Pré-requisitos
- Node.js 18+
- NPM ou Yarn

### Setup
```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env.development

# 3. Rodar em desenvolvimento
npm run dev

# 4. Abrir http://localhost:5173
```

### Build para Produção
```bash
npm run build
# Saída em ./dist
```

## 📁 Estrutura do Projeto

```
frontend/
├── src/
│   ├── app/
│   │   ├── App.tsx                    # Componente principal
│   │   └── components/
│   │       └── ui/                    # Componentes shadcn/ui
│   ├── services/
│   │   └── api.ts                    # Cliente HTTP centralizado
│   ├── styles/
│   │   ├── index.css                 # Entry point CSS
│   │   ├── globals.css               # Estilos globais
│   │   ├── theme.css                 # Variáveis de tema
│   │   └── tailwind.css              # Config Tailwind
│   └── main.tsx                       # Entry point React
├── index.html                         # HTML principal
├── vite.config.ts                    # Config do Vite
├── tailwind.config.ts                # Config Tailwind
├── postcss.config.mjs                # Config PostCSS
├── .env.development                  # Variáveis dev
├── .env.production                   # Variáveis produção
└── package.json
```

## 🔌 API Integration

### Serviço de API (`src/services/api.ts`)

O arquivo `api.ts` centraliza todas as comunicações com o backend:

```typescript
// Exemplos de uso:

// 1. Calcular trastes com escala customizada
const result = await api.calculateFrets(648, 22, 'drop-d');

// 2. Calcular com escala pré-definida
const result = await api.calculateFretsWithScale('fender', 22, 'standard');

// 3. Buscar escalas
const scales = await api.getScales();

// 4. Buscar afinações
const tunings = await api.getTunings();
```

### Variáveis de Ambiente

#### Desenvolvimento (`.env.development`)
```
VITE_API_URL=http://localhost:3000
```

#### Produção (`.env.production`)
```
VITE_API_URL=/api
# Ou aponte para seu domínio de produção
```

## 🎨 Styling

### Tecnologias
- **Tailwind CSS**: Utility-first CSS
- **Shadcn/ui**: Componentes React pré-construídos
- **PostCSS**: Processamento de CSS

### Tema
O tema é customizado em `src/styles/theme.css` com cores douradas e tema escuro:
- Cor primária: `#D4AF37` (ouro)
- Background: `#050505` (preto profundo)

## 🧩 Componentes Principais

### `App.tsx`
Componente raiz que contém:
- Header com navegação
- Seção de configuração (escalas, afinações, número de trastes)
- Seção de resultados com tabela e visualização de escala
- Footer com informações

### `FretboardVisualization`
Renderiza uma visualização SVG do braço com trastes marcados.

### `GuitarWireframe`
Elemento decorativo de fundo com um desenho de violão.

## 🌐 Dependências Principais

```json
{
  "@radix-ui/*": "Componentes UI headless",
  "lucide-react": "Ícones SVG",
  "tailwindcss": "CSS utility-first",
  "@tailwindcss/vite": "Plugin Tailwind Vite"
}
```

## 🔧 Scripts

```bash
npm run dev      # Rodar em desenvolvimento
npm run build    # Build para produção
npm run preview  # Preview do build
```

## 📝 Tipos TypeScript

### `FretResult`
```typescript
interface FretResult {
  fret: number;
  "distance-to-nut": number;        // Em mm
  "distance-to-bridge": number;     // Em mm
}
```

### `ScalePreset`
```typescript
interface ScalePreset {
  id: string;
  label: string;
  length: number;
}
```

## 🐛 Debug

### Logs de API
As chamadas à API estão bem documentadas. Abra o console (F12) para ver:
- Requisições HTTP
- Responses da API
- Erros de conexão

### Estado da Aplicação
Estados principais no `App.tsx`:
- `scalesData`: Escalas carregadas da API
- `tuningsData`: Afinações carregadas da API
- `results`: Resultados do último cálculo
- `isLoading`: Indica se está aguardando resposta
- `error`: Mensagem de erro, se houver

## 🚢 Deploy

### Vercel
```bash
vercel
```

### Docker
Veja `Dockerfile` (se houver) para instruções.

### Build Estático
```bash
npm run build
# Servir /dist com qualquer servidor web estático
```

---

**Desenvolvido com Vite + React + TypeScript + Tailwind CSS**
