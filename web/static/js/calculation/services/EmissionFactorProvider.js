export class EmissionFactorProvider {
  #factors = {
    'car': 0.192,
    'bus': 0.105,
    'train': 0.041,
    'plane_short': 0.254,
    'plane_long': 0.146,
    'bicycle': 0.00,
    'truck': 0.25
  };

  #profiles = {
    'urban': 1.2,
    'mixed': 1.0,
    'highway': 0.9
  };

  getFactor(mode, distance) {
    if (mode === 'plane') {
      return distance < 1500 ? this.#factors.plane_short : this.#factors.plane_long;
    }
    return this.#factors[mode] ?? 0;
  }

  getProfileMultiplier(profile) {
    return this.#profiles[profile] ?? 1.0;
  }

  getAvailableModes() {
    return Object.keys(this.#factors);
  }
}