import { EmissionFactorProvider } from './services/EmissionFactorProvider.js';
import { EmissionCalculator } from './services/EmissionCalculator.js';
import { EmissionResult } from './models/EmissionResult.js';
import { ResultGallery } from './ui/ResultGallery.js';
import { ResultSummaryCard } from './ui/ResultSummaryCard.js';
import { ComparisonCard } from './ui/ComparisonCard.js';
import { FormValidator } from './utils/validators.js';

class CarbonApp {
  #calculator;
  #gallery;
  #selectedFactor = 0.14;

  constructor() {
    const factorProvider = new EmissionFactorProvider();
    this.#calculator = new EmissionCalculator(factorProvider);
    this.#gallery = new ResultGallery('resultImages', [
      '/static/results/impact.png',
      '/static/results/comparison.png',
      '/static/results/offset.png'
    ]);
    this.#summaryCard = new ResultSummaryCard('resultSummary');
    this.#bindEvents();
  }

  #bindEvents() {
    const cards = document.querySelectorAll('.m3-transport-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        cards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        this.#selectedFactor = parseFloat(card.dataset.factor);
      });
    });

    const form = document.getElementById('co2Form');
    form?.addEventListener('submit', (e) => this.#handleSubmit(e));

    const manualCheck = document.getElementById('manualDistance');
    const distanceInput = document.getElementById('distance');
    const distanceNote = document.getElementById('distanceNote');

    manualCheck?.addEventListener('change', function() {
      if (this.checked) {
        distanceInput.disabled = false;
        distanceInput.value = '';
        distanceNote.style.display = 'none';
        distanceInput.focus();
      } else {
        distanceInput.disabled = true;
        distanceInput.value = '0';
        distanceNote.style.display = 'block';
      }
    });

    document.getElementById('destination')?.addEventListener('blur', function() {
      if (!manualCheck?.checked && this.value.trim() !== '') {
        distanceInput.value = Math.floor(Math.random() * 500) + 50;
      }
    });
  }

  async #handleSubmit(e) {
    e.preventDefault();

    const distance = parseFloat(document.getElementById('distance')?.value);
    const origin = document.getElementById('origin')?.value;
    const destination = document.getElementById('destination')?.value;

    if (!FormValidator.validateDistance(distance)) {
      alert('Informe uma distância válida');
      return;
    }
    if (!FormValidator.validateCity(origin) || !FormValidator.validateCity(destination)) {
      alert('Informe origem e destino válidos');
      return;
    }

    try {
      const origin = document.getElementById('origin')?.value || 'Origem';
      const destination = document.getElementById('destination')?.value || 'Destino';
      const mode = 'car';

      const data = this.#calculator.calculate(distance, mode);
      const result = new EmissionResult(data);

      const resultPanel = document.getElementById('resultPanel');
      const co2Result = document.getElementById('co2Result');
      
      if (co2Result) co2Result.textContent = result.totalEmissions.toFixed(2);
      if (resultPanel) {
        resultPanel.classList.add('active');
      }

      this.#summaryCard.render({
        origin,
        destination,
        distance_km: data.distance,
        total_kg_co2e: data.total_kg_co2e,
        mode: data.mode
      });

      this.#comparisonCard.render(data.total_kg_co2e, data.distance);
      this.#gallery.render(result);
      resultPanel.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      console.error('Calculation error:', error);
      alert('Erro ao calcular emissões');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new CarbonApp();
});