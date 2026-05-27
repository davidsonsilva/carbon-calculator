import unittest

try:
    from web.app import create_app
except Exception:
    create_app = None


class APITest(unittest.TestCase):
    def setUp(self):
        if create_app is None:
            self.skipTest('Flask not available in this environment')
        self.app = create_app().test_client()

    def test_estimate_api(self):
        payload = {'distance': 100, 'mode': 'car', 'profile': 'mixed', 'passengers': 1}
        rv = self.app.post('/api/estimate', json=payload)
        self.assertEqual(rv.status_code, 200)
        data = rv.get_json()
        self.assertTrue(data['ok'])
        self.assertIn('result', data)
        self.assertAlmostEqual(data['result']['total_kg_co2e'], 0.192 * 100, places=6)

    def test_estimate_segments(self):
        payload = {
            'segments': [
                {'distance': 50, 'mode': 'car', 'profile': 'mixed', 'passengers': 1},
                {'distance': 200, 'mode': 'train', 'profile': 'mixed', 'passengers': 1},
                {'distance': 30, 'mode': 'car', 'profile': 'urban', 'passengers': 1},
            ]
        }
        rv = self.app.post('/api/estimate', json=payload)
        self.assertEqual(rv.status_code, 200)
        data = rv.get_json()
        self.assertTrue(data['ok'])
        res = data['result']
        # check grouped_by_mode contains car and train
        self.assertIn('car', res['grouped_by_mode'])
        self.assertIn('train', res['grouped_by_mode'])
        car_total = res['grouped_by_mode']['car']['total_kg_co2e']
        train_total = res['grouped_by_mode']['train']['total_kg_co2e']
        self.assertAlmostEqual(car_total, round(0.192*50 + 0.192*30*1.2,6), places=6)
        self.assertAlmostEqual(train_total, round(0.041*200,6), places=6)


if __name__ == '__main__':
    unittest.main()
