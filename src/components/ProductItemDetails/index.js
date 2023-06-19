// Write your code here
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Cookies from 'js-cookie'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productList: [],
    quantity: 1,
    similarProductsData: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProductDetails()
  }

  getFormattedData = data => ({
    availability: data.availability,
    brand: data.brand,
    description: data.description,
    id: data.id,
    imageUrl: data.image_url,
    price: data.price,
    rating: data.rating,

    style: data.style,
    title: data.title,
    totalReviews: data.total_reviews,
  })

  getProductDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    // this.state({apiStatus: apiStatusConstants.inProgress})

    const token = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
    }

    const url = `https://apis.ccbp.in/products/${id}`

    const response = await fetch(url, options)

    if (response.ok === true) {
      const data = await response.json()
      const updatedData = this.getFormattedData(data)

      const updatedSimilarProductsData = data.similar_products.map(
        eachSimilarProduct => this.getFormattedData(eachSimilarProduct),
      )

      this.setState({
        productList: updatedData,
        similarProductsData: updatedSimilarProductsData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onIncrease = () => {
    this.setState(prevState => ({quantity: prevState.quantity + 1}))
  }

  onDecrease = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevState => ({quantity: prevState.quantity - 1}))
    }
  }

  renderSuccessView = () => {
    const {productList, quantity, similarProductsData} = this.state
    const {
      availability,
      brand,
      description,
      imageUrl,
      price,
      rating,
      title,
      totalReviews,
    } = productList

    return (
      <div className="success-container">
        <div className="product-details-container">
          <img src={imageUrl} alt="product" className="product-image" />
          <div className="first-container">
            <h1 className="title">{title}</h1>
            <p className="price">Rs {price}/-</p>
            <div className="review-container">
              <div className="rating-container">
                <p className="rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="stars"
                  className="logo-image"
                />
              </div>
              <p>{totalReviews} Reviews</p>
            </div>
            <p>{description}</p>
            <p>
              <span>Available: </span>
              {availability}
            </p>
            <p>
              <span>Brand: </span>
              {brand}
            </p>
            <hr />
            <div className="button-container">
              <button
                className="button"
                type="button"
                onClick={this.onDecrease}
                data-testid="minus"
              >
                <BsDashSquare />
              </button>
              <p>{quantity}</p>
              <button
                className="button"
                type="button"
                onClick={this.onIncrease}
                data-testid="plus"
              >
                <BsPlusSquare />
              </button>
            </div>
            <button className="button2" type="button">
              ADD TO CART
            </button>
          </div>
        </div>
        <div className="similar-container">
          <h1>Similar Products</h1>

          <ul className="unorder-similar">
            {similarProductsData.map(eachProduct => (
              <SimilarProductItem
                similarProductsData={eachProduct}
                key={eachProduct.id}
              />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderLoadingView = () => (
    <div data-testid="loader" className="products-details-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderFailureView = () => (
    <div className="product-details-failure-view-container">
      <img
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        className="failure-view-image"
      />
      <h1 className="product-not-found-heading">Product Not Found</h1>
      <Link to="/products">
        <button type="button" className="button3">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  renderCasesView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div>{this.renderCasesView()}</div>
      </>
    )
  }
}

export default ProductItemDetails
