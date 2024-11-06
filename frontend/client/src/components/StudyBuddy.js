import React from 'react';

// Import the study buddy images
import level1Image from '../assets/study-buddy/level1.png';
import level2Image from '../assets/study-buddy/level2.png';
import level3Image from '../assets/study-buddy/level3.png';
import level4Image from '../assets/study-buddy/level4.png';
import level5Image from '../assets/study-buddy/level5.png';
import level6Image from '../assets/study-buddy/level6.png';
// Add more images as needed for higher levels

const StudyBuddy = ({ studyTime, level }) => {
    // Map the level to the corresponding image
    const levelImages = {
        1: level1Image,
        2: level2Image,
        3: level3Image,
        4: level4Image,
        5: level5Image,
        6: level6Image,
        // Add more levels as needed
    };

    // Default to the highest available level if the level exceeds defined images
    const buddyImage = levelImages[level] || levelImages[Object.keys(levelImages).length];

    return (
        <div>
            <h2>Your Study Buddy</h2>
            <p>Level: {level}</p>
            <p>Total Study Time: {studyTime} minutes</p>
            <div style={{ width: '100%', height: '30px', backgroundColor: '#e0e0e0' }}>
                <div
                    style={{
                        width: `${(studyTime % 60) / 60 * 100}%`,
                        height: '100%',
                        backgroundColor: 'green',
                        transition: 'width 0.5s ease', // Smooth transition for visual effect
                    }}
                ></div>
            </div>
            <div>
                <img
                    src={buddyImage}
                    alt={`Study Buddy Level ${level}`}
                    style={{ width: '200px', height: 'auto', marginTop: '20px' }}
                />
            </div>
        </div>
    );
};

export default StudyBuddy;