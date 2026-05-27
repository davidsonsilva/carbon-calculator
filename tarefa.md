# Tarefa: Refatoração com Material Design 3 e Componentes de Resultado

## Entendimento dos Requisitos

1. **Design System**: Aplicar Material Design 3 (https://m3.material.io/) na interface
2. **Componente de Resultados**: Exibir 3 imagens representando os resultados do cálculo após clique em "Calcular"
3. **Lógica de Cálculo**: Criar/refatorar funções de cálculo seguindo princípios S.O.L.I.D.
4. **Entrega**: Criar `tarefa.md` para validação antes da implementação

## Plano de Implementação

### 1. Estrutura S.O.L.I.D. para Cálculos (eco_trip/calc.py)

```
- EmissionFactorProvider (SRP): Responsável único por fornecer fatores de emissão
- EmissionCalculator (OCP/LSP): Calcula emissões, extensível para novos modos
- ResultFormatter (ISP): Interface para formatar resultados (JSON, texto, UI)
- CarbonCalculationService (DIP): Orquestra cálculo injetando dependências
```

### 2. Componentes M3 para index.html

- **Elevation & Surface**: Cards com elevation levels para formulário e resultados
- **Color System**: Tokens M3 (primary, secondary, surface, error) via CSS variables
- **Typography**: Fontes Roboto com scales M3 (display, headline, body, label)
- **Components**:
  - `md-filled-button` para ação principal
  - `md-outlined-text-field` para inputs de origem/destino/distância
  - `md-elevated-card` para painel de resultados
  - `md-image-list` ou grid para exibir as 3 imagens de resultado

### 3. Exibição de Imagens de Resultado

- Criar container `<div id="resultImages">` oculto por padrão
- Após cálculo bem-sucedido:
  1. Mostrar painel de resultado existente
  2. Exibir 3 imagens em grid responsivo (M3 image list)
  3. Animação de fade-in com transition M3
- Imagens representando:
  1. Impacto ambiental (ex: árvores equivalentes)
  2. Comparativo com outros modos de transporte
  3. Sugestão de compensação/mitigação

### 4. Refatoração do JavaScript

- Separar responsabilidades:
  - `TransportSelector`: Gerencia seleção de cards de transporte
  - `DistanceHandler`: Lógica de preenchimento automático/manual de distância
  - `ResultRenderer`: Renderiza resultado textual e imagens
  - `FormValidator`: Valida inputs antes do cálculo
- Usar classes ES6 com injeção de dependência simples

### 5. Arquivos a Modificar/Criar

```
web/templates/index.html          # Refatorar HTML/CSS com M3
web/static/js/calculation/        # Nova pasta para lógica JS
  ├── services/CarbonService.js   # Serviço de cálculo (DIP)
  ├── models/EmissionResult.js    # Modelo de resultado (SRP)
  ├── ui/ResultGallery.js         # Componente de imagens (ISP)
  └── utils/validators.js         # Validações reutilizáveis
web/static/css/m3-theme.css       # Tokens M3 customizados
```

### 6. Observações sobre Imagens

- Não foram encontradas imagens no projeto via glob search
- Opções:
  a) Usuário fornece paths das 3 imagens → usar como src
  b) Usar placeholders do Material Design Icons
  c) Gerar imagens dinamicamente via canvas/SVG
- Assumirei paths: `/static/results/impact.png`, `/static/results/comparison.png`, `/static/results/offset.png`

## Critérios de Aceite

- [ ] Interface segue tokens visuais do Material Design 3
- [ ] 3 imagens de resultado exibidas após cálculo válido
- [ ] Código JS refatorado com separação clara de responsabilidades
- [ ] Funções de cálculo em Python seguem S.O.L.I.D.
- [ ] Responsividade mantida (mobile-first)
- [ ] Acessibilidade: labels, aria-attributes, contraste M3

## Próximos Passos (após validação)

1. Criar estrutura de pastas e arquivos JS
2. Implementar tokens M3 em CSS
3. Refatorar HTML com componentes M3
4. Implementar lógica S.O.L.I.D. em Python e JS
5. Integrar exibição de imagens no fluxo de resultado
6. Testar em diferentes viewports
