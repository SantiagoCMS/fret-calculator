# Backend API - Calculadora de Trastes

API REST em Clojure que fornece cálculos precisos de posição de trastes para instrumentos de corda.

## 🚀 Quick Start

### Pré-requisitos
- Java 11+
- Leiningen

### Setup
```bash
# 1. Entrar no diretório do projeto
cd fret-calculator

# 2. Rodar o servidor
lein run

# 3. API estará disponível em http://localhost:3000
```

## 📡 Endpoints

### 1. Calcular Trastes (por comprimento customizado)
```
GET /frets?scale_length=648&num_frets=22&tuning=standard
```

**Parâmetros:**
- `scale_length` (número): Comprimento da escala em mm
- `num_frets` (inteiro, opcional): Número de trastes (padrão: 22)
- `tuning` (string, opcional): ID da afinação (ex: standard, drop-d)

**Response:**
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

### 2. Calcular Trastes (com escala pré-definida)
```
GET /frets?scale=fender&num_frets=22&tuning=drop-d
```

### 3. Listar Escalas
```
GET /scales
```

### 4. Listar Afinações
```
GET /tunings
```

---

Para documentação completa, veja o arquivo original [README.md](./README.md)
