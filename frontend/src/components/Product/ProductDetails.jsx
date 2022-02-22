import React, { Fragment, useEffect, useState } from "react";
import Carousel from "react-material-ui-carousel";
import { useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getProductDetails } from "../../actions/productActions";
import "./productDetails.css"
import ReactStars from "react-rating-stars-component";
import Loader from "../layout/Loader";
import ReviewCard from "./ReviewCard.js"
import { useAlert } from "react-alert";

const ProductDetails = ({ match }) => {
  const dispatch = useDispatch();
  const params = useParams()
  const alert = useAlert()

  const { product, loading, error } = useSelector(
    (state) => state.productDetails
  );

  const options = {
    edit: false,
    color: "rgba(20,20,20,0.1)",
    activeColor: "tomato",
    size: window.innerWidth < 600 ? 20 : 25,
    value: product.ratings,
    isHalf: true,
  };
  useEffect(() => {
    if(error){
      alert.error(error);
      dispatch(clearErrors())
    }
    dispatch(getProductDetails(params.id));
  }, [dispatch], params.id , error, alert);

  return (
    <Fragment>
      {loading? <Loader/>:(      <Fragment>
        <div className="ProductDetails">

          <div className="myimg">
            <Carousel>
              {product.images &&
                product.images.map((item, i) => (
                  <img
                    className="CarouselImage"
                    key={i}
                    src={item.url}
                    alt={`${i} Slide`}
                  />
                ))}
            </Carousel>
          </div>

          <div>
            <div className="detailsblock-1">

              <h2>{product.name}</h2>
              <p>Product# {product._id}</p>
            </div>

            <div className="detailsblock-2">
              <ReactStars {...options} /> <span>({product.noOfReviews} Reviews)</span>
            </div>

            <div className="detailsblock-3">
              <h1>{`Rs${product.price}`}</h1>
              <div className="detailsblock-3-1">
                <div className="detailsblock-3-1-1">
                  <button>-</button>
                  <input type="number" value="1" />
                  <button>+</button>
                </div>{" "}
                <button>Add to Cart</button>
              </div>
              <p>
                <b className={product.stock < 1 ? "reqColor" : "greenColor"}>
                  {product.stock < 1 ? "out of stock" : "In stock"}
                </b>
              </p>
            </div>
            <div className="detailsblock-4">
              Description: <p>{product.description}</p>
            </div>
            <button className="submitReview">Submit Review</button>
          </div>
        </div>
        <h3 className="reviewHeading">REVIEWS</h3>
        <div className="reviews">
        {
          product.review && product.review[0] ? (product.review.map((review) => <ReviewCard review={review} />)) : 
          (<p className="noReviews">No Review Yet</p> )
        }
        </div>

      </Fragment>)}


    </Fragment>
  );
};

export default ProductDetails;