import { useParams, Link } from 'react-router-dom';
import { useData } from '../hooks/useData';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowLeft, Clock, Share2, Facebook, Twitter } from 'lucide-react';
import SEO from '../components/layout/SEO';
import Breadcrumbs from '../components/ui/Breadcrumbs';

const JournalDetail = () => {
  const { slug } = useParams();
  const { posts, isLoading } = useData();
  const post = posts.find(p => p.slug === slug);

  if (isLoading) {
    return (
      <div className="pt-32 min-h-screen section-container flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-brand-accent border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-brand-600 font-serif text-xl italic">Loading story...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="pt-32 min-h-screen section-container text-center">
        <h2 className="text-3xl font-serif text-brand-900 mb-4">Story not found</h2>
        <p className="text-brand-600 mb-8">The romantic inspiration you're looking for seems to have drifted away.</p>
        <Link to="/journal" className="btn-primary inline-flex items-center gap-2">
          <ArrowLeft size={18} /> Back to Journal
        </Link>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white"
    >
      <SEO 
        title={`${post.title} | Journal`}
        description={post.excerpt}
        image={post.image}
      />
      
      <div className="absolute top-24 left-0 right-0 z-20">
        <Breadcrumbs />
      </div>

      {/* Hero Section */}
      <header className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <img 
          src={post.image} 
          alt={post.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-brand-900/40 backdrop-blur-[1px]" />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="section-container text-center text-white">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block px-4 py-1.5 bg-brand-accent/90 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest mb-6"
            >
              {post.category}
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-7xl font-serif mb-8 max-w-4xl mx-auto leading-tight drop-shadow-2xl"
            >
              {post.title}
            </motion.h1>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap items-center justify-center gap-8 text-sm font-medium text-brand-50/90"
            >
              <div className="flex items-center gap-2">
                <User size={18} className="text-brand-accent" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-brand-accent" />
                <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-brand-accent" />
                <span>{post.readTime}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <article className="section-container py-24">
        <div className="max-w-3xl mx-auto">
          {/* Excerpt/Intro */}
          <p className="text-2xl font-serif text-brand-900 mb-12 italic leading-relaxed border-l-4 border-brand-accent pl-8 py-2">
            {post.excerpt}
          </p>

          {/* Main Content */}
          <div className="prose prose-brand prose-lg max-w-none text-brand-700 space-y-8 leading-relaxed">
            {post.content ? (
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            ) : (
              <p>No content available for this story yet.</p>
            )}
            
            <div className="my-12 rounded-[40px] overflow-hidden shadow-2xl">
              <img src={post.image} alt="Romantic moment" className="w-full h-auto" />
              <p className="bg-brand-50 p-4 text-center text-sm italic text-brand-500">Every detail is handpicked to reflect your unique love story.</p>
            </div>
          </div>

          {/* Share & Tags */}
          <div className="mt-20 pt-12 border-t border-brand-100 flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-400">Share Story:</span>
              <div className="flex gap-4">
                <button className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 hover:bg-brand-accent hover:text-white transition-all">
                  <Facebook size={18} />
                </button>
                <button className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 hover:bg-brand-accent hover:text-white transition-all">
                  <Twitter size={18} />
                </button>
                <button className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 hover:bg-brand-accent hover:text-white transition-all">
                  <Share2 size={18} />
                </button>
              </div>
            </div>
            
            <Link to="/journal" className="flex items-center gap-2 text-brand-accent font-bold uppercase tracking-widest text-xs hover:gap-3 transition-all">
              <ArrowLeft size={14} /> Back to all stories
            </Link>
          </div>
        </div>
      </article>

      {/* Newsletter Re-use */}
      <section className="bg-brand-50 py-24">
        <div className="section-container text-center">
          <p className="script-font text-brand-accent mb-4">Continue the Journey</p>
          <h2 className="text-3xl md:text-5xl font-serif text-brand-900 mb-8">Never Miss a Story</h2>
          <p className="text-brand-600 max-w-xl mx-auto mb-12">Join 5,000+ couples who receive our weekly curated romantic travel inspiration.</p>
          <form className="max-w-md mx-auto flex gap-4">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-grow px-6 py-4 rounded-full border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-accent/20"
            />
            <button className="btn-primary px-8">Join</button>
          </form>
        </div>
      </section>
    </motion.div>
  );
};

export default JournalDetail;
