import './App.css';
import Header from "./components/layout/Header.js"
import Footer from "./components/layout/Footer.js"
import Home from "./components/Home/Home.jsx"

import {BrowserRouter as Router, Routes ,Route} from "react-router-dom"
function App() {
  return (
    <Router>

<Header/>
<Routes>

<Route exact path="/" element ={<Home/>}/>
</Routes>
<Footer/>
    </Router>
  );
}

export default App;
