"use client";

import { useState, useEffect } from "react";
import { IBlog } from "@/models/Blog";
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

const BlogAdmin = () => {
  const [posts, setPosts] = useState<IBlog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<IBlog | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'title' | 'category' | 'status' | 'date'>('title');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Handle image upload
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [useExternalUrl, setUseExternalUrl] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    category: "",
    status: "draft" as "draft" | "published",
    image: {
      url: "",
      filename: "",
      contentType: "image/jpeg"
    },
    tags: [] as string[],
    createdBy: "admin"
  });

  // Function to generate slug from title
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with hyphens
      .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
      .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
  };

  // Predefined categories
  const allCategories = [
    'Cyber-Security',
    'Digital-Forensics',
    'Monitoring',
    'Cyber-Intelligence',
    'Ethical-Hacking',
    'Artificial-Intelligence',
    'Data-Science',
    'Software-Engineering',
    'Others'
  ];

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      setApiError(null);
      const response = await fetch('/api/blog');
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      setPosts(data);
      setIsLoading(false);
      setSelectedPosts([]);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setApiError("Failed to load posts. Please try again later.");
      setIsLoading(false);
    }
  };

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
    await fetchPosts();
    setTimeout(() => setRefreshing(false), 500);
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedPosts.length > 0) {
      setShowBulkDeleteModal(true);
    }
  };

  // Confirm bulk delete
  const confirmBulkDelete = async () => {
    setApiError(null);

    try {
      const deletePromises = selectedPosts.map(id =>
        fetch(`/api/blog/${id}`, { method: 'DELETE' })
      );

      const results = await Promise.allSettled(deletePromises);
      const failedResults = results.filter(result => result.status === 'rejected');
      const failedCount = failedResults.length;

      if (failedCount > 0) {
        const errorMessages = failedResults
          .map((result, index) => {
            if (result.status === 'rejected') {
              const postId = selectedPosts[index];
              return `Failed to delete post "${postId}": ${result.reason}`;
            }
            return null;
          })
          .filter(Boolean)
          .join(', ');

        setApiError(`Failed to delete ${failedCount} post(s). ${errorMessages}`);
      } else {
        showSuccessMessage(`Successfully deleted ${selectedPosts.length} post(s).`);
      }

      await fetchPosts();
      setShowBulkDeleteModal(false);
    } catch (error) {
      console.error('Error deleting posts:', error);
      setApiError('Failed to delete posts. Please try again.');
    }
  };

  // Toggle post selection
  const togglePostSelection = (id: string) => {
    setSelectedPosts(prev =>
      prev.includes(id)
        ? prev.filter(postId => postId !== id)
        : [...prev, id]
    );
  };

  // Select all posts
  const toggleSelectAll = () => {
    if (selectedPosts.length === filteredPosts.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(filteredPosts.map(post => post._id?.toString() || ''));
    }
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

  // Toggle between upload and external URL
  const toggleImageInputMethod = () => {
    setUseExternalUrl(!useExternalUrl);
    // Reset image state when toggling
    if (!useExternalUrl) {
      setImageFile(null);
      setImagePreview(formData.image.url || null);
    } else {
      setImagePreview(null);
      // Ensure image.url is always a string
      setFormData(prev => ({
        ...prev,
        image: {
          ...prev.image,
          url: prev.image.url || ""
        }
      }));
    }
  };

  // Upload image to server/storage
  const uploadImage = async (): Promise<string> => {
    if (useExternalUrl && formData.image.url) {
      // Return the external URL directly
      return formData.image.url;
    }

    if (!imageFile) return formData.image.url || '';

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
      return formData.image.url || '';
    }
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // If title is being changed, automatically update the slug
    if (name === 'title') {
      const newSlug = generateSlug(value);
      setFormData(prev => ({
        ...prev,
        title: value,
        slug: newSlug
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle image URL change
  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setFormData(prev => ({
      ...prev,
      image: {
        ...prev.image,
        url: url || "" // Ensure we always set a string
      }
    }));

    // Show preview of external URL
    if (url) {
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  };

  // Handle tag changes
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData(prev => ({
      ...prev,
      tags
    }));
  };

  // Reset form with default values
  const resetForm = () => {
    setSelectedPost(null);
    setIsEditing(false);
    setFormData({
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      category: "",
      status: "draft",
      image: {
        url: "",
        filename: "",
        contentType: "image/jpeg"
      },
      tags: [],
      createdBy: "admin"
    });
    setImageFile(null);
    setImagePreview(null);
    setUseExternalUrl(false);
  };

  // Update handleSubmit with image upload
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    try {
      setUploadingImage(true);
      // Upload image if there's a new one
      let imageUrl = formData.image.url;
      if (imageFile) {
        imageUrl = await uploadImage();
        if (!imageUrl) {
          setApiError("Failed to upload image. Please try again.");
          setUploadingImage(false);
          return;
        }
      }

      const url = isEditing ? `/api/blog/${selectedPost?._id}` : '/api/blog';
      const method = isEditing ? 'PUT' : 'POST';

      // Create FormData object
      const submitFormData = new FormData();
      submitFormData.append('title', formData.title);
      submitFormData.append('content', formData.content);
      submitFormData.append('excerpt', formData.excerpt);
      submitFormData.append('category', formData.category);
      submitFormData.append('status', formData.status);
      submitFormData.append('slug', formData.slug);
      submitFormData.append('tags', JSON.stringify(formData.tags));
      submitFormData.append('author', JSON.stringify({ name: formData.createdBy }));
      
      if (imageFile) {
        submitFormData.append('image', imageFile);
      } else if (imageUrl) {
        submitFormData.append('googleImageUrl', imageUrl);
      }

      const response = await fetch(url, {
        method,
        body: submitFormData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error occurred' }));
        throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
      }

      await fetchPosts();
      setShowAddModal(false);
      setShowEditModal(false);
      showSuccessMessage(isEditing ? "Post updated successfully!" : "Post created successfully!");
      resetForm();
      setImageFile(null);
      setImagePreview(null);
      setUploadingImage(false);
    } catch (error) {
      console.error('Error saving post:', error);
      setApiError(error instanceof Error ? error.message : "Failed to save post. Please try again.");
      setUploadingImage(false);
    }
  };

  const handleDelete = async (id: string) => {
    setPostToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (postToDelete) {
      try {
        const response = await fetch(`/api/blog/${postToDelete}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error occurred' }));
          throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
        }

        await fetchPosts();
        setShowDeleteModal(false);
        setPostToDelete(null);
        showSuccessMessage("Post deleted successfully!");
      } catch (error) {
        console.error("Error deleting post:", error);
        setApiError(error instanceof Error ? error.message : "Failed to delete post. Please try again.");
      }
    }
  };

  const handleEdit = (post: IBlog) => {
    setSelectedPost(post);
    setIsEditing(true);
    setFormData({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      category: post.category,
      status: post.status,
      image: {
        url: post.image?.url || '', // Ensure we always set a string
        filename: post.image?.filename || '',
        contentType: post.image?.contentType || 'image/jpeg'
      },
      tags: post.tags,
      createdBy: post.createdBy || "admin" // Default to admin if not set
    });
    setShowEditModal(true);
  };

  const handleView = (post: IBlog) => {
    setSelectedPost(post);
    setShowViewModal(true);
  };

  // Filter posts based on search term and category
  const filteredPosts = posts.filter(post =>
    (post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.status.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (categoryFilter === 'all' || post.category === categoryFilter)
  );

  // Get unique categories for filter
  const categories = ['all', ...Array.from(new Set(posts.map(post => post.category)))];

  // Sort posts
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Handle sort click
  const handleSort = (field: 'title' | 'category' | 'status' | 'date') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Function to get the appropriate sort icon
  const getSortIcon = (field: 'title' | 'category' | 'status' | 'date') => {
    if (sortField !== field) {
      return <FontAwesomeIcon icon={faSort} className="ml-1" />;
    }
    return sortDirection === 'asc' ?
      <FontAwesomeIcon icon={faSortUp} className="ml-1" /> :
      <FontAwesomeIcon icon={faSortDown} className="ml-1" />;
  };

  // Update pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedPosts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedPosts.length / itemsPerPage);

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

  // Helper function for status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Render content based on loading and error states
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-t-4 border-[#64ffda] rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#64ffda]">Loading posts...</p>
          </div>
        </div>
      );
    }

    if (apiError) {
      return (
        <div className="bg-[#112240] rounded-lg p-8 text-center">
          <p className="text-[#ff6b6b] mb-4">{apiError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#64ffda] text-[#0a192f] rounded-md hover:bg-[#4cd8c0] transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    // Handle no posts
    if (posts.length === 0) {
      return (
        <div className="bg-[#112240] rounded-lg p-8 text-center">
          <p className="text-gray-300 mb-4">No posts found</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-[#64ffda] text-[#0a192f] rounded-md hover:bg-[#4cd8c0] transition-colors"
          >
            Add Your First Post
          </button>
        </div>
      );
    }

    // Handle no filtered posts
    if (filteredPosts.length === 0) {
      return (
        <div className="bg-[#112240] rounded-lg p-8 text-center">
          <p className="text-gray-300 mb-4">No posts match your filter criteria</p>
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
            Add New Post
          </button>
        </div>
      );
    }

    // If posts exist, show the posts table
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#233554] border border-[#233554]">
          <thead className="bg-[#0a192f]">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                <input
                  type="checkbox"
                  checked={selectedPosts.length === filteredPosts.length && filteredPosts.length > 0}
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
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-[#112240] divide-y divide-[#233554]">
            {currentItems.map((post) => (
              <tr key={post._id?.toString()} className="hover:bg-[#1d3461] transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <input
                    type="checkbox"
                    checked={selectedPosts.includes(post._id?.toString() || '')}
                    onChange={() => post._id && togglePostSelection(post._id.toString())}
                    className="h-4 w-4 text-[#64ffda] focus:ring-[#64ffda] border-[#64ffda] rounded"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                  {post.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {post.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(post.status)}`}>
                    {post.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleView(post)}
                    className="text-[#64ffda] hover:text-[#4cd8c0] mx-2"
                    title="View Post"
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                  <button
                    onClick={() => handleEdit(post)}
                    className="text-[#64ffda] hover:text-[#4cd8c0] mx-2"
                    title="Edit Post"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    onClick={() => post._id && handleDelete(post._id.toString())}
                    className="text-[#ff6b6b] hover:text-[#ff5252] mx-2"
                    title="Delete Post"
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
        <h1 className="text-2xl font-semibold text-[#64ffda] text-center md:text-left">Blog Management</h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <FontAwesomeIcon icon={faSearch} className="text-[#64ffda]" />
            </span>
            <input
              type="text"
              placeholder="Search posts..."
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
            title="Refresh Posts"
          >
            <FontAwesomeIcon icon={faSync} className={`${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center bg-[#64ffda] text-[#0a192f] px-4 py-2 rounded-md hover:bg-[#4cc9b8] transition-colors"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add Post
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedPosts.length > 0 && (
        <div className="bg-[#112240] p-3 rounded-md flex justify-between items-center">
          <span className="text-sm text-gray-300">
            {selectedPosts.length} {selectedPosts.length === 1 ? 'post' : 'posts'} selected
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

      {/* Posts Table */}
      <div className="bg-[#112240] rounded-lg shadow-lg overflow-hidden">
        {renderContent()}
        <div className="px-6 py-4 border-t border-[#233554] flex items-center justify-between">
          <div className="text-sm text-gray-300">
            Showing {currentItems.length > 0 ? `${indexOfFirstItem + 1}-${Math.min(indexOfLastItem, filteredPosts.length)}` : '0'} of {filteredPosts.length} posts
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

      {/* Add/Edit Post Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 z-50 overflow-y-auto" style={{ backgroundColor: 'rgba(10, 25, 47, 0.9)', backdropFilter: 'blur(4px)' }}>
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="relative w-full max-w-lg" style={{ backgroundColor: '#112240', borderRadius: '0.5rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-[#64ffda]">
                    {showEditModal ? "Edit Post" : "Add New Post"}
                  </h3>
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
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="slug" className="block text-sm font-medium text-gray-300">Slug</label>
                    <input
                      type="text"
                      id="slug"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-[#64ffda] rounded-md shadow-sm py-2 px-3 bg-[#0a192f] text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#64ffda] focus:ring-opacity-50"
                      required
                      readOnly
                    />
                  </div>

                  <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-300">Content</label>
                    <textarea
                      id="content"
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      rows={4}
                      className="mt-1 block w-full border border-[#64ffda] rounded-md shadow-sm py-2 px-3 bg-[#0a192f] text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#64ffda] focus:ring-opacity-50"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="excerpt" className="block text-sm font-medium text-gray-300">Excerpt</label>
                    <textarea
                      id="excerpt"
                      name="excerpt"
                      value={formData.excerpt}
                      onChange={handleInputChange}
                      rows={2}
                      className="mt-1 block w-full border border-[#64ffda] rounded-md shadow-sm py-2 px-3 bg-[#0a192f] text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#64ffda] focus:ring-opacity-50"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-300">Category</label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-[#64ffda] rounded-md shadow-sm py-2 px-3 bg-[#0a192f] text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#64ffda] focus:ring-opacity-50"
                      required
                    >
                      <option value="">Select a category</option>
                      {allCategories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
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
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-300">Post Image</label>

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

                    {formData.image.url && !imagePreview && (
                      <div className="mt-2 mb-2">
                        <Image
                          src={formData.image.url}
                          alt="Current post image"
                          className="h-32 rounded-md border border-[#64ffda]"
                          width={300}
                          height={128}
                        />
                        <p className="text-xs text-gray-400 mt-1">Current image</p>
                      </div>
                    )}

                    {useExternalUrl ? (
                      <input
                        type="url"
                        id="imageUrl"
                        name="imageUrl"
                        value={formData.image.url || ''}
                        onChange={handleImageUrlChange}
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
                          alt="Post image preview"
                          className="h-32 rounded-md border border-[#64ffda]"
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

                  <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-300">Tags (comma separated)</label>
                    <input
                      type="text"
                      id="tags"
                      value={formData.tags.join(', ')}
                      onChange={handleTagsChange}
                      className="mt-1 block w-full border border-[#64ffda] rounded-md shadow-sm py-2 px-3 bg-[#0a192f] text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#64ffda] focus:ring-opacity-50"
                    />
                  </div>

                  <div className="bg-[#0a192f] px-4 py-3 flex justify-end space-x-3">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#64ffda] text-[#0a192f] rounded-md hover:bg-[#4cc9b8] focus:outline-none focus:ring-2 focus:ring-[#64ffda] focus:ring-opacity-50"
                    >
                      {showEditModal ? "Update Post" : "Create Post"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddModal(false);
                        setShowEditModal(false);
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

      {/* View Post Modal */}
      {showViewModal && selectedPost && (
        <div className="fixed inset-0 z-50 overflow-y-auto" style={{ backgroundColor: 'rgba(10, 25, 47, 0.9)', backdropFilter: 'blur(4px)' }}>
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="relative w-full max-w-2xl" style={{ backgroundColor: '#112240', borderRadius: '0.5rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-[#64ffda]">Post Details</h3>
                </div>

                {/* Post Image */}
                {selectedPost.image.url && (
                  <div className="mb-4">
                    <Image
                      src={selectedPost.image.url}
                      alt={selectedPost.title}
                      className="w-full h-48 rounded-md border border-[#64ffda]"
                      width={400}
                      height={192}
                    />
                  </div>
                )}

                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Title</label>
                    <p className="mt-1 text-sm text-gray-100">{selectedPost.title}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300">Content</label>
                    <p className="mt-1 text-sm text-gray-100 whitespace-pre-wrap">{selectedPost.content}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300">Excerpt</label>
                    <p className="mt-1 text-sm text-gray-100">{selectedPost.excerpt}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300">Category</label>
                    <p className="mt-1 text-sm text-gray-100">{selectedPost.category}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300">Status</label>
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedPost.status)}`}>
                      {selectedPost.status}
                    </span>
                  </div>

                  {selectedPost.tags && selectedPost.tags.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300">Tags</label>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {selectedPost.tags.map((tag, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-[#1d3461] text-gray-300">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-[#0a192f] px-4 py-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedPost(null);
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto" style={{ backgroundColor: 'rgba(10, 25, 47, 0.9)', backdropFilter: 'blur(4px)' }}>
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="relative w-full max-w-lg" style={{ backgroundColor: '#112240', borderRadius: '0.5rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
              <div className="p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <FontAwesomeIcon icon={faTrash} className="h-6 w-6 text-[#ff6b6b]" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-[#64ffda]">Delete Post</h3>
                    <p className="mt-2 text-sm text-gray-300">
                      Are you sure you want to delete this post? This action cannot be undone.
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
        <div className="fixed inset-0 z-50 overflow-y-auto" style={{ backgroundColor: 'rgba(10, 25, 47, 0.9)', backdropFilter: 'blur(4px)' }}>
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="relative w-full max-w-lg" style={{ backgroundColor: '#112240', borderRadius: '0.5rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
              <div className="p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <FontAwesomeIcon icon={faTrash} className="h-6 w-6 text-[#ff6b6b]" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-[#64ffda]">Delete Multiple Posts</h3>
                    <p className="mt-2 text-sm text-gray-300">
                      Are you sure you want to delete {selectedPosts.length} {selectedPosts.length === 1 ? 'post' : 'posts'}?
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

export default BlogAdmin;