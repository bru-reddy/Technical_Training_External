import { useEffect, useState } from "react";

export default function App() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const loadQuestions = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    setAnswers({});
    try {
      const response = await fetch("/api/questions");
      if (!response.ok) throw new Error("Could not load quiz questions.");
      const data = await response.json();
      setQuestions(data);
    } catch (err) {
      setError(err.message || "Could not connect to the server. Check that the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  const chooseAnswer = (questionId, option) => {
    if (result) return;
    setAnswers((current) => ({ ...current, [questionId]: option }));
  };

  const submitQuiz = async (event) => {
    event.preventDefault();
    if (Object.keys(answers).length !== questions.length) {
      setError("Please answer every question before submitting.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not submit the quiz.");
      setResult(data);
    } catch (err) {
      setError(err.message || "Something went wrong while submitting.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <main className="state-page"><div className="loader" /><p>Getting your quiz ready...</p></main>;
  }

  if (error && questions.length === 0) {
    return (
      <main className="state-page">
        <div className="state-icon">!</div>
        <h1>Quiz unavailable</h1>
        <p>{error}</p>
        <button className="button primary" onClick={loadQuestions}>Try again</button>
      </main>
    );
  }

  return (
    <main className="page">
      <header className="hero">
        <div className="brand"><span className="brand-mark">Q</span><span>quickquiz</span></div>
        <div className="hero-copy">
          <p className="eyebrow">TEST YOUR KNOWLEDGE</p>
          <h1>A little challenge.<br /><span>A lot to learn.</span></h1>
          <p className="hero-text">Take a few minutes, trust what you know, and see how you do.</p>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="art-circle circle-one" />
          <div className="art-circle circle-two" />
          <div className="art-card"><span>✦</span><strong>Think<br />clearly.</strong></div>
        </div>
      </header>

      <section className="quiz-area">
        <div className="quiz-heading">
          <div>
            <p className="eyebrow">YOUR QUIZ</p>
            <h2>{result ? "Here's how you did" : "Ready when you are"}</h2>
          </div>
          <div className="question-count"><strong>{questions.length}</strong><span>questions</span></div>
        </div>

        {result ? (
          <section className="result-panel">
            <div className="score-circle">
              <strong>{result.score}</strong>
              <span>of {result.total}</span>
            </div>
            <p className="eyebrow">QUIZ COMPLETE</p>
            <h2>{result.score === result.total ? "Perfect score!" : result.score >= result.total / 2 ? "Nice work!" : "Keep practising!"}</h2>
            <p className="result-description">You got {result.score} out of {result.total} questions correct.</p>
            <div className="review-list">
              {result.review.map((item, index) => (
                <article className={item.correct ? "review-item right" : "review-item wrong"} key={item.questionId}>
                  <div className="review-number">{String(index + 1).padStart(2, "0")}</div>
                  <div className="review-content">
                    <h3>{item.question}</h3>
                    <p>Your answer: <strong>{item.selectedAnswer ? item.selectedAnswer + ". " + item.selectedText : "Not answered"}</strong></p>
                    {!item.correct && <p className="correct-answer">Correct answer: <strong>{item.correctAnswer}. {item.correctText}</strong></p>}
                  </div>
                  <span className="review-status">{item.correct ? "Correct" : "Review"}</span>
                </article>
              ))}
            </div>
            <button className="button primary retake" onClick={loadQuestions}>Try the quiz again <span>↗</span></button>
          </section>
        ) : (
          <form onSubmit={submitQuiz}>
            <div className="progress-row">
              <span>{Object.keys(answers).length} of {questions.length} answered</span>
              <div className="progress-track"><div style={{ width: `${(Object.keys(answers).length / Math.max(questions.length, 1)) * 100}%` }} /></div>
            </div>
            <div className="question-list">
              {questions.map((question, index) => (
                <article className="question-card" key={question.id}>
                  <div className="question-top">
                    <span className="question-number">QUESTION {String(index + 1).padStart(2, "0")}</span>
                    <span className="point-label">1 point</span>
                  </div>
                  <h3>{question.text}</h3>
                  <div className="options">
                    {question.options.map((option) => (
                      <label className={`option ${answers[question.id] === option.key ? "selected" : ""}`} key={option.key}>
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={option.key}
                          checked={answers[question.id] === option.key}
                          onChange={() => chooseAnswer(question.id, option.key)}
                        />
                        <span className="option-key">{option.key}</span>
                        <span className="option-text">{option.text}</span>
                        <span className="option-check">{answers[question.id] === option.key ? "✓" : ""}</span>
                      </label>
                    ))}
                  </div>
                </article>
              ))}
            </div>
            {error && <p className="error-message">{error}</p>}
            <div className="submit-row">
              <p>Your score will appear after you submit your answers.</p>
              <button className="button primary" type="submit" disabled={submitting}>
                {submitting ? "Checking answers..." : "Submit quiz"} <span>↗</span>
              </button>
            </div>
          </form>
        )}
      </section>
      <footer><span>quickquiz</span><span>Learn something new every day.</span></footer>
    </main>
  );
}
