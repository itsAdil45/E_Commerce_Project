import React, { Fragment } from 'react'
import { useSelector , useDispatch } from 'react-redux'
import { getProduct, clearErrors } from '../../actions/productActions'
import Loader from '../layout/Loader'
import ProductCard from '../Home/ProductCard'
import { useEffect } from 'react'
import "./Products.css"
import { useParams } from 'react-router-dom'


const Products = () => {
    const{products, loading, error, productsCount} = useSelector((state)=>state.products);
    const dispatch = useDispatch();
    const params = useParams();
    const keyword = params.keyword
    useEffect(()=>{dispatch(getProduct(keyword))},[dispatch], keyword);
  return (
  <Fragment>{loading?<Loader/>:
      <Fragment>
          <h2 className='productsHeading'>Products</h2>
        <div className='products'>
        { products && products.map((product)=><ProductCard key={product._id} product ={product}/>)

        }
        </div>
      </Fragment>
      }
  </Fragment>
  )
}

export default Products