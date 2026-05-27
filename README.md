# EcoTrip — Calculadora de Emissão de CO₂

## Descrição

O **EcoTrip** é uma aplicação web para estimativa de emissões de CO₂ em viagens entre capitais brasileiras. O projeto permite ao usuário calcular o impacto ambiental de sua viagem com base na distância percorrida e no meio de transporte escolhido, exibindo os resultados de forma visual e interativa.

## Funcionalidades

- **Cálculo de emissões** por viagem com base em fatores científicos de CO₂e por passageiro/km
- **Mapa interativo** com rota traçada entre origem e destino, usando cores distintas por modal de transporte
- **Comparação entre modais** — barras de progresso comparando bicicleta, ônibus, carro e caminhão
- **Créditos de carbono** — cálculo automático de créditos necessários para compensar a emissão com estimativa de custo
- **Modal de compensação** com passo a passo e links para plataformas certificadas (Verra, Gold Standard, MOSS Earth)

## Tecnologias utilizadas

| Camada | Tecnologia |
|---|---|
| Frontend | HTML5, CSS3, JavaScript ES6 |
| Mapas | Leaflet.js + OpenStreetMap (CartoDB Dark) |
| Design System | Material Design 3 tokens + dark theme custom |
| Backend | Python 3 + Flask |
| Testes | unittest (Python) |
| Deploy | GitHub Pages (estático) |

## Arquitetura

O projeto segue uma arquitetura de duas camadas independentes: um **pacote Python** (`eco_trip`) com lógica de cálculo testada e reutilizável via CLI ou API, e uma **interface web estática** com toda a lógica de apresentação em JavaScript client-side, publicada no GitHub Pages sem necessidade de servidor.

## Como usar

**Web:** https://davidsonsilva.github.io/carbon-calculator/

**CLI:**
```powershell
python -m eco_trip --distance 150 --mode car --profile mixed --passengers 1
```

**Rodar testes:**
```powershell
python -m unittest discover -s tests -v
```

**Rodar servidor local:**
```powershell
python web/app.py
```

## Arquivos principais

- [`eco_trip/calc.py`](eco_trip/calc.py) — lógica de cálculo de emissões
- [`eco_trip/cli.py`](eco_trip/cli.py) — interface de linha de comando
- [`web/app.py`](web/app.py) — servidor Flask com API REST
- [`web/templates/index.html`](web/templates/index.html) — interface web
- [`tests/test_calc.py`](tests/test_calc.py) — testes unitários
- [`docs/`](docs/) — build estático para GitHub Pages

## Licença

Use conforme desejar (sem licença explícita definida).
