export class ComparisonCard {
  #container;

  constructor(containerId) {
    this.#container = document.getElementById(containerId);
  }

  render(baseEmission, distance) {
    if (!this.#container) return;

    const modes = [
      { key: 'bicycle', label: 'Bicicleta', factor: 0.00, icon: '🚲' },
      { key: 'bus', label: 'Ônibus', factor: 0.105, icon: '🚌' },
      { key: 'car', label: 'Carro Selecionado', factor: 0.192, icon: '🚗', selected: true },
      { key: 'truck', label: 'Caminhão', factor: 0.25, icon: '🚚' }
    ];

    const comparisons = modes.map(mode => {
      const emission = mode.factor * distance;
      const vsCar = mode.key === 'car' ? 100 : (emission / baseEmission) * 100;
      const width = Math.min(100, vsCar);
      return {
        ...mode,
        emission,
        vsCar: Math.round(vsCar * 100) / 100,
        width
      };
    });

    this.#container.innerHTML = `
      <div class="comparison-card">
        <div class="card-header">
          <h2>Comparação entre Meios de Transporte</h2>
        </div>
        <div class="card-body">
          ${comparisons.map(item => `
            <div class="transport-item${item.selected ? ' highlighted' : ''}">
              <div class="transport-info">
                <span class="icon">${item.icon}</span>
                <div>
                  <span class="name">${item.label}</span>
                  <span class="emission">${item.emission.toFixed(2).replace('.', ',')} kg CO₂ (vs Carro: ${item.vsCar.toFixed(2)}%)</span>
                </div>
              </div>
              <div class="progress-bar"><div class="progress fill-${item.key}" style="width: ${item.width}%"></div></div>
            </div>
          `).join('')}
        </div>
        <div class="card-footer">
          <p>💡 <strong>Dica:</strong> Escolher meios de transporte mais sustentáveis ajuda a reduzir significativamente as emissões de CO₂ e contribui para um planeta mais saudável!</p>
        </div>
      </div>
    `;
    this.#container.style.display = 'block';
  }

  hide() {
    if (this.#container) {
      this.#container.style.display = 'none';
    }
  }
}