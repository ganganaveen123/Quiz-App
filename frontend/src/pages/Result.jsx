import { useLocation, useNavigate } from "react-router-dom";
import "./Result.css";

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { score, total, questions, answers } = location.state || {};

  if (!questions || !answers) {
    return (
      <div className="result-container">
        <h2>Invalid Access</h2>
        <button onClick={() => navigate("/")}>Go Home</button>
      </div>
    );
  }

  return (
    <div className="result-container">
      <div className="result-box">
        <h1 className="result-title">Quiz Result</h1>
        <h2 className="result-score">
          Score: {score} / {total}
        </h2>

        <div className="review-section">
          {questions.map((q, index) => {
            const userAnswer = answers[index];
            const answer = q.answer;

            return (
              <div key={index} className="review-question">
                <p className="review-question-text">
                  {index + 1}. {q.question}
                </p>

                <p
                  className={`review-answer ${
                    userAnswer === answer ? "correct" : "wrong"
                  }`}
                >
                  Your Answer: {userAnswer || "Not answered"}
                </p>
                <p className="review-correct-answer">
                  Correct Answer: {answer}
                </p>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button onClick={() => navigate("/courses")} className="back-button">
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Result;
