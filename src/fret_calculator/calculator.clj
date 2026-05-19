(ns fret-calculator.calculator)

(defn distance-to-bridge
  "Calcula a distância do traste N até a ponte (bridge).
   Parâmetros:
     scale-length - comprimento de escala em mm
     fret-number  - número do traste" 
  [scale-length fret-number]
  (/ scale-length (Math/pow 2 (/ fret-number 12.0))))

(defn distance-to-nut
  "Calcula a distância do traste N até a pestana (nut).
   Parâmetros:
     scale-length - comprimento de escala em mm
     fret-number  - número do traste"
  [scale-length fret-number]
  (- scale-length (distance-to-bridge scale-length fret-number)))

(defn calculate-fret
  "Retorna um mapa com as distâncias de um traste específico.
   Exemplo de retorno:
     {:fret 1 :distance-to-nut 36.35 :distance-to-bridge 611.65}"
  [scale-length fret-number]
  (let [to-bridge (distance-to-bridge scale-length fret-number)
        to-nut (distance-to-nut scale-length fret-number)]
    {:fret           fret-number
     :distance-to-nut  (Double/parseDouble (format "%.2f" to-nut))
     :distance-to-bridge (Double/parseDouble (format "%.2f" to-bridge))}))

(defn calculate-all-frets
  "Calcula a ditância de todos os trastes de 1 até num-frets.
   Parâmetros:
     scale-length - comprimento da escala em mm
     num-frets - quantidade de trastes (ex: 22 ou 24)"
  [scale-length num-frets]
  (mapv (partial calculate-fret scale-length) (range 1 (inc num-frets))))

(comment
  (distance-to-bridge 650 12)
  (distance-to-nut 650 12)
  (calculate-fret 648 12)
  (calculate-all-frets 650 22))