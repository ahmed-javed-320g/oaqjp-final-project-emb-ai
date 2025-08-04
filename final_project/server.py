"""
Flask application for emotion detection using Watson NLP.
"""

from flask import Flask, request, render_template, jsonify
from EmotionDetection import emotion_detector

app = Flask(__name__)


@app.route('/')
def index():
    """
    Render the main index page.
    """
    return render_template('index.html')


@app.route("/emotionDetector", methods=["GET"])
def detect_emotion():
    """
    Handle GET requests to perform emotion detection on user-provided text.
    Returns JSON with emotion scores and dominant emotion.
    """
    text_to_analyze = request.args.get('textToAnalyze')

    if not text_to_analyze:
        return jsonify({'error': 'Empty input'}), 400

    try:
        result = emotion_detector(text_to_analyze)

        if not result or result.get('dominant_emotion') is None:
            return jsonify({'error': 'Could not detect emotion'}), 400

        # ✅ Return clean JSON
        return jsonify({
            "anger": result['anger'],
            "disgust": result['disgust'],
            "fear": result['fear'],
            "joy": result['joy'],
            "sadness": result['sadness'],
            "dominant_emotion": result['dominant_emotion']
        })

    except Exception as e:
        return jsonify({'error': 'Server error', 'details': str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
