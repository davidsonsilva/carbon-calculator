import unittest

from eco_trip.calc import estimate_emissions, estimate_segments


class TestCalc(unittest.TestCase):
    def test_car_100km_single(self):
        r = estimate_emissions(100, 'car', 'mixed', 1)
        self.assertAlmostEqual(r['total_kg_co2e'], 0.192 * 100, places=6)

    def test_plane_short_vs_long(self):
        r_short = estimate_emissions(500, 'plane', 'mixed', 1)
        r_long = estimate_emissions(2000, 'plane', 'mixed', 1)
        self.assertAlmostEqual(r_short['total_kg_co2e'], 0.254 * 500, places=6)
        self.assertAlmostEqual(r_long['total_kg_co2e'], 0.146 * 2000, places=6)

    def test_negative_distance_raises(self):
        with self.assertRaises(ValueError):
            estimate_emissions(-10, 'car', 'mixed', 1)

    def test_zero_passengers_raises(self):
        with self.assertRaises(ValueError):
            estimate_emissions(100, 'car', 'mixed', 0)

    def test_invalid_mode_raises(self):
        with self.assertRaises(ValueError):
            estimate_emissions(100, 'bicycle', 'mixed', 1)

    def test_unknown_profile_uses_default(self):
        r = estimate_emissions(100, 'car', 'unknown_profile', 1)
        self.assertEqual(r['multiplier'], 1.0)

    def test_multiple_passengers(self):
        r = estimate_emissions(100, 'car', 'mixed', 4)
        self.assertAlmostEqual(r['per_passenger_kg_co2e'], (0.192 * 100) / 4, places=6)

    def test_profile_multipliers(self):
        r_urban = estimate_emissions(100, 'car', 'urban', 1)
        r_highway = estimate_emissions(100, 'car', 'highway', 1)
        self.assertAlmostEqual(r_urban['total_kg_co2e'], 0.192 * 100 * 1.2, places=6)
        self.assertAlmostEqual(r_highway['total_kg_co2e'], 0.192 * 100 * 0.9, places=6)

    def test_estimate_segments(self):
        segments = [
            {'distance': 100, 'mode': 'car', 'profile': 'mixed', 'passengers': 1},
            {'distance': 50, 'mode': 'train', 'profile': 'urban', 'passengers': 2},
        ]
        result = estimate_segments(segments)
        self.assertEqual(len(result['segments']), 2)
        self.assertIn('total_kg_co2e', result)
        self.assertIn('grouped_by_mode', result)

    def test_estimate_segments_invalid_input(self):
        with self.assertRaises(ValueError):
            estimate_segments("not a list")


if __name__ == '__main__':
    unittest.main()
