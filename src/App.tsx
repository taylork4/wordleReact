import { useState } from 'react'
import './App.css'
import './index.css'



function App() {
    const headingStyle = {
        fontSize: '100px',
        fontWeight: 'bold',
    };

    const [userWords, setUserWords] = useState<string[]>(Array(30).fill(""));
    const [letterColor, setLetterColor] = useState<string[]>(Array(30).fill(""));
    const [congrats, setCongrats] = useState(false);
    const [gameover, setGameover] = useState(false);

    const [checks, setChecks] = useState(0)
    const [secretWord, setSecretWord] = useState<string>(() => {
        const words: string[] = ['amber', 'brave', 'catch', 'dream', 'earth', 'flair', 'gloom', 'happy', 'image', 'juice', 'knack', 'latch', 'birth', 'notch', 'olive', 'peace', 'quirk', 'route', 'shrug', 'toast'];
        return words[Math.floor(Math.random() * words.length)];
    });

    function generateNewWord() {
        const words: string[] = ['amber', 'brave', 'catch', 'dream', 'earth', 'flair', 'gloom', 'happy', 'image', 'juice', 'knack', 'latch', 'birth', 'notch', 'olive', 'peace', 'quirk', 'route', 'shrug', 'toast'];
        const newWord = words[Math.floor(Math.random() * words.length)];
        setSecretWord(newWord);
      }

    function newGame() {
        generateNewWord();
        setCongrats(false);
        setGameover(false);
        setChecks(0);
        setUserWords(Array(30).fill(""))
        setLetterColor(Array(30).fill(""))
    }

    /*--------------------------------------------------------------------------------------------
        The checkAnswer() method is a word matching algorithm with built-in checks for
        duplicate letters.
    -------------------------------------------------------------------*/
    function checkAnswer() {
        // const secretWord = "dolly" //test word
        const cellLoc = 5 * checks;
        let tempArray: Array<string> = [];
        
        // Initializes the temporary array with the secret word separated by each individual character
        for (let i = 0; i < 5; i++) {
            // When a blank space exists in row, the user will not be able to check their results
            if (userWords[i + cellLoc] == "") {
                return;
            }
            tempArray.push(secretWord.charAt(i));
        }
    
        for (let i = 0; i < 5; i++) {
            // Checks if there is a correct letter in the correct location
            if (userWords[i + cellLoc].toLowerCase() == secretWord.charAt(i) && tempArray.includes(userWords[i + cellLoc].toLowerCase())) {
                letterColor[i + cellLoc] = "G" // Correct letter, correct location
                // Checks for duplicate letters in a word
                for (let j = 0; j < 5; j++) {
                    if (tempArray[j] == userWords[i + cellLoc].toLowerCase()) {
                        tempArray.splice(j, 1);
                        break;
                    }
                }
            // Checks if there is a correct letter in the wrong location
            } else if (secretWord.charAt(i) != userWords[i + cellLoc] && tempArray.includes(userWords[i + cellLoc].toLowerCase())) {
                letterColor[i + cellLoc] = "Y" // Correct letter, wrong location
                // Checks for duplicate letters in a word
                for (let j = 0; j < 5; j++) {
                    if (tempArray[j] == userWords[i + cellLoc].toLowerCase()) {
                        tempArray.splice(j, 1);
                        break;
                    }
                }
            // Sets color of cell with the wrong letter
            } else {
                letterColor[i + cellLoc] = "B"; // Wrong letter
            }
        }
        
        // After 6 guesses, the player loses
        setChecks(checks + 1);
    
        // Checks if player won 
        checkWin();
    
        if (checks == 6 && !congrats) {
            setGameover(true);
        }
        setUserWords([...userWords]);
    }

    function checkWin() {
        let numFound = 0;

        // Checks grid to see if player has won yet.
        for (let i = 0; i < 30; i++) {
          if (letterColor[i] == "G") {
            numFound++;
          }
          // Player wins when five letters in a row are correct.
          if (numFound == 5) {
            win();
          // Checks next row
          } else if ((i + 1) % 5 == 0) {
            numFound = 0;
          }
        }
      }
    /*--------------------------------------------------------------------------------------------
        The win() method allows congratulations screen to display and
        pauses timer.
    -------------------------------------------------------------------*/
    function win() {
        setCongrats(true);
    }

    return (
    <div className="App">
        <h1>Wordle in React</h1>
        <h1>
        <div id="grid">
        {userWords.map((w, pos) => (
            <p key={pos}>
            {letterColor[pos] === "" && (
            <input
                className="cell"
                value={userWords[pos]}
                onChange={(e) => {
                    const updatedUserWords = [...userWords];
                    updatedUserWords[pos] = e.target.value;
                    setUserWords(updatedUserWords);
                }}
                />
            )}
            {letterColor[pos] === "B" && (
                <input
                className="cell"
                id="wrong"
                value={userWords[pos]}
                onChange={(e) => {
                    const updatedUserWords = [...userWords];
                    updatedUserWords[pos] = e.target.value;
                    setUserWords(updatedUserWords);
                }}
                />
            )}
            {letterColor[pos] === "G" && (
                <input
                className="cell"
                id="right"
                value={userWords[pos]}
                onChange={(e) => {
                    const updatedUserWords = [...userWords];
                    updatedUserWords[pos] = e.target.value;
                    setUserWords(updatedUserWords);
                }}
                />
            )}
            {letterColor[pos] === "Y" && (
                <input
                className="cell"
                id="misplaced"
                value={userWords[pos]}
                onChange={(e) => {
                    const updatedUserWords = [...userWords];
                    updatedUserWords[pos] = e.target.value;
                    setUserWords(updatedUserWords);
                }}
                />
            )}
            </p>
        ))}

        </div>
        </h1>
        <div className="card">
            <br/>
            <div className="buttons">
                <button onClick={newGame}>New Game</button>
                {!congrats && !gameover && (
                <button onClick={checkAnswer}>Check Answer</button>
                )}
            </div>
            <br/>
        </div>
        <div className="report">
            <h1 style={headingStyle}> <b>Report:</b> </h1>
            <h5>
            Our word matching function first checks that the user has entered a
            complete five-letter word. Then it creates a temporary array with the
            letters of the secret word to check for duplicate letters in the user's
            word.
            It then loops through each letter in the user's word and compares it to
            the corresponding letter in the secret word. If the letters match and
            the letter is in the correct position, it assigns the "G" color code.
            If the letters match but are in the wrong position, it assigns the "Y"
            color code. If the letters do not match, it assigns the "B" color code.
            If the user's word contains a letter that is in the secret word, the function
            removes that letter from the temporary array to avoid counting it twice in
            the color codes.
            </h5>
            <h5>
            In this Vue3 template, a grid of input cells is displayed using an
            inline-grid layout with six rows and five columns. The "v-for" directive
            is used to iterate through the "userWords" array and display an input
            field for each element. The "v-model" directive is used to bind the
            input field to the corresponding element of the "userWords" array.

            Conditional rendering is used to change the background color of the
            input field based on the value of the "letterColor" array. Four different
            classes are defined in the "style" section, each with a different background
            color: black for the default cell, grey for a wrong letter, green for a
            correct letter in the right spot, and yellow for a correct letter in the
            wrong spot.
            </h5>
        </div>
    </div>
  )
}

export default App