# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

**Run CLI:**
```powershell
python -m eco_trip --distance 150 --mode car --profile mixed --passengers 1
python -m eco_trip --distance 150 --mode car --json
```

**Run web app (Flask, port 5000):**
```powershell
python web/app.py
```

**Run all tests:**
```powershell
python -m unittest discover -v
```

**Run a single test:**
```powershell
python -m unittest tests.test_calc.TestCalc.test_car_100km_single
```

**Install web dependencies:**
```powershell
pip install -r requirements.txt
```

## Architecture

The project has two independent layers:

### `eco_trip/` — Pure Python package (no web deps)
- `calc.py` — Core logic. `estimate_emissions(distance_km, mode, profile, passengers)` returns a dict with `total_kg_co2e` and `per_passenger_kg_co2e`. `estimate_segments(segments)` handles multi-leg trips and returns results grouped by mode.
- `cli.py` — `argparse`-based CLI wrapping `estimate_emissions`.
- Supported modes: `car`, `bus`, `train`, `plane` (auto-selects `plane_short` vs `plane_long` at 1500 km threshold).
- Supported profiles: `urban` (×1.2), `mixed` (×1.0), `highway` (×0.9). Unknown profiles silently fall back to ×1.0.

### `web/` — Flask UI
- `web/app.py` — Flask app; currently uses a module-level `app` instance (no factory). `tests/test_api.py` expects a `create_app()` factory — this is not yet implemented.
- `web/templates/index.html` — Single-page form; Material Design 3 themed.
- `web/static/css/m3-theme.css` — M3 CSS custom property tokens.
- `web/static/js/calculation/` — ES6 module tree following SOLID:
  - `services/EmissionFactorProvider.js` — emission factors and profile multipliers
  - `services/EmissionCalculator.js` — calculation logic (mirrors Python `calc.py`)
  - `models/EmissionResult.js` — result model
  - `ui/ResultGallery.js`, `ui/ResultSummaryCard.js`, `ui/ComparisonCard.js` — UI components
  - `utils/validators.js` — input validation
- `web/static/js/app.js` and `web/static/app.js` — entry points (two copies; `js/app.js` is the active one using ES6 imports).

### Test layout
- `tests/test_calc.py` — unit tests for `eco_trip.calc`; no external deps.
- `tests/test_api.py` — integration tests against Flask's test client; skipped automatically if `create_app` is unavailable.
