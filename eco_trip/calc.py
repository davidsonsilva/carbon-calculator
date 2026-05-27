"""eco_trip.calc

Calculadora simples de emissões de CO2e para viagens.

Função principal: `estimate_emissions(distance_km, mode, profile, passengers)`
"""
from typing import Any, Dict, List, Union

EMISSION_FACTORS = {
    # kg CO2e per passenger-km (approximate average factors)
    'car': 0.192,
    'bus': 0.105,
    'train': 0.041,
    'plane_short': 0.254,
    'plane_long': 0.146,
}

PROFILE_MULTIPLIER = {
    'urban': 1.2,
    'mixed': 1.0,
    'highway': 0.9,
}


def estimate_emissions(
    distance_km: float,
    mode: str,
    profile: str = 'mixed',
    passengers: int = 1
) -> Dict[str, Union[float, int, str]]:
    """Estimate emissions for a trip.

    Args:
        distance_km (float): distance in kilometers (must be >= 0)
        mode (str): one of 'car', 'bus', 'train', 'plane'
        profile (str): 'urban', 'mixed', or 'highway'
        passengers (int): number of passengers (>=1)

    Returns:
        dict: {distance_km, mode, profile, passengers, factor, multiplier, total_kg_co2e, per_passenger_kg_co2e}
    """
    if distance_km < 0:
        raise ValueError('distance_km must be >= 0')
    if passengers < 1:
        raise ValueError('passengers must be >= 1')

    mode = str(mode).lower()
    profile = str(profile).lower()

    if mode == 'plane':
        # heuristic: choose short- vs long-haul factor based on distance
        key = 'plane_short' if distance_km < 1500 else 'plane_long'
    else:
        key = mode

    if key not in EMISSION_FACTORS:
        raise ValueError(f'unknown mode: {mode}')

    factor = EMISSION_FACTORS[key]
    multiplier = PROFILE_MULTIPLIER.get(profile, 1.0)

    total = factor * distance_km * multiplier
    per_passenger = total / passengers

    return {
        'distance_km': float(distance_km),
        'mode': mode,
        'profile': profile,
        'passengers': int(passengers),
        'factor': float(factor),
        'multiplier': float(multiplier),
        'total_kg_co2e': round(float(total), 6),
        'per_passenger_kg_co2e': round(float(per_passenger), 6),
    }


def estimate_segments(segments: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Estimate emissions for multiple trip segments.

    segments: list of dicts with keys: distance, mode, profile, passengers

    Returns a dict with:
      - segments: list of per-segment results
      - grouped_by_mode: dict mapping mode -> { 'total_kg_co2e', 'segments': [...] }
      - total_kg_co2e: overall total
    """
    if not isinstance(segments, list):
        raise ValueError('segments must be a list')

    results = []
    grouped = {}
    overall_total = 0.0

    for seg in segments:
        # accept flexible keys
        distance = seg.get('distance') or seg.get('distance_km') or 0
        mode = seg.get('mode')
        profile = seg.get('profile', 'mixed')
        passengers = seg.get('passengers', 1)

        res = estimate_emissions(distance, mode, profile, passengers)
        results.append(res)

        overall_total += res['total_kg_co2e']

        m = res['mode']
        if m not in grouped:
            grouped[m] = {'total_kg_co2e': 0.0, 'segments': []}
        grouped[m]['total_kg_co2e'] += res['total_kg_co2e']
        grouped[m]['segments'].append(res)

    # round grouped totals
    for m in grouped:
        grouped[m]['total_kg_co2e'] = round(float(grouped[m]['total_kg_co2e']), 6)

    return {
        'segments': results,
        'grouped_by_mode': grouped,
        'total_kg_co2e': round(float(overall_total), 6),
    }
