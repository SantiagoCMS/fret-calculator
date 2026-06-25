/**
 * Serviço de API para integração com o backend Clojure
 * Todos os cálculos devem ser feitos no servidor
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export interface Fret {
  fret: number;
  "distance-to-nut": number;
  "distance-to-bridge": number;
}

export interface FretCalculationResponse {
  "scale-length-mm": number;
  "num-frets": number;
  frets: Fret[];
  tuning?: {
    name: string;
    notes: string;
  };
}

export interface Scale {
  id: string;
  label: string;
  length: number;
}

export interface ScalesResponse {
  scales: Scale[];
}

export interface Tuning {
  id: string;
  label: string;
  notes: string;
}

export interface TuningsResponse {
  tunings: Tuning[];
}

/**
 * Calcula os trastes baseado no comprimento da escala
 * @param scaleLength - Comprimento em mm (ex: 648)
 * @param numFrets - Número de trastes (ex: 22)
 * @param tuning - (Opcional) Afinação pré-definida
 */
export async function calculateFrets(
  scaleLength: number,
  numFrets: number,
  tuning?: string
): Promise<FretCalculationResponse> {
  const params = new URLSearchParams({
    scale_length: scaleLength.toString(),
    num_frets: numFrets.toString(),
  });

  if (tuning) {
    params.append("tuning", tuning);
  }

  const response = await fetch(`${API_BASE_URL}/frets?${params}`);
  if (!response.ok) {
    throw new Error(`Erro ao calcular trastes: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Calcula os trastes usando escala pré-definida
 * @param scale - Nome da escala (ex: "fender", "gibson")
 * @param numFrets - Número de trastes (ex: 22)
 * @param tuning - (Opcional) Afinação
 */
export async function calculateFretsWithScale(
  scale: string,
  numFrets: number,
  tuning?: string
): Promise<FretCalculationResponse> {
  const params = new URLSearchParams({
    scale: scale,
    num_frets: numFrets.toString(),
  });

  if (tuning) {
    params.append("tuning", tuning);
  }

  const response = await fetch(`${API_BASE_URL}/frets?${params}`);
  if (!response.ok) {
    throw new Error(`Erro ao calcular trastes: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Busca todas as escalas pré-definidas
 */
export async function getScales(): Promise<ScalesResponse> {
  const response = await fetch(`${API_BASE_URL}/scales`);
  if (!response.ok) {
    throw new Error(`Erro ao buscar escalas: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Busca todas as afinações pré-definidas
 */
export async function getTunings(): Promise<TuningsResponse> {
  const response = await fetch(`${API_BASE_URL}/tunings`);
  if (!response.ok) {
    throw new Error(`Erro ao buscar afinações: ${response.statusText}`);
  }
  return response.json();
}
