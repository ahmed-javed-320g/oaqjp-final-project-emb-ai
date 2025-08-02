"""
Flask application for emotion detection using Watson NLP.
"""
from flask import Flask, request, render_template
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
    Returns a formatted string of emotion scores and dominant emotion,
    or an error message if input is invalid.
    """
    text_to_analyze = request.args.get('textToAnalyze')
    # Defensive fallback for missing text
    if not text_to_analyze:
        return "Invalid text! Please try again!"
    try:
        result = emotion_detector(text_to_analyze)
        # Check for None dominant emotion (invalid input)
        if result['dominant_emotion'] is None:
            return "Invalid text! Please try again!"
        formatted_result = (
            f"For the given statement, the system response is "
            f"'anger': {result['anger']}, "
            f"'disgust': {result['disgust']}, "
            f"'fear': {result['fear']}, "
            f"'joy': {result['joy']} and "
            f"'sadness': {result['sadness']}. "
            f"The dominant emotion is {result['dominant_emotion']}."
        )
        return formatted_result
    except (KeyError, TypeError, ValueError):
        # Generic error message, can log e for debugging
        return "Invalid text! Please try again!"
if __name__ == "__main__":
    app.run(debug=True)