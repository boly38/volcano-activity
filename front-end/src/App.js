import Menu from './core/Menu.js';
import MainContent from './core/MainContent.js';
import './assets/css/entity.css';
import './assets/css/react-overrides.css';
import './App.css';
// bootstrap
import 'bootstrap/dist/css/bootstrap.css';
function App() {
    return (
        <div className="App">
            <Menu/>
            <div className="backgroundCredit">
                <a href="https://pixabay.com/fr/photos/costa-rica-volcan-paysage-costa-2580657/" target="_pb">costa rica - volcan - paysage</a> - <a href="https://pixabay.com/fr/users/kristendawn-5971956/" target="_pb">kristendawn</a> via pixabay</div>
            <MainContent/>
        </div>
    );
}

export default App;
