import { useState } from "react";
import "./Flashcards.css"; // Import CSS for notebook styling

const Flashcards = () => {
  const [flashcards, setFlashcards] = useState([
    { question: "", answer: "" }, // Start with one blank flashcard
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [tilt, setTilt] = useState(""); // State to manage tilt direction

  const handleNext = () => {
    setTilt("tilt-right");
    setTimeout(() => {
      setIsFlipped(false);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
      setTilt(""); // Reset tilt after switching
    }, 300);
  };

  const handlePrev = () => {
    setTilt("tilt-left");
    setTimeout(() => {
      setIsFlipped(false);
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? flashcards.length - 1 : prevIndex - 1
      );
      setTilt(""); // Reset tilt after switching
    }, 300);
  };

  const handleChange = (e, field) => {
    const updatedFlashcards = [...flashcards];
    updatedFlashcards[currentIndex][field] = e.target.value;
    setFlashcards(updatedFlashcards);
  };

  const handleAddFlashcard = () => {
    setFlashcards([...flashcards, { question: "", answer: "" }]);
    setCurrentIndex(flashcards.length); // Move to the new card
  };

  return (
    <div className="flashcards-container">
      <h2>Flashcards</h2>

      <div id="notebook-paper">
        <div className={`flashcard ${isFlipped ? "flipped" : ""} ${tilt}`}>
          {!isFlipped ? (
            <div className="flashcard-content front">
              
              <textarea
                placeholder="Enter question..."
                value={flashcards[currentIndex].question}
                onChange={(e) => handleChange(e, "question")}
              />
            </div>
          ) : (
            <div className="flashcard-content back">
              
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
