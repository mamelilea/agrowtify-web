// hooks/useAgroguide.ts
import { useState, useEffect, useCallback } from 'react';
import { AgroguideContent } from '@prisma/client';

interface Category {
  id: string;
  name: string;
  description?: string;
  _count?: {
    agroguides: number;
  };
}

interface UseAgroguideProps {
  contentType: 'ARTICLE' | 'VIDEO';
}

interface AgroguideResponse {
  content: (AgroguideContent & { category: { id: string; name: string } })[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const useAgroguide = ({ contentType }: UseAgroguideProps) => {
  const [content, setContent] = useState<(AgroguideContent & { category: { id: string; name: string } })[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 0,
  });

  // Debounced search to avoid too many API calls
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }, []);

  // Fetch content
  const fetchContent = useCallback(async (
    category: string | null = selectedCategory,
    search: string = debouncedSearchTerm,
    page: number = 1
  ) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.append('type', contentType);
      params.append('page', page.toString());
      params.append('limit', pagination.limit.toString());
      
      if (category) {
        params.append('category', category);
      }
      if (search.trim()) {
        params.append('search', search.trim());
      }

      const response = await fetch(`/api/agroguide?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Error fetching ${contentType.toLowerCase()}: ${response.statusText}`);
      }
      
      const data: AgroguideResponse = await response.json();
      setContent(data.content);
      setPagination(data.pagination);
    } catch (err: any) {
      setError(err.message);
      setContent([]);
    } finally {
      setLoading(false);
    }
  }, [contentType, selectedCategory, debouncedSearchTerm, pagination.limit]);

  // Initial fetch
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Fetch content when dependencies change
  useEffect(() => {
    fetchContent();
  }, [selectedCategory, debouncedSearchTerm]);

  // Handlers
  const handleCategoryClick = useCallback((categoryId: string | null) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  }, [selectedCategory]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }));
    fetchContent(selectedCategory, debouncedSearchTerm, page);
  }, [fetchContent, selectedCategory, debouncedSearchTerm]);

  return {
    content,
    categories,
    selectedCategory,
    searchTerm,
    loading,
    error,
    pagination,
    handleCategoryClick,
    handleSearchChange,
    handlePageChange,
    refetch: () => fetchContent(),
  };
};