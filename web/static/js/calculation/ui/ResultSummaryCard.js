export class ResultSummaryCard {
  #container;

  constructor(containerId) {
    this.#container = document.getElementById(containerId);
  }

  render(data) {
    if (!this.#container) return;

    this.#container.innerHTML = `
      <div class="emission-card">
        <div class="card-header">
          <h2>Resultados da Emissão</h2>
        </div>
        <div class="card-body">
          <div class="info-group">
            <span class="icon">📍</span>
            <div class="info-content">
              <label>Rota</label>
              <p>${data.origin} &rarr; ${data.destination}</p>
            </div>
          </div>
          <div class="info-group">
            <span class="icon">🛣️</span>
            <div class="info-content">
              <label>Distância</label>
              <p>${data.distance_km.toFixed(0)} km</p>
            </div>
          </div>
          <div class="info-group">
            <span class="icon">🌿</span>
            <div class="info-content">
              <label>Emissão de CO₂</label>
              <p class="highlight">${data.total_kg_co2e.toFixed(2).replace('.', ',')} kg</p>
            </div>
          </div>
          <div class="info-group">
            <span class="icon">🚗</span>
            <div class="info-content">
              <label>Meio de Transporte</label>
              <p>${this.#formatMode(data.mode)}</p>
            </div>
          </div>
        </div>
      </div>
    `;
    this.#container.style.display = 'block';
  }

  #formatMode(mode) {
    const modes = {
      'car': 'Carro',
      'bus': 'Ônibus',
      'train': 'Trem',
      'plane': 'Avião',
      'bicycle': 'Bicicleta',
      'truck': 'Caminhão'
    };
    return modes[mode] || mode;
  }

  hide() {
    if (this.#container) {
      this.#container.style.display = 'none';
    }
  }
}