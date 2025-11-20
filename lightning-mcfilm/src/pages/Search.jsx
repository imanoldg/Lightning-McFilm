import SearchResults from "../components/SearchResults";
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

const Search = () => {
  return (
    <div className="min-h-screen bg-mc-light-blue">
      <Header />
        <main className="container mx-auto px-4 py-12">
            <SearchResults />
        </main>
      <Footer />
    </div>
  );
}

export default Search;