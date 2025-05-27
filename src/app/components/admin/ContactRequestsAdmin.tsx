"use client";

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope,
  faTrash,
  faSearch,
  faEye,
  faSort,
  faSortUp,
  faSortDown,
  faReply,
  faCheckCircle,
  faExclamationCircle,
  faSpinner,
  faFileExport,
  faSync
} from '@fortawesome/free-solid-svg-icons';

// Define Contact type
interface Contact {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
  status: 'new' | 'in-progress' | 'completed';
  notes?: string;
}

type SortField = 'name' | 'email' | 'phone' | 'subject' | 'date' | 'status';
type SortDirection = 'asc' | 'desc';
type ContactStatus = 'new' | 'in-progress' | 'completed';

const ContactRequestsAdmin: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [currentContact, setCurrentContact] = useState<Contact | null>(null);
  const [statusFilter, setStatusFilter] = useState<ContactStatus | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [replySubject, setReplySubject] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // New state variables for bulk selection and actions
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  // Fetch contact requests on component mount
  useEffect(() => {
    fetchContacts();
  }, []);

  // Filter contacts
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Fetch contacts from the API
  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/contact');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch contact requests');
      }

      setContacts(data.data);
      // Clear selection when fetching new data
      setSelectedContacts([]);
      setSelectAll(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
      console.error('Error fetching contacts:', err);
    } finally {
      setLoading(false);
    }
  };

  // Update contact status
  const updateContactStatus = async (id: string, status: ContactStatus) => {
    try {
      setSubmitting(true);

      const response = await fetch(`/api/contact/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update contact status');
      }

      // Update the contact in the local state
      setContacts(contacts.map(contact =>
        contact._id === id ? { ...contact, status } : contact
      ));

      // If the current contact is the one being updated, update it too
      if (currentContact && currentContact._id === id) {
        setCurrentContact({ ...currentContact, status });
      }

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      console.error('Error updating contact status:', err);
      alert('Failed to update contact status: ' + errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // Delete contact
  const confirmDelete = async () => {
    if (!currentContact) return;

    try {
      setSubmitting(true);

      const response = await fetch(`/api/contact/${currentContact._id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete contact');
      }

      // Remove the contact from the local state
      setContacts(contacts.filter(contact => contact._id !== currentContact._id));
      setShowDeleteModal(false);
      setCurrentContact(null);

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      console.error('Error deleting contact:', err);
      alert('Failed to delete contact: ' + errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle reply to contact
  const handleReplyContact = (contact: Contact) => {
    setCurrentContact(contact);
    setReplySubject(`Re: ${contact.subject}`);
    setReplyMessage('');
    setShowReplyModal(true);
  };

  // Send reply
  const sendReply = async () => {
    if (!currentContact) return;

    try {
      setSubmitting(true);

      // In a real application, you would send the email here
      // For now, we'll just update the status
      await updateContactStatus(currentContact._id, 'in-progress');

      // Close the modal
      setShowReplyModal(false);
      setReplySubject('');
      setReplyMessage('');

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      console.error('Error sending reply:', err);
      alert('Failed to send reply: ' + errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // Sort contacts
  const sortedContacts = [...filteredContacts].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Handle sort click
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Get sort icon
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return faSort;
    return sortDirection === 'asc' ? faSortUp : faSortDown;
  };

  // Handle view contact
  const handleViewContact = (contact: Contact) => {
    setCurrentContact(contact);
    setShowViewModal(true);
  };

  // Handle delete contact
  const handleDeleteContact = (contact: Contact) => {
    setCurrentContact(contact);
    setShowDeleteModal(true);
  };

  // Get status badge class
  const getStatusBadgeClass = (status: ContactStatus) => {
    switch (status) {
      case 'new':
        return 'bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20';
      case 'in-progress':
        return 'bg-[var(--secondary)]/10 text-[var(--secondary)] border border-[var(--secondary)]/20';
      case 'completed':
        return 'bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20';
      default:
        return 'bg-[var(--muted)] text-[var(--foreground)]';
    }
  };

  // Get status icon
  const getStatusIcon = (status: ContactStatus) => {
    switch (status) {
      case 'new':
        return faExclamationCircle;
      case 'in-progress':
        return faReply;
      case 'completed':
        return faCheckCircle;
      default:
        return faEnvelope;
    }
  };

  // Update the main container styling
  const mainContainerStyle = {
    backgroundColor: 'var(--background)',
    color: 'var(--foreground)',
    padding: '1.5rem',
    borderRadius: '0.5rem',
  };

  // Update the table styling
  const tableStyle = {
    backgroundColor: 'var(--card)',
    borderColor: 'var(--border)',
    color: 'var(--foreground)',
  };

  // Update the header styling
  const headerStyle = {
    backgroundColor: 'var(--muted)',
    color: 'var(--foreground)',
  };

  // Update the cell styling
  const cellStyle = {
    color: 'var(--foreground)',
    borderColor: 'var(--border)',
  };

  // Update the input and select styling
  const inputStyle = {
    backgroundColor: 'var(--input)',
    color: 'var(--foreground)',
    borderColor: 'var(--border)',
    '&:focus': {
      borderColor: 'var(--primary)',
      boxShadow: '0 0 0 2px var(--primary)/20',
    },
  };

  // Update the button styling
  const buttonStyle = {
    backgroundColor: 'var(--primary)',
    color: 'white',
    '&:hover': {
      backgroundColor: 'var(--primary)/90',
    },
  };

  // Update the modal styling
  const modalOverlayStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(4px)',
  };

  const modalContentStyle = {
    backgroundColor: 'var(--card)',
    borderRadius: '0.5rem',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    border: '1px solid var(--border)',
  };

  // Bulk delete contacts
  const bulkDeleteContacts = async () => {
    if (selectedContacts.length === 0) return;

    try {
      setSubmitting(true);

      // Process deletion sequentially
      for (const id of selectedContacts) {
        const response = await fetch(`/api/contact/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || `Failed to delete contact with ID: ${id}`);
        }
      }

      // Refresh contacts after all deletions
      await fetchContacts();
      setShowBulkDeleteModal(false);

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      console.error('Error with bulk delete operation:', err);
      alert('Failed to delete contacts: ' + errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // Export contacts as CSV
  const exportAsCSV = () => {
    try {
      setExportLoading(true);

      // Get contacts to export (filtered or selected)
      const contactsToExport = selectedContacts.length > 0
        ? contacts.filter(contact => selectedContacts.includes(contact._id))
        : filteredContacts;

      // CSV Header
      const csvHeader = ['Name', 'Email', 'Phone', 'Subject', 'Message', 'Status', 'Date'];

      // Generate CSV rows from contacts
      const csvRows = contactsToExport.map(contact => [
        contact.name,
        contact.email,
        contact.phone,
        contact.subject,
        // Clean up message for CSV format
        contact.message.replace(/"/g, '""').replace(/\n/g, ' '),
        contact.status,
        new Date(contact.date).toLocaleString()
      ].map(field => `"${field}"`).join(','));

      // Combine header and rows
      const csvContent = [csvHeader.join(','), ...csvRows].join('\n');

      // Create a Blob and download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      // Set download attributes
      link.setAttribute('href', url);
      link.setAttribute('download', `contact_requests_${new Date().toISOString().split('T')[0]}.csv`);

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Failed to export CSV. Please try again.');
    } finally {
      setExportLoading(false);
    }
  };

  // Toggle selection of a contact
  const toggleContactSelection = (id: string) => {
    setSelectedContacts(prev => {
      if (prev.includes(id)) {
        return prev.filter(contactId => contactId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Handle toggle select all
  const handleToggleSelectAll = () => {
    if (!selectAll) {
      // If turning on selectAll, select all filtered contacts
      setSelectedContacts(filteredContacts.map(contact => contact._id));
    } else {
      // If turning off selectAll, clear selections
      setSelectedContacts([]);
    }
    setSelectAll(!selectAll);
  };

  return (
    <div className="space-y-6" style={mainContainerStyle}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-semibold text-[var(--foreground)] text-center md:text-left">Contact Requests</h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <FontAwesomeIcon icon={faSearch} className="text-[var(--muted-foreground)]" />
            </span>
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--input)] text-[var(--foreground)] w-full"
              style={inputStyle}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ContactStatus | 'all')}
            className="px-4 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--input)] text-[var(--foreground)]"
            style={inputStyle}
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        {selectedContacts.length > 0 && (
          <button
            onClick={() => setShowBulkDeleteModal(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
            disabled={submitting}
          >
            <FontAwesomeIcon icon={faTrash} className="mr-2" />
            Delete Selected ({selectedContacts.length})
          </button>
        )}

        <div className="flex-grow"></div>

        <div className="flex gap-2">
          <button
            onClick={exportAsCSV}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
            disabled={exportLoading || filteredContacts.length === 0}
          >
            {exportLoading ? (
              <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
            ) : (
              <FontAwesomeIcon icon={faFileExport} className="mr-2" />
            )}
            Export CSV
          </button>

          <button
            onClick={fetchContacts}
            className="px-4 py-2 bg-[var(--primary)] text-white rounded-md hover:bg-[var(--primary)]/90 transition-colors flex items-center"
            disabled={loading}
          >
            {loading ? (
              <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
            ) : (
              <FontAwesomeIcon icon={faSync} className="mr-2" />
            )}
            Refresh
          </button>
        </div>
      </div>

      {/* Contacts Table */}
      <div className="bg-[var(--card)] rounded-lg shadow overflow-hidden" style={tableStyle}>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <FontAwesomeIcon icon={faSpinner} className="text-[var(--primary)] text-3xl animate-spin" />
              <span className="ml-3 text-[var(--foreground)]">Loading contact requests...</span>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-red-500">{error}</p>
              <button
                onClick={fetchContacts}
                className="mt-4 px-4 py-2 bg-[var(--primary)] text-white rounded-md hover:bg-[var(--primary)]/90"
              >
                Try Again
              </button>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-[var(--border)]">
              <thead className="bg-[var(--muted)]" style={headerStyle}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground)] uppercase tracking-wider">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleToggleSelectAll}
                        className="h-4 w-4 text-[var(--primary)] focus:ring-[var(--primary)] rounded"
                      />
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground)] uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      Name
                      <FontAwesomeIcon icon={getSortIcon('name')} className="ml-1" />
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground)] uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('email')}
                  >
                    <div className="flex items-center">
                      Email
                      <FontAwesomeIcon icon={getSortIcon('email')} className="ml-1" />
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground)] uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('phone')}
                  >
                    <div className="flex items-center">
                      Phone
                      <FontAwesomeIcon icon={getSortIcon('phone')} className="ml-1" />
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground)] uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('subject')}
                  >
                    <div className="flex items-center">
                      Subject
                      <FontAwesomeIcon icon={getSortIcon('subject')} className="ml-1" />
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground)] uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('date')}
                  >
                    <div className="flex items-center">
                      Date
                      <FontAwesomeIcon icon={getSortIcon('date')} className="ml-1" />
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground)] uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center">
                      Status
                      <FontAwesomeIcon icon={getSortIcon('status')} className="ml-1" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-[var(--foreground)] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-[var(--card)] divide-y divide-[var(--border)]">
                {sortedContacts.map((contact) => (
                  <tr key={contact._id} className={contact.status === 'new' ? 'bg-[var(--primary)]/5' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={cellStyle}>
                      <input
                        type="checkbox"
                        checked={selectedContacts.includes(contact._id)}
                        onChange={() => toggleContactSelection(contact._id)}
                        className="h-4 w-4 text-[var(--primary)] focus:ring-[var(--primary)] rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--foreground)]" style={cellStyle}>
                      {contact.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--muted-foreground)]" style={cellStyle}>
                      {contact.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--muted-foreground)]" style={cellStyle}>
                      {contact.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--muted-foreground)] max-w-xs truncate" style={cellStyle}>
                      {contact.subject}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--muted-foreground)]" style={cellStyle}>
                      {new Date(contact.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(contact.status as ContactStatus)}`}
                      >
                        <FontAwesomeIcon icon={getStatusIcon(contact.status as ContactStatus)} className="mr-1" />
                        {contact.status === 'new' ? 'New' :
                          contact.status === 'in-progress' ? 'In Progress' : 'Completed'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          className="text-[var(--primary)] hover:text-[var(--primary)]/80"
                          onClick={() => handleViewContact(contact)}
                          style={buttonStyle}
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                        <button
                          className="text-[var(--secondary)] hover:text-[var(--secondary)]/80"
                          onClick={() => handleReplyContact(contact)}
                          style={buttonStyle}
                        >
                          <FontAwesomeIcon icon={faReply} />
                        </button>
                        <button
                          className="text-[var(--accent)] hover:text-[var(--accent)]/80"
                          onClick={() => handleDeleteContact(contact)}
                          style={buttonStyle}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredContacts.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-sm text-[var(--muted-foreground)]">
                      No contact requests found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        <div className="px-6 py-4 border-t border-[var(--border)] flex items-center justify-between">
          <div className="text-sm text-[var(--muted-foreground)]">
            Showing {filteredContacts.length} of {contacts.length} contacts
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-[var(--border)] rounded-md text-sm text-[var(--foreground)] hover:bg-[var(--accent)]/10">
              Previous
            </button>
            <button className="px-3 py-1 border border-[var(--border)] rounded-md text-sm text-[var(--foreground)] hover:bg-[var(--accent)]/10">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* View Contact Modal */}
      {showViewModal && currentContact && (
        <div className="fixed inset-0 z-50 overflow-y-auto" style={modalOverlayStyle}>
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="relative w-full max-w-lg bg-[var(--card)]" style={modalContentStyle}>
              <div className="bg-[var(--card)] px-4 pt-5 pb-4 sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-[var(--foreground)]">Contact Request Details</h3>
                    <div className="mt-4 space-y-4">
                      <div>
                        <p className="text-sm font-medium text-[var(--muted-foreground)]">Name</p>
                        <p className="mt-1 text-sm text-[var(--foreground)]">{currentContact.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[var(--muted-foreground)]">Email</p>
                        <p className="mt-1 text-sm text-[var(--foreground)]">{currentContact.email}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[var(--muted-foreground)]">Phone</p>
                        <p className="mt-1 text-sm text-[var(--foreground)]">{currentContact.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[var(--muted-foreground)]">Subject</p>
                        <p className="mt-1 text-sm text-[var(--foreground)]">{currentContact.subject}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[var(--muted-foreground)]">Message</p>
                        <p className="mt-1 text-sm text-[var(--foreground)] whitespace-pre-wrap">{currentContact.message}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[var(--muted-foreground)]">Date</p>
                        <p className="mt-1 text-sm text-[var(--foreground)]">{new Date(currentContact.date).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[var(--muted-foreground)]">Status</p>
                        <div className="mt-1">
                          <select
                            value={currentContact.status}
                            onChange={(e) => updateContactStatus(currentContact._id, e.target.value as ContactStatus)}
                            disabled={submitting}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-[var(--border)] focus:outline-none focus:ring-[var(--primary)] focus:border-[var(--primary)] sm:text-sm rounded-md bg-[var(--input)] text-[var(--foreground)]"
                          >
                            <option value="new">New</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-[var(--muted)] px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => handleReplyContact(currentContact)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                >
                  <FontAwesomeIcon icon={faReply} className="mr-2" />
                  Reply
                </button>
                <button
                  type="button"
                  onClick={() => setShowViewModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-[var(--border)] shadow-sm px-4 py-2 bg-[var(--card)] text-[var(--foreground)] hover:bg-[var(--accent)]/10 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {showReplyModal && currentContact && (
        <div className="fixed inset-0 z-50 overflow-y-auto" style={modalOverlayStyle}>
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="relative w-full max-w-lg bg-[var(--card)]" style={modalContentStyle}>
              <div className="bg-[var(--card)] px-4 pt-5 pb-4 sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-[var(--foreground)]">Reply to {currentContact.name}</h3>
                    <div className="mt-4 space-y-4">
                      <div>
                        <p className="text-sm font-medium text-[var(--muted-foreground)]">To</p>
                        <p className="mt-1 text-sm text-[var(--foreground)]">{currentContact.email}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[var(--muted-foreground)]">Phone</p>
                        <p className="mt-1 text-sm text-[var(--foreground)]">{currentContact.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[var(--muted-foreground)]">Subject</p>
                        <input
                          type="text"
                          value={replySubject}
                          onChange={(e) => setReplySubject(e.target.value)}
                          className="mt-1 block w-full border-[var(--border)] rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[var(--primary)] focus:border-[var(--primary)] sm:text-sm bg-[var(--input)] text-[var(--foreground)]"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[var(--muted-foreground)]">Message</p>
                        <textarea
                          rows={6}
                          value={replyMessage}
                          onChange={(e) => setReplyMessage(e.target.value)}
                          className="mt-1 block w-full border-[var(--border)] rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[var(--primary)] focus:border-[var(--primary)] sm:text-sm bg-[var(--input)] text-[var(--foreground)]"
                          placeholder="Type your reply here..."
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-[var(--muted)] px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={sendReply}
                  disabled={submitting}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {submitting ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>Send Reply</>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowReplyModal(false)}
                  disabled={submitting}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-[var(--border)] shadow-sm px-4 py-2 bg-[var(--card)] text-[var(--foreground)] hover:bg-[var(--accent)]/10 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && currentContact && (
        <div className="fixed inset-0 z-50 overflow-y-auto" style={modalOverlayStyle}>
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="relative w-full max-w-lg bg-[var(--card)]" style={modalContentStyle}>
              <div className="bg-[var(--card)] px-4 pt-5 pb-4 sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <FontAwesomeIcon icon={faTrash} className="text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-[var(--foreground)]">Delete Contact Request</h3>
                    <div className="mt-2">
                      <p className="text-sm text-[var(--muted-foreground)]">
                        Are you sure you want to delete this contact request from {currentContact.name}? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-[var(--muted)] px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={confirmDelete}
                  disabled={submitting}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {submitting ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                      Deleting...
                    </>
                  ) : (
                    <>Delete</>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={submitting}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-[var(--border)] shadow-sm px-4 py-2 bg-[var(--card)] text-[var(--foreground)] hover:bg-[var(--accent)]/10 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {showBulkDeleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto" style={modalOverlayStyle}>
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="relative w-full max-w-lg bg-[var(--card)]" style={modalContentStyle}>
              <div className="bg-[var(--card)] px-4 pt-5 pb-4 sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <FontAwesomeIcon icon={faTrash} className="text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-[var(--foreground)]">Bulk Delete Confirmation</h3>
                    <div className="mt-2">
                      <p className="text-sm text-[var(--muted-foreground)]">
                        Are you sure you want to delete {selectedContacts.length} selected contact requests? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-[var(--muted)] px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={bulkDeleteContacts}
                  disabled={submitting}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {submitting ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                      Deleting...
                    </>
                  ) : (
                    <>Delete Selected</>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowBulkDeleteModal(false)}
                  disabled={submitting}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-[var(--border)] shadow-sm px-4 py-2 bg-[var(--card)] text-[var(--foreground)] hover:bg-[var(--accent)]/10 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactRequestsAdmin;