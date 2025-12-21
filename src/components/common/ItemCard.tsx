import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Tag, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { LostItem, FoundItem, ReturnedItem } from '@/types/types';

interface ItemCardProps {
  item: LostItem | FoundItem | ReturnedItem;
  type: 'lost' | 'found' | 'returned';
}

const ItemCard: React.FC<ItemCardProps> = ({ item, type }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/${type}-item/${item.id}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getDateField = () => {
    if (type === 'lost') return formatDate((item as LostItem).date_lost);
    if (type === 'found') return formatDate((item as FoundItem).date_found);
    return formatDate((item as ReturnedItem).return_date);
  };

  const getDateLabel = () => {
    if (type === 'lost') return 'Lost on';
    if (type === 'found') return 'Found on';
    return 'Returned on';
  };

  const getContactName = () => {
    if (type === 'returned') {
      return (item as ReturnedItem).owner_name;
    }
    return (item as LostItem | FoundItem).contact_name;
  };

  return (
    <Card
      className="card-hover cursor-pointer animate-fade-in"
      onClick={handleClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{item.item_name}</CardTitle>
            <CardDescription className="line-clamp-2">
              {item.description}
            </CardDescription>
          </div>
          <Badge
            variant={
              type === 'lost'
                ? 'destructive'
                : type === 'found'
                  ? 'default'
                  : 'secondary'
            }
            className="ml-2"
          >
            {type === 'lost' ? 'Lost' : type === 'found' ? 'Found' : 'Returned'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex items-center text-muted-foreground">
            <Tag className="w-4 h-4 mr-2" />
            <span>{item.category}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="line-clamp-1">{item.location} • {item.campus}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{getDateLabel()} {getDateField()}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <User className="w-4 h-4 mr-2" />
            <span>{getContactName()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ItemCard;
