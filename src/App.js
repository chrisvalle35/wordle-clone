import "./App.css";
import GameBoard from "./game/gameBoard";

function App() {
  return (
    <>
      <div className="title">
        <h1>Wordle</h1>
      </div>
      <div className="board">
        <GameBoard />
      </div>
    </>
  );
}

export default App;
