import React, { useEffect, useState } from 'react';
import { PackageX, Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { createLostItem, getLostItemById } from '@/db/api';
import ItemCard from '@/components/common/ItemCard';
import type { LostItem, LostItemInput } from '@/types/types';
import { CATEGORIES, CAMPUSES } from '@/types/types';
import { useAuth } from '@/contexts/AuthContext';

const formSchema = z.object({
  item_name: z.string().min(3, 'Item name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Please select a category'),
  date_lost: z.string().min(1, 'Please select a date'),
  location: z.string().min(3, 'Location must be at least 3 characters'),
  campus: z.string().min(1, 'Please select a campus'),
  contact_name: z.string().min(2, 'Name must be at least 2 characters'),
  contact_email: z.string().email('Invalid email address').optional().or(z.literal('')),
  contact_phone: z.string().optional(),
  additional_info: z.string().optional(),
});

const ReportLostPage: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [myReports, setMyReports] = useState<LostItem[]>([]);
  const [loadingReports, setLoadingReports] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      item_name: '',
      description: '',
      category: '',
      date_lost: '',
      location: '',
      campus: '',
      contact_name: '',
      contact_email: '',
      contact_phone: '',
      additional_info: '',
    },
  });

  useEffect(() => {
    loadMyReports();
  }, []);

  const loadMyReports = async () => {
    try {
      setLoadingReports(true);
      const reportIds = JSON.parse(localStorage.getItem('myLostReports') || '[]');
      const reports = await Promise.all(
        reportIds.map((id: string) => getLostItemById(id))
      );
      setMyReports(reports.filter((r): r is LostItem => r !== null));
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoadingReports(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Check if user is logged in
      if (!user) {
        toast({
          title: 'Authentication Required',
          description: 'Please sign in to submit a report.',
          variant: 'destructive',
        });
        // Redirect to login with return path
        window.location.href = '/login?redirect=/report-lost';
        return;
      }

      setSubmitting(true);
      const itemData: LostItemInput = {
        user_id: user.id,
        item_name: values.item_name,
        description: values.description,
        category: values.category,
        date_lost: values.date_lost,
        location: values.location,
        campus: values.campus,
        contact_name: values.contact_name,
        contact_email: values.contact_email || undefined,
        contact_phone: values.contact_phone || undefined,
        additional_info: values.additional_info || undefined,
      };

      const newItem = await createLostItem(itemData);

      // Save to localStorage
      const reportIds = JSON.parse(localStorage.getItem('myLostReports') || '[]');
      reportIds.unshift(newItem.id);
      localStorage.setItem('myLostReports', JSON.stringify(reportIds));

      toast({
        title: 'Success!',
        description: 'Your lost item report has been submitted.',
      });

      form.reset();
      loadMyReports();
    } catch (error) {
      console.error('Error submitting report:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit report. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-8 animate-fade-in">
          <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center">
            <PackageX className="w-7 h-7 text-destructive" />
          </div>
          <div>
            <h1 className="text-3xl xl:text-4xl font-bold">Report Lost Item</h1>
            <p className="text-muted-foreground">
              Help us help you find your lost item
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Form */}
          <div className="xl:col-span-2">
            <Card className="animate-slide-in">
              <CardHeader>
                <CardTitle>Item Details</CardTitle>
                <CardDescription>
                  Please provide as much detail as possible to help others identify your item
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="item_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Item Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Black Leather Wallet" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your item in detail..."
                              className="min-h-24"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {CATEGORIES.map((cat) => (
                                  <SelectItem key={cat} value={cat}>
                                    {cat}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="date_lost"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date Lost *</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location *</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Main Library, 3rd Floor" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="campus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Campus *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select campus" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {CAMPUSES.map((campus) => (
                                <SelectItem key={campus} value={campus}>
                                  {campus}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contact_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="contact_email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="john@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="contact_phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input placeholder="555-0123" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="additional_info"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Information</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Any other details that might help..."
                              className="min-h-20"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" size="lg" disabled={submitting} className="w-full">
                      <Plus className="w-5 h-5 mr-2" />
                      {submitting ? 'Submitting...' : 'Submit Report'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* My Reports */}
          <div className="xl:col-span-1">
            <Card className="animate-fade-in sticky top-20">
              <CardHeader>
                <CardTitle>My Reports</CardTitle>
                <CardDescription>Your submitted lost item reports</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingReports ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
                    ))}
                  </div>
                ) : myReports.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <PackageX className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No reports yet</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto">
                    {myReports.map((item) => (
                      <ItemCard key={item.id} item={item} type="lost" />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportLostPage;
