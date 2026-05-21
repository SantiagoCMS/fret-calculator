(ns fret-calculator.calculator-test
  (:require [clojure.test :refer [deftest is testing]]
            [fret-calculator.calculator :refer :all]))

(deftest test-distance-to-bridge
  (testing "traste 12 deve ser exatamente metade da escala inserida"
    (is (= 325.0 (distance-to-bridge 650 12))))

  (testing "traste 0 deve retornar a escala completa (sem deslocamento)"
    (is (= 650.0 (distance-to-bridge 650 0))))

  (testing "quanto maior o traste, menor a distância até a ponte"
    (is (> (distance-to-bridge 650 1)
           (distance-to-bridge 650 5)
           (distance-to-bridge 650 12)))))

(deftest test-distance-to-nut
  (testing "traste 12 deve ser exatamente metade da escala inserida"
    (is (= 325.0 (distance-to-nut 650 12))))

  (testing "traste 0 deve retornar 0 (pestana é o ponto incial)"
    (is (= 0.0 (distance-to-nut 650 0))))

  (testing "quanto maior o traste maior a dinstância até a pestana"
    (is (< (distance-to-nut 650 1)
           (distance-to-nut 650 5)
           (distance-to-nut 650 12)))))

(deftest test-calculate-fret
  (testing "retorna mapa com todas as chaves obrigatórias"
    (let [result (calculate-fret 650 1)]
      (is (contains? result :fret))
      (is (contains? result :distance-to-nut))
      (is (contains? result :distance-to-bridge))))

  (testing "o número do traste no mapa bate com o parâmetro"
    (is (= 7 (:fret (calculate-fret 650 7)))))

  (testing "distância ao nut + distância à ponte deve ser igual à escala"
    (let [result (calculate-fret 650 5)]
      (is (= 650.0 (+ (:distance-to-nut result)
                      (:distance-to-bridge result))))))

  (testing "valores são arredondados para 2 casas decimais"
    (let [result (calculate-fret 650 1)]
      (is (= (Double/parseDouble (format "%.2f" (:distance-to-nut result)))
             (:distance-to-nut result))))))

(deftest test-calculate-all-frets
  (testing "retorna a quantidade exata de trastes solicitada"
    (is (= 22 (count (calculate-all-frets 650 22))))
    (is (= 24 (count (calculate-all-frets 650 24)))))
  
  (testing "o primeiro elemento é o traste 1"
    (is (= 1 (:fret (first (calculate-all-frets 650 22))))))
  
  (testing "o último elemento bate com o num-frets"
    (is (= 22 (:fret (last (calculate-all-frets 650 22))))))
  
  (testing "retorna um vetor não uma lazy sequence"
    (is (vector? (calculate-all-frets 650 22)))))