from flask import Flask, render_template, send_from_directory, request, jsonify
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from eco_trip.calc import estimate_emissions, estimate_segments


def create_app():
    app = Flask(__name__,
        template_folder=os.path.join(os.path.dirname(__file__), 'templates'),
        static_folder=os.path.join(os.path.dirname(__file__), 'static')
    )

    @app.route('/')
    def index():
        return render_template('index.html')

    @app.route('/static/<path:path>')
    def serve_static(path):
        return send_from_directory(app.static_folder, path)

    @app.route('/api/estimate', methods=['POST'])
    def estimate():
        data = request.get_json(force=True) or {}
        try:
            if 'segments' in data:
                result = estimate_segments(data['segments'])
            else:
                result = estimate_emissions(
                    data['distance'],
                    data['mode'],
                    data.get('profile', 'mixed'),
                    data.get('passengers', 1),
                )
        except (ValueError, KeyError, TypeError) as e:
            return jsonify({'ok': False, 'error': str(e)}), 400

        return jsonify({'ok': True, 'result': result})

    return app


app = create_app()

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)
