(ns fret-calculator.scales)

(def scale-lengths
  {:gibson     {:name "Gibson"          :length 628.0}
   :fender     {:name "Fender / Strat"  :length 648.0}
   :prs        {:name "PRS"             :length 635.0}
   :baritone   {:name "Baritone"        :length 686.0}})

(def tunings
  {:standard         {:name "Standard"             :notes ["E2" "A2" "D3" "G3" "B3" "E4"]}
   :drop-d           {:name "Drop D"               :notes ["D2" "A2" "D3" "G3" "B3" "E4"]}
   :half-step-down   {:name "Half Step Down (Eb)"  :notes ["Eb2" "Ab2" "Db3" "Gb3" "Bb3" "Eb4"]}
   :open-g           {:name "Open G"               :notes ["D2" "G2" "D3" "G3" "B3" "D4"]}
   :drop-c           {:name "Drop C"               :notes ["C2" "G2" "C3" "F3" "A3" "D4"]}
   :dadgad           {:name "DADGAD"               :notes ["D2" "A2" "D3" "G3" "A3" "D4"]}})

(defn get-scale
  "Busca uma escala pelo keyword (ex: :fender).
   Retorna nil se não encontrada."
  [scale-key]
  (get scale-lengths scale-key))

(defn get-tuning
  "Busca uma afinação pelo keyword (ex: :drop-d).
   Retorna nil se não encontrada"
  [tuning-key]
  (get tunings tuning-key))

(defn list-scale 
  "Retorna todas as escalas como vetor de mapas,
   adicionando o :id de cada uma."
  []
  (mapv (fn [[k v]] (assoc v :id (name k))) scale-lengths))

(defn list-tunings
  "Retorna todas as afinações como vetor de mapas,
   adicionando o :id de cada uma." 
  []
  (mapv (fn [[k v]] (assoc v :id (name k))) tunings))

(comment
  (get-scale :fender)
  (get-scale :gibson)
  (get-tuning :drop-d)
  (get-tuning :dadgad)
  (list-scale)
  (list-tunings))