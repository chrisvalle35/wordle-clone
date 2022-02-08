import "./App.css";
import GameBoard from "./game/gameBoard";

function App() {
  return (
    <div className="container">
      <main>
        <h1 className="title">Wordle</h1>

        <div className="grid">
          <div className="card">
            <GameBoard />
          </div>
        </div>
      </main>

      <footer>
        <a
          href="https://chrisvalle.io"
          target="_blank"
          rel="noopener noreferrer"
        >
          A Chrisco Product <br /> Moar Content Plz
        </a>
      </footer>
    </div>
  );
}

export default App;
