export class EmissionResult {
  #data;

  constructor(data) {
    this.#data = data;
  }

  get totalEmissions() {
    return this.#data.total_kg_co2e;
  }

  get perPassengerEmissions() {
    return this.#data.per_passenger_kg_co2e;
  }

  get equivalentTrees() {
    return Math.round(this.#data.total_kg_co2e / 22 * 10) / 10;
  }

  get comparisonData() {
    const modes = {
      'car': { label: 'Carro', factor: 0.192 },
      'bus': { label: 'Ônibus', factor: 0.105 },
      'train': { label: 'Trem', factor: 0.041 },
      'bicycle': { label: 'Bicicleta', factor: 0 }
    };
    return Object.entries(modes).map(([key, val]) => ({
      mode: val.label,
      emissions: Math.round(val.factor * this.#data.distance * 100) / 100
    }));
  }

  toJSON() {
    return { ...this.#data };
  }
}