import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { categories } from './data/categories'
import { menuItems } from './data/menu'

function App() {
  const [group, setGroup] = useState<'Food' | 'Drinks'>('Food')
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('Home')

  useEffect(() => {
    if (!selectedCategory) return

    document.getElementById('menu-category-view')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }, [selectedCategory])


  const visibleCategories = useMemo(() => {
    return categories.filter((category) => {
      const matchesGroup = category.group === group
      const matchesSearch = category.name.toLowerCase().includes(search.toLowerCase())
      return matchesGroup && matchesSearch
    })
  }, [group, search])

  const selected = categories.find((category) => category.id === selectedCategory)

  const selectedItems = useMemo(() => {
    if (!selectedCategory) return []

    return menuItems.filter((item) => item.categoryId === selectedCategory)
  }, [selectedCategory])

  const groupedItems = useMemo(() => {
    const sections = new Map<string, typeof selectedItems>()

    selectedItems.forEach((item) => {
      const section = item.sourceSection
      const existing = sections.get(section) ?? []
      sections.set(section, [...existing, item])
    })

    return Array.from(sections.entries())
  }, [selectedItems])

  function changeGroup(nextGroup: 'Food' | 'Drinks') {
    setGroup(nextGroup)
    setSelectedCategory(null)
    setSearch('')
  }

  function selectCategory(categoryId: string) {
    setSelectedCategory(categoryId)
  }

  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href="#" onClick={() => setActiveTab('Home')}>
          <span className="brand-name">TIMNA</span>
          <span className="brand-subtitle">CAFÉ & RESTAURANT</span>
        </a>
        <span className="location-label">KAMPALA · UGANDA</span>
      </header>

      <main>
        <section className="hero">
          <div className="hero-kicker">
            <span className="gold-line" />
            THE TIMNA EXPERIENCE
          </div>

          <h1>
            Good food.
            <br />
            <span>Beautiful moments.</span>
          </h1>

          <p className="hero-copy">
            Discover a menu made for good company, memorable meals
            and moments worth sharing.
          </p>

          <button
            className="explore-button"
            onClick={() =>
              document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })
            }
          >
            EXPLORE THE MENU <span>↘</span>
          </button>

          <div className="hero-index">
            <span>01</span>
            <span className="index-line" />
            <span>DISCOVER</span>
          </div>
        </section>

        <section className="menu-area" id="menu">
          <div className="section-heading">
            <div>
              <span className="eyebrow">A WORLD OF FLAVOUR</span>
              <h2>Explore our menu</h2>
            </div>
            <span className="section-number">01 / MENU</span>
          </div>

          <div className="group-switch" aria-label="Menu type">
            <button
              className={group === 'Food' ? 'group-button active' : 'group-button'}
              onClick={() => changeGroup('Food')}
            >
              <span>01</span> Food
            </button>

            <button
              className={group === 'Drinks' ? 'group-button active' : 'group-button'}
              onClick={() => changeGroup('Drinks')}
            >
              <span>02</span> Drinks
            </button>
          </div>

          <label className="search-box">
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              placeholder="Find a category..."
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setSelectedCategory(null)
              }}
              aria-label="Search menu categories"
            />
            <span className="search-hint">SEARCH</span>
          </label>

          <div className="category-heading">
            <h3>
              {selected
                ? selected.name
                : group === 'Food'
                  ? 'Food selections'
                  : 'Drinks & beverages'}
            </h3>
            <span>
              {selected
                ? `${selectedItems.length.toString().padStart(2, '0')} ITEMS`
                : `${visibleCategories.length.toString().padStart(2, '0')} CATEGORIES`}
            </span>
          </div>

          {selected ? (
            <section id="menu-category-view" className="menu-category-view" aria-live="polite">
              <div className="menu-category-toolbar">
                <button
                  className="menu-back-button"
                  onClick={() => setSelectedCategory(null)}
                >
                  <span aria-hidden="true">←</span>
                  ALL {group.toUpperCase()} CATEGORIES
                </button>
                <span className="menu-category-caption">TIMNA MENU</span>
              </div>

              {selected.note && (
                <p className="menu-category-note">{selected.note}</p>
              )}


              {selectedItems.length > 0 ? (
                <div className="menu-items-panel">
                  {groupedItems.map(([section, items]) => (
                    <div className="menu-item-section" key={section}>
                      <h4>{section}</h4>

                      <div className="menu-item-list">
                        {items.map((item) => (
                          <article className="menu-item-row" key={item.id}>
                            <div className="menu-item-details">
                              <div className="menu-item-name">
                                <span>{item.name}</span>
                                {item.nameStatus === 'needs-review' && (
                                  <span
                                    className="review-label"
                                    title="Printed spelling needs confirmation"
                                  >
                                    REVIEW
                                  </span>
                                )}
                              </div>

                              {item.description && (
                                <p className="menu-item-description">
                                  {item.description}
                                </p>
                              )}
                            </div>

                            <div className="menu-item-price">
                              {item.priceOptions?.length ? (
                                <div className="menu-item-price-options">
                                  {item.priceOptions.map((option) => (
                                    <div className="menu-price-option" key={option.label}>
                                      <span>{option.label}</span>
                                      <strong>
                                        UGX {option.amount.toLocaleString('en-UG')}
                                      </strong>
                                    </div>
                                  ))}
                                </div>
                              ) : item.price ? (
                                `UGX ${item.price.amount.toLocaleString('en-UG')}`
                              ) : (
                                'Price to be confirmed'
                              )}
                            </div>
                          </article>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="menu-empty-panel">
                  <p>
                    This section is being prepared from Timna's original menu.
                    Its entries will appear here after their names and prices
                    have been checked.
                  </p>
                  <span>MENU DETAILS UNDER REVIEW</span>
                </div>
              )}
            </section>
          ) : (
            <>
              <div className="category-grid">
                {visibleCategories.map((category, index) => (
                  <button
                    key={category.id}
                    className="category-card"
                    onClick={() => selectCategory(category.id)}
                  >
                    <span className="category-index">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="category-name">{category.name}</span>
                    <span className="category-description">
                      {category.description}
                    </span>
                    <span className="category-arrow">↗</span>
                  </button>
                ))}
              </div>

              {visibleCategories.length === 0 && (
                <p className="empty-state">
                  No matching categories. Try another search.
                </p>
              )}
            </>
          )}
        </section>
      </main>

      <footer className="footer" id="footer">
        <span className="footer-brand">TIMNA</span>
        <span>SAVOUR. INDULGE. REPEAT.</span>
        <span>© TIMNA CAFÉ & RESTAURANT</span>
      </footer>

      <nav className="bottom-nav" aria-label="Main navigation">
        {[
          { name: 'Home', symbol: '⌂' },
          { name: 'Food', symbol: '✳' },
          { name: 'Drinks', symbol: '◒' },
          { name: 'Info', symbol: 'i' },
        ].map((item) => (
          <button
            key={item.name}
            className={activeTab === item.name ? 'nav-item active' : 'nav-item'}
            onClick={() => {
              setActiveTab(item.name)

              if (item.name === 'Food' || item.name === 'Drinks') {
                changeGroup(item.name)
                setActiveTab(item.name)
                document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })
              } else if (item.name === 'Home') {
                window.scrollTo({ top: 0, behavior: 'smooth' })
              } else {
                document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' })
              }
            }}
          >
            <span className="nav-symbol">{item.symbol}</span>
            <span>{item.name}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}

export default App
