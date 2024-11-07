import React from 'react';

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

    // Default to level 1 image if the level is not found
    const buddyImage = levelImages[level] || levelImages[Object.keys(levelImages).length];


    // Calculate progress as a percentage toward the next level
    const progressPercentage = (studyTime % 60) / 60 * 100;

    return (
        <div>
            <h2>Your Study Buddy</h2>
            <p>Level: {level}</p>
            
            <div style={{ width: '100%', height: '30px', backgroundColor: '#e0e0e0' }}>
                <div
                    style={{
                        width: `${progressPercentage}%`,
                        height: '100%',
                        backgroundColor: 'green',
                        transition: 'width 0.5s ease',
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