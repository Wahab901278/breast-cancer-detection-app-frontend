import React, { useState } from "react";
import axios from "axios";
import "./styles/CourseDetails.css";
import { formatText } from "./utils";
import "./styles/utils.css";
// Custom styling for the details page

const Mammography = () => {
  const [file, setFile] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPrecautions, setShowPrecautions] = useState(false); // New state for precautions

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
    setPrediction(null);
    setShowPrecautions(false); // Reset precautions visibility on new file select
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "https://wahab07-breast-cancer-app-backend.hf.space/mammography/predict_mammography",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setPrediction(response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
      setError(error.response?.data?.error || "Error processing the image");
    } finally {
      setLoading(false);
    }
  };

  const handlePrecautionsClick = () => {
    setShowPrecautions(!showPrecautions); // Toggle precautions visibility
  };

  return (
    <section className="course-details">
      <div className="container">
        <h1>MammoGuard - Upload Mammograph</h1>
        <p>Upload your Mammograph to get a prediction.</p>

        <form onSubmit={handleSubmit}>
          <input
            type="file"
            onChange={handleFileChange}
            accept=".png,.jpg,.jpeg"
          />
          <button
            type="submit"
            className="btn btn-primary"
            style={{ backgroundColor: "#6c63ff", borderColor: "#6c63ff" }}
            disabled={loading || !file}
          >
            {loading ? "Processing..." : "Upload"}
          </button>
        </form>

        {error && (
          <div
            className="error-message"
            style={{ color: "red", marginTop: "1rem" }}
          >
            {error}
          </div>
        )}

        {prediction && (
          <div className="prediction-result">
            <h2>Prediction Result:</h2>
            <p>Class: {prediction.class}</p>
            <p>Confidence: {prediction.confidence}</p>
            <button
              type="button"
              className="btn btn-primary"
              style={{ backgroundColor: "#6c63ff", borderColor: "#6c63ff" }}
              onClick={handlePrecautionsClick} // Updated to handle precautions click
            >
              Precautions and Suggestions
            </button>

            {showPrecautions && ( // Conditionally render precautions based on state
              <div className="precautions">
                <div
                  className="precautions-content"
                  dangerouslySetInnerHTML={{
                    __html: formatText(prediction.explanation),
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Mammography;
