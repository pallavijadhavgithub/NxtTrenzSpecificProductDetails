// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {similarProductsData} = props
  const {imageUrl, price, rating, title, brand} = similarProductsData

  return (
    <li className="similar-product-list">
      <img src={imageUrl} alt="similar product" className="similar-image" />
      <h1 className="similar-title">{title}</h1>
      <p className="similar-brand">by {brand}</p>
      <div className="small-rating-container">
        <p className="price-small">Rs {price}</p>
        <div className="small-container">
          <p className="small-rating">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png "
            alt="stars"
            className="stars-image-small"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
