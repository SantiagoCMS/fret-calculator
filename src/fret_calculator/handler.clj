(ns fret-calculator.handler
  (:require [compojure.core :refer [defroutes GET]]
            [compojure.route :as route]
            [ring.middleware.json :refer [wrap-json-response]]
            [ring.middleware.params :refer [wrap-params]]
            [ring.middleware.cors :refer [wrap-cors]]
            [ring.util.response :refer [response bad-request]]
            [fret-calculator.calculator :as calc]
            [fret-calculator.scales :as scales]))

; Helpers

(defn- resolve-scale-length
  "Resolve o comprimento da escala a partir dos parâmetros da requisição.
   Prioridade:
     1. ?scale=fender -> busca no scales.clj
     2. ?scale_length=660 -> usa valor inserido pelo usuário
     3. nenhum dos dois -> retorna nil"
  [{:strs [scale scale_length]}]
  (cond
    scale (when-let [s (scales/get-scale (keyword scale))]
            (:length s))
    scale_length (Double/parseDouble scale_length)
    :else nil))

(defn- resolve-tuning
  "Busca a afinação pelo nome passado na query string.
   Retorna nil se não encontrada ou não informada."
  [tuning-key]
  (when tuning-key
    (scales/get-tuning (keyword tuning-key))))

(defn- parse-num-frets
  "Converte num_frets para inteiro. Padrão: 22."
  [num-frets]
  (if num-frets
    (Integer/parseInt num-frets)
    22))

; Handlers

(defn frets-handler
  "Handler do endpoint GET /frets.
   Query params aceitos:
     scale        - nome da escala pré-definida (ex: fender, gibson)
     scale_length - comprimento customizado em mm  (ex: 660)
     tuning       - afinação pré-definida (ex: standard, drop-d)
     num_frets    - quantidade de trastes (padrão: 22)"
  [req]
  (let [params        (:query-params req)
        scale-length  (resolve-scale-length params)
        tuning        (resolve-tuning (get params "tuning"))
        num-frets     (parse-num-frets (get params "num_frets"))]
    (cond
      (nil? scale-length)
      (bad-request {:error "Informe 'scale' (ex: fender) ou 'scale_length' em mm (ex: 660)"})
      
      (not (pos? scale-length))
      (bad-request {:error "O comprimento de escala deve ser um número positivo."})
      
      (not (< 0 num-frets 37))
      (bad-request {:error "num_frets deve estar entre 1 e 36."})
      
      :else
      (response (cond-> {:scale-length-mm scale-length
                         :num-frets       num-frets
                         :frets           (calc/calculate-all-frets scale-length num-frets)}
                  tuning (assoc :tuning {:name  (:name tuning)
                                         :notes (:notes tuning)}))))))

(defn scales-handler
  "Handler do endpoint GET /scales.
   Retorna todas as escalas pré-definidas."
  [_]
  (response {:scales (scales/list-scales)}))

(defn tunings-handler
  "Handler do endpoint GET /tunings.
   Retorna todas as afinações pré-definidas."
  [_]
  (response {:tunings (scales/list-tunings)}))

; Rotas

(defroutes app-routes
  (GET "/frets"   req (frets-handler req))
  (GET "/scales"  req (scales-handler req))
  (GET "/tunings" req (tunings-handler req))
  (route/not-found (response {:error "Rota não encontrada."})))

; Middleware

(def app
  (-> app-routes
      wrap-params
      (wrap-json-response {:pretty true})
      (wrap-cors :access-control-allow-origin [#".*"]
                 :access-control-allow-methods [:get :post :options]
                 :access-control-allow-headers ["Content-Type"])))