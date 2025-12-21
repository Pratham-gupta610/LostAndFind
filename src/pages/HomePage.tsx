import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Package, PackageCheck, PackageX, Search, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ItemCard from '@/components/common/ItemCard';
import { getRecentLostItems, getRecentFoundItems, getRecentReturnedItems } from '@/db/api';
import type { LostItem, FoundItem, ReturnedItem } from '@/types/types';

const HomePage: React.FC = () => {
  const [lostItems, setLostItems] = useState<LostItem[]>([]);
  const [foundItems, setFoundItems] = useState<FoundItem[]>([]);
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
    <div className="min-h-screen bg-background">
      {/* Hero Section with Gradient */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,255,255,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,0,100,0.1),transparent_50%)]" />
        
        <div className="relative container mx-auto px-4 py-16 xl:py-24">
          <div className="text-center max-w-4xl mx-auto animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-pulse-glow">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Multi-Campus Lost & Found Platform</span>
            </div>
            
            <h1 className="text-5xl xl:text-7xl font-bold mb-6 glow-text">
              <span className="text-primary">FINDIT</span>
              <span className="text-foreground">.AI</span>
            </h1>
            
            <p className="text-xl xl:text-2xl text-muted-foreground mb-10 leading-relaxed">
              Lost something? Found something? We're here to help reunite our campus community with their belongings.
            </p>
            
            <div className="flex flex-col xl:flex-row gap-4 justify-center mb-12">
              <Button asChild size="lg" className="text-lg btn-interactive bg-accent hover:bg-accent/90">
                <Link to="/report-lost">
                  <PackageX className="w-5 h-5 mr-2" />
                  Report Lost Item
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg btn-interactive border-primary/30 hover:border-primary">
                <Link to="/report-found">
                  <PackageCheck className="w-5 h-5 mr-2" />
                  Report Found Item
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg btn-interactive border-primary/30 hover:border-primary">
                <Link to="/lost-items">
                  <Search className="w-5 h-5 mr-2" />
                  Search Items
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 card-hover">
                <div className="text-3xl font-bold text-accent mb-2">{lostItems.length}+</div>
                <div className="text-sm text-muted-foreground">Lost Items Reported</div>
              </div>
              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 card-hover">
                <div className="text-3xl font-bold text-primary mb-2">{foundItems.length}+</div>
                <div className="text-sm text-muted-foreground">Found Items Listed</div>
              </div>
              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 card-hover">
                <div className="text-3xl font-bold text-green-500 mb-2">{returnedItems.length}+</div>
                <div className="text-sm text-muted-foreground">Successful Returns</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lost Items Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8 animate-slide-in">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-accent/10 rounded-xl border border-accent/20">
              <PackageX className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground">Lost Items</h2>
              <p className="text-muted-foreground">Help reunite people with their belongings</p>
            </div>
          </div>
          <Button asChild variant="ghost" className="interactive-scale">
            <Link to="/lost-items" className="flex items-center gap-2">
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        ) : lostItems.length > 0 ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
            {lostItems.map((item, index) => (
              <div key={item.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <ItemCard item={item} type="lost" />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-card/30 rounded-xl border border-border">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No lost items reported yet</p>
          </div>
        )}
      </section>

      {/* Found Items Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8 animate-slide-in">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-xl border border-primary/20">
              <PackageCheck className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground">Found Items</h2>
              <p className="text-muted-foreground">Browse items waiting to be claimed</p>
            </div>
          </div>
          <Button asChild variant="ghost" className="interactive-scale">
            <Link to="/found-items" className="flex items-center gap-2">
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        ) : foundItems.length > 0 ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
            {foundItems.map((item, index) => (
              <div key={item.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <ItemCard item={item} type="found" />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-card/30 rounded-xl border border-border">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No found items listed yet</p>
          </div>
        )}
      </section>

      {/* Recently Returned Section */}
      <section className="container mx-auto px-4 py-12 pb-20">
        <div className="flex items-center justify-between mb-8 animate-slide-in">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-500/10 rounded-xl border border-green-500/20">
              <Sparkles className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground">Success Stories</h2>
              <p className="text-muted-foreground">Celebrating successful reunions</p>
            </div>
          </div>
          <Button asChild variant="ghost" className="interactive-scale">
            <Link to="/history" className="flex items-center gap-2">
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        ) : returnedItems.length > 0 ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
            {returnedItems.map((item, index) => (
              <div key={item.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <ItemCard item={item} type="returned" />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-card/30 rounded-xl border border-border">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No success stories yet</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
