import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../hooks/useData';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import SEO from '../components/layout/SEO';

const Journal = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { posts, isSecondaryLoading } = useData();

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const journalSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "The Honeymoonner Journal",
    "description": "Curated guides, personal stories, and expert advice for romantic travel.",
    "publisher": {
      "@type": "Organization",
      "name": "The Honeymoonner"
    },
    "blogPost": posts.map(post => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "image": post.image,
      "author": {
        "@type": "Person",
        "name": post.author
      },
      "datePublished": post.date
    }))
  };

  return (
    <div className="pt-24 min-h-screen bg-brand-50">
      <SEO 
        title="Journal | Romantic Inspiration"
        description="Curated guides, personal stories, and expert advice to help you plan the most important journey of your life."
        canonical="https://thehoneymoonertravel.com/journal"
        schema={journalSchema}
      />
      <Breadcrumbs />

      {/* Hero Section */}
      <section className="relative h-[50vh] sm:h-[60vh] flex items-center justify-center overflow-hidden mb-12 sm:mb-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://cms.thehoneymoonertravel.com/wp-content/uploads/2026/04/hoi-an-and-da-nang-photographer-f1Yk1rGf3tE-unsplash-scaled.jpg" 
            alt="The Honeymoonner Journal" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-brand-900/40 backdrop-blur-[1px]" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4 sm:px-6">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="script-font mb-4 block text-2xl sm:text-3xl lg:text-4xl"
          >
            The Honeymoonner Journal
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-7xl font-serif mb-6 drop-shadow-2xl leading-tight"
          >
            Romantic Inspiration
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-brand-50 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed font-medium"
          >
            Curated guides, personal stories, and expert advice to help you plan the most important journey of your life.
          </motion.p>
        </div>
      </section>

      <section className="section-container px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        <div className="text-center mb-12 sm:mb-16">
          <div className="max-w-md mx-auto relative mb-12 px-2">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-accent">
              <Heart size={18} className="fill-brand-accent/10" />
            </div>
            <input 
              type="text" 
              placeholder="Search for inspiration..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 sm:pl-16 pr-6 sm:pr-8 py-4 sm:py-5 bg-white border border-brand-100 rounded-xl sm:rounded-2xl text-sm sm:text-base text-brand-900 font-medium focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent transition-all shadow-sm"
            />
          </div>
        </div>

        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {filteredPosts.map((post, idx) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="romantic-card group flex flex-col h-full rounded-2xl sm:rounded-[40px] overflow-hidden"
              >
                <Link to={`/journal/${post.slug}`} className="block relative h-64 sm:h-72 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 sm:top-6 left-4 sm:left-6">
                    <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/90 backdrop-blur-md rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-brand-accent shadow-lg">
                      {post.category}
                    </span>
                  </div>
                </Link>
                <div className="p-6 sm:p-8 flex flex-col flex-grow">
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-brand-400 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest mb-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-brand-accent" />
                      <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <User className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-brand-accent" />
                      <span>{post.author}</span>
                    </div>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-serif text-brand-900 mb-4 group-hover:text-brand-accent transition-colors line-clamp-2 leading-tight">
                    <Link to={`/journal/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className="text-brand-600/90 text-sm leading-relaxed mb-8 line-clamp-3 flex-grow">
                    {post.excerpt}
                  </p>
                  <Link 
                    to={`/journal/${post.slug}`} 
                    className="btn-outline w-full sm:w-auto py-2.5 px-6 text-[10px] sm:text-xs inline-flex items-center justify-center gap-2 mt-auto"
                  >
                    View Story <ArrowRight size={14} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : isSecondaryLoading && searchTerm.trim() === '' ? (
          <div className="text-center py-32 bg-white rounded-[40px] border border-brand-100 shadow-sm">
            <div className="w-16 h-16 border-4 border-brand-accent border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <h3 className="text-2xl font-serif text-brand-900 mb-2">Loading stories...</h3>
            <p className="text-brand-600 max-w-md mx-auto">Fetching the latest romantic inspiration for you.</p>
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-[40px] border border-brand-100 shadow-sm">
            <div className="w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-8 text-brand-accent/40">
              <Heart size={40} />
            </div>
            <h3 className="text-3xl font-serif text-brand-900 mb-4">No stories found for your search.</h3>
            <p className="text-brand-600 max-w-md mx-auto">Try a different keyword or explore our popular categories.</p>
            <button 
              onClick={() => setSearchTerm('')}
              className="mt-8 text-brand-accent font-bold uppercase tracking-widest text-xs border-b-2 border-brand-accent/20 hover:border-brand-accent transition-all pb-1"
            >
              View All Stories
            </button>
          </div>
        )}
      </section>

      {/* Newsletter Section */}
      <section className="bg-brand-900 py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-accent/10 rounded-full -mr-48 -mt-48 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-accent/5 rounded-full -ml-48 -mb-48 blur-3xl" />
        
        <div className="section-container relative z-10 text-center text-white">
          <p className="script-font text-brand-accent-light mb-4">The Honeymoonner Circle</p>
          <h2 className="text-4xl md:text-5xl font-serif mb-8">Join The Honeymoonner Circle</h2>
          <p className="text-brand-200 text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
            Receive exclusive travel inspiration, secret destination guides, and special romantic offers directly in your inbox.
          </p>
          
          <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
            <input 
              type="email" 
              placeholder="Your email address..." 
              className="flex-grow px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white placeholder:text-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-accent/50 transition-all"
              required
            />
            <button type="submit" className="btn-primary whitespace-nowrap px-10">
              Subscribe
            </button>
          </form>
          <p className="mt-6 text-brand-400 text-xs italic">We respect your privacy. Unsubscribe at any time.</p>
        </div>
      </section>
    </div>
  );
};

export default Journal;
