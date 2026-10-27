import { useEffect, useState } from "react";

export default function App() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function loadQuestions() {
    setError("");
    setResult(null);
    setAnswers({});
    try {
      const response = await fetch("/api/questions");
      if (!response.ok) throw new Error("Could not load questions.");
      setQuestions(await response.json());
    } catch {
      setError("Could not connect to the server. Make sure the backend is running.");
    }
  }

  useEffect(() => {
    loadQuestions();
  }, []);

  async function submitQuiz(event) {
    event.preventDefault();
    setError("");

    if (Object.keys(answers).length !== questions.length) {
      setError("Please answer every question.");
      return;
    }

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not submit answers.");
      setResult(data);
    } catch (err) {
      setError(err.message || "Could not submit the quiz.");
    }
  }

  return (
    <main className="container">
      <header>
        <h1>Online Quiz</h1>
        <p>Answer all questions and check your score.</p>
      </header>

      {error && <p className="error">{error}</p>}

      {!questions.length && !error && <p>Loading questions...</p>}

      {questions.length > 0 && !result && (
        <form onSubmit={submitQuiz}>
          {questions.map((question, index) => (
            <section className="question" key={question.id}>
              <h2>{index + 1}. {question.text}</h2>
              {question.options.map((option) => (
                <label className="option" key={option.key}>
                  <input
                    type="radio"
                    name={String(question.id)}
                    checked={answers[question.id] === option.key}
                    onChange={() => setAnswers({ ...answers, [question.id]: option.key })}
                  />
                  {option.key}. {option.text}
                </label>
              ))}
            </section>
          ))}
          <button type="submit">Submit Quiz</button>
        </form>
      )}

      {result && (
        <section className="result">
          <h2>Your Score: {result.score} / {result.total}</h2>
          <h3>Answers</h3>
          {result.review.map((item, index) => (
            <div className="review" key={item.questionId}>
              <p>{index + 1}. {item.question}</p>
              <p>Your answer: {item.selectedAnswer ? item.selectedAnswer + ". " + item.selectedText : "Not answered"}</p>
              <p>Correct answer: {item.correctAnswer}. {item.correctText}</p>
              <strong>{item.correct ? "Correct" : "Incorrect"}</strong>
            </div>
          ))}
          <button type="button" onClick={loadQuestions}>Try Again</button>
        </section>
      )}
    </main>
  );
}