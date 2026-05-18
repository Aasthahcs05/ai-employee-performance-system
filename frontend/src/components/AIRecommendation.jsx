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
    <div className="card">
      <h2>AI Recommendation Display Page</h2>

      <button onClick={generateAI}>
        {loading ? "Generating..." : "Generate AI Recommendation"}
      </button>

      {recommendation && (
        <pre className="ai-box">{recommendation}</pre>
      )}
    </div>
  );
}

export default AIRecommendation;