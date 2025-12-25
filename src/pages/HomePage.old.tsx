import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Package, PackageCheck, PackageX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ItemCard from '@/components/common/ItemCard';
import { getRecentLostItems, getRecentFoundItems, getRecentReturnedItems } from '@/db/api';
import type { LostItemWithProfile, FoundItemWithProfile, ReturnedItem } from '@/types/types';

const HomePage: React.FC = () => {
  const [lostItems, setLostItems] = useState<LostItemWithProfile[]>([]);
  const [foundItems, setFoundItems] = useState<FoundItemWithProfile[]>([]);
  const [returnedItems, setReturnedItems] = useState<ReturnedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [lost, found, returned] = await Promise.all([
          getRecentLostItems(6),
          getRecentFoundItems(6),
          getRecentReturnedItems(6),
        ]);
        setLostItems(lost);
        setFoundItems(found);
        setReturnedItems(returned);
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 xl:py-16">
        <div className="text-center max-w-3xl mx-auto animate-fade-in">
          <h1 className="text-4xl xl:text-5xl font-bold mb-4 text-primary">
            Lost Something? We'll Help You Find It.
          </h1>
          <p className="text-lg xl:text-xl text-muted-foreground mb-8">
            Multi-campus Lost & Found platform connecting our community to reunite people with their belongings.
          </p>
          <div className="flex flex-col xl:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-base">
              <Link to="/report-lost">
                <PackageX className="w-5 h-5 mr-2" />
                Report Lost Item
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-base">
              <Link to="/report-found">
                <PackageCheck className="w-5 h-5 mr-2" />
                Report Found Item
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Lost Items Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <PackageX className="w-6 h-6 text-destructive" />
            </div>
            <h2 className="text-2xl xl:text-3xl font-bold">Lost Items</h2>
          </div>
          <Button asChild variant="ghost">
            <Link to="/lost-items">
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {lostItems.map((item) => (
              <ItemCard key={item.id} item={item} type="lost" />
            ))}
          </div>
        )}
      </section>

      {/* Found Items Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <PackageCheck className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl xl:text-3xl font-bold">Found Items</h2>
          </div>
          <Button asChild variant="ghost">
            <Link to="/found-items">
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {foundItems.map((item) => (
              <ItemCard key={item.id} item={item} type="found" />
            ))}
          </div>
        )}
      </section>

      {/* Recently Returned Items Section */}
      <section className="container mx-auto px-4 py-8 pb-16">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
              <Package className="w-6 h-6 text-secondary-foreground" />
            </div>
            <h2 className="text-2xl xl:text-3xl font-bold">Recently Returned Items</h2>
          </div>
          <Button asChild variant="ghost">
            <Link to="/history">
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {returnedItems.map((item) => (
              <ItemCard key={item.id} item={item} type="returned" />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
