import React, { useEffect } from 'react';
import {CgMouse} from "react-icons/all"
import "./Home.css"
import ProductCard from './ProductCard';
import MetaData from '../layout/MetaData';
import {clearErrors, getProduct} from "../../actions/productActions";
import {useSelector ,useDispatch} from "react-redux"
import Loader from '../layout/Loader';
import { useAlert } from 'react-alert';
const Home = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const {loading, error, products, productsCount}= useSelector((state)=>state.products);
  useEffect(()=>{
    if(error){
      alert.error(error);
      dispatch(clearErrors)
    }
    dispatch(getProduct())
  },[dispatch,error,alert]);
  return <>
  {loading? (<Loader/>):(<>
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
    {products &&
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
    
    </div>
  </>)}
  
  
  
  
  </>
};

export default Home;
