import { useState } from "react";
import API from "../api";

function AIRecommendation() {
  const [recommendation, setRecommendation] = useState("");
  const [loading, setLoading] = useState(false);

  const generateAI = async () => {
    try {
      setLoading(true);
      const res = await API.post("/api/ai/recommend");
      setRecommendation(res.data.recommendation);
    } catch (error) {
      setRecommendation(error.response?.data?.message || "AI recommendation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-card ai-section">
      <div className="card-header">
        <div>
          <h2>Smart AI Insights</h2>
          <p>Generate promotion, training, ranking, and feedback recommendations.</p>
        </div>

        <button className="primary-btn small" onClick={generateAI}>
          {loading ? "Generating..." : "✦ Generate New Insights"}
        </button>
      </div>

      <div className="insight-grid">
        <div className="small-insight">
          <h3>Training Opportunity</h3>
          <p>
            AI checks missing or weak skills and suggests learning improvements.
          </p>
        </div>

        <div className="small-insight">
          <h3>Promotion Recommendation</h3>
          <p>
            High performance employees are identified for promotion suggestions.
          </p>
        </div>

        <div className="small-insight">
          <h3>Improvement Feedback</h3>
          <p>
            Low score employees receive clear HR improvement feedback.
          </p>
        </div>
      </div>

      {recommendation && (
        <pre className="ai-output">{recommendation}</pre>
      )}
    </div>
  );
}

export default AIRecommendation;