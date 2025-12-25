import React, { useEffect, useState } from 'react';
import { MessageSquare, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getChatConversationsForUser } from '@/db/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import ChatDialog from '@/components/chat/ChatDialog';
import { formatDistanceToNow } from 'date-fns';

interface ConversationWithDetails {
  id: string;
  lost_item_id: string | null;
  found_item_id: string | null;
  lost_item_owner_id: string;
  found_item_reporter_id: string;
  created_at: string;
  updated_at: string;
  lost_item?: {
    id: string;
    item_name: string;
    image_url: string | null;
    category: string;
  } | null;
  found_item?: {
    id: string;
    item_name: string;
    image_url: string | null;
    category: string;
  } | null;
  lost_owner?: {
    id: string;
    full_name: string | null;
    email: string;
  } | null;
  found_reporter?: {
    id: string;
    full_name: string | null;
    email: string;
  } | null;
}

const ChatHistoryPage: React.FC = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ConversationWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<ConversationWithDetails | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  const loadConversations = async () => {
    if (!user) return;

    let timeoutId: NodeJS.Timeout;

    try {
      setLoading(true);
      setError(null);

      // Add timeout protection
      const fetchPromise = getChatConversationsForUser(user.id);
      const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error('Request timeout')), 10000);
      });

      const data = await Promise.race([fetchPromise, timeoutPromise]);
      
      clearTimeout(timeoutId);
      setConversations(data || []);
    } catch (err) {
      console.error('Error loading conversations:', err);
      setError('Unable to load conversations. Please check your connection.');
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChat = (conversation: ConversationWithDetails) => {
    setSelectedConversation(conversation);
    setChatOpen(true);
  };

  const handleCloseChat = () => {
    setChatOpen(false);
    setSelectedConversation(null);
    // Reload conversations to update timestamps
    loadConversations();
  };

  const getOtherUser = (conversation: ConversationWithDetails) => {
    if (!user) return null;
    
    if (conversation.lost_item_owner_id === user.id) {
      return conversation.found_reporter;
    } else {
      return conversation.lost_owner;
    }
  };

  const getOtherUserName = (otherUser: any) => {
    if (!otherUser) return 'User';
    return otherUser.username || otherUser.full_name || otherUser.email || 'User';
  };

  const getItemInfo = (conversation: ConversationWithDetails) => {
    // Prefer the item that belongs to the other user
    if (!user) return null;
    
    if (conversation.lost_item_owner_id === user.id) {
      return conversation.found_item;
    } else {
      return conversation.lost_item;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Login Required</CardTitle>
            <CardDescription>Please login to view your chat history</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-8 animate-fade-in">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <MessageSquare className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl xl:text-4xl font-bold">Chat History</h1>
            <p className="text-muted-foreground">
              View your conversations about lost and found items
            </p>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-16 w-16 rounded-lg bg-muted" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-3/4 bg-muted" />
                      <Skeleton className="h-4 w-1/2 bg-muted" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-card rounded-xl border border-border">
            <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Unable to Load Conversations</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={loadConversations} variant="outline">
              Retry
            </Button>
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-16 bg-card/30 rounded-xl border border-border">
            <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No conversations yet</h3>
            <p className="text-muted-foreground">
              Start chatting when you find matches for your lost or found items
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {conversations.map((conversation) => {
              const otherUser = getOtherUser(conversation);
              const itemInfo = getItemInfo(conversation);
              
              return (
                <Card 
                  key={conversation.id} 
                  className="hover:shadow-lg transition-all duration-200 cursor-pointer"
                  onClick={() => handleOpenChat(conversation)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      {/* Item Image */}
                      <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                        {itemInfo?.image_url ? (
                          <img 
                            src={itemInfo.image_url} 
                            alt={itemInfo.item_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <MessageSquare className="w-8 h-8 text-muted-foreground" />
                        )}
                      </div>

                      {/* Conversation Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg truncate">
                              {itemInfo?.item_name || 'Item'}
                            </h3>
                            <p className="text-sm text-muted-foreground truncate">
                              Chat with {getOtherUserName(otherUser)}
                            </p>
                          </div>
                          <Badge variant="secondary" className="flex-shrink-0">
                            {itemInfo?.category || 'Item'}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>
                            Last message: {formatDistanceToNow(new Date(conversation.updated_at), { addSuffix: true })}
                          </span>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenChat(conversation);
                            }}
                          >
                            Open Chat
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Chat Dialog */}
      {selectedConversation && (
        <ChatDialog
          open={chatOpen}
          onClose={handleCloseChat}
          conversationId={selectedConversation.id}
          otherUserName={getOtherUserName(getOtherUser(selectedConversation))}
          conversation={selectedConversation}
        />
      )}
    </div>
  );
};

export default ChatHistoryPage;
