import { useState } from 'react'
import axios, {AxiosResponse} from 'axios'
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

    const [checks, setChecks] = useState(0);
    const [secretWord, setSecretWord] = useState<string>("");
    const [started, setStarted] = useState(false);

    type WordleResponse = {
        word: string
    }
    
    //Stop getting requests on start
    if (started == false) {
        setStarted(true);
        axios.request({method: "GET", url: "https://wordlereact.onrender.com/wordleReact"})
        .then((res:AxiosResponse) => res.data)
            .then((w: WordleResponse) => {
                console.log(`The secret word from server is ${w.word}`)
                setSecretWord(w.word);
            }   
        )
    }
    /*--------------------------------------------------------------------------------------------
    The newGame() method initializes the next Wordle game.
        ~ The timer gets reset and restarted
        ~ A new secret word gets set
        ~ All cells get reset
        ~ Game over/win conditions reset
    -------------------------------------------------------------------*/
    async function newGame() {
        axios.request({method: "GET", url: "https://wordlereact.onrender.com/wordleReact"})
            .then((res:AxiosResponse) => res.data)
                .then((w: WordleResponse) => {
                    console.log(`The secret word from server is ${w.word}`)
                    console.log(w.word);
                    setSecretWord(w.word);
                    setCongrats(false);
                    setGameover(false);
                    setChecks(0);
                    setUserWords(Array(30).fill(""));
                    setLetterColor(Array(30).fill(""));
                }
        )
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
        
        if (checks == 5 && !congrats) {
            setGameover(true);
        }
        setUserWords([...userWords]);
    }

    /*--------------------------------------------------------------------------------------------
        The checkWin() method verifies if the user got the correct answer
        before using up all of the guesses
    -------------------------------------------------------------------*/
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
        <h1> Wordle in React </h1>
        <br></br>
        <h2> Developed by: </h2>
        <h3> Cameron Snoap </h3>
        <h3> Kyle Taylor </h3>
        <h1>
            <div id="grid">
            {userWords.map((w, pos) => (
                <p key={pos}>
                    {letterColor[pos] === "" && (
                    <input className="cell" value={userWords[pos]} onChange={(e) => {
                            const updatedUserWords = [...userWords];
                            updatedUserWords[pos] = e.target.value;
                            setUserWords(updatedUserWords);
                        }}
                    />)}
                    {letterColor[pos] === "B" && (
                        <input className="cell" id="wrong" value={userWords[pos]} onChange={(e) => {
                            const updatedUserWords = [...userWords];
                            updatedUserWords[pos] = e.target.value;
                            setUserWords(updatedUserWords);
                        }}
                    />)}
                    {letterColor[pos] === "G" && (
                        <input className="cell" id="right" value={userWords[pos]} onChange={(e) => {
                            const updatedUserWords = [...userWords];
                            updatedUserWords[pos] = e.target.value;
                            setUserWords(updatedUserWords);
                        }}
                    />)}
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
                    />)}
                </p>
            ))}
            </div>
        </h1>
        <h2>
            {congrats ? (
                <div>
                    <h1> 🎊 Congratulations! You Win! 🎊 </h1>
                    <h2> Tap the 'New Game' button to play again! </h2>
                </div>
            ) : gameover ? (
                <div>
                    <h1> 😔 Game Over! No more guesses left! 😔 </h1>
                    <h2> The word was '{secretWord}' </h2>
                    <h2> Tap the 'New Game' button to play again! </h2>
                </div>
            ) : null}
        </h2>

        <div className="card">
            <br/>
            <div className="buttons">
                <button onClick={newGame}> New Game </button>
                {!congrats && !gameover && (<button onClick={checkAnswer}> Check Answer </button>)}
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
            In this React template, a grid of input cells is displayed using an
            inline-grid layout with six rows and five columns. The userWords.map
            function binds the user entered input to an input field for each 
            element. Then, when the input changes, it gets detected by the onChange
            event handler.
            
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