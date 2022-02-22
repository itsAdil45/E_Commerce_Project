import './App.css';
import Header from "./components/layout/Header.js"
import Footer from "./components/layout/Footer.js"
import Home from "./components/Home/Home.jsx"
import ProductDetails from "./components/Product/ProductDetails.jsx"
import Search from "./components/Product/Search.js"

import {BrowserRouter as Router, Routes ,Route} from "react-router-dom"
import Products from './components/Product/Products.js';
function App() {
  return (
    <Router>

<Header/>
<Routes>

<Route exact path="/" element ={<Home/>}/>
<Route exact path="/product/:id" element ={<ProductDetails/>}/>
<Route exact path="/products" element ={<Products/>}/>
<Route exact path="/search" element ={<Search/>}/>
</Routes>
<Footer/>
    </Router>
  );
}

export default App;
