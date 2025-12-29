import React, { useState } from 'react';
import { Upload, Search, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { searchItemsByImage } from '@/db/api';
import ItemCard from '@/components/common/ItemCard';
import type { LostItemWithProfile, FoundItemWithProfile } from '@/types/types';

const ImageSearchPage: React.FC = () => {
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Array<LostItemWithProfile | FoundItemWithProfile>>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: 'Invalid File Type',
        description: 'Please upload a JPEG, PNG, GIF, WEBP, or AVIF image.',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (10MB max before compression)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'File Too Large',
        description: 'Please upload an image smaller than 10MB.',
        variant: 'destructive',
      });
      return;
    }

    setSelectedImage(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const fakeEvent = {
        target: { files: [file] }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleImageSelect(fakeEvent);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview('');
    setSearchResults([]);
    setHasSearched(false);
    setUploadProgress(0);
  };

  const handleSearch = async () => {
    if (!selectedImage) {
      toast({
        title: 'No Image Selected',
        description: 'Please upload an image to search.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSearching(true);
      setUploadProgress(0);
      setHasSearched(false);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const results = await searchItemsByImage(selectedImage);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setSearchResults(results);
      setHasSearched(true);

      toast({
        title: 'Search Complete',
        description: `Found ${results.length} matching ${results.length === 1 ? 'item' : 'items'}.`,
      });
    } catch (error) {
      console.error('Error searching by image:', error);
      toast({
        title: 'Search Failed',
        description: 'Failed to search for items. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSearching(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-8 animate-fade-in">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <ImageIcon className="w-7 h-7 text-background" />
          </div>
          <div>
            <h1 className="text-3xl xl:text-4xl font-bold">Image Search</h1>
            <p className="text-muted-foreground">
              Upload an image to find similar lost or found items
            </p>
          </div>
        </div>

        {/* Upload Section */}
        <Card className="mb-8 animate-slide-in border-primary/20 shadow-lg">
          <CardHeader>
            <CardTitle>Upload Image</CardTitle>
            <CardDescription>
              Upload a photo of the item you're looking for. We'll search through all lost and found items.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!imagePreview ? (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed border-primary/30 rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer bg-secondary/20"
              >
                <input
                  type="file"
                  id="image-upload"
                  accept="image/jpeg,image/png,image/gif,image/webp,image/avif"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="w-16 h-16 text-primary mx-auto mb-4" />
                  <p className="text-lg font-semibold mb-2">
                    Drop an image here or click to upload
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Supports: JPEG, PNG, GIF, WEBP, AVIF (Max 10MB)
                  </p>
                </label>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-lg overflow-hidden border-2 border-primary/30">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-contain bg-secondary/50"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={clearImage}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Uploading...</span>
                      <span className="text-primary font-semibold">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-primary h-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    onClick={handleSearch}
                    disabled={searching}
                    className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                  >
                    {searching ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Search Similar Items
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={clearImage}>
                    Clear
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Search Results */}
        {hasSearched && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                Search Results
                <span className="text-muted-foreground ml-2">
                  ({searchResults.length} {searchResults.length === 1 ? 'item' : 'items'})
                </span>
              </h2>
            </div>

            {searchResults.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="py-16 text-center">
                  <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Matching Items Found</h3>
                  <p className="text-muted-foreground">
                    Try uploading a different image or check back later.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {searchResults.map((item) => {
                  const type = 'date_lost' in item ? 'lost' : 'found';
                  return <ItemCard key={item.id} item={item} type={type} />;
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageSearchPage;
