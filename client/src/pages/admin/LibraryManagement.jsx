import { useState, useEffect } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { HiBookOpen, HiPlus, HiCheck, HiXMark } from 'react-icons/hi2';
import EmptyState from '../../components/common/EmptyState';

const LibraryManagement = () => {
  const [books, setBooks] = useState([]);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddBook, setShowAddBook] = useState(false);
  const [newBook, setNewBook] = useState({ title: '', author: '', isbn: '', category: '', totalCopies: 1 });

  const fetchData = async () => {
    try {
      const [booksRes, issuesRes] = await Promise.all([
        API.get('/api/library/books'),
        API.get('/api/library/issues')
      ]);
      setBooks(booksRes.data.books || []);
      setIssues(issuesRes.data.issues || []);
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      await API.post('/api/library/books', newBook);
      toast.success('Book added to catalog');
      setShowAddBook(false);
      fetchData();
    } catch (err) {
      toast.error('Failed to add book');
    }
  };

  const handleIssueStatus = async (id, status) => {
    try {
      await API.put(`/api/library/issue/${id}/status`, { status });
      toast.success(`Request ${status}`);
      fetchData();
    } catch (err) {
      toast.error('Operation failed');
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Library Administration</h1>
          <p className="text-gray-600 text-sm">Manage books and student issue requests</p>
        </div>
        <button onClick={() => setShowAddBook(true)} className="btn-primary flex items-center gap-2">
          <HiPlus /> Add New Book
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Manage Issues */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <HiCheck className="text-amber-400" /> Pending Requests
          </h2>
          {issues.filter(i => i.status === 'Requested').length === 0 ? (
            <div className="glass p-8 text-center text-gray-500 text-sm">No pending issue requests</div>
          ) : (
            <div className="space-y-3">
              {issues.filter(i => i.status === 'Requested').map(i => (
                <div key={i._id} className="glass p-4 flex justify-between items-center">
                  <div>
                    <h4 className="text-white font-medium">{i.book?.title}</h4>
                    <p className="text-gray-500 text-xs">Request by: {i.user?.name}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleIssueStatus(i._id, 'Issued')} className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"><HiCheck /></button>
                    <button onClick={() => handleIssueStatus(i._id, 'Rejected')} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"><HiXMark /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Catalog List */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <HiBookOpen className="text-cyan-400" /> Current Catalog
          </h2>
          <div className="glass overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-white/5 text-[10px] uppercase tracking-wider text-gray-400">
                <tr>
                  <th className="px-4 py-3">Book Details</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {books.map(b => (
                  <tr key={b._id} className="text-sm hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-white font-medium">{b.title}</p>
                      <p className="text-gray-500 text-xs">{b.author}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-400">{b.availableCopies}/{b.totalCopies}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${b.availableCopies > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                        {b.availableCopies > 0 ? 'INSTOCK' : 'LOWSTOCK'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryManagement;
