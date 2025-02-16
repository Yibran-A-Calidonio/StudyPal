import { useState } from "react";
import "./Flashcards.css"; // Import CSS for styling

const Flashcards = () => {
  const [flashcards, setFlashcards] = useState([
    { question: "What is 2+2?", answer: "4" },
    { question: "Capital of France?", answer: "Paris" },
    { question: "What does CPU stand for?", answer: "Central Processing Unit" },
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false); // Prevents spam clicks

  const nextIndex = (currentIndex + 1) % flashcards.length;
  const prevIndex = currentIndex === 0 ? flashcards.length - 1 : currentIndex - 1;

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    setTimeout(() => {
      setIsFlipped(false);
      setCurrentIndex(nextIndex);
      setIsAnimating(false);
    }, 400);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    setTimeout(() => {
      setIsFlipped(false);
      setCurrentIndex(prevIndex);
      setIsAnimating(false);
    }, 400);
  };

  const handleChange = (e, field) => {
    const updatedFlashcards = [...flashcards];
    updatedFlashcards[currentIndex][field] = e.target.value;
    setFlashcards(updatedFlashcards);
  };

  const handleAddFlashcard = () => {
    setFlashcards([...flashcards, { question: "", answer: "" }]);
    setCurrentIndex(flashcards.length);
  };

  return (
    <div className="flashcards-container">
      <h2>Flashcards</h2>

      <div className="flashcard-stack">
        {/* Back card (Next card data) */}
        {flashcards.length > 1 && (
          <div className={`flashcard back-card ${isAnimating ? "incoming" : ""}`}>
            <div className="flashcard-content">
              <h3 className="flashcard-label">Next: {isFlipped ? "Answer" : "Question"}</h3>
              <p>{isFlipped ? flashcards[nextIndex].answer : flashcards[nextIndex].question}</p>
            </div>
          </div>
        )}

        {/* Front card (Active Card) */}
        <div className={`flashcard front-card ${isAnimating ? "disappearing" : ""}`}>
          {!isFlipped ? (
            <div className="flashcard-content front">
              <h3 className="flashcard-label">Question</h3>
              <textarea
                placeholder="Enter question..."
                value={flashcards[currentIndex].question}
                onChange={(e) => handleChange(e, "question")}
              />
            </div>
          ) : (
            <div className="flashcard-content back">
              <h3 className="flashcard-label">Answer</h3>
              <textarea
                placeholder="Enter answer..."
                value={flashcards[currentIndex].answer}
                onChange={(e) => handleChange(e, "answer")}
              />
            </div>
          )}
        </div>
      </div>

      <div className="flashcard-buttons">
        <button onClick={handlePrev}>Prev</button>
        <button onClick={() => setIsFlipped(!isFlipped)}>Flip</button>
        <button onClick={handleNext}>Next</button>
        <button onClick={handleAddFlashcard}>➕ Add</button>
      </div>
    </div>
  );
};

export default Flashcards;
