import React from 'react'
import { Grid, BookOpen, Laptop, Home, Tag, Clock, MoreHorizontal } from 'lucide-react'

const categories = [
  { id: 'all', label: 'All', icon: Grid },
  { id: 'textbooks', label: 'Textbooks', icon: BookOpen },
  { id: 'electronics', label: 'Electronics', icon: Laptop },
  { id: 'furniture', label: 'Furniture', icon: Home },
  { id: 'clothing', label: 'Clothing', icon: Tag },
  { id: 'sports', label: 'Sports', icon: Clock },
  { id: 'other', label: 'Other', icon: MoreHorizontal },
]

function Categories({ activeCategory, onCategoryChange }) {
  return (
    <section className="categories">
      {categories.map((category) => {
        const Icon = category.icon
        return (
          <button
            key={category.id}
            className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
            onClick={() => onCategoryChange(category.id)}
          >
            <Icon size={18} />
            {category.label}
          </button>
        )
      })}
    </section>
  )
}

export default Categories
