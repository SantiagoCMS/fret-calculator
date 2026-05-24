(ns fret-calculator.core
  (:require [ring.adapter.jetty :refer [run-jetty]]
            [fret-calculator.handler :refer [app]])
  (:gen-class))

(def server-config
  {:port  3000
   :join? true})

(defn -main
  "Inicia o servidor HTTP na porta 3000."
  [& _args]
  (println "🎸 Fret Calculator API iniciando...")
  (println "   Porta: " (:port server-config))
  (println "   Endpoints disponíveis:")
  (println "     GET /frets?scale=fender&tuning=standard&num_frets=22")
  (println "     GET /frets?scale_length=660&num_frets=24")
  (println "     GET /scales")
  (println "     GET /tunings")
  (println "✅ Servidor rodando em http://localhost:3000")
  (run-jetty app server-config))
