import Menu from './core/Menu.js';
import MainContent from './core/MainContent.js';
import './App.css';

function App() {
    return (
        <div className="App" id="app-main-container">
            <Menu/>
            <MainContent/>
            <div className="backgroundCredit">
                <a href="https://pixabay.com/fr/photos/costa-rica-volcan-paysage-costa-2580657/" target="_pb">costa rica - volcan - paysage</a> - <a href="https://pixabay.com/fr/users/kristendawn-5971956/" target="_pb">kristendawn</a> via pixabay</div>
        </div>
    );
}

export default App;
