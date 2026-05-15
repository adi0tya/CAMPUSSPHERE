import { useState, useEffect } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { HiBookOpen, HiMagnifyingGlass, HiArrowPath } from 'react-icons/hi2';
import EmptyState from '../../components/common/EmptyState';

const LibrarySystem = () => {
  const [books, setBooks] = useState([]);
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    try {
      const [booksRes, issuedRes] = await Promise.all([
        API.get('/api/library/books'),
        API.get('/api/library/my-issues')
      ]);
      setBooks(booksRes.data.books || []);
      setIssuedBooks(issuedRes.data.issues || []);
    } catch (err) {
      toast.error('Failed to load library data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleIssueRequest = async (bookId) => {
    try {
      await API.post('/api/library/issue', { bookId });
      toast.success('Issue request submitted!');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to request book');
    }
  };

  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(search.toLowerCase()) || 
    b.author.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Digital Library</h1>
        <p className="text-gray-600 text-sm">Search and request books from the college library</p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-xl">
        <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
        <input 
          type="text" 
          placeholder="Search by title, author or ISBN..." 
          className="input-field pl-12"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Book Catalog */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <HiBookOpen className="text-cyan-400" /> Book Catalog
          </h2>
          {filteredBooks.length === 0 ? <EmptyState title="No books found" icon={HiBookOpen} /> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredBooks.map(b => (
                <div key={b._id} className="glass p-4 card-hover flex flex-col justify-between">
                  <div>
                    <h3 className="text-white font-semibold">{b.title}</h3>
                    <p className="text-gray-500 text-xs mt-1">by {b.author}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${b.availableCopies > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                        {b.availableCopies > 0 ? `${b.availableCopies} Available` : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
                  <button 
                    disabled={b.availableCopies === 0}
                    onClick={() => handleIssueRequest(b._id)}
                    className="mt-4 btn-primary text-xs py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Request Issue
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Issued Books */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <HiArrowPath className="text-cyan-400" /> My Borrowed Books
          </h2>
          {issuedBooks.length === 0 ? (
            <div className="glass p-8 text-center border-dashed border-white/5">
              <p className="text-gray-500 text-sm">No books currently borrowed</p>
            </div>
          ) : (
            <div className="space-y-3">
              {issuedBooks.map(i => (
                <div key={i._id} className="glass p-4 border-l-2 border-cyan-500">
                  <h4 className="text-white text-sm font-medium">{i.book?.title}</h4>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-[10px] text-gray-500">Due: {new Date(i.dueDate).toLocaleDateString()}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${i.status === 'Issued' ? 'text-amber-400 bg-amber-400/10' : 'text-emerald-400 bg-emerald-400/10'}`}>
                      {i.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LibrarySystem;
