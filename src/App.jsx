import './App.scss'
import Clocks from './components/Clocks'
import Calendar from './components/Calendar'
import { ReactComponent as Logo } from './assets/DRC_logo_SVG_horizontal_rgb.svg'
import Currencies from './components/Currencies'

function App() {

  return (
    <div className="App">
      <div id="content"> 
        <section id="icons"></section>
        <section id="middle">
          <Clocks />
          <br />
          <Currencies />
        </section>
        <section id="right">
          <div className="upper">
            <Calendar />
          </div>
          <div id="logo">
            <Logo />
          </div>
        </section>
        </div>
      <section id="taskbar"></section>
    </div>
  );
}
// offline-online indicator!
export default App;
