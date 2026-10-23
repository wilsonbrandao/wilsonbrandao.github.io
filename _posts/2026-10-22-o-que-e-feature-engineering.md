---
title: O que é Feature Engineering?
description: Como transformar dados brutos em sinais úteis para um modelo, e os erros que fazem um modelo parecer bom no notebook e falhar em produção.
tags: [Feature Engineering, Fundamentos]
---
Um modelo de Machine Learning não enxerga o mundo. Ele enxerga números organizados em colunas. **Feature engineering** é o trabalho de decidir quais colunas existem e como elas são calculadas a partir dos dados brutos.

Uma *feature* é qualquer variável de entrada do modelo. Num dado de transações bancárias, o valor da compra já é uma feature. Mas "quantas compras esse cliente fez nas últimas 24 horas" é uma feature muito mais informativa para detectar fraude, e ela não existe nos dados brutos: alguém precisa construí-la.

## Por que isso importa

Para dados tabulares, um bom conjunto de features costuma pesar mais do que trocar um algoritmo por outro. O modelo só pode aprender padrões que estejam representados nas colunas que ele recebe.

Existe também uma razão de engenharia: as features precisam ser calculadas **do mesmo jeito** no treino e em produção. Boa parte dos problemas em ML na prática vem dessa diferença, e não do modelo.

## As famílias de técnicas

| Tipo de dado | Técnicas comuns | Exemplo |
|---|---|---|
| Numérico | Padronização, log, divisão em faixas | Aplicar `log` no valor da transação, que costuma ser muito assimétrico |
| Categórico | One-hot, frequência, target encoding | Canal da compra: app, cartão, Pix |
| Temporal | Hora, dia da semana, janelas móveis, defasagens | Número de transações nas últimas 24 horas |
| Interação | Razões, diferenças, produtos | Valor da compra dividido pela média do cliente |
| Texto | Contagem de termos, embeddings | Descrição da transação |

### Tratando categorias

Modelos precisam de números, então categorias viram colunas. O **one-hot encoding** cria uma coluna binária por categoria e é o ponto de partida mais seguro. Quando há centenas de categorias, ele cresce demais e vale considerar codificação por frequência ou target encoding.

### Tratando o tempo

Hora do dia é cíclica: 23h e 0h estão a uma hora de distância, mas numericamente parecem opostos. Uma forma de representar isso é usar seno e cosseno:

```python
import numpy as np

df["hora_sin"] = np.sin(2 * np.pi * df["hora"] / 24)
df["hora_cos"] = np.cos(2 * np.pi * df["hora"] / 24)
```

Para janelas móveis, o cuidado é olhar **só para o passado**:

```python
df = df.sort_values(["cliente_id", "data_hora"])

df["qtd_transacoes_24h"] = (
    df.set_index("data_hora")
      .groupby("cliente_id")["valor"]
      .rolling("24h", closed="left")  # exclui a transação atual
      .count()
      .reset_index(level=0, drop=True)
      .values
)
```

## O erro mais caro: data leakage

*Data leakage* acontece quando uma feature usa informação que **não estaria disponível** no momento da previsão. O modelo parece excelente na validação e falha em produção.

Exemplos clássicos:

- Calcular a média de uma coluna usando o conjunto inteiro, incluindo os dados de teste, antes de dividir treino e teste.
- Usar uma janela móvel que inclui o próprio evento que se quer prever.
- Fazer target encoding sem separar os dados corretamente, deixando o alvo vazar para a feature.

> Pergunta de verificação para cada feature: no instante em que o modelo precisará prever, eu já teria esse valor?
{: .nota}

## Colocando tudo em um pipeline

A forma mais simples de evitar vazamento e garantir o mesmo cálculo no treino e na inferência é encapsular as transformações junto com o modelo. Com scikit-learn:

```python
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

numericas = ["valor", "idade_conta_dias"]
categoricas = ["canal", "categoria_estabelecimento"]

preprocessamento = ColumnTransformer([
    ("num", Pipeline([
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler()),
    ]), numericas),
    ("cat", Pipeline([
        ("imputer", SimpleImputer(strategy="most_frequent")),
        ("onehot", OneHotEncoder(handle_unknown="ignore")),
    ]), categoricas),
])

modelo = Pipeline([
    ("prep", preprocessamento),
    ("clf", LogisticRegression(max_iter=1000)),
])

modelo.fit(X_treino, y_treino)   # aprende médias, medianas e categorias só do treino
previsoes = modelo.predict(X_teste)
```

O `fit` aprende médias, medianas e categorias **apenas com o treino**. O `predict` aplica exatamente as mesmas transformações ao teste e, depois, aos dados de produção. Esse único objeto é o que se versiona e se publica.

## Do notebook para a produção

Quando várias equipes e modelos compartilham features, calcular tudo de novo em cada projeto gera divergência. Uma **feature store** guarda a definição de cada feature uma única vez e a serve tanto para o treino quanto para a inferência em tempo real. O problema que ela resolve tem nome: *training-serving skew*, a diferença entre como a feature foi calculada no treino e como é calculada em produção. Vou aprofundar isso em um post sobre MLOps.

## O que levo deste estudo

1. Feature engineering é decidir **o que o modelo consegue enxergar**.
2. O maior risco não é uma feature fraca, é uma feature que vaza o futuro.
3. Encapsular as transformações em um pipeline resolve boa parte dos problemas de consistência.

O próximo passo é aplicar isso em um projeto: um [pipeline de features para detecção de fraude]({{ '/projetos/' | relative_url }}) com dados sintéticos.
