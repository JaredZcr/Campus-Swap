import { useState } from 'react';
import { Hero } from './components/hero';
import { Navbar } from './components/Navbar';
import { MyListings } from './components/myListings';
import Categories from './components/Categories';
import Filters from './components/Filters';
import Footer from './components/Footer';
import Listings from './components/Listings';
import SellItemModal from './components/SellItemModal';
import AuthPage from './pages/AuthPage';
import OrdersPage from './pages/OrdersPage';
import MessagesPage from './pages/MessagesPage';
import FavoritesPage from './pages/FavoritesPage';
import AdminPage from './pages/AdminPage';
import ProfilePage from './pages/ProfilePage';
import AddressesPage from './pages/AddressesPage';
import OrderDetailPage from './pages/OrderDetailPage';
import { AuthProvider } from './context/AuthContext';
import './App.css';

function AppContent() {
  const [activePage, setActivePage] = useState('home');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('newest');
  const [showSellModal, setShowSellModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [listingsKey, setListingsKey] = useState(0);
  const [activeOrderId, setActiveOrderId] = useState(null);

  // Order detail navigation is handled via the Orders page callback.

  return (
    <div>
      <Navbar
        onNavigate={setActivePage}
        onHomeClick={() => setActivePage('home')}
        onSearch={setSearchQuery}
        onSellClick={() => setShowSellModal(true)}
        onLoginClick={() => setShowAuthModal(true)}
        onAdminClick={() => setActivePage('admin')}
      />

      {activePage === 'home' && (
        <>
          <Hero />
          <Categories activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
          <Filters priceRange={priceRange} onPriceChange={setPriceRange} sortBy={sortBy} onSortChange={setSortBy} />
          <Listings
            key={listingsKey}
            category={activeCategory}
            searchQuery={searchQuery}
            priceRange={priceRange}
            sortBy={sortBy}
          />
        </>
      )}

      {activePage === 'myListings' && <MyListings />}
      {activePage === 'orders' && (
        <OrdersPage
          onViewOrder={(id) => {
            setActiveOrderId(id);
            setActivePage('orderDetail');
          }}
        />
      )}
      {activePage === 'messages' && <MessagesPage />}
      {activePage === 'favorites' && <FavoritesPage />}
      {activePage === 'profile' && <ProfilePage />}
      {activePage === 'addresses' && <AddressesPage />}
      {activePage === 'orderDetail' && activeOrderId && (
        <OrderDetailPage
          orderId={activeOrderId}
          onBack={() => {
            setActiveOrderId(null);
            setActivePage('orders');
          }}
        />
      )}
      {activePage === 'admin' && <AdminPage onBackHome={() => setActivePage('home')} />}

      {activePage !== 'admin' && <Footer />}

      {showSellModal && (
        <SellItemModal
          onClose={() => setShowSellModal(false)}
          onSuccess={() => { setListingsKey((k) => k + 1); setActivePage('home'); }}
        />
      )}

      {showAuthModal && <AuthPage onClose={() => setShowAuthModal(false)} />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
