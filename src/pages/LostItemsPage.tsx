import React, { useEffect, useState } from 'react';
import { PackageX } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import SearchBar from '@/components/common/SearchBar';
import DateRangeFilter from '@/components/common/DateRangeFilter';
import ItemCard from '@/components/common/ItemCard';
import { getLostItems } from '@/db/api';
import type { LostItem } from '@/types/types';
import { useDebounce } from '@/hooks/use-debounce';

const LostItemsPage: React.FC = () => {
  const [items, setItems] = useState<LostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const data = await getLostItems(
          debouncedSearch,
          dateRange?.from,
          dateRange?.to
        );
        setItems(data);
      } catch (error) {
        console.error('Error fetching lost items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [debouncedSearch, dateRange]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-8 animate-fade-in">
          <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center">
            <PackageX className="w-7 h-7 text-destructive" />
          </div>
          <div>
            <h1 className="text-3xl xl:text-4xl font-bold">Lost Items</h1>
            <p className="text-muted-foreground">Browse all reported lost items</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col xl:flex-row gap-4 mb-8 animate-slide-in">
          <div className="flex-1">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search lost items by name, description, location..."
            />
          </div>
          <DateRangeFilter
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <PackageX className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No lost items found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-muted-foreground">
              Found {items.length} {items.length === 1 ? 'item' : 'items'}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {items.map((item) => (
                <ItemCard key={item.id} item={item} type="lost" />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LostItemsPage;
