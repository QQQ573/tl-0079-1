import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SearchBar from '../SearchBar';
import { useAppStore } from '@/store/useAppStore';
import type { SKU } from '@/types';

const createSKU = (partial: Partial<SKU>): SKU => ({
  id: 'test-1',
  name: '测试SKU',
  brandId: 'xiCha',
  category: '水果茶',
  salesPercentile: 50,
  repurchaseRate: 50,
  socialMention: 50,
  marginTier: 50,
  ...partial,
});

vi.mock('@/store/useAppStore', async () => {
  const actual = await vi.importActual('@/store/useAppStore');
  return {
    ...actual,
    useAppStore: vi.fn(() => ({
      searchQuery: '',
      searchResults: [] as SKU[],
      setSearchQuery: vi.fn(),
      setHighlightedRow: vi.fn(),
    })),
  };
});

describe('SearchBar', () => {
  let mockSetSearchQuery: ReturnType<typeof vi.fn>;
  let mockSetHighlightedRow: ReturnType<typeof vi.fn>;
  let mockSearchResults: SKU[];
  let mockSearchQuery: string;

  beforeEach(() => {
    vi.clearAllMocks();
    mockSetSearchQuery = vi.fn();
    mockSetHighlightedRow = vi.fn();
    mockSearchResults = [];
    mockSearchQuery = '';

    (useAppStore as any).mockImplementation((selector: any) => {
      const state = {
        searchQuery: mockSearchQuery,
        searchResults: mockSearchResults,
        setSearchQuery: mockSetSearchQuery,
        setHighlightedRow: mockSetHighlightedRow,
      };
      return selector ? selector(state) : state;
    });
  });

  it('renders input with placeholder', () => {
    render(<SearchBar />);
    expect(screen.getByPlaceholderText('搜索SKU...')).toBeInTheDocument();
  });

  it('calls setSearchQuery on input change', () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText('搜索SKU...');
    fireEvent.change(input, { target: { value: '葡萄' } });
    expect(mockSetSearchQuery).toHaveBeenCalledWith('葡萄');
  });

  it('shows dropdown with matching results when search returns data', async () => {
    mockSearchQuery = '葡萄';
    mockSearchResults = [
      createSKU({ id: 'xc-1', name: '多肉葡萄', category: '水果茶' }),
      createSKU({ id: 'nx-3', name: '霸气葡萄', category: '水果茶' }),
    ];

    render(<SearchBar />);
    const input = screen.getByPlaceholderText('搜索SKU...');
    fireEvent.focus(input);

    await waitFor(() => {
      expect(screen.getByText('多肉葡萄')).toBeInTheDocument();
      expect(screen.getByText('霸气葡萄')).toBeInTheDocument();
      expect(screen.getAllByText('水果茶')).toHaveLength(2);
    });
  });

  it('shows "未找到匹配SKU" when no results', async () => {
    mockSearchQuery = '不存在的SKU';
    mockSearchResults = [];

    render(<SearchBar />);
    const input = screen.getByPlaceholderText('搜索SKU...');
    fireEvent.focus(input);

    await waitFor(() => {
      expect(screen.getByText('未找到匹配SKU')).toBeInTheDocument();
    });
  });

  it('calls scrollIntoView and resets search when result is clicked', async () => {
    const mockScrollIntoView = vi.fn();
    const mockEl = { scrollIntoView: mockScrollIntoView };
    vi.spyOn(document, 'getElementById').mockImplementation((id) => {
      if (id === 'sku-row-xc-1') return mockEl as any;
      return null;
    });

    mockSearchQuery = '葡萄';
    mockSearchResults = [
      createSKU({ id: 'xc-1', name: '多肉葡萄', category: '水果茶' }),
    ];

    render(<SearchBar />);
    const input = screen.getByPlaceholderText('搜索SKU...');
    fireEvent.focus(input);

    await waitFor(() => {
      expect(screen.getByText('多肉葡萄')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('多肉葡萄'));

    expect(mockSetHighlightedRow).toHaveBeenCalledWith('xc-1');
    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'center' });
    expect(mockSetSearchQuery).toHaveBeenCalledWith('');
  });

  it('clears search when X button is clicked', async () => {
    mockSearchQuery = '葡萄';
    mockSearchResults = [
      createSKU({ id: 'xc-1', name: '多肉葡萄', category: '水果茶' }),
    ];

    render(<SearchBar />);
    const input = screen.getByPlaceholderText('搜索SKU...');
    fireEvent.focus(input);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: '' })).toBeInTheDocument();
    });

    const clearBtn = screen.getByRole('button', { name: '' });
    fireEvent.click(clearBtn);

    expect(mockSetSearchQuery).toHaveBeenCalledWith('');
  });

  it('resets highlighted row when search query is cleared (via useEffect)', () => {
    mockSearchQuery = '';
    render(<SearchBar />);
    expect(mockSetHighlightedRow).toHaveBeenCalledWith(null);
  });

  it('partial match "多肉" finds "多肉葡萄"', async () => {
    mockSearchQuery = '多肉';
    mockSearchResults = [
      createSKU({ id: 'xc-1', name: '多肉葡萄', category: '水果茶' }),
    ];

    render(<SearchBar />);
    const input = screen.getByPlaceholderText('搜索SKU...');
    fireEvent.focus(input);

    await waitFor(() => {
      expect(screen.getByText('多肉葡萄')).toBeInTheDocument();
    });
  });
});
