export class ResultGallery {
  #container;
  #imagePaths;

  constructor(containerId, imagePaths = []) {
    this.#container = document.getElementById(containerId);
    this.#imagePaths = imagePaths;
  }

  render(result) {
    if (!this.#container) return;

    const images = [
      { src: this.#imagePaths[0] || '/static/results/impact.png', caption: `${result.equivalentTrees} árvores para compensar` },
      { src: this.#imagePaths[1] || '/static/results/comparison.png', caption: 'Comparativo com outros modos' },
      { src: this.#imagePaths[2] || '/static/results/offset.png', caption: 'Sugestões de mitigação' }
    ];

    this.#container.innerHTML = `
      <div class="m3-image-grid">
        ${images.map(img => `
          <div class="m3-image-card">
            <img src="${img.src}" alt="${img.caption}" onerror="this.parentElement.innerHTML='<div style=\"height:160px;background:#e6f4ea;display:flex;align-items:center;justify-content:center;color:#15803d;font-weight:600\">${img.caption}</div>'">
            <div class="caption">${img.caption}</div>
          </div>
        `).join('')}
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