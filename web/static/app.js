document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('trip-form');
  const resultCard = document.getElementById('result-card');
  const errorCard = document.getElementById('error-card');

  function buildSegmentsPayload() {
    const segEls = document.querySelectorAll('.segment');
    const segs = [];
    segEls.forEach(el => {
      const distance = parseFloat(el.querySelector('.distance').value) || 0;
      const mode = el.querySelector('.mode').value;
      const profile = el.querySelector('.profile').value;
      const passengers = parseInt(el.querySelector('.passengers').value) || 1;
      segs.push({ distance, mode, profile, passengers });
    });
    return segs;
  }

  form.addEventListener('submit', async function (ev) {
    ev.preventDefault();
    resultCard.classList.add('d-none');
    errorCard.classList.add('d-none');

    const segments = buildSegmentsPayload();
    const payload = { segments };

    try {
      const resp = await fetch('/api/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await resp.json();
      if (!data.ok) throw new Error(data.error || 'Erro desconhecido');

      // display grouped results
      const grouped = data.result.grouped_by_mode || {};
      const total = data.result.total_kg_co2e;

      let html = `<p class="mb-2"><strong>Emissão total:</strong> ${total} kg CO2e</p>`;
      html += `<div>`;
      for (const mode in grouped) {
        const m = grouped[mode];
        html += `<div class="mb-2"><strong>${mode}:</strong> ${m.total_kg_co2e} kg CO2e</div>`;
      }
      html += `</div>`;

      const totalEl = document.getElementById('total'); if (totalEl) totalEl.textContent = total;
      const perEl = document.getElementById('per'); if (perEl) perEl.textContent = '';
      const factorEl = document.getElementById('factor'); if (factorEl) factorEl.textContent = '';
      const multEl = document.getElementById('mult'); if (multEl) multEl.textContent = '';

      // inject custom grouped HTML into result card body
      const container = resultCard.querySelector('.card-body');
      const info = container.querySelector('.grouped-info');
      if (info) info.remove();
      const div = document.createElement('div');
      div.className = 'grouped-info mt-3';
      div.innerHTML = html;
      container.appendChild(div);

      resultCard.classList.remove('d-none');

      // add to history list (keep last results)
      const hist = JSON.parse(localStorage.getItem('eco_history') || '[]');
      // create a readable label from segments
      const label = segments.map(s => `${s.mode} ${s.distance}km`).join(' + ');
      const item = { label, total: data.result.total_kg_co2e, grouped: data.result.grouped_by_mode, segments: data.result.segments || [] };
      hist.push(item);
      if (hist.length > 20) hist.shift();
      localStorage.setItem('eco_history', JSON.stringify(hist));
      renderHistory();
    } catch (err) {
      errorCard.textContent = err.message || String(err);
      errorCard.classList.remove('d-none');
    }
  });

  // dynamic add/remove segments
  const addBtn = document.getElementById('add-seg');
  addBtn.addEventListener('click', () => {
    const container = document.getElementById('segments-container');
    const first = container.querySelector('.segment');
    const clone = first.cloneNode(true);
    // reset values
    clone.querySelector('.distance').value = '10';
    clone.querySelector('.passengers').value = '1';
    container.appendChild(clone);
    attachRemove(clone);
  });

  function attachRemove(el) {
    const btn = el.querySelector('.remove-seg');
    btn.addEventListener('click', () => {
      const container = document.getElementById('segments-container');
      if (container.querySelectorAll('.segment').length > 1) {
        el.remove();
      }
    });
  }

  // attach remove to initial segment
  document.querySelectorAll('.segment').forEach(attachRemove);

  // History rendering
  const historyList = document.getElementById('history-list');
  function renderHistory() {
    const hist = JSON.parse(localStorage.getItem('eco_history') || '[]');
    if (!historyList) return;
    historyList.innerHTML = '';
    hist.slice().reverse().forEach((h, idx) => {
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center';
      // compute unique profiles used in this history entry
      const profiles = (h.segments || []).map(s => s.profile).filter(Boolean);
      const uniqProfiles = Array.from(new Set(profiles));
      li.innerHTML = `<div><strong>${h.label}</strong><div class="small">${h.total} kg CO2e · perfil: ${uniqProfiles.join(', ') || '—'}</div></div><div><button class="btn btn-sm btn-outline-secondary btn-copy" data-idx="${idx}">Reusar</button></div>`;
      historyList.appendChild(li);
    });
  }

  // reuse (copy) from history -> populates the first segment and shows results
  if (historyList) {
    historyList.addEventListener('click', (ev) => {
      const btn = ev.target.closest('.btn-copy');
      if (!btn) return;
      const idx = parseInt(btn.dataset.idx, 10);
      const hist = JSON.parse(localStorage.getItem('eco_history') || '[]');
      const item = hist.slice().reverse()[idx];
      if (!item) return;
      // populate segments container with the saved segments
      const container = document.getElementById('segments-container');
      if (!container) return;
      container.innerHTML = '';
      const segs = item.segments || [];
      if (segs.length === 0) {
        // fallback: keep one empty segment
        container.innerHTML = document.querySelector('.segment').outerHTML;
      } else {
        segs.forEach(s => {
          const first = document.createElement('div');
          first.className = 'segment mb-3 p-2 border rounded';
          first.innerHTML = `
            <div class="mb-2">
              <label class="form-label">Distância (km)</label>
              <input type="number" step="0.1" class="form-control distance" value="${s.distance}">
            </div>
            <div class="mb-2">
              <label class="form-label">Meio de Transporte</label>
              <select class="form-select mode">
                <option value="car">Carro</option>
                <option value="bus">Ônibus</option>
                <option value="train">Trem</option>
                <option value="plane">Avião</option>
              </select>
            </div>
            <div class="mb-2">
              <label class="form-label">Perfil</label>
              <select class="form-select profile">
                <option value="urban">Urbano</option>
                <option value="mixed">Misto</option>
                <option value="highway">Rodovia</option>
              </select>
            </div>
            <div class="mb-2">
              <label class="form-label">Passageiros</label>
              <input type="number" class="form-control passengers" value="${s.passengers || 1}" min="1">
            </div>
            <div class="text-end">
              <button type="button" class="btn btn-sm btn-outline-danger remove-seg">Remover</button>
            </div>
          `;
          container.appendChild(first);
          // set mode and profile values
          const modeEl = first.querySelector('.mode'); if (modeEl) modeEl.value = s.mode || 'car';
          const profEl = first.querySelector('.profile'); if (profEl) profEl.value = s.profile || 'mixed';
          attachRemove(first);
        });
      }
      // submit form to calculate with reused segments
      form.requestSubmit();
    });
  }

  // chart and clear history
  const chartBtn = document.getElementById('chart-btn');
  const clearBtn = document.getElementById('clear-history');
  let chartInstance = null;
  if (chartBtn) {
    chartBtn.addEventListener('click', () => {
    const hist = JSON.parse(localStorage.getItem('eco_history') || '[]');
    const all = hist; // include all history entries
    if (all.length === 0) return;
    const labels = all.map(h => h.label);
    // collect all modes
    const modesSet = new Set();
    all.forEach(h => {
      const g = h.grouped || {};
      Object.keys(g).forEach(m => modesSet.add(m));
    });
    const modes = Array.from(modesSet);
    const datasets = modes.map((mode, idx) => {
      const colorMap = {
        car: 'rgba(54,162,235,0.7)',
        bus: 'rgba(255,159,64,0.7)',
        train: 'rgba(75,192,192,0.7)',
        plane: 'rgba(255,99,132,0.7)'
      };
      const bg = colorMap[mode] || `hsl(${(idx*60)%360} 70% 50% / 0.7)`;
      return {
        label: mode,
        data: all.map(h => (h.grouped && h.grouped[mode]) ? h.grouped[mode].total_kg_co2e : 0),
        backgroundColor: bg,
      };
    });
    const ctxEl = document.getElementById('historyChart');
    if (!ctxEl) return;
    const ctx = ctxEl.getContext('2d');
    if (chartInstance) chartInstance.destroy();
    chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets,
      },
      options: {
        responsive: true,
        scales: { x: { stacked: true }, y: { stacked: true } },
        plugins: {
          tooltip: {
            callbacks: {
              footer: (items) => {
                if (!items.length) return '';
                const dataIndex = items[0].dataIndex;
                const entry = all[dataIndex];
                if (!entry) return '';
                const profiles = (entry.segments || []).map(s => s.profile).filter(Boolean);
                const uniq = Array.from(new Set(profiles));
                return 'Perfis: ' + (uniq.join(', ') || '—');
              }
            }
          }
        }
      }
    });
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
    localStorage.removeItem('eco_history');
    renderHistory();
    if (chartInstance) { chartInstance.destroy(); chartInstance = null; }
  });
  }

  // initial render
  renderHistory();
});
