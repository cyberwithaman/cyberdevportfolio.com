"use client";

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faTrash,
  faSearch,
  faEye,
  faSort,
  faSortUp,
  faSortDown,
  faCheckCircle,
  faSpinner,
  faDownload,
  faFilter,
  faCalendar,
  faTrashAlt
} from '@fortawesome/free-solid-svg-icons';

// Define the ServiceRequest interface
interface ServiceRequest {
  _id: string;
  serviceTitle: string;
  name: string;
  email: string;
  phone: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

type SortField = '_id' | 'serviceTitle' | 'name' | 'email' | 'phone' | 'status';
type SortDirection = 'asc' | 'desc';

const ServicesRequestsAdmin: React.FC = () => {
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('_id');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [editFormData, setEditFormData] = useState<ServiceRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [serviceTitleFilter, setServiceTitleFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // New state variables
  const [uniqueServiceTitles, setUniqueServiceTitles] = useState<string[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);

  // Fetch service requests from the API
  const fetchServiceRequests = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/services/admin');
      
      if (!response.ok) {
        throw new Error('Failed to fetch service requests');
      }
      
      const data = await response.json();
      
      if (data.success) {
        const requests = data.data as ServiceRequest[];
        setServiceRequests(requests);
        
        // Extract unique service titles for the dropdown
        const titles = [...new Set(requests.map(req => req.serviceTitle))];
        setUniqueServiceTitles(titles.sort());
      } else {
        throw new Error(data.message || 'Failed to fetch service requests');
      }
    } catch (error) {
      console.error('Error fetching service requests:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while fetching data');
    } finally {
      setIsLoading(false);
    }
  };

  // Call fetchServiceRequests on component mount
  useEffect(() => {
    fetchServiceRequests();
  }, []);

  // Filter service requests based on search term and specific filters
  const filteredRequests = serviceRequests.filter(request => {
    // First, filter by search term (global search)
    const matchesSearch = 
      request.serviceTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Then apply specific filters if they're set
    const matchesServiceTitle = !serviceTitleFilter || 
      request.serviceTitle === serviceTitleFilter;
    
    // Date filter logic
    let matchesDateRange = true;
    
    if (startDate) {
      const requestDate = new Date(request.createdAt);
      const filterStartDate = new Date(startDate);
      matchesDateRange = requestDate >= filterStartDate;
    }
    
    if (endDate && matchesDateRange) {
      const requestDate = new Date(request.createdAt);
      const filterEndDate = new Date(endDate);
      // Set end date to the end of the day
      filterEndDate.setHours(23, 59, 59, 999);
      matchesDateRange = requestDate <= filterEndDate;
    }
    
    // Return true only if all active filters match
    return matchesSearch && matchesServiceTitle && matchesDateRange;
  });

