"""Simple CLI for EcoTrip calculator."""
import argparse
import sys
import json
from .calc import estimate_emissions


def build_parser():
    p = argparse.ArgumentParser(prog='eco_trip', description='Calculadora EcoTrip - estimativa de emissão de carbono')
    p.add_argument('--distance', '-d', type=float, required=True, help='Distância em km')
    p.add_argument('--mode', '-m', choices=['car', 'bus', 'train', 'plane'], required=True, help='Meio de transporte')
    p.add_argument('--profile', '-p', choices=['urban', 'mixed', 'highway'], default='mixed', help='Perfil do trajeto')
    p.add_argument('--passengers', '-n', type=int, default=1, help='Número de passageiros')
    p.add_argument('--json', action='store_true', help='Output em formato JSON')
    return p


def main(argv=None):
    parser = build_parser()
    args = parser.parse_args(argv)

    try:
        res = estimate_emissions(args.distance, args.mode, args.profile, args.passengers)
    except ValueError as e:
        print(f'Erro: {e}', file=sys.stderr)
        sys.exit(1)

    if args.json:
        print(json.dumps(res, indent=2))
    else:
        print('--- Calculadora EcoTrip ---')
        print(f"Distância: {res['distance_km']} km")
        print(f"Meio: {res['mode']}")
        print(f"Perfil: {res['profile']}")
        print(f"Passageiros: {res['passengers']}")
        print(f"Fator usado: {res['factor']} kgCO2e/pkm")
        print(f"Multiplicador de perfil: {res['multiplier']}")
        print(f"Emissão total: {res['total_kg_co2e']} kg CO2e")
        print(f"Emissão por passageiro: {res['per_passenger_kg_co2e']} kg CO2e")


if __name__ == '__main__':
    main()
