function Filters({ priceRange, onPriceChange, sortBy, onSortChange }) {
  return (
    <section className="filters">
      {/* Price Filter */}
      <div className="price-filter">
        <label>Price:</label>
        <input 
          type="text" 
          className="price-input" 
          placeholder="Min"
          value={priceRange.min}
          onChange={(e) => onPriceChange({ ...priceRange, min: e.target.value })}
        />
        <span>-</span>
        <input 
          type="text" 
          className="price-input" 
          placeholder="Max"
          value={priceRange.max}
          onChange={(e) => onPriceChange({ ...priceRange, max: e.target.value })}
        />
      </div>
      
      {/* Sort Dropdown */}
      <select 
        className="sort-dropdown"
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
      >
        <option value="newest">Newest Listed</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
        <option value="popular">Most Popular</option>
      </select>
    </section>
  )
}

export default Filters
