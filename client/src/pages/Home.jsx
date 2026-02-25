
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import BlogList from '../components/BlogList';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="min-h-screen bg-page text-heading">
      <Navbar />
      <main className="relative">
        <Header />
        <BlogList />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
