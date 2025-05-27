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
    faTimesCircle,
    faExclamationCircle,
    faSync,
    faFileExport,
    faTrashAlt
} from '@fortawesome/free-solid-svg-icons';

// Define the ProjectRequest interface
interface ProjectRequest {
    _id: string;
    name: string;
    email: string;
    phone: string;
    projectType: string;
    description: string;
    date: string;
    status: 'new' | 'in-progress' | 'approved' | 'rejected';
}

type SortField = 'name' | 'email' | 'projectType' | 'date' | 'status';
type SortDirection = 'asc' | 'desc';
type RequestStatus = 'new' | 'in-progress' | 'approved' | 'rejected';

const ProjectsRequestsAdmin: React.FC = () => {
    const [requests, setRequests] = useState<ProjectRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState<SortField>('date');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showResponseModal, setShowResponseModal] = useState(false);
    const [currentRequest, setCurrentRequest] = useState<ProjectRequest | null>(null);
    const [statusFilter, setStatusFilter] = useState<RequestStatus | 'all'>('all');
    const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
    const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);

    // Fetch project requests from API
    const fetchRequests = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/project-requests');

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();
            setRequests(data.requests);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching project requests:', error);
            setError('Failed to load project requests. Please try again later.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    // Filter requests based on search term and status
    const filteredRequests = requests.filter(request => {
        const matchesSearch =
            request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.projectType.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.description.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || request.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Sort requests
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
        if (sortField !== field) {
            return <FontAwesomeIcon icon={faSort} className="ml-1" />;
        }
        return sortDirection === 'asc' ?
            <FontAwesomeIcon icon={faSortUp} className="ml-1" /> :
            <FontAwesomeIcon icon={faSortDown} className="ml-1" />;
    };

    // Handle view request
    const handleViewRequest = (request: ProjectRequest) => {
        setCurrentRequest(request);
        setShowViewModal(true);
    };

    // Handle respond to request
    const handleRespondRequest = (request: ProjectRequest) => {
        setCurrentRequest(request);
        setShowResponseModal(true);
    };

    // Handle delete request
    const handleDeleteRequest = (request: ProjectRequest) => {
        setCurrentRequest(request);
        setShowDeleteModal(true);
    };

    // Confirm delete
    const confirmDelete = async () => {
        if (currentRequest) {
            try {
                const response = await fetch(`/api/project-requests/${currentRequest._id}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error('Failed to delete project request');
                }

                setRequests(requests.filter(request => request._id !== currentRequest._id));
                setShowDeleteModal(false);
                setCurrentRequest(null);
            } catch (error) {
                console.error('Error deleting project request:', error);
                alert('Failed to delete project request. Please try again.');
            }
        }
    };

    // Handle bulk delete
    const handleBulkDelete = () => {
        if (selectedRequests.length > 0) {
            setShowBulkDeleteModal(true);
        } else {
            alert('Please select at least one request to delete');
        }
    };

    // Confirm bulk delete
    const confirmBulkDelete = async () => {
        try {
            // In a real app, you might want to use a batch delete endpoint
            // For now, we'll delete them one by one
            const deletePromises = selectedRequests.map(id =>
                fetch(`/api/project-requests/${id}`, {
                    method: 'DELETE',
                })
            );

            await Promise.all(deletePromises);

            setRequests(requests.filter(request => !selectedRequests.includes(request._id)));
            setSelectedRequests([]);
            setShowBulkDeleteModal(false);
        } catch (error) {
            console.error('Error bulk deleting project requests:', error);
            alert('Failed to delete some project requests. Please try again.');
        }
    };

    // Toggle select request
    const toggleSelectRequest = (id: string) => {
        setSelectedRequests(prev =>
            prev.includes(id)
                ? prev.filter(requestId => requestId !== id)
                : [...prev, id]
        );
    };

    // Select all visible requests
    const selectAllVisible = () => {
        if (selectedRequests.length === sortedRequests.length) {
            setSelectedRequests([]);
        } else {
            setSelectedRequests(sortedRequests.map(request => request._id));
        }
    };

    // Update request status
    const updateRequestStatus = async (id: string, status: RequestStatus) => {
        try {
            const response = await fetch(`/api/project-requests/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status }),
            });

            if (!response.ok) {
                throw new Error('Failed to update project request status');
            }

            const data = await response.json();
            setRequests(requests.map(request =>
                request._id === id ? data.request : request
            ));
        } catch (error) {
            console.error('Error updating project request status:', error);
            alert('Failed to update status. Please try again.');
        }
    };

    // Export to CSV
    const exportToCSV = () => {
        // Create CSV content
        const headers = ['Name', 'Email', 'Phone', 'Project Type', 'Description', 'Date', 'Status'];
        const csvContent = [
            headers.join(','),
            ...sortedRequests.map(request => [
                `"${request.name.replace(/"/g, '""')}"`,
                `"${request.email.replace(/"/g, '""')}"`,
                `"${request.phone.replace(/"/g, '""')}"`,
                `"${request.projectType.replace(/"/g, '""')}"`,
                `"${request.description.replace(/"/g, '""')}"`,
                `"${request.date.replace(/"/g, '""')}"`,
                `"${request.status.replace(/"/g, '""')}"`
            ].join(','))
        ].join('\n');

        // Create a blob and download link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `project-requests-${new Date().toISOString().slice(0, 10)}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Get status badge class
    const getStatusBadgeClass = (status: RequestStatus) => {
        switch (status) {
            case 'new':
                return 'bg-blue-100 text-blue-800';
            case 'in-progress':
                return 'bg-yellow-100 text-yellow-800';
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Get status icon
    const getStatusIcon = (status: RequestStatus) => {
        switch (status) {
            case 'new':
                return faExclamationCircle;
            case 'in-progress':
                return faEdit;
            case 'approved':
                return faCheckCircle;
            case 'rejected':
                return faTimesCircle;
            default:
                return faExclamationCircle;
        }
    };

    // Render content based on loading and error states
    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="w-12 h-12 border-4 border-t-4 border-[var(--primary)] rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-[var(--primary)]">Loading project requests...</p>
                    </div>
                </div>
            );
        }

        if (error) {
            return (
                <div className="cyberpunk-border bg-[var(--muted)]/30 p-8 text-center">
                    <p className="text-[var(--glitch)] mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-[var(--primary)] text-[var(--background)] rounded-md hover:bg-[var(--primary)]/80 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            );
        }

        if (requests.length === 0) {
            return (
                <div className="cyberpunk-border bg-[var(--muted)]/30 p-8 text-center">
                    <p className="text-[var(--foreground)]/70 mb-4">No project requests found</p>
                </div>
            );
        }

        return (
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[var(--primary)]/20">
                    <thead className="bg-[var(--muted)]/40">
                        <tr>
                            <th className="px-3 py-3">
                                <input
                                    type="checkbox"
                                    checked={selectedRequests.length === sortedRequests.length && sortedRequests.length > 0}
                                    onChange={selectAllVisible}
                                    className="h-4 w-4 text-[var(--primary)] focus:ring-[var(--primary)] border-[var(--primary)]/30 rounded"
                                />
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground)]/70 uppercase tracking-wider cursor-pointer hover:bg-[var(--muted)]/60 transition-colors"
                                onClick={() => handleSort('name')}
                            >
                                <div className="flex items-center">
                                    Name {getSortIcon('name')}
                                </div>
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground)]/70 uppercase tracking-wider cursor-pointer hover:bg-[var(--muted)]/60 transition-colors"
                                onClick={() => handleSort('projectType')}
                            >
                                <div className="flex items-center">
                                    Project Type {getSortIcon('projectType')}
                                </div>
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground)]/70 uppercase tracking-wider cursor-pointer hover:bg-[var(--muted)]/60 transition-colors"
                                onClick={() => handleSort('date')}
                            >
                                <div className="flex items-center">
                                    Date {getSortIcon('date')}
                                </div>
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground)]/70 uppercase tracking-wider cursor-pointer hover:bg-[var(--muted)]/60 transition-colors"
                                onClick={() => handleSort('status')}
                            >
                                <div className="flex items-center">
                                    Status {getSortIcon('status')}
                                </div>
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-[var(--foreground)]/70 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--primary)]/20">
                        {sortedRequests.map((request) => (
                            <tr key={request._id} className={`${request.status === 'new' ? 'bg-[var(--primary)]/10' : 'hover:bg-[var(--muted)]/40'} transition-colors`}>
                                <td className="px-3 py-4">
                                    <input
                                        type="checkbox"
                                        checked={selectedRequests.includes(request._id)}
                                        onChange={() => toggleSelectRequest(request._id)}
                                        className="h-4 w-4 text-[var(--primary)] focus:ring-[var(--primary)] border-[var(--primary)]/30 rounded"
                                    />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--foreground)]">
                                    {request.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--foreground)]/80">
                                    {request.projectType}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--foreground)]/80">
                                    {request.date}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(request.status as RequestStatus)}`}
                                    >
                                        <FontAwesomeIcon icon={getStatusIcon(request.status as RequestStatus)} className="mr-1" />
                                        {request.status === 'new' ? 'New' :
                                            request.status === 'in-progress' ? 'In Progress' :
                                                request.status === 'approved' ? 'Approved' : 'Rejected'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex justify-end space-x-2">
                                        <button
                                            className="text-[var(--primary)] hover:text-[var(--secondary)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)] rounded-md p-1"
                                            onClick={() => handleViewRequest(request)}
                                        >
                                            <FontAwesomeIcon icon={faEye} />
                                        </button>
                                        <button
                                            className="text-[var(--primary)] hover:text-[var(--secondary)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)] rounded-md p-1"
                                            onClick={() => handleRespondRequest(request)}
                                        >
                                            <FontAwesomeIcon icon={faEdit} />
                                        </button>
                                        <button
                                            className="text-[var(--glitch)] hover:text-[var(--glitch)]/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--glitch)] rounded-md p-1"
                                            onClick={() => handleDeleteRequest(request)}
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="space-y-6 bg-[var(--background)] min-h-screen p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h1 className="text-2xl font-semibold text-[var(--foreground)] text-center md:text-left">Project Requests</h1>
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
                            className="pl-10 pr-4 py-2 border border-[var(--primary)]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] w-full bg-[var(--muted)]/30 text-[var(--foreground)]"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as RequestStatus | 'all')}
                        className="px-4 py-2 border border-[var(--primary)]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--muted)]/30 text-[var(--foreground)]"
                    >
                        <option value="all">All Status</option>
                        <option value="new">New</option>
                        <option value="in-progress">In Progress</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                    <button
                        onClick={fetchRequests}
                        className="px-4 py-2 border border-[var(--primary)]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--muted)]/30 text-[var(--foreground)] hover:bg-[var(--muted)]/60 transition-colors"
                        title="Refresh requests"
                    >
                        <FontAwesomeIcon icon={faSync} className="mr-2" />
                        Refresh
                    </button>
                    <button
                        onClick={exportToCSV}
                        className="px-4 py-2 border border-[var(--primary)]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--muted)]/30 text-[var(--foreground)] hover:bg-[var(--muted)]/60 transition-colors"
                        title="Export to CSV"
                    >
                        <FontAwesomeIcon icon={faFileExport} className="mr-2" />
                        Export CSV
                    </button>
                    <button
                        onClick={handleBulkDelete}
                        disabled={selectedRequests.length === 0}
                        className={`px-4 py-2 border border-[var(--glitch)]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--glitch)] bg-[var(--muted)]/30 text-[var(--foreground)] hover:bg-[var(--glitch)]/10 transition-colors ${selectedRequests.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title="Bulk Delete"
                    >
                        <FontAwesomeIcon icon={faTrashAlt} className="mr-2" />
                        Bulk Delete ({selectedRequests.length})
                    </button>
                </div>
            </div>

            {/* Requests Table */}
            <div className="cyberpunk-border bg-[var(--muted)]/30 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden">
                {renderContent()}
                <div className="px-6 py-4 border-t border-[var(--primary)]/20 flex items-center justify-between bg-[var(--muted)]/40">
                    <div className="text-sm text-[var(--foreground)]/70">
                        Showing {filteredRequests.length} of {requests.length} requests
                    </div>
                    <div className="flex space-x-2">
                        <button className="px-3 py-1 border border-[var(--primary)]/30 rounded-md text-sm text-[var(--foreground)] hover:bg-[var(--muted)]/60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)]">
                            Previous
                        </button>
                        <button className="px-3 py-1 border border-[var(--primary)]/30 rounded-md text-sm text-[var(--foreground)] hover:bg-[var(--muted)]/60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)]">
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* View Request Modal */}
            {showViewModal && currentRequest && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-[var(--background)]/80 backdrop-blur-sm"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom cyberpunk-border bg-[var(--muted)]/30 backdrop-blur-sm rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="px-4 pt-5 pb-4 sm:p-6">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                                        <h3 className="text-lg leading-6 font-medium text-[var(--foreground)]">Project Request Details</h3>
                                        <div className="mt-4 space-y-4">
                                            <div>
                                                <p className="text-sm font-medium text-[var(--foreground)]/70">Name</p>
                                                <p className="mt-1 text-sm text-[var(--foreground)]">{currentRequest.name}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-[var(--foreground)]/70">Email</p>
                                                <p className="mt-1 text-sm text-[var(--foreground)]">{currentRequest.email}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-[var(--foreground)]/70">Phone</p>
                                                <p className="mt-1 text-sm text-[var(--foreground)]">{currentRequest.phone}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-[var(--foreground)]/70">Project Type</p>
                                                <p className="mt-1 text-sm text-[var(--foreground)]">{currentRequest.projectType}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-[var(--foreground)]/70">Description</p>
                                                <p className="mt-1 text-sm text-[var(--foreground)] whitespace-pre-wrap">{currentRequest.description}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-[var(--foreground)]/70">Date</p>
                                                <p className="mt-1 text-sm text-[var(--foreground)]">{currentRequest.date}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-[var(--foreground)]/70">Status</p>
                                                <div className="mt-1">
                                                    <select
                                                        value={currentRequest.status}
                                                        onChange={(e) => updateRequestStatus(currentRequest._id, e.target.value as RequestStatus)}
                                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-[var(--primary)]/30 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] sm:text-sm rounded-md bg-[var(--muted)]/30 text-[var(--foreground)]"
                                                    >
                                                        <option value="new">New</option>
                                                        <option value="in-progress">In Progress</option>
                                                        <option value="approved">Approved</option>
                                                        <option value="rejected">Rejected</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-[var(--muted)]/40 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    onClick={() => handleRespondRequest(currentRequest)}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[var(--primary)] text-base font-medium text-[var(--background)] hover:bg-[var(--primary)]/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)] sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    <FontAwesomeIcon icon={faEdit} className="mr-2" />
                                    Respond
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowViewModal(false)}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-[var(--primary)]/30 shadow-sm px-4 py-2 bg-[var(--muted)]/30 text-base font-medium text-[var(--foreground)] hover:bg-[var(--muted)]/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)] sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Response Modal */}
            {showResponseModal && currentRequest && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-[var(--background)]/80 backdrop-blur-sm"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom cyberpunk-border bg-[var(--muted)]/30 backdrop-blur-sm rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="px-4 pt-5 pb-4 sm:p-6">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                                        <h3 className="text-lg leading-6 font-medium text-[var(--foreground)]">Respond to Project Request</h3>
                                        <div className="mt-4 space-y-4">
                                            <div>
                                                <p className="text-sm font-medium text-[var(--foreground)]/70">To</p>
                                                <p className="mt-1 text-sm text-[var(--foreground)]">{currentRequest.email}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-[var(--foreground)]/70">Subject</p>
                                                <input
                                                    type="text"
                                                    defaultValue={`Re: Project Request - ${currentRequest.projectType}`}
                                                    className="mt-1 block w-full border border-[var(--primary)]/30 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] sm:text-sm bg-[var(--muted)]/30 text-[var(--foreground)]"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-[var(--foreground)]/70">Status</p>
                                                <select
                                                    value={currentRequest.status}
                                                    onChange={(e) => updateRequestStatus(currentRequest._id, e.target.value as RequestStatus)}
                                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-[var(--primary)]/30 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] sm:text-sm rounded-md bg-[var(--muted)]/30 text-[var(--foreground)]"
                                                >
                                                    <option value="new">New</option>
                                                    <option value="in-progress">In Progress</option>
                                                    <option value="approved">Approved</option>
                                                    <option value="rejected">Rejected</option>
                                                </select>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-[var(--foreground)]/70">Message</p>
                                                <textarea
                                                    rows={6}
                                                    className="mt-1 block w-full border border-[var(--primary)]/30 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] sm:text-sm bg-[var(--muted)]/30 text-[var(--foreground)]"
                                                    placeholder="Type your response here..."
                                                    defaultValue={`Dear ${currentRequest.name},\n\nThank you for your interest in our services. Regarding your request for ${currentRequest.projectType}, we...`}
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-[var(--muted)]/40 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    onClick={() => {
                                        updateRequestStatus(currentRequest._id, 'in-progress' as RequestStatus);
                                        setShowResponseModal(false);
                                    }}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[var(--primary)] text-base font-medium text-[var(--background)] hover:bg-[var(--primary)]/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)] sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Send Response
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowResponseModal(false)}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-[var(--primary)]/30 shadow-sm px-4 py-2 bg-[var(--muted)]/30 text-base font-medium text-[var(--foreground)] hover:bg-[var(--muted)]/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)] sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && currentRequest && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-[var(--background)]/80 backdrop-blur-sm"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom cyberpunk-border bg-[var(--muted)]/30 backdrop-blur-sm rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-[var(--glitch)]/10 sm:mx-0 sm:h-10 sm:w-10">
                                        <FontAwesomeIcon icon={faTrash} className="text-[var(--glitch)]" />
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-[var(--foreground)]">Delete Project Request</h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-[var(--foreground)]/70">
                                                Are you sure you want to delete this project request from {currentRequest.name}? This action cannot be undone.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-[var(--muted)]/40 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    onClick={confirmDelete}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[var(--glitch)] text-base font-medium text-[var(--background)] hover:bg-[var(--glitch)]/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--glitch)] sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Delete
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowDeleteModal(false)}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-[var(--primary)]/30 shadow-sm px-4 py-2 bg-[var(--muted)]/30 text-base font-medium text-[var(--foreground)] hover:bg-[var(--muted)]/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)] sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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
                            <div className="absolute inset-0 bg-[var(--background)]/80 backdrop-blur-sm"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom cyberpunk-border bg-[var(--muted)]/30 backdrop-blur-sm rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-[var(--glitch)]/10 sm:mx-0 sm:h-10 sm:w-10">
                                        <FontAwesomeIcon icon={faTrashAlt} className="text-[var(--glitch)]" />
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-[var(--foreground)]">Bulk Delete Project Requests</h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-[var(--foreground)]/70">
                                                Are you sure you want to delete {selectedRequests.length} selected project requests? This action cannot be undone.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-[var(--muted)]/40 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    onClick={confirmBulkDelete}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[var(--glitch)] text-base font-medium text-[var(--background)] hover:bg-[var(--glitch)]/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--glitch)] sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Delete All
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowBulkDeleteModal(false)}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-[var(--primary)]/30 shadow-sm px-4 py-2 bg-[var(--muted)]/30 text-base font-medium text-[var(--foreground)] hover:bg-[var(--muted)]/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)] sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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

export default ProjectsRequestsAdmin; 