  // Sort service requests
  const sortedRequests = [...filteredRequests].sort((a, b) => {
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

  // Handle delete click
  const handleDeleteClick = (id: string) => {
    setRequestToDelete(id);
    setShowDeleteModal(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (requestToDelete !== null) {
      try {
        const response = await fetch(`/api/services/admin?id=${requestToDelete}`, {
          method: 'DELETE',
        });

        const data = await response.json();

        if (data.success) {
          setServiceRequests(serviceRequests.filter(request => request._id !== requestToDelete));
          setShowDeleteModal(false);
          setRequestToDelete(null);
        } else {
          console.error('Failed to delete service request:', data.message);
        }
      } catch (error) {
        console.error('Error deleting service request:', error);
      }
    }
  };

  // Handle view request details
  const handleViewRequest = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setShowViewModal(true);
  };

  // Update request status
  const updateRequestStatus = async (id: string, status: string) => {
    try {
      if (!selectedRequest) return;

      const updatedRequest = { ...selectedRequest, status };

      const response = await fetch('/api/services/admin', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          serviceTitle: updatedRequest.serviceTitle,
          name: updatedRequest.name,
          email: updatedRequest.email,
          phone: updatedRequest.phone,
          description: updatedRequest.description,
          status,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setServiceRequests(serviceRequests.map(request =>
          request._id === id ? { ...request, status } : request
        ));
      } else {
        console.error('Failed to update service request status:', data.message);
      }
    } catch (error) {
      console.error('Error updating service request status:', error);
    }
  };

  // Handle edit click
  const handleEditClick = (request: ServiceRequest) => {
    setEditFormData({ ...request });
    setShowEditModal(true);
  };

  // Handle edit form change
  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFormData((prev: ServiceRequest | null) => prev ? {
      ...prev,
      [name]: value
    } : null);
  };

  // Save edit
  const handleSaveEdit = async () => {
    if (!editFormData) return;

    try {
      const response = await fetch('/api/services/admin', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editFormData._id,
          serviceTitle: editFormData.serviceTitle,
          name: editFormData.name,
          email: editFormData.email,
          phone: editFormData.phone,
          description: editFormData.description,
          status: editFormData.status,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setServiceRequests(serviceRequests.map(request =>
          request._id === editFormData._id ? { ...editFormData } : request
        ));
        setShowEditModal(false);
        setEditFormData(null);
      } else {
        console.error('Failed to update service request:', data.message);
      }
    } catch (error) {
      console.error('Error updating service request:', error);
    }
  };

  // Export data to CSV
  const exportToCSV = () => {
    // Column headers
    const headers = [
      'ID',
      'Service Title',
      'Name',
      'Email',
      'Phone',
      'Description',
      'Status',
      'Created At'
    ];

    // Format data for CSV
    const csvData = sortedRequests.map(request => [
      request._id,
      request.serviceTitle,
      request.name,
      request.email,
      request.phone,
      // Wrap description in quotes to handle commas within the text
      `"${request.description.replace(/"/g, '""')}"`,
      request.status,
      new Date(request.createdAt).toLocaleString()
    ]);

    // Combine headers and data
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    // Create a Blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    // Set up and trigger download
    link.setAttribute('href', url);
    link.setAttribute('download', `service-requests-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle item selection for bulk operations
  const handleItemSelection = (id: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedItems([...selectedItems, id]);
    } else {
      setSelectedItems(selectedItems.filter(item => item !== id));
    }
  };

  // Handle select all for bulk operations
  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedItems(sortedRequests.map(request => request._id));
    } else {
      setSelectedItems([]);
    }
  };

  // Toggle bulk delete modal
  const toggleBulkDeleteModal = () => {
    if (selectedItems.length > 0) {
      setShowBulkDeleteModal(true);
    }
  };

  // Confirm bulk delete
  const confirmBulkDelete = async () => {
    try {
      // Since our API doesn't support bulk delete natively, we'll
      // perform multiple sequential delete operations
      const deletePromises = selectedItems.map(id => 
        fetch(`/api/services/admin?id=${id}`, {
          method: 'DELETE',
        })
      );
      
      const results = await Promise.all(deletePromises);
      const deleteSuccess = results.every(res => res.ok);
      
      if (deleteSuccess) {
        setServiceRequests(serviceRequests.filter(request => !selectedItems.includes(request._id)));
        setSelectedItems([]);
        setShowBulkDeleteModal(false);
      } else {
        console.error('Failed to delete some service requests');
      }
    } catch (error) {
      console.error('Error performing bulk delete:', error);
    }
  };

  return (
    <div className="space-y-6 bg-[var(--background)] min-h-screen p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-semibold text-[var(--foreground)] text-center md:text-left">Service Requests</h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <FontAwesomeIcon icon={faSearch} className="text-[var(--primary)]" />
            </span>
            <input
              type="text"
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-[var(--primary)] rounded-md bg-[var(--muted)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] w-full"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 ${showFilters ? 'bg-[var(--secondary)]' : 'bg-[var(--muted)]'} border border-[var(--primary)] hover:bg-[var(--primary)]/20 text-[var(--foreground)] transition-colors duration-300 rounded-md flex items-center gap-2`}
          >
            <FontAwesomeIcon icon={faFilter} />
            Filters
          </button>
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-[var(--terminal-green)] hover:bg-[var(--terminal-green)]/80 text-white transition-colors duration-300 rounded-md flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faDownload} />
            Export CSV
          </button>
          <button
            onClick={() => fetchServiceRequests()}
            className="px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary)]/80 text-white transition-colors duration-300 rounded-md"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-[var(--muted)]/50 p-4 rounded-lg border border-[var(--primary)]/30 mt-4">
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-3">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="service-title-filter" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                Service Title
              </label>
              <select
                id="service-title-filter"
                value={serviceTitleFilter}
                onChange={(e) => setServiceTitleFilter(e.target.value)}
                className="w-full px-3 py-2 border border-[var(--primary)]/30 rounded-md bg-[var(--muted)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              >
                <option value="">All Service Titles</option>
                {uniqueServiceTitles.map((title, index) => (
                  <option key={index} value={title}>{title}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="start-date" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                Start Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faCalendar} className="text-[var(--primary)]/70" />
                </div>
                <input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-[var(--primary)]/30 rounded-md bg-[var(--muted)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="end-date" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                End Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faCalendar} className="text-[var(--primary)]/70" />
                </div>
                <input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-[var(--primary)]/30 rounded-md bg-[var(--muted)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                setServiceTitleFilter('');
                setStartDate('');
                setEndDate('');
              }}
              className="px-4 py-2 bg-[var(--muted)] border border-[var(--primary)] hover:bg-[var(--primary)]/10 text-[var(--foreground)] transition-colors duration-300 rounded-md"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* Loading and Error States */}
      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <FontAwesomeIcon icon={faSpinner} spin className="text-[var(--primary)] text-3xl mr-2" />
          <span className="text-[var(--foreground)]">Loading service requests...</span>
        </div>
      )}

      {error && !isLoading && (
        <div className="bg-[var(--glitch)]/20 text-[var(--glitch)] p-4 rounded-md">
          <p className="font-medium">Error: {error}</p>
          <button
            onClick={() => fetchServiceRequests()}
            className="mt-2 px-4 py-1 bg-[var(--glitch)] text-white rounded-md hover:bg-[var(--glitch)]/80 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Service Requests Table */}
      {!isLoading && !error && (
        <div className="bg-[var(--muted)] rounded-lg shadow-lg overflow-hidden cyberpunk-border">
          <div className="px-6 py-4 border-b border-[var(--primary)] flex items-center justify-between">
            <div className="text-sm text-[var(--foreground)]/60">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedItems.length === sortedRequests.length && sortedRequests.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="h-4 w-4 rounded border-[var(--primary)] text-[var(--primary)] focus:ring-[var(--primary)]"
                />
                <span>{selectedItems.length} items selected</span>
              </div>
            </div>
            {selectedItems.length > 0 && (
              <button
                onClick={toggleBulkDeleteModal}
                className="px-3 py-1 bg-[var(--glitch)] text-white rounded-md hover:bg-[var(--glitch)]/80 transition-colors flex items-center space-x-1"
              >
                <FontAwesomeIcon icon={faTrashAlt} />
                <span>Delete Selected</span>
              </button>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[var(--primary)]">
              <thead className="bg-[var(--muted)]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--primary)] uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === sortedRequests.length && sortedRequests.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="h-4 w-4 rounded border-[var(--primary)] text-[var(--primary)] focus:ring-[var(--primary)]"
                    />
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-[var(--primary)] uppercase tracking-wider cursor-pointer hover:text-[var(--secondary)] transition-colors"
                    onClick={() => handleSort('_id')}
                  >
                    <div className="flex items-center">
                      ID
                      <FontAwesomeIcon icon={getSortIcon('_id')} className="ml-1" />
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-[var(--primary)] uppercase tracking-wider cursor-pointer hover:text-[var(--secondary)] transition-colors"
                    onClick={() => handleSort('serviceTitle')}
                  >
                    <div className="flex items-center">
                      Service Title
                      <FontAwesomeIcon icon={getSortIcon('serviceTitle')} className="ml-1" />
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-[var(--primary)] uppercase tracking-wider cursor-pointer hover:text-[var(--secondary)] transition-colors"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      Name
                      <FontAwesomeIcon icon={getSortIcon('name')} className="ml-1" />
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-[var(--primary)] uppercase tracking-wider cursor-pointer hover:text-[var(--secondary)] transition-colors"
                    onClick={() => handleSort('email')}
                  >
                    <div className="flex items-center">
                      Email
                      <FontAwesomeIcon icon={getSortIcon('email')} className="ml-1" />
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-[var(--primary)] uppercase tracking-wider cursor-pointer hover:text-[var(--secondary)] transition-colors"
                    onClick={() => handleSort('phone')}
                  >
                    <div className="flex items-center">
                      Phone
                      <FontAwesomeIcon icon={getSortIcon('phone')} className="ml-1" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--primary)] uppercase tracking-wider">
                    Description
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-[var(--primary)] uppercase tracking-wider cursor-pointer hover:text-[var(--secondary)] transition-colors"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center">
                      Status
                      <FontAwesomeIcon icon={getSortIcon('status')} className="ml-1" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-[var(--primary)] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-[var(--muted)] divide-y divide-[var(--primary)]">
                {sortedRequests.map((request) => (
                  <tr key={request._id} className="hover:bg-[var(--background)]/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(request._id)}
                        onChange={(e) => handleItemSelection(request._id, e.target.checked)}
                        className="h-4 w-4 rounded border-[var(--primary)] text-[var(--primary)] focus:ring-[var(--primary)]"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--foreground)]">
                      {request._id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--foreground)]">
                      {request.serviceTitle}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--foreground)]">
                      {request.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--foreground)]">
                      {request.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--foreground)]">
                      {request.phone}
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--foreground)] max-w-xs truncate">
                      {request.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${request.status === 'completed'
                          ? 'bg-[var(--terminal-green)]/20 text-[var(--terminal-green)]'
                          : request.status === 'in-progress'
                            ? 'bg-[var(--secondary)]/20 text-[var(--secondary)]'
                            : 'bg-[var(--primary)]/20 text-[var(--primary)]'
                          }`}
                      >
                        {request.status === 'completed' && <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />}
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          className="text-[var(--secondary)] hover:text-[var(--secondary)]/80 transition-colors"
                          onClick={() => handleViewRequest(request)}
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                        <button
                          className="text-[var(--primary)] hover:text-[var(--primary)]/80 transition-colors"
                          onClick={() => handleEditClick(request)}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button
                          className="text-[var(--glitch)] hover:text-[var(--glitch)]/80 transition-colors"
                          onClick={() => handleDeleteClick(request._id)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {sortedRequests.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-6 py-4 text-center text-sm text-[var(--foreground)]/60">
                      {searchTerm || serviceTitleFilter || startDate || endDate ? 'No service requests found matching your filters.' : 'No service requests found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-[var(--primary)] flex items-center justify-between">
            <div className="text-sm text-[var(--foreground)]/60">
              Showing {filteredRequests.length} of {serviceRequests.length} service requests
              {selectedItems.length > 0 && ` (${selectedItems.length} selected)`}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-[var(--background)] opacity-90"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-[var(--muted)] rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full cyberpunk-border">
              <div className="bg-[var(--muted)] px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-[var(--glitch)]/20 sm:mx-0 sm:h-10 sm:w-10">
                    <FontAwesomeIcon icon={faTrash} className="text-[var(--glitch)]" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-[var(--foreground)]">Delete Service Request</h3>
                    <div className="mt-2">
                      <p className="text-sm text-[var(--foreground)]/60">
                        Are you sure you want to delete this service request? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-[var(--muted)] px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[var(--glitch)] text-base font-medium text-[var(--foreground)] hover:bg-[var(--glitch)]/80 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-[var(--primary)] shadow-sm px-4 py-2 bg-[var(--muted)] text-base font-medium text-[var(--foreground)] hover:bg-[var(--primary)]/10 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Request Modal */}
      {showViewModal && selectedRequest && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-[var(--background)] opacity-90"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-[var(--muted)] rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full cyberpunk-border">
              <div className="bg-[var(--muted)] px-4 pt-5 pb-4 sm:p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-[var(--foreground)]">Service Request Details</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-[var(--primary)]">ID</p>
                    <p className="mt-1 text-sm text-[var(--foreground)]">{selectedRequest._id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--primary)]">Service Title</p>
                    <p className="mt-1 text-sm text-[var(--foreground)]">{selectedRequest.serviceTitle}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--primary)]">Name</p>
                    <p className="mt-1 text-sm text-[var(--foreground)]">{selectedRequest.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--primary)]">Email</p>
                    <p className="mt-1 text-sm text-[var(--foreground)]">{selectedRequest.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--primary)]">Phone</p>
                    <p className="mt-1 text-sm text-[var(--foreground)]">{selectedRequest.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--primary)]">Description</p>
                    <p className="mt-1 text-sm text-[var(--foreground)]">{selectedRequest.description}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--primary)]">Date Submitted</p>
                    <p className="mt-1 text-sm text-[var(--foreground)]">
                      {new Date(selectedRequest.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--primary)]">Status</p>
                    <div className="mt-1">
                      <select
                        value={selectedRequest.status}
                        onChange={(e) => {
                          const newStatus = e.target.value;
                          setSelectedRequest({ ...selectedRequest, status: newStatus });
                          updateRequestStatus(selectedRequest._id, newStatus);
                        }}
                        className="block w-full border border-[var(--primary)] rounded-md shadow-sm py-2 px-3 bg-[var(--muted)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-opacity-50"
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-[var(--muted)] px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => setShowViewModal(false)}
                  className="w-full inline-flex justify-center rounded-md border border-[var(--primary)] shadow-sm px-4 py-2 bg-[var(--muted)] text-base font-medium text-[var(--foreground)] hover:bg-[var(--primary)]/10 focus:outline-none sm:w-auto sm:text-sm transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editFormData && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-[var(--background)] opacity-90"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-[var(--muted)] rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full cyberpunk-border">
              <div className="bg-[var(--muted)] px-4 pt-5 pb-4 sm:p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-[var(--foreground)]">Edit Service Request</h3>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }} className="space-y-4">
                  <div>
                    <label htmlFor="serviceTitle" className="block text-sm font-medium text-[var(--primary)]">Service Title</label>
                    <input
                      type="text"
                      id="serviceTitle"
                      name="serviceTitle"
                      value={editFormData.serviceTitle}
                      onChange={handleEditFormChange}
                      className="mt-1 block w-full border border-[var(--primary)] rounded-md shadow-sm py-2 px-3 bg-[var(--muted)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-opacity-50"
                    />
                  </div>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-[var(--primary)]">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={editFormData.name}
                      onChange={handleEditFormChange}
                      className="mt-1 block w-full border border-[var(--primary)] rounded-md shadow-sm py-2 px-3 bg-[var(--muted)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-opacity-50"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[var(--primary)]">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={editFormData.email}
                      onChange={handleEditFormChange}
                      className="mt-1 block w-full border border-[var(--primary)] rounded-md shadow-sm py-2 px-3 bg-[var(--muted)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-opacity-50"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-[var(--primary)]">Phone</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={editFormData.phone}
                      onChange={handleEditFormChange}
                      className="mt-1 block w-full border border-[var(--primary)] rounded-md shadow-sm py-2 px-3 bg-[var(--muted)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-opacity-50"
                    />
                  </div>
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-[var(--primary)]">Description</label>
                    <textarea
                      id="description"
                      name="description"
                      value={editFormData.description}
                      onChange={handleEditFormChange}
                      rows={3}
                      className="mt-1 block w-full border border-[var(--primary)] rounded-md shadow-sm py-2 px-3 bg-[var(--muted)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-opacity-50"
                    />
                  </div>
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-[var(--primary)]">Status</label>
                    <select
                      id="status"
                      name="status"
                      value={editFormData.status}
                      onChange={handleEditFormChange}
                      className="mt-1 block w-full border border-[var(--primary)] rounded-md shadow-sm py-2 px-3 bg-[var(--muted)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-opacity-50"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </form>
              </div>
              <div className="bg-[var(--muted)] px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[var(--primary)] text-base font-medium text-[var(--foreground)] hover:bg-[var(--primary)]/80 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditFormData(null);
                  }}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-[var(--primary)] shadow-sm px-4 py-2 bg-[var(--muted)] text-base font-medium text-[var(--foreground)] hover:bg-[var(--primary)]/10 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
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
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-[var(--background)] opacity-90"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-[var(--muted)] rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full cyberpunk-border">
              <div className="bg-[var(--muted)] px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-[var(--glitch)]/20 sm:mx-0 sm:h-10 sm:w-10">
                    <FontAwesomeIcon icon={faTrashAlt} className="text-[var(--glitch)]" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-[var(--foreground)]">Delete Multiple Service Requests</h3>
                    <div className="mt-2">
                      <p className="text-sm text-[var(--foreground)]/60">
                        Are you sure you want to delete {selectedItems.length} selected service requests? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-[var(--muted)] px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={confirmBulkDelete}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[var(--glitch)] text-base font-medium text-[var(--foreground)] hover:bg-[var(--glitch)]/80 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                >
                  Delete All
                </button>
                <button
                  type="button"
                  onClick={() => setShowBulkDeleteModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-[var(--primary)] shadow-sm px-4 py-2 bg-[var(--muted)] text-base font-medium text-[var(--foreground)] hover:bg-[var(--primary)]/10 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
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

export default ServicesRequestsAdmin;