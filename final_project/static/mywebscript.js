function RunSentimentAnalysis() {
    const textToAnalyze = document.getElementById("textToAnalyze").value.trim();
    const system_response = document.getElementById("system_response");

    // Clear previous output
    system_response.innerHTML = "";

    // Check for empty input
    if (textToAnalyze === "") {
        system_response.innerHTML = 
            <div class="alert alert-warning" role="alert">
                ⚠️ Please enter some text before running sentiment analysis.
            </div>
        ;
        return;
    }

    const url = "/emotionDetector?textToAnalyze=" + encodeURIComponent(textToAnalyze);

    // Show loading spinner
    system_response.innerHTML = 
        <div class="text-center my-4">
            <div class="spinner-border text-primary" role="status"></div>
            <p>Analyzing emotions...</p>
        </div>
    ;

    fetch(url)
    .then(response => {
        if (!response.ok) throw new Error("Server error");
        return response.json();
    })
    .then(data => {
        if (data.error) {
            system_response.innerHTML = 
                <div class="alert alert-danger" role="alert">
                    ❌ ${data.error}
                </div>
            ;
            return;
        }

        const emotions = ['anger', 'disgust', 'fear', 'joy', 'sadness'];
        let html = '<div class="section-title">Emotion Scores</div><div class="row">';
        const emotionScores = [];

        emotions.forEach(emotion => {
            const score = data[emotion];
            const percent = (score * 100).toFixed(2);
            emotionScores.push({ emotion, percent });

            html += 
                <div class="col-md-6">
                    <div class="card emotion-card p-3 mb-3">
                        <div class="card-header text-capitalize">${emotion}</div>
                        <div class="card-body">
                            <p class="card-text">${percent}%</p>
                        </div>
                    </div>
                </div>
            ;
        });

        html += '</div>';
        /*
        // Display dominant emotion as text only (no percent or NaN)
        if (data.dominant_emotion) {
            html += 
                <div class="section-title mt-4">Dominant Emotion</div>
                <div class="dominant-emotion-box display-6 fw-bold text-center">
                    ${data.dominant_emotion.toUpperCase()}
                </div>
            ;
        }
        */
        // Optional: Add a Chart.js bar chart (uncomment if desired)
        /*
        html += 
            <div class="section-title mt-4">Emotion Chart</div>
            <canvas id="emotionChart" height="150"></canvas>;
        

        system_response.innerHTML = html;

        // Optional Chart.js rendering (if you uncommented above)
        
        const ctx = document.getElementById('emotionChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: emotionScores.map(e => e.emotion),
                datasets: [{
                    label: 'Emotion %',
                    data: emotionScores.map(e => e.percent),
                    backgroundColor: ['#ff4d4d', '#ff9933', '#9966cc', '#33cc33', '#6699ff']
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
        */

    })
    .catch(error => {
        system_response.innerHTML = 
            <div class="alert alert-danger" role="alert">
                ❌ Error while analyzing text. Please try again later.
            </div>
        ;
        console.error("Error:", error);
    });
}