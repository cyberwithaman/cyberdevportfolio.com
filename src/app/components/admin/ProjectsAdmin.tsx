"use client";

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faTrash,
  faPlus,
  faSearch,
  faEye,
  faSort,
  faSortUp,
  faSortDown,
  faSync
} from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

interface Project {
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  technologies: string[];
  image: string;
  features: string[];
  category: string;
  tags?: string[];
  date: string;
  status: string;
  featured: boolean;
  delay?: number;
  githubUrl?: string;
  imageUrl?: string;
}

type SortField = 'title' | 'category' | 'status' | 'date' | 'featured';
type SortDirection = 'asc' | 'desc';

const ProjectsAdmin: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('title');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [refreshing, setRefreshing] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Handle image upload
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [useExternalUrl, setUseExternalUrl] = useState(false);

  // API call state
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState<string | null>(null);

  // Fetch projects from API
  const fetchProjects = async () => {
    try {
      setLoading(true);
      setApiError(null);
      const response = await fetch('/api/projects');
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      setProjects(data.projects);
      setLoading(false);
      setSelectedProjects([]);
      setCurrentPage(1);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      setError("Failed to load projects. Please try again later.");
      setApiError("Failed to load projects. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Show temporary success message
  const showSuccessMessage = (message: string) => {
    setApiSuccess(message);
    setTimeout(() => {
      setApiSuccess(null);
    }, 3000);
  };

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchProjects();
    setTimeout(() => setRefreshing(false), 500); // Show refresh animation for at least 500ms
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedProjects.length > 0) {
      setShowBulkDeleteModal(true);
    }
  };

  // Confirm bulk delete
  const confirmBulkDelete = async () => {
    setApiError(null);

    try {
      const deletePromises = selectedProjects.map(slug =>
        fetch(`/api/projects/${slug}`, { method: 'DELETE' })
      );

      const results = await Promise.allSettled(deletePromises);
      const failedResults = results.filter(result => result.status === 'rejected');
      const failedCount = failedResults.length;

      if (failedCount > 0) {
        const errorMessages = failedResults
          .map((result, index) => {
            if (result.status === 'rejected') {
              const projectSlug = selectedProjects[index];
              return `Failed to delete project "${projectSlug}": ${result.reason}`;
            }
            return null;
          })
          .filter(Boolean)
          .join(', ');

        setApiError(`Failed to delete ${failedCount} project(s). ${errorMessages}`);
      } else {
        showSuccessMessage(`Successfully deleted ${selectedProjects.length} project(s).`);
      }

      // Refresh projects
      await fetchProjects();
      setShowBulkDeleteModal(false);
    } catch (error) {
      console.error('Error deleting projects:', error);
      setApiError('Failed to delete projects. Please try again.');
    }
  };

  // Toggle project selection
  const toggleProjectSelection = (slug: string) => {
    setSelectedProjects(prev =>
      prev.includes(slug)
        ? prev.filter(id => id !== slug)
        : [...prev, slug]
    );
  };

  // Select all projects
  const toggleSelectAll = () => {
    if (selectedProjects.length === filteredProjects.length) {
      setSelectedProjects([]);
    } else {
      setSelectedProjects(filteredProjects.map(project => project.slug));
    }
  };

  // Add form state
  const [formData, setFormData] = useState<Omit<Project, 'slug'>>({
    title: '',
    description: '',
    longDescription: '',
    technologies: [],
    image: '',
    features: [],
    category: 'Cyber-Security',
    tags: [],
    status: 'Active',
    date: new Date().toISOString().split('T')[0],
    featured: false,
    delay: 0.1,
    githubUrl: '',
    imageUrl: ''
  });

  const [formErrors, setFormErrors] = useState({
    title: '',
    category: '',
    status: '',
    date: ''
  });

  // Add styles for modal overlay
  const modalOverlayStyle = {
    backgroundColor: 'rgba(10, 25, 47, 0.9)',
    backdropFilter: 'blur(4px)',
  };

  // Add styles for modal content
  const modalContentStyle = {
    backgroundColor: '#112240',
    borderRadius: '0.5rem',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  };

  // Add styles for input focus
  const inputFocusStyle = {
    outline: 'none',
    borderColor: '#64ffda',
    boxShadow: '0 0 0 2px rgba(100, 255, 218, 0.2)',
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
    // Clear error when user starts typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle array input changes
  const handleArrayInputChange = (name: string, value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(Boolean);
    setFormData(prev => ({
      ...prev,
      [name]: items
    }));
  };

  // Validate form
  const validateForm = () => {
    const errors = {
      title: '',
      category: '',
      status: '',
      date: ''
    };
    let isValid = true;

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
      isValid = false;
    }

    if (!formData.category) {
      errors.category = 'Category is required';
      isValid = false;
    }

    if (!formData.status) {
      errors.status = 'Status is required';
      isValid = false;
    }

    if (!formData.date) {
      errors.date = 'Date is required';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  // Handle image file change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);

      // Create a preview
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Reset external URL mode when a file is selected
      setUseExternalUrl(false);
    }
  };

  // Handle external URL input
  const handleExternalUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setFormData(prev => ({
      ...prev,
      imageUrl: url
    }));

    // Show preview of external URL
    if (url) {
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  };

  // Toggle between upload and external URL
  const toggleImageInputMethod = () => {
    setUseExternalUrl(!useExternalUrl);
    // Reset image state when toggling
    if (!useExternalUrl) {
      setImageFile(null);
      setImagePreview(formData.imageUrl || null);
      // Ensure imageUrl is defined in formData
      if (formData.imageUrl === undefined) {
        setFormData(prev => ({
          ...prev,
          imageUrl: ''
        }));
      }
    } else {
      setImagePreview(null);
    }
  };

  // Upload image to server/storage
  const uploadImage = async (): Promise<string> => {
    if (useExternalUrl && formData.imageUrl) {
      // Return the external URL directly
      return formData.imageUrl;
    }

    if (!imageFile) return formData.imageUrl || '';

    try {
      setUploadingImage(true);

      // Create form data for upload
      const formDataUpload = new FormData();
      formDataUpload.append('image', imageFile);

      // Upload to your image handling endpoint
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formDataUpload,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      setUploadingImage(false);

      // Return the image URL from the response
      return data.imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadingImage(false);
      alert('Failed to upload image. Please try again.');
      return formData.imageUrl || '';
    }
  };

  // Update handleSubmit with better error handling
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (validateForm()) {
      try {
        setUploadingImage(true);
        // Upload image if there's a new one
        let imageUrl = formData.imageUrl;
        if (imageFile) {
          imageUrl = await uploadImage();
          if (!imageUrl) {
            setApiError("Failed to upload image. Please try again.");
            setUploadingImage(false);
            return;
          }
        }

        // Ensure arrays are properly initialized
        const projectData = {
          ...formData,
          technologies: Array.isArray(formData.technologies) ? formData.technologies : [],
          features: Array.isArray(formData.features) ? formData.features : [],
          tags: Array.isArray(formData.tags) ? formData.tags : [],
          imageUrl
        };

        // Create project with image URL
        const response = await fetch('/api/projects', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(projectData),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error occurred' }));
          throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setProjects([...projects, data.project]);
        setShowAddModal(false);
        showSuccessMessage("Project created successfully!");

        // Reset form and image states
        resetForm();
        setImageFile(null);
        setImagePreview(null);
        setUploadingImage(false);
      } catch (error) {
        console.error('Error creating project:', error);
        setApiError(error instanceof Error ? error.message : "Failed to create project. Please try again.");
        setUploadingImage(false);
      }
    }
  };

  // Filter projects based on search term and category
  const filteredProjects = projects.filter(project =>
    (project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.status.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (categoryFilter === 'all' || project.category === categoryFilter)
  );

  // Get unique categories for filter
  const categories = ['all', ...Array.from(new Set(projects.map(project => project.category)))];

  // Sort projects
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortField === 'featured') {
      return sortDirection === 'asc'
        ? (a.featured === b.featured ? 0 : a.featured ? 1 : -1)
        : (a.featured === b.featured ? 0 : a.featured ? -1 : 1);
    }

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

  // Function to get the appropriate sort icon
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <FontAwesomeIcon icon={faSort} className="ml-1" />;
    }
    return sortDirection === 'asc' ?
      <FontAwesomeIcon icon={faSortUp} className="ml-1" /> :
      <FontAwesomeIcon icon={faSortDown} className="ml-1" />;
  };

  // Handle view project
  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    setShowViewModal(true);
  };

  // Handle edit project
  const handleProjectEdit = (project: Project) => {
    setSelectedProject(project);
    // Set form data from the selected project, including GitHub URL and image URL
    setFormData({
      title: project.title || '',
      description: project.description || '',
      longDescription: project.longDescription || '',
      technologies: project.technologies || [],
      image: project.image || '',
      features: project.features || [],
      category: project.category || 'Cyber-Security',
      tags: project.tags || [],
      status: project.status || 'Active',
      date: project.date || new Date().toISOString().split('T')[0],
      featured: project.featured || false,
      delay: project.delay || 0.1,
      githubUrl: project.githubUrl || '',
      imageUrl: project.imageUrl || '' // Ensure imageUrl is never undefined
    });
    // Reset image state when editing
    setImageFile(null);
    setImagePreview(project.imageUrl || null);
    setUseExternalUrl(!!project.imageUrl); // Set to true if imageUrl exists
    setShowEditModal(true);
  };

  // Handle delete project
  const handleProjectDelete = (project: Project) => {
    setProjectToDelete(project.slug);
    setShowDeleteModal(true);
  };

  // Update handleSaveEdit with better error handling
  const handleSaveEdit = async () => {
    setApiError(null);

    if (validateForm() && selectedProject) {
      try {
        setUploadingImage(true);
        // Upload image if there's a new one
        let imageUrl = formData.imageUrl;
        if (imageFile) {
          imageUrl = await uploadImage();
          if (!imageUrl) {
            setApiError("Failed to upload image. Please try again.");
            setUploadingImage(false);
            return;
          }
        }

        // Ensure arrays are properly initialized
        const projectData = {
          ...formData,
          technologies: Array.isArray(formData.technologies) ? formData.technologies : [],
          features: Array.isArray(formData.features) ? formData.features : [],
          tags: Array.isArray(formData.tags) ? formData.tags : [],
          imageUrl
        };

        const response = await fetch(`/api/projects/${selectedProject.slug}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(projectData),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error occurred' }));
          throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        const updatedProjects = projects.map(project =>
          project.slug === selectedProject.slug ? data.project : project
        );

        setProjects(updatedProjects);
        setShowEditModal(false);
        setSelectedProject(null);
        resetForm();
        setImageFile(null);
        setImagePreview(null);
        setUploadingImage(false);
        showSuccessMessage("Project updated successfully!");
      } catch (error) {
        console.error('Error updating project:', error);
        setApiError(error instanceof Error ? error.message : "Failed to update project. Please try again.");
        setUploadingImage(false);
      }
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      longDescription: '',
      technologies: [],
      image: '',
      features: [],
      category: 'Cyber-Security',
      tags: [],
      status: 'Active',
      date: new Date().toISOString().split('T')[0],
      featured: false,
      delay: 0.1,
      githubUrl: '',
      imageUrl: '' // Ensure imageUrl is initialized with an empty string
    });
    setFormErrors({
      title: '',
      category: '',
      status: '',
      date: ''
    });
    setImageFile(null);
    setImagePreview(null);
    setUseExternalUrl(false);
  };

  // Update handleConfirmDelete with better error handling
  const handleConfirmDelete = async () => {
    setApiError(null);

    if (projectToDelete) {
      try {
        const response = await fetch(`/api/projects/${projectToDelete}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error occurred' }));
          throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
        }

        setProjects(projects.filter(project => project.slug !== projectToDelete));
        setShowDeleteModal(false);
        setProjectToDelete(null);
        showSuccessMessage("Project deleted successfully!");
      } catch (error) {
        console.error('Error deleting project:', error);
        setApiError(error instanceof Error ? error.message : "Failed to delete project. Please try again.");
      }
    }
  };

  // Update pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedProjects.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedProjects.length / itemsPerPage);

  // Pagination navigation
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Render content based on loading and error states
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-t-4 border-[#64ffda] rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#64ffda]">Loading projects...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-[#112240] rounded-lg p-8 text-center">
          <p className="text-[#ff6b6b] mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#64ffda] text-[#0a192f] rounded-md hover:bg-[#4cd8c0] transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    // Handle no projects
    if (projects.length === 0) {
      return (
        <div className="bg-[#112240] rounded-lg p-8 text-center">
          <p className="text-gray-300 mb-4">No projects found</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-[#64ffda] text-[#0a192f] rounded-md hover:bg-[#4cd8c0] transition-colors"
          >
            Add Your First Project
          </button>
        </div>
      );
    }

    // Handle no filtered projects
    if (filteredProjects.length === 0) {
      return (
        <div className="bg-[#112240] rounded-lg p-8 text-center">
          <p className="text-gray-300 mb-4">No projects match your filter criteria</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setCategoryFilter('all');
            }}
            className="px-4 py-2 bg-[#64ffda] text-[#0a192f] rounded-md hover:bg-[#4cd8c0] transition-colors mr-2"
          >
            Clear Filters
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-[#64ffda] text-[#0a192f] rounded-md hover:bg-[#4cd8c0] transition-colors"
          >
            Add New Project
          </button>
        </div>
      );
    }

    // If projects exist, show the projects table
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#233554] border border-[#233554]">
          <thead className="bg-[#0a192f]">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                <input
                  type="checkbox"
                  checked={selectedProjects.length === filteredProjects.length && filteredProjects.length > 0}
                  onChange={toggleSelectAll}
                  className="h-4 w-4 text-[#64ffda] focus:ring-[#64ffda] border-[#64ffda] rounded"
                />
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('title')}
              >
                Title {getSortIcon('title')}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('category')}
              >
                Category {getSortIcon('category')}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('status')}
              >
                Status {getSortIcon('status')}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('date')}
              >
                Date {getSortIcon('date')}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('featured')}
              >
                Featured {getSortIcon('featured')}
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-[#112240] divide-y divide-[#233554]">
            {currentItems.map((project) => (
              <tr key={project.slug} className="hover:bg-[#1d3461] transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <input
                    type="checkbox"
                    checked={selectedProjects.includes(project.slug)}
                    onChange={() => toggleProjectSelection(project.slug)}
                    className="h-4 w-4 text-[#64ffda] focus:ring-[#64ffda] border-[#64ffda] rounded"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                  {project.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {project.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {project.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {project.featured ?
                    <span className="text-[#64ffda]">Yes</span> :
                    <span className="text-gray-500">No</span>
                  }
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleProjectSelect(project)}
                    className="text-[#64ffda] hover:text-[#4cd8c0] mx-2"
                    title="View Project"
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                  <button
                    onClick={() => handleProjectEdit(project)}
                    className="text-[#64ffda] hover:text-[#4cd8c0] mx-2"
                    title="Edit Project"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    onClick={() => handleProjectDelete(project)}
                    className="text-[#ff6b6b] hover:text-[#ff5252] mx-2"
                    title="Delete Project"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Helper function for status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-purple-100 text-purple-800';
      case 'On Hold':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 bg-[#0a192f] text-gray-100 p-6">
      {/* API Error or Success Messages */}
      {apiError && (
        <div className="bg-red-900 text-white p-3 rounded-md shadow-md">
          <p>{apiError}</p>
        </div>
      )}

      {apiSuccess && (
        <div className="bg-green-900 text-white p-3 rounded-md shadow-md">
          <p>{apiSuccess}</p>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-semibold text-[#64ffda] text-center md:text-left">Projects Management</h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <FontAwesomeIcon icon={faSearch} className="text-[#64ffda]" />
            </span>
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-[#64ffda] rounded-md focus:outline-none focus:ring-2 focus:ring-[#64ffda] bg-[#112240] text-gray-100 w-full"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-[#64ffda] rounded-md focus:outline-none focus:ring-2 focus:ring-[#64ffda] bg-[#112240] text-gray-100"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
          <button
            onClick={handleRefresh}
            className={`flex items-center justify-center bg-[#112240] text-[#64ffda] border border-[#64ffda] px-4 py-2 rounded-md hover:bg-[#233554] transition-colors ${refreshing ? 'animate-pulse' : ''}`}
            disabled={refreshing}
            title="Refresh Projects"
          >
            <FontAwesomeIcon icon={faSync} className={`${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center bg-[#64ffda] text-[#0a192f] px-4 py-2 rounded-md hover:bg-[#4cc9b8] transition-colors"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add Project
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedProjects.length > 0 && (
        <div className="bg-[#112240] p-3 rounded-md flex justify-between items-center">
          <span className="text-sm text-gray-300">
            {selectedProjects.length} {selectedProjects.length === 1 ? 'project' : 'projects'} selected
          </span>
          <button
            onClick={handleBulkDelete}
            className="flex items-center justify-center bg-[#ff6b6b] text-white px-4 py-2 rounded-md hover:bg-[#ff5252] transition-colors"
          >
            <FontAwesomeIcon icon={faTrash} className="mr-2" />
            Delete Selected
          </button>
        </div>
      )}

      {/* Projects Table */}
      <div className="bg-[#112240] rounded-lg shadow-lg overflow-hidden">
        {renderContent()}
        <div className="px-6 py-4 border-t border-[#233554] flex items-center justify-between">
          <div className="text-sm text-gray-300">
            Showing {currentItems.length > 0 ? `${indexOfFirstItem + 1}-${Math.min(indexOfLastItem, filteredProjects.length)}` : '0'} of {filteredProjects.length} projects
          </div>
          <div className="flex space-x-2 items-center">
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 border border-[#64ffda] rounded-md text-sm text-[#64ffda] bg-[#0a192f]"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className={`px-3 py-1 border border-[#64ffda] rounded-md text-sm text-[#64ffda] hover:bg-[#64ffda] hover:text-[#0a192f] transition-colors ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Previous
            </button>
            <span className="text-sm text-gray-300">
              Page {currentPage} of {totalPages || 1}
            </span>
            <button
              onClick={goToNextPage}
              disabled={currentPage >= totalPages}
              className={`px-3 py-1 border border-[#64ffda] rounded-md text-sm text-[#64ffda] hover:bg-[#64ffda] hover:text-[#0a192f] transition-colors ${currentPage >= totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* View Project Modal */}
      {showViewModal && selectedProject && (
        <div className="fixed inset-0 z-50 overflow-y-auto" style={modalOverlayStyle}>
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="relative w-full max-w-2xl" style={modalContentStyle}>
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-[#64ffda]">Project Details</h3>
                </div>

                {/* Project Image */}
                {selectedProject.imageUrl && (
                  <div className="mb-4">
                    <Image
                      src={selectedProject.imageUrl}
                      alt={selectedProject.title || 'Project image'}
                      className="w-full h-48 object-contain rounded-md border border-[#64ffda]"
                      width={400}
                      height={192}
                    />
                  </div>
                )}

                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Title</label>
                    <p className="mt-1 text-sm text-gray-100">{selectedProject.title}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300">Short Description</label>
                    <p className="mt-1 text-sm text-gray-100 whitespace-pre-wrap">{selectedProject.description}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300">Long Description</label>
                    <p className="mt-1 text-sm text-gray-100 whitespace-pre-wrap">{selectedProject.longDescription}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300">Technologies</label>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {selectedProject.technologies && selectedProject.technologies.map((tech, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-[#1d3461] text-[#64ffda]">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300">Features</label>
                    <ul className="mt-1 list-disc pl-5 text-sm text-gray-100">
                      {selectedProject.features && selectedProject.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>

                  {selectedProject.tags && selectedProject.tags.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300">Tags</label>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {selectedProject.tags.map((tag, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-[#1d3461] text-gray-300">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* GitHub URL */}
                  {selectedProject.githubUrl && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300">GitHub URL</label>
                      <a
                        href={selectedProject.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 text-sm text-[#64ffda] hover:underline inline-flex items-center"
                      >
                        {selectedProject.githubUrl}
                        <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-300">Category</label>
                    <p className="mt-1 text-sm text-gray-100">{selectedProject.category}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Status</label>
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedProject.status)}`}>
                      {selectedProject.status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Date</label>
                    <p className="mt-1 text-sm text-gray-100">{selectedProject.date}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Featured</label>
                    <p className="mt-1 text-sm">
                      {selectedProject.featured ?
                        <span className="text-[#64ffda]">Yes</span> :
                        <span className="text-gray-500">No</span>
                      }
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-[#0a192f] px-4 py-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedProject(null);
                  }}
                  className="px-4 py-2 border border-[#64ffda] text-[#64ffda] rounded-md hover:bg-[#64ffda] hover:text-[#0a192f] focus:outline-none focus:ring-2 focus:ring-[#64ffda] focus:ring-opacity-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {showEditModal && selectedProject && (
        <div className="fixed inset-0 z-50 overflow-y-auto" style={modalOverlayStyle}>
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="relative w-full max-w-lg" style={modalContentStyle}>
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-[#64ffda]">Edit Project</h3>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }} className="space-y-4">
                  {apiError && (
                    <div className="bg-red-900 text-white p-3 rounded-md text-sm">
                      <p>{apiError}</p>
                    </div>
                  )}
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-300">Title</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-[#64ffda] rounded-md shadow-sm py-2 px-3 bg-[#0a192f] text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#64ffda] focus:ring-opacity-50"
                      style={inputFocusStyle}
                    />
                    {formErrors.title && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.title}</p>
                    )}
                  </div>

                  {/* Description Field */}
                  <div>
                    <label htmlFor="edit-description" className="block text-sm font-medium text-gray-300">Short Description</label>
                    <textarea
                      id="edit-description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={2}
                      className="mt-1 block w-full border border-[#64ffda] rounded-md shadow-sm py-2 px-3 bg-[#0a192f] text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#64ffda] focus:ring-opacity-50"
                    ></textarea>
                  </div>

                  {/* Long Description Field */}
                  <div>
                    <label htmlFor="edit-longDescription" className="block text-sm font-medium text-gray-300">Long Description</label>
                    <textarea
                      id="edit-longDescription"
                      name="longDescription"
                      value={formData.longDescription}
                      onChange={handleInputChange}
                      rows={4}
                      className="mt-1 block w-full border border-[#64ffda] rounded-md shadow-sm py-2 px-3 bg-[#0a192f] text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#64ffda] focus:ring-opacity-50"
                    ></textarea>
                  </div>

                  {/* Technologies Field */}
                  <div>
                    <label htmlFor="edit-technologies" className="block text-sm font-medium text-gray-300">Technologies (comma separated)</label>
                    <input
                      type="text"
                      id="edit-technologies"
                      name="technologies"
                      value={Array.isArray(formData.technologies) ? formData.technologies.join(', ') : ''}
                      onChange={(e) => handleArrayInputChange('technologies', e.target.value)}
                      placeholder="React, Node.js, MongoDB"
                      className="mt-1 block w-full border border-[#64ffda] rounded-md shadow-sm py-2 px-3 bg-[#0a192f] text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#64ffda] focus:ring-opacity-50"
                    />
                  </div>

                  {/* Features Field */}
                  <div>
                    <label htmlFor="edit-features" className="block text-sm font-medium text-gray-300">Features (comma separated)</label>
                    <input
                      type="text"
                      id="edit-features"
                      name="features"
                      value={Array.isArray(formData.features) ? formData.features.join(', ') : ''}
                      onChange={(e) => handleArrayInputChange('features', e.target.value)}
                      placeholder="User authentication, Data visualization, API"
                      className="mt-1 block w-full border border-[#64ffda] rounded-md shadow-sm py-2 px-3 bg-[#0a192f] text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#64ffda] focus:ring-opacity-50"
                    />
                  </div>

                  {/* Tags Field */}
                  <div>
                    <label htmlFor="edit-tags" className="block text-sm font-medium text-gray-300">Tags (comma separated)</label>
                    <input
                      type="text"
                      id="edit-tags"
                      name="tags"
                      value={Array.isArray(formData.tags) ? formData.tags.join(', ') : ''}
                      onChange={(e) => handleArrayInputChange('tags', e.target.value)}
                      placeholder="Web, Development, Security"
                      className="mt-1 block w-full border border-[#64ffda] rounded-md shadow-sm py-2 px-3 bg-[#0a192f] text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#64ffda] focus:ring-opacity-50"
                    />
                  </div>

                  {/* GitHub URL Field */}
                  <div>
                    <label htmlFor="edit-githubUrl" className="block text-sm font-medium text-gray-300">GitHub URL</label>
                    <input
                      type="url"
                      id="edit-githubUrl"
                      name="githubUrl"
                      value={formData.githubUrl}
                      onChange={handleInputChange}
                      placeholder="https://github.com/username/repo"
                      className="mt-1 block w-full border border-[#64ffda] rounded-md shadow-sm py-2 px-3 bg-[#0a192f] text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#64ffda] focus:ring-opacity-50"
                    />
                  </div>

                  {/* Image Upload/Preview Field */}
                  <div>
                    <label htmlFor="edit-image" className="block text-sm font-medium text-gray-300">Project Image</label>

                    <div className="mt-2 mb-3">
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={toggleImageInputMethod}
                          className={`px-3 py-1 text-sm rounded-md ${!useExternalUrl ? 'bg-[#64ffda] text-[#0a192f]' : 'bg-transparent border border-[#64ffda] text-[#64ffda]'}`}
                        >
                          Upload Image
                        </button>
                        <button
                          type="button"
                          onClick={toggleImageInputMethod}
                          className={`px-3 py-1 text-sm rounded-md ${useExternalUrl ? 'bg-[#64ffda] text-[#0a192f]' : 'bg-transparent border border-[#64ffda] text-[#64ffda]'}`}
                        >
                          Use External URL
                        </button>
                      </div>
                    </div>

                    {formData.imageUrl && !imagePreview && (
                      <div className="mt-2 mb-2">
                        <Image
                          src={formData.imageUrl}
                          alt="Current project image"
                          className="h-32 object-contain rounded-md border border-[#64ffda]"
                          width={300}
                          height={128}
                        />
                        <p className="text-xs text-gray-400 mt-1">Current image</p>
                      </div>
                    )}

                    {useExternalUrl ? (
                      <input
                        type="url"
                        id="edit-imageUrl"
                        name="imageUrl"
                        value={formData.imageUrl || ''}
                        onChange={handleExternalUrlChange}
                        placeholder="https://example.com/image.jpg"
                        className="mt-1 block w-full border border-[#64ffda] rounded-md shadow-sm py-2 px-3 bg-[#0a192f] text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#64ffda] focus:ring-opacity-50"
                      />
                    ) : (
                      <input
                        type="file"
                        id="edit-image"
                        name="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="mt-1 block w-full border border-[#64ffda] rounded-md shadow-sm py-2 px-3 bg-[#0a192f] text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#64ffda] focus:ring-opacity-50"
                      />
                    )}

                    {imagePreview && (
                      <div className="mt-2">
                        <Image
                          src={imagePreview}
                          alt="Project image preview"
                          className="h-32 object-contain rounded-md border border-[#64ffda]"
                          width={300}
                          height={128}
                        />
                        <p className="text-xs text-gray-400 mt-1">
                          {useExternalUrl ? 'External image preview' : 'Upload preview'}
                        </p>
                      </div>
                    )}
                    {uploadingImage && (
                      <div className="mt-2 text-sm text-[#64ffda]">
                        Uploading image...
                      </div>
                    )}
                  </div>

                  {/* Existing fields continue */}
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-300">Category</label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-[#64ffda] rounded-md shadow-sm py-2 px-3 bg-[#0a192f] text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#64ffda] focus:ring-opacity-50"
                    >
                      <option value="Cyber-Security">Cyber Security</option>
                      <option value="Digital-Forensics">Digital Forensics</option>
                      <option value="Monitoring">Monitoring</option>
                      <option value="Cyber-Intelligence">Cyber Intelligence</option>
                      <option value="Ethical-Hacking">Ethical Hacking</option>
                      <option value="Artificial-Intelligence">Artificial Intelligence</option>
                      <option value="Data-Science">Data Science</option>
                      <option value="Software-Engineering">Software Engineering</option>
                      <option value="Others">Others</option>
                    </select>
                    {formErrors.category && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.category}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-300">Status</label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-[#64ffda] rounded-md shadow-sm py-2 px-3 bg-[#0a192f] text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#64ffda] focus:ring-opacity-50"
                    >
                      <option value="Active">Active</option>
                      <option value="In Progress">In Progress</option>
                      <option value="On Hold">On Hold</option>
                      <option value="Completed">Completed</option>
                    </select>
                    {formErrors.status && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.status}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-300">Date</label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-[#64ffda] rounded-md shadow-sm py-2 px-3 bg-[#0a192f] text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#64ffda] focus:ring-opacity-50"
                    />
                    {formErrors.date && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.date}</p>
                    )}
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="featured"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-[#64ffda] focus:ring-[#64ffda] border-[#64ffda] rounded"
                    />
                    <label htmlFor="featured" className="ml-2 block text-sm text-gray-300">Featured Project</label>
                  </div>
                  <div className="bg-[#0a192f] px-4 py-3 flex justify-end space-x-3">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#64ffda] text-[#0a192f] rounded-md hover:bg-[#4cc9b8] focus:outline-none focus:ring-2 focus:ring-[#64ffda] focus:ring-opacity-50"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditModal(false);
                        setSelectedProject(null);
                        resetForm();
                      }}
                      className="px-4 py-2 border border-[#64ffda] text-[#64ffda] rounded-md hover:bg-[#64ffda] hover:text-[#0a192f] focus:outline-none focus:ring-2 focus:ring-[#64ffda] focus:ring-opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Project Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto" style={modalOverlayStyle}>
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="relative w-full max-w-lg" style={modalContentStyle}>
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-[#64ffda]">Add New Project</h3>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {apiError && (
                    <div className="bg-red-900 text-white p-3 rounded-md text-sm">
                      <p>{apiError}</p>
                    </div>
                  )}
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-300">Title</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-[#64ffda] rounded-md shadow-sm py-2 px-3 bg-[#0a192f] text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#64ffda] focus:ring-opacity-50"
                    />
                    {formErrors.title && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.title}</p>
                    )}
                  </div>

                  {/* Description Field */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-300">Short Description</label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={2}
                      className="mt-1 block w-full border border-[#64ffda] rounded-md shadow-sm py-2 px-3 bg-[#0a192f] text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#64ffda] focus:ring-opacity-50"
                    ></textarea>
                  </div>

                  {/* Long Description Field */}
                  <div>
                    <label htmlFor="longDescription" className="block text-sm font-medium text-gray-300">Long Description</label>
                    <textarea
                      id="longDescription"
                      name="longDescription"
                      value={formData.longDescription}
                      onChange={handleInputChange}
                      rows={4}
                      className="mt-1 block w-full border border-[#64ffda] rounded-md shadow-sm py-2 px-3 bg-[#0a192f] text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#64ffda] focus:ring-opacity-50"
                    ></textarea>
                  </div>

                  {/* Technologies Field */}
                  <div>
                    <label htmlFor="technologies" className="block text-sm font-medium text-gray-300">Technologies (comma separated)</label>
                    <input
                      type="text"
                      id="technologies"
                      name="technologies"
                      value={Array.isArray(formData.technologies) ? formData.technologies.join(', ') : ''}
                      onChange={(e) => handleArrayInputChange('technologies', e.target.value)}
                      placeholder="React, Node.js, MongoDB"
                      className="mt-1 block w-full border border-[#64ffda] rounded-md shadow-sm py-2 px-3 bg-[#0a192f] text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#64ffda] focus:ring-opacity-50"
                    />
                  </div>

                  {/* Features Field */}
                  <div>
                    <label htmlFor="features" className="block text-sm font-medium text-gray-300">Features (comma separated)</label>
                    <input
                      type="text"
                      id="features"
                      name="features"
                      value={Array.isArray(formData.features) ? formData.features.join(', ') : ''}
                      onChange={(e) => handleArrayInputChange('features', e.target.value)}
                      placeholder="User authentication, Data visualization, API"
                      className="mt-1 block w-full border border-[#64ffda] rounded-md shadow-sm py-2 px-3 bg-[#0a192f] text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#64ffda] focus:ring-opacity-50"
                    />
                  </div>

                  {/* Tags Field */}
                  <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-300">Tags (comma separated)</label>
                    <input
                      type="text"
                      id="tags"
                      name="tags"
                      value={Array.isArray(formData.tags) ? formData.tags.join(', ') : ''}
                      onChange={(e) => handleArrayInputChange('tags', e.target.value)}
                      placeholder="Web, Development, Security"
                      className="mt-1 block w-full border border-[#64ffda] rounded-md shadow-sm py-2 px-3 bg-[#0a192f] text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#64ffda] focus:ring-opacity-50"
                    />
                  </div>

                  {/* GitHub URL Field */}
                  <div>
                    <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-300">GitHub URL</label>
                    <input
                      type="url"
                      id="githubUrl"
                      name="githubUrl"
                      value={formData.githubUrl}
                      onChange={handleInputChange}
                      placeholder="https://github.com/username/repo"
                      className="mt-1 block w-full border border-[#64ffda] rounded-md shadow-sm py-2 px-3 bg-[#0a192f] text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#64ffda] focus:ring-opacity-50"
                    />
                  </div>

                  {/* Image Upload Field */}
                  <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-300">Project Image</label>

                    <div className="mt-2 mb-3">
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={toggleImageInputMethod}
                          className={`px-3 py-1 text-sm rounded-md ${!useExternalUrl ? 'bg-[#64ffda] text-[#0a192f]' : 'bg-transparent border border-[#64ffda] text-[#64ffda]'}`}
                        >
                          Upload Image
                        </button>
                        <button
                          type="button"
                          onClick={toggleImageInputMethod}
                          className={`px-3 py-1 text-sm rounded-md ${useExternalUrl ? 'bg-[#64ffda] text-[#0a192f]' : 'bg-transparent border border-[#64ffda] text-[#64ffda]'}`}
                        >
                          Use External URL
                        </button>
                      </div>
                    </div>

                    {useExternalUrl ? (
                      <input
                        type="url"
                        id="imageUrl"
                        name="imageUrl"
                        value={formData.imageUrl || ''}
                        onChange={handleExternalUrlChange}
                        placeholder="https://example.com/image.jpg"
                        className="mt-1 block w-full border border-[#64ffda] rounded-md shadow-sm py-2 px-3 bg-[#0a192f] text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#64ffda] focus:ring-opacity-50"
                      />
                    ) : (
                      <input
                        type="file"
                        id="image"
                        name="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="mt-1 block w-full border border-[#64ffda] rounded-md shadow-sm py-2 px-3 bg-[#0a192f] text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#64ffda] focus:ring-opacity-50"
                      />
                    )}

                    {imagePreview && (
                      <div className="mt-2">
                        <Image
                          src={imagePreview}
                          alt="Project image preview"
                          className="h-32 object-contain rounded-md border border-[#64ffda]"
                          width={300}
                          height={128}
                        />
                        <p className="text-xs text-gray-400 mt-1">
                          {useExternalUrl ? 'External image preview' : 'Upload preview'}
                        </p>
                      </div>
                    )}
                    {uploadingImage && (
                      <div className="mt-2 text-sm text-[#64ffda]">
                        Uploading image...
                      </div>
                    )}
                  </div>

                  {/* Existing fields continue */}
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-300">Category</label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-[#64ffda] rounded-md shadow-sm py-2 px-3 bg-[#0a192f] text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#64ffda] focus:ring-opacity-50"
                    >
                      <option value="Cyber-Security">Cyber Security</option>
                      <option value="Digital-Forensics">Digital Forensics</option>
                      <option value="Monitoring">Monitoring</option>
                      <option value="Cyber-Intelligence">Cyber Intelligence</option>
                      <option value="Ethical-Hacking">Ethical Hacking</option>
                      <option value="Artificial-Intelligence">Artificial Intelligence</option>
                      <option value="Data-Science">Data Science</option>
                      <option value="Software-Engineering">Software Engineering</option>
                      <option value="Others">Others</option>
                    </select>
                    {formErrors.category && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.category}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-300">Status</label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-[#64ffda] rounded-md shadow-sm py-2 px-3 bg-[#0a192f] text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#64ffda] focus:ring-opacity-50"
                    >
                      <option value="Active">Active</option>
                      <option value="In Progress">In Progress</option>
                      <option value="On Hold">On Hold</option>
                      <option value="Completed">Completed</option>
                    </select>
                    {formErrors.status && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.status}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-300">Date</label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-[#64ffda] rounded-md shadow-sm py-2 px-3 bg-[#0a192f] text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#64ffda] focus:ring-opacity-50"
                    />
                    {formErrors.date && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.date}</p>
                    )}
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="featured"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-[#64ffda] focus:ring-[#64ffda] border-[#64ffda] rounded"
                    />
                    <label htmlFor="featured" className="ml-2 block text-sm text-gray-300">Featured Project</label>
                  </div>
                  <div className="bg-[#0a192f] px-4 py-3 flex justify-end space-x-3">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#64ffda] text-[#0a192f] rounded-md hover:bg-[#4cc9b8] focus:outline-none focus:ring-2 focus:ring-[#64ffda] focus:ring-opacity-50"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddModal(false);
                        resetForm();
                      }}
                      className="px-4 py-2 border border-[#64ffda] text-[#64ffda] rounded-md hover:bg-[#64ffda] hover:text-[#0a192f] focus:outline-none focus:ring-2 focus:ring-[#64ffda] focus:ring-opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto" style={modalOverlayStyle}>
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="relative w-full max-w-lg" style={modalContentStyle}>
              <div className="p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <FontAwesomeIcon icon={faTrash} className="h-6 w-6 text-[#ff6b6b]" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-[#64ffda]">Delete Project</h3>
                    <p className="mt-2 text-sm text-gray-300">
                      Are you sure you want to delete this project? This action cannot be undone.
                    </p>
                  </div>
                </div>
                {apiError && (
                  <div className="mt-4 bg-red-900 text-white p-3 rounded-md text-sm">
                    <p>{apiError}</p>
                  </div>
                )}
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleConfirmDelete}
                    className="px-4 py-2 bg-[#ff6b6b] text-white rounded-md hover:bg-[#ff5252] focus:outline-none focus:ring-2 focus:ring-[#ff6b6b] focus:ring-opacity-50"
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 border border-[#64ffda] text-[#64ffda] rounded-md hover:bg-[#64ffda] hover:text-[#0a192f] focus:outline-none focus:ring-2 focus:ring-[#64ffda] focus:ring-opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {showBulkDeleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto" style={modalOverlayStyle}>
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="relative w-full max-w-lg" style={modalContentStyle}>
              <div className="p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <FontAwesomeIcon icon={faTrash} className="h-6 w-6 text-[#ff6b6b]" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-[#64ffda]">Delete Multiple Projects</h3>
                    <p className="mt-2 text-sm text-gray-300">
                      Are you sure you want to delete {selectedProjects.length} {selectedProjects.length === 1 ? 'project' : 'projects'}?
                      This action cannot be undone.
                    </p>
                  </div>
                </div>
                {apiError && (
                  <div className="mt-4 bg-red-900 text-white p-3 rounded-md text-sm">
                    <p>{apiError}</p>
                  </div>
                )}
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={confirmBulkDelete}
                    className="px-4 py-2 bg-[#ff6b6b] text-white rounded-md hover:bg-[#ff5252] focus:outline-none focus:ring-2 focus:ring-[#ff6b6b] focus:ring-opacity-50"
                  >
                    Delete All Selected
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowBulkDeleteModal(false)}
                    className="px-4 py-2 border border-[#64ffda] text-[#64ffda] rounded-md hover:bg-[#64ffda] hover:text-[#0a192f] focus:outline-none focus:ring-2 focus:ring-[#64ffda] focus:ring-opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsAdmin;