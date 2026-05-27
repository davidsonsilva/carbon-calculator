import { EmissionFactorProvider } from './EmissionFactorProvider.js';

export class EmissionCalculator {
  #factorProvider;

  constructor(factorProvider) {
    this.#factorProvider = factorProvider;
  }

  calculate(distance, mode, profile = 'mixed', passengers = 1) {
    if (distance < 0) throw new Error('distance must be >= 0');
    if (passengers < 1) throw new Error('passengers must be >= 1');

    const factor = this.#factorProvider.getFactor(mode, distance);
    const multiplier = this.#factorProvider.getProfileMultiplier(profile);
    const total = factor * distance * multiplier;
    const perPassenger = total / passengers;

    return {
      distance,
      mode,
      profile,
      passengers,
      factor,
      multiplier,
      total_kg_co2e: Math.round(total * 1e6) / 1e6,
      per_passenger_kg_co2e: Math.round(perPassenger * 1e6) / 1e6
    };
  }
}