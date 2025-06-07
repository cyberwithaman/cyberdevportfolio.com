"use client";

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope,
  faPhone,
  faUser,
  faCalendarAlt,
  faSearch,
  faSort,
  faTrash,
  faSync,
  faDownload,
  faEye,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

interface UpdateHistoryItem {
  date: string;
  fields: string[];
  action: string;
  source?: string;
  previousValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
}

interface Subscriber {
  _id: string;
  name: string;
  email: string;
  phone: string;
  whatsapp: boolean;
  createdAt: string;
  lastUpdated: string;
  active: boolean;
  updateHistory: UpdateHistoryItem[];
}

const NewsletterAdmin: React.FC = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Subscriber;
    direction: 'ascending' | 'descending';
  }>({ key: 'createdAt', direction: 'descending' });
  const [selectedSubscriber, setSelectedSubscriber] = useState<Subscriber | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const fetchSubscribers = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/newsletter');
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch newsletter subscribers');
      }

      setSubscribers(result.data);
    } catch (err) {
      console.error('Error fetching newsletter subscribers:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this subscriber?')) {
      return;
    }

    try {
      const response = await fetch(`/api/newsletter/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to delete subscriber');
      }

      // Remove the deleted subscriber from the state
      setSubscribers(subscribers.filter(sub => sub._id !== id));
    } catch (err) {
      console.error('Error deleting subscriber:', err);
      alert(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  const handleSort = (key: keyof Subscriber) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === 'ascending'
        ? 'descending'
        : 'ascending';

    setSortConfig({ key, direction });
  };

  const sortedSubscribers = [...subscribers].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const filteredSubscribers = sortedSubscribers.filter(subscriber =>
    subscriber.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subscriber.phone.includes(searchTerm)
  );

  const exportToCSV = () => {
    try {
      // Add optional Status field to the headers
      const headers = ['Name', 'Email', 'Phone', 'WhatsApp', 'Status', 'Created Date'];

      // Ensure proper escaping of fields that might contain commas or quotes
      const escapeCSV = (data: string) => {
        // If the data contains quotes, commas, or newlines, we need to:
        // 1. Replace any double quotes with two double quotes
        // 2. Wrap the result in double quotes
        if (data && (data.includes('"') || data.includes(',') || data.includes('\n'))) {
          return `"${data.replace(/"/g, '""')}"`;
        }
        return `"${data}"`;
      };

      const csvRows = [
        headers.join(','),
        ...filteredSubscribers.map(sub => [
          escapeCSV(sub.name),
          escapeCSV(sub.email),
          escapeCSV(sub.phone),
          sub.whatsapp ? 'Yes' : 'No',
          sub.active ? 'Subscribed' : 'Unsubscribed',
          new Date(sub.createdAt).toLocaleDateString()
        ].join(','))
      ];

      // Add BOM (Byte Order Mark) to ensure Excel recognizes UTF-8
      const BOM = '\uFEFF';
      const csvContent = BOM + csvRows.join('\r\n'); // Use CRLF for better Excel compatibility
      
      // Create the blob with the correct charset
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
      
      // Handle download differently based on browser support
      if (window.navigator && 'msSaveOrOpenBlob' in window.navigator) {
        // For IE/Edge
        (window.navigator as { msSaveOrOpenBlob: (blob: Blob, name: string) => void }).msSaveOrOpenBlob(blob, `newsletter_subscribers_${new Date().toISOString().split('T')[0]}.csv`);
        return;
      } 
      
      // For other browsers
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `newsletter_subscribers_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (err) {
      console.error('Error exporting CSV:', err);
      alert('Failed to export CSV. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleUnsubscribe = async (subscriber: Subscriber) => {
    const action = subscriber.active ? 'unsubscribe' : 'resubscribe';
    const confirmMessage = subscriber.active
      ? `Are you sure you want to unsubscribe ${subscriber.name}?`
      : `Are you sure you want to resubscribe ${subscriber.name}?`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      const endpoint = subscriber.active ? '/api/newsletter/unsubscribe' : '/api/newsletter/resubscribe';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: subscriber.email }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || `Failed to ${action} subscriber`);
      }

      // Update the subscriber in the local state
      setSubscribers(subscribers.map(sub =>
        sub._id === subscriber._id
          ? {
            ...sub,
            active: !sub.active,
            lastUpdated: new Date().toISOString(),
            updateHistory: [
              ...sub.updateHistory,
              {
                date: new Date().toISOString(),
                fields: ['active'],
                action: subscriber.active ? 'unsubscribe_preferences' : 'resubscribed',
                previousValues: { active: subscriber.active },
                newValues: { active: !subscriber.active }
              }
            ]
          }
          : sub
      ));
    } catch (err) {
      console.error(`Error ${action}ing subscriber:`, err);
      alert(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  const openHistoryModal = (subscriber: Subscriber) => {
    setSelectedSubscriber(subscriber);
    setShowHistoryModal(true);
  };

  const closeHistoryModal = () => {
    setShowHistoryModal(false);
    setSelectedSubscriber(null);
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredSubscribers.map(sub => sub._id));
    }
    setSelectAll(!selectAll);
  };

  const toggleSelectItem = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(itemId => itemId !== id));
      setSelectAll(false);
    } else {
      setSelectedIds([...selectedIds, id]);
      if (selectedIds.length + 1 === filteredSubscribers.length) {
        setSelectAll(true);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} subscriber${selectedIds.length > 1 ? 's' : ''}?`)) {
      return;
    }

    setLoading(true);

    try {
      let successCount = 0;
      let failCount = 0;

      // Process deletions sequentially to avoid overloading the server
      for (const id of selectedIds) {
        try {
          const response = await fetch(`/api/newsletter/${id}`, {
            method: 'DELETE',
          });

          if (response.ok) {
            successCount++;
          } else {
            failCount++;
          }
        } catch (err) {
          failCount++;
          console.error(`Error deleting subscriber ${id}:`, err);
        }
      }

      // Update the subscriber list
      if (successCount > 0) {
        setSubscribers(subscribers.filter(sub => !selectedIds.includes(sub._id)));
        setSelectedIds([]);
        setSelectAll(false);
      }

      alert(`Successfully deleted ${successCount} subscriber${successCount !== 1 ? 's' : ''}. ${failCount > 0 ? `Failed to delete ${failCount} subscriber${failCount !== 1 ? 's' : ''}.` : ''}`);
    } catch (err) {
      console.error('Error during bulk delete operation:', err);
      alert('An error occurred during bulk delete operation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="bg-gray-800 p-4 md:p-6 rounded-lg shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <h1 className="text-xl md:text-2xl font-bold text-white flex items-center justify-center md:justify-start w-full md:w-auto text-center md:text-left">
            Newsletter Subscribers
          </h1>

          <div className="flex flex-wrap gap-2 md:gap-4 w-full md:w-auto">
            <button
              onClick={fetchSubscribers}
              className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-blue-600 text-white text-sm md:text-base rounded hover:bg-blue-700 flex-1 md:flex-initial justify-center"
            >
              <FontAwesomeIcon icon={faSync} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-green-600 text-white text-sm md:text-base rounded hover:bg-green-700 flex-1 md:flex-initial justify-center"
            >
              <FontAwesomeIcon icon={faDownload} />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            {selectedIds.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-red-600 text-white text-sm md:text-base rounded hover:bg-red-700 flex-1 md:flex-initial justify-center"
                disabled={loading}
              >
                <FontAwesomeIcon icon={faTrash} />
                <span className="hidden sm:inline">Delete</span>
                <span className="inline ml-1">({selectedIds.length})</span>
              </button>
            )}
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search subscribers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:border-blue-500"
            />
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary)]"></div>
          </div>
        ) : error ? (
          <div className="bg-red-500/20 border border-red-500 p-4 rounded text-white mb-4">
            <p>{error}</p>
          </div>
        ) : filteredSubscribers.length === 0 ? (
          <div className="bg-gray-700 border border-gray-600 p-6 rounded text-center">
            <p className="text-gray-300">No subscribers found</p>
          </div>
        ) : (
          <div>
            {/* Mobile view - card layout */}
            <div className="md:hidden space-y-4">
              {filteredSubscribers.map((subscriber) => (
                <div key={subscriber._id} className={`bg-gray-900 p-4 rounded-lg ${!subscriber.active ? 'opacity-60' : ''}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(subscriber._id)}
                        onChange={() => toggleSelectItem(subscriber._id)}
                        className="h-4 w-4 mt-1 text-blue-600 border-gray-600 rounded bg-gray-700 focus:ring-blue-500 focus:ring-opacity-50 mr-3"
                      />
                      <div>
                        <h3 className="font-semibold text-white">{subscriber.name}</h3>
                        <p className="text-sm text-gray-400">{subscriber.email}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openHistoryModal(subscriber)}
                        className="text-blue-500 hover:text-blue-700 p-1"
                        title="View Details"
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button
                        onClick={() => handleUnsubscribe(subscriber)}
                        className={`${subscriber.active ? 'text-yellow-500 hover:text-yellow-700' : 'text-green-500 hover:text-green-700'} p-1`}
                        title={subscriber.active ? 'Unsubscribe' : 'Resubscribe'}
                      >
                        {subscriber.active ? '🔕' : '🔔'}
                      </button>
                      <button
                        onClick={() => handleDelete(subscriber._id)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Delete"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                    <div>
                      <span className="text-gray-500">Phone:</span>
                      <span className="ml-2 text-white">{subscriber.phone}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">WhatsApp:</span>
                      <span className="ml-2">
                        {subscriber.whatsapp ? (
                          <span className="text-green-500">Yes</span>
                        ) : (
                          <span className="text-gray-400">No</span>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs text-gray-400">
                    <div>
                      <span>Created: {new Date(subscriber.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className={`inline-block px-2 py-1 rounded ${subscriber.active ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
                        {subscriber.active ? 'Subscribed' : 'Unsubscribed'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop view - table layout */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full bg-gray-900 text-white rounded-lg overflow-hidden">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-4 py-3">
                      <div className="flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={selectAll}
                          onChange={toggleSelectAll}
                          className="h-4 w-4 text-blue-600 border-gray-600 rounded bg-gray-700 focus:ring-blue-500 focus:ring-opacity-50"
                        />
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faUser} className="text-gray-500" />
                        <span>Name</span>
                        {sortConfig.key === 'name' && (
                          <FontAwesomeIcon
                            icon={faSort}
                            className={`ml-1 ${sortConfig.direction === 'ascending' ? 'text-gray-300' : 'text-gray-300 transform rotate-180'}`}
                          />
                        )}
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('email')}
                    >
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faEnvelope} className="text-gray-500" />
                        <span>Email</span>
                        {sortConfig.key === 'email' && (
                          <FontAwesomeIcon
                            icon={faSort}
                            className={`ml-1 ${sortConfig.direction === 'ascending' ? 'text-gray-300' : 'text-gray-300 transform rotate-180'}`}
                          />
                        )}
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('phone')}
                    >
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faPhone} className="text-gray-500" />
                        <span>Phone</span>
                        {sortConfig.key === 'phone' && (
                          <FontAwesomeIcon
                            icon={faSort}
                            className={`ml-1 ${sortConfig.direction === 'ascending' ? 'text-gray-300' : 'text-gray-300 transform rotate-180'}`}
                          />
                        )}
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                    >
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faWhatsapp} className="text-gray-500" />
                        <span>WhatsApp</span>
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('active')}
                    >
                      <div className="flex items-center gap-2">
                        <span>Status</span>
                        {sortConfig.key === 'active' && (
                          <FontAwesomeIcon
                            icon={faSort}
                            className={`ml-1 ${sortConfig.direction === 'ascending' ? 'text-gray-300' : 'text-gray-300 transform rotate-180'}`}
                          />
                        )}
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('createdAt')}
                    >
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-500" />
                        <span>Created</span>
                        {sortConfig.key === 'createdAt' && (
                          <FontAwesomeIcon
                            icon={faSort}
                            className={`ml-1 ${sortConfig.direction === 'ascending' ? 'text-gray-300' : 'text-gray-300 transform rotate-180'}`}
                          />
                        )}
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('lastUpdated')}
                    >
                      <div className="flex items-center gap-2">
                        <span>Last Updated</span>
                        {sortConfig.key === 'lastUpdated' && (
                          <FontAwesomeIcon
                            icon={faSort}
                            className={`ml-1 ${sortConfig.direction === 'ascending' ? 'text-gray-300' : 'text-gray-300 transform rotate-180'}`}
                          />
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filteredSubscribers.map((subscriber) => (
                    <tr key={subscriber._id} className={`hover:bg-gray-800/50 transition duration-150 ${!subscriber.active ? 'opacity-60' : ''}`}>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(subscriber._id)}
                            onChange={() => toggleSelectItem(subscriber._id)}
                            className="h-4 w-4 text-blue-600 border-gray-600 rounded bg-gray-700 focus:ring-blue-500 focus:ring-opacity-50"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{subscriber.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{subscriber.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{subscriber.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {subscriber.whatsapp ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Yes
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            No
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {subscriber.active ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Subscribed
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Unsubscribed
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{formatDate(subscriber.createdAt)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {subscriber.lastUpdated ? formatDate(subscriber.lastUpdated) : formatDate(subscriber.createdAt)}
                        {subscriber.updateHistory && subscriber.updateHistory.length > 0 && (
                          <div className="text-xs text-gray-400 mt-1">
                            {subscriber.updateHistory[subscriber.updateHistory.length - 1].action}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-3 justify-end">
                          <button
                            onClick={() => openHistoryModal(subscriber)}
                            className="text-blue-500 hover:text-blue-700"
                            title="View Details"
                          >
                            <span className="sr-only">View Details</span>
                            <FontAwesomeIcon icon={faEye} />
                          </button>
                          <button
                            onClick={() => handleUnsubscribe(subscriber)}
                            className={`${subscriber.active ? 'text-yellow-500 hover:text-yellow-700' : 'text-green-500 hover:text-green-700'}`}
                            title={subscriber.active ? 'Unsubscribe' : 'Resubscribe'}
                          >
                            <span className="sr-only">{subscriber.active ? 'Unsubscribe' : 'Resubscribe'}</span>
                            {subscriber.active ? '🔕' : '🔔'}
                          </button>
                          <button
                            onClick={() => handleDelete(subscriber._id)}
                            className="text-red-500 hover:text-red-700"
                            title="Delete"
                          >
                            <span className="sr-only">Delete</span>
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-4 text-sm text-gray-400">
          {!loading && !error && (
            <p>Showing {filteredSubscribers.length} of {subscribers.length} subscribers</p>
          )}
        </div>
      </div>

      {/* History Modal - make it mobile friendly */}
      {showHistoryModal && selectedSubscriber && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] md:max-h-[80vh] overflow-hidden">
            <div className="flex justify-between items-center border-b border-gray-800 p-3 md:p-4">
              <h3 className="text-lg md:text-xl font-bold text-white truncate pr-2">
                {selectedSubscriber.name}
              </h3>
              <button
                onClick={closeHistoryModal}
                className="text-gray-400 hover:text-white p-1"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <div className="p-3 md:p-4 overflow-y-auto max-h-[calc(90vh-120px)] md:max-h-[calc(80vh-120px)]">
              <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <div className="bg-gray-800 p-3 rounded">
                  <p className="text-gray-400 text-xs md:text-sm">Email</p>
                  <p className="text-white text-sm md:text-base break-all">{selectedSubscriber.email}</p>
                </div>
                <div className="bg-gray-800 p-3 rounded">
                  <p className="text-gray-400 text-xs md:text-sm">Phone</p>
                  <p className="text-white text-sm md:text-base">{selectedSubscriber.phone}</p>
                </div>
                <div className="bg-gray-800 p-3 rounded">
                  <p className="text-gray-400 text-xs md:text-sm">WhatsApp</p>
                  <p className="text-white text-sm md:text-base">{selectedSubscriber.whatsapp ? "Enabled" : "Disabled"}</p>
                </div>
                <div className="bg-gray-800 p-3 rounded">
                  <p className="text-gray-400 text-xs md:text-sm">Current Status</p>
                  <p className={`font-medium text-sm md:text-base ${selectedSubscriber.active ? "text-green-500" : "text-red-500"}`}>
                    {selectedSubscriber.active ? "Subscribed" : "Unsubscribed"}
                  </p>
                </div>
              </div>

              <h4 className="text-base md:text-lg font-semibold text-white mb-3 border-b border-gray-800 pb-2">Update History</h4>

              {selectedSubscriber.updateHistory && selectedSubscriber.updateHistory.length > 0 ? (
                <div className="space-y-4">
                  {[...selectedSubscriber.updateHistory].reverse().map((update, index) => (
                    <div key={index} className="bg-gray-800 p-4 rounded">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${update.action.includes('unsubscribe') || update.action.includes('resubscribed')
                            ? (update.action.includes('unsubscribe') ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800")
                            : "bg-blue-100 text-blue-800"
                            }`}>
                            {update.action}
                          </span>
                        </div>
                        <div className="text-gray-400 text-sm">
                          {new Date(update.date).toLocaleDateString()} at {new Date(update.date).toLocaleTimeString()}
                        </div>
                      </div>

                      {/* Display for fields with value changes */}
                      {update.fields && update.fields.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-400 mb-1">
                            {update.action.includes('unsubscribe') ? 'Unsubscribe Details:' :
                              update.action.includes('resubscribed') ? 'Resubscribe Details:' :
                                'Updated Fields:'}
                          </p>
                          <div className="space-y-2">
                            {update.fields.map((field, i) => {
                              let displayName = field;
                              let badgeColor = "bg-gray-700";

                              // Better labeling for different field types
                              if (field === "name" || field === "Name") {
                                displayName = "Name";
                                badgeColor = "bg-yellow-700";
                              } else if (field === "email" || field === "Email") {
                                displayName = "Email Communication";
                                badgeColor = "bg-blue-700";
                              } else if (field === "phone" || field === "Phone") {
                                displayName = "Phone Communication";
                                badgeColor = "bg-purple-700";
                              } else if (field === "whatsapp" || field === "WhatsApp") {
                                displayName = "WhatsApp Communication";
                                badgeColor = "bg-green-700";
                              } else if (field === "active") {
                                displayName = "Subscription Status";
                                badgeColor = "bg-orange-700";
                              }

                              const prevValue = update.previousValues ? update.previousValues[field.toLowerCase()] : undefined;
                              const newValue = update.newValues ? update.newValues[field.toLowerCase()] : undefined;
                              const hasValueData = prevValue !== undefined && newValue !== undefined;

                              return (
                                <div key={i} className="bg-gray-700/30 p-2 rounded">
                                  <span
                                    className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${badgeColor} text-white mb-2`}
                                  >
                                    {displayName}
                                  </span>

                                  {hasValueData ? (
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                      <div className="bg-red-500/10 p-1.5 rounded border border-red-500/20">
                                        <span className="block text-gray-400 mb-1">Previous Value:</span>
                                        <span className="text-white">
                                          {field.toLowerCase() === 'whatsapp'
                                            ? (prevValue ? 'Enabled' : 'Disabled')
                                            : field.toLowerCase() === 'active'
                                              ? (prevValue ? 'Subscribed' : 'Unsubscribed')
                                              : (prevValue as React.ReactNode || 'None')}
                                        </span>
                                      </div>
                                      <div className="bg-green-500/10 p-1.5 rounded border border-green-500/20">
                                        <span className="block text-gray-400 mb-1">New Value:</span>
                                        <span className="text-white">
                                          {field.toLowerCase() === 'whatsapp'
                                            ? (newValue ? 'Enabled' : 'Disabled')
                                            : field.toLowerCase() === 'active'
                                              ? (newValue ? 'Subscribed' : 'Unsubscribed')
                                              : (newValue as React.ReactNode || 'None')}
                                        </span>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="text-xs text-gray-400">
                                      {field.toLowerCase() === 'active' ?
                                        (update.action.includes('unsubscribe') ? 'Changed to: Unsubscribed' : 'Changed to: Subscribed') :
                                        'Value details not available'}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {update.source && (
                        <div className="mt-2 text-sm text-gray-400">
                          <span className="font-medium">Updated From:</span> {update.source}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-400">
                  No update history available for this subscriber.
                </div>
              )}
            </div>

            <div className="border-t border-gray-800 p-3 md:p-4 bg-gray-900 flex justify-end">
              <button
                onClick={closeHistoryModal}
                className="px-4 py-2 bg-gray-700 text-white text-sm md:text-base rounded hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsletterAdmin; 