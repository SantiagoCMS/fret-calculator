(defproject fret-calculator "0.1.0-SNAPSHOT"
  :description "API para cálculo de distâncias de trastes de violão "
  :url "https://github.com/SantiagoCMS/fret-calculator.git"
  :license {:name "MIT"
            :url "https://opensource.org/licenses/MIT"}

  :dependencies [[org.clojure/clojure "1.12.2"]
                 [compojure "1.7.1"]
                 [ring/ring-core "1.11.0"]
                 [ring/ring-jetty-adapter "1.11.0"]
                 [ring/ring-json "0.5.1"]
                 [ring-cors "0.1.13"]
                 [cheshire "5.12.0"]]

  :main ^:skip-aot fret-calculator.core

  :target-path "target/%s"

  :profiles {:uberjar {:aot :all
                       :jvm-opts ["-Dclojure.compiler.direct-linking=true"]}
             :dev {:dependencies [[ring/ring-mock "0.4.0"]]}})
