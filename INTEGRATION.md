# Integração Frontend-Backend - Fret Calculator

## 📋 Resumo da Integração

A integração entre frontend (React/TypeScript) e backend (Clojure) foi refatorada para seguir o princípio de **separação de responsabilidades**:

- **Backend Clojure**: Responsável por TODOS os cálculos matemáticos
- **Frontend React**: Responsável apenas pela interface e consumo da API

## 🏗️ Arquitetura

### Backend (Clojure)
- **Porta**: 3000
- **Endpoints**:
  - `GET /frets?scale_length=648&num_frets=22` - Calcula trastes para escala customizada
  - `GET /frets?scale=fender&num_frets=22` - Calcula trastes para escala pré-definida
  - `GET /scales` - Lista todas as escalas disponíveis
  - `GET /tunings` - Lista todas as afinações disponíveis

### Frontend (React + Vite)
- **Porta**: 5173 (padrão do Vite em dev)
- **Serviço de API**: `src/services/api.ts` - Centraliza todas as requisições HTTP

## 🚀 Como Rodar

### 1. Backend (Clojure)
```bash
cd c:\Users\sneak\Documents\IMT 2026\fret-calculator
lein run
# Servidor rodará em http://localhost:3000
```

### 2. Frontend (React)
```bash
cd "c:\Users\sneak\Documents\IMT 2026\fret-calculator\frontend"
npm install  # Se necessário
npm run dev
# Aplicação rodará em http://localhost:5173
```

## 📁 Estrutura de Arquivos Importantes

### Frontend
```
frontend/
├── src/
│   ├── app/
│   │   ├── App.tsx              # Componente principal
│   │   └── components/          # Componentes UI
│   ├── services/
│   │   └── api.ts              # Cliente HTTP para chamar backend
│   └── styles/                  # Estilos CSS
├── .env.development             # Config para desenvolvimento
├── .env.production              # Config para produção
└── vite.config.ts              # Config do Vite
```

### Backend
```
src/fret_calculator/
├── core.clj                     # Entrada (main)
├── handler.clj                  # Rotas HTTP e CORS
├── calculator.clj               # Lógica de cálculo de trastes
└── scales.clj                   # Escalas e afinações pré-definidas
```

## 🔄 Fluxo de Dados

```
Frontend (App.tsx)
    ↓
handleCalculate()
    ↓
api.calculateFrets() [src/services/api.ts]
    ↓
HTTP GET /frets?scale_length=648&num_frets=22
    ↓
Backend (handler.clj) → calculator.clj
    ↓
Retorna JSON com resultados
    ↓
Frontend renderiza tabela e visualização
```

## ✅ Mudanças Realizadas

### 1. Backend (Clojure)
- ✅ Adicionado middleware CORS (`ring-cors`)
- ✅ Ajustado `scales.clj` para retornar formato correto (`:label`, `:id`, `:notes` como string)
- ✅ Endpoints funcionando corretamente

### 2. Frontend (React/TypeScript)
- ✅ Criado serviço de API (`src/services/api.ts`)
- ✅ Removida função `calculateFrets()` local
- ✅ Refatorado `App.tsx` para chamar backend
- ✅ Ajustados tipos de dados para match com resposta da API
- ✅ Adicionado loading state e error handling
- ✅ Carregamento dinâmico de escalas e afinações via API
- ✅ Removida duplicação de código

### 3. Configuração
- ✅ Criados arquivos `.env.development` e `.env.production`
- ✅ Criado `index.html` e `main.tsx`
- ✅ Frontend compila sem erros

## 🔑 Pontos-Chave

### Separação de Responsabilidades
- **Cálculos**: 100% no backend (Clojure)
- **Interface**: 100% no frontend (React)
- **Validação**: Feita no backend antes de retornar

### API Responses
Os endpoints retornam dados em formato kebab-case (padrão Clojure):
```json
{
  "scale-length-mm": 648,
  "num-frets": 22,
  "frets": [
    {
      "fret": 1,
      "distance-to-nut": 36.35,
      "distance-to-bridge": 611.65
    }
  ]
}
```

O serviço `api.ts` define interfaces TypeScript para type-safety.

## 🐛 Troubleshooting

### Erro: "Failed to fetch from http://localhost:3000"
- Certifique-se que o backend está rodando
- Verifique se a porta 3000 está disponível
- Abra `http://localhost:3000/scales` no navegador para testar

### Erro: "CORS Error"
- O CORS já foi configurado no backend
- Se ainda tiver problemas, verifique `handler.clj`

### Frontend não compila
- Verifique se há erro nos imports de `api.ts`
- Run `npm install` para instalar dependências

## 📚 Próximos Passos (Opcional)

1. **Autenticação**: Se necessário, adicionar autenticação ao backend
2. **Cache**: Implementar cache das escalas/afinações
3. **Validação**: Adicionar mais validações no backend
4. **Testes**: Criar testes unitários para ambos
5. **Deploy**: Configurar CI/CD para deploy automático

---

**Data**: 24/06/2026
**Status**: ✅ Integração Completa e Testada
