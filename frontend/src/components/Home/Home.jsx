import React, { useEffect } from 'react';
import {CgMouse} from "react-icons/all"
import "./Home.css"
import Product from "./Product.jsx"
import MetaData from '../layout/MetaData';
import {getProduct} from "../../actions/productActions";
import {useSelector ,useDispatch} from "react-redux"
const product ={
    name:"Tshirt",
    images:[{url:"https://i.ibb.co/DRST11n/1.webp"}],
    price: "500Rs",
    _id: "adilsgsjh"

}
const Home = () => {
  const dispatch = useDispatch();
  const {loading, error, products, productsCount}= useSelector((state)=>state.products);
  useEffect(()=>{dispatch(getProduct())},[dispatch]);
  return <>
    <MetaData title="Home Page"/>
    <div  className='banner'>
    <p>Welcome to my site</p>
    <h1>Find your products here</h1>
    <a href='#container'>
        <button>
            scroll <CgMouse/>
        </button>
    </a>

    </div>
    <div className="homeHeading">Featured Products</div>
    <div className="container" id="container">
      {products && products.map((product) =>{

    <Product product ={product}/>
      })}
    
    </div>
  </>;
};

export default Home;
