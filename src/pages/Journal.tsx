import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, Bookmark, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../hooks/useData';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import SEO from '../components/layout/SEO';

const Journal = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { posts } = useData();

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const journalSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "The Honeymooner Journal",
    "description": "Curated guides, personal stories, and expert advice for romantic travel.",
    "publisher": {
      "@type": "Organization",
      "name": "The Honeymooner"
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
        schema={journalSchema}
      />
      <Breadcrumbs />

      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden mb-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&q=80&w=2070" 
            alt="The Honeymooner Journal" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-brand-900/40 backdrop-blur-[1px]" />
          
          {/* Subtle Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
            <img 
              src="https://ik.imagekit.io/360t0n1jd9/Afrokoko%20Foundation%20Assets/Wordmark%20Logo%20No%20BG%20-%20White%20Only.png?updatedAt=1773691277015" 
              alt=""
              className="w-full max-w-[140rem] h-auto object-contain"
            />
          </div>
        </div>
        
        <div className="relative z-10 text-center text-white px-4">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="script-font mb-4 block"
          >
            The Honeymooner Journal
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif mb-6 drop-shadow-2xl"
          >
            Romantic Inspiration
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-brand-50 max-w-2xl mx-auto text-lg leading-relaxed font-medium"
          >
            Curated guides, personal stories, and expert advice to help you plan the most important journey of your life.
          </motion.p>
        </div>
      </section>

      <section className="section-container pb-24">
        <div className="text-center mb-16">
          <div className="max-w-md mx-auto relative mb-12">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-accent">
              <Heart size={18} className="fill-brand-accent/10" />
            </div>
            <input
              type="text"
              placeholder="Search for inspiration..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-16 pr-6 py-4 rounded-full bg-white border-2 border-brand-100 focus:border-brand-accent/30 focus:ring-4 focus:ring-brand-accent/5 transition-all text-brand-900 placeholder:text-brand-300 font-serif italic shadow-sm"
            />
          </div>
        </div>

        {/* Featured Post (only show if no search term) */}
        {!searchTerm && filteredPosts.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative rounded-3xl overflow-hidden shadow-xl mb-16 group"
          >
            <div className="aspect-[21/9] w-full overflow-hidden">
              <img 
                src={posts[0].image} 
                alt={posts[0].title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            </div>
            <div className="absolute bottom-0 left-0 p-8 md:p-12 text-white max-w-3xl">
              <span className="px-4 py-1 bg-brand-accent text-white rounded-full text-sm font-medium mb-4 inline-block">
                {posts[0].category}
              </span>
              <h2 className="text-3xl md:text-4xl font-serif mb-4">{posts[0].title}</h2>
              <p className="text-brand-100 text-lg mb-6 line-clamp-2">{posts[0].excerpt}</p>
              <div className="flex items-center gap-6 text-sm text-brand-200 mb-6">
                <span className="flex items-center gap-2"><User className="w-4 h-4" /> {posts[0].author}</span>
                <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {posts[0].date}</span>
              </div>
              <Link to={`/journal/${posts[0].id}`} className="inline-flex items-center gap-2 text-white font-medium hover:gap-4 transition-all group/btn">
                Read Full Story <ArrowRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        )}

        {/* Recent Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(searchTerm ? filteredPosts : filteredPosts.slice(1)).map((post, index) => (
            <motion.article 
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-brand-100 hover:shadow-xl transition-all duration-500 flex flex-col group"
            >
              <div className="aspect-[16/10] overflow-hidden relative">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <button className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur rounded-full text-brand-accent hover:bg-brand-accent hover:text-white transition-colors">
                  <Bookmark className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <span className="text-xs font-semibold uppercase tracking-widest text-brand-accent mb-3 inline-block">
                  {post.category}
                </span>
                <h3 className="text-xl font-serif text-brand-900 mb-4 group-hover:text-brand-accent transition-colors">
                  {post.title}
                </h3>
                <p className="text-brand-700 text-sm mb-6 line-clamp-3 flex-grow leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-brand-50 text-xs text-brand-500 font-medium">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                  <span>{post.readTime}</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-24">
            <p className="text-brand-400 text-lg italic">No stories found matching your heart's desire...</p>
            <button
              onClick={() => setSearchTerm('')}
              className="text-brand-accent font-medium mt-4 hover:underline"
            >
              Show all stories
            </button>
          </div>
        )}

        {/* Newsletter Section */}
        <section className="mt-24 bg-brand-900 rounded-3xl p-12 md:p-16 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-brand-accent/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-brand-accent/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl font-serif mb-6">Join The Honeymooner Circle</h2>
            <p className="text-brand-100 mb-8">Receive exclusive travel inspiration, secret destination guides, and special romantic offers directly in your inbox.</p>
            <form className="flex flex-col sm:flex-row gap-4">
              <input 
                type="email" 
                placeholder="Your email address"
                className="flex-grow px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 outline-none focus:bg-white/20 transition-all"
                required
              />
              <button type="submit" className="px-8 py-4 bg-white text-brand-900 rounded-xl font-medium hover:bg-brand-50 transition-colors">
                Subscribe
              </button>
            </form>
            <p className="mt-4 text-xs text-brand-300">We respect your privacy. Unsubscribe at any time.</p>
          </div>
        </section>
      </section>
    </div>
  );
};

export default Journal;
