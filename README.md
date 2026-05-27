# Calculadora EcoTrip

Calculadora EcoTrip é um projeto que simula o impacto ambiental de viagens, estimando a emissão de carbono com base em fatores como distância, meio de transporte e perfil do trajeto, ajudando o usuário a tomar decisões mais conscientes e sustentáveis.

Funcionalidades iniciais:
- Estimativa de emissão (kg CO2e) por viagem
- Modos: `car`, `bus`, `train`, `plane` (heurística short/long para avião)
- Perfis: `urban`, `mixed`, `highway`

Como usar (CLI):

```powershell
python -m eco_trip --distance 150 --mode car --profile mixed --passengers 1
```

Executar testes unitários:

```powershell
python -m unittest discover -s tests -v
```

Arquivos principais:
- [eco_trip/calc.py](eco_trip/calc.py#L1) — lógica da calculadora
- [eco_trip/cli.py](eco_trip/cli.py#L1) — interface de linha de comando
- [tests/test_calc.py](tests/test_calc.py#L1) — testes unitários

Licença: use conforme desejar (sem licença explícita definida).

