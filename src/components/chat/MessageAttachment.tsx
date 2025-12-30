import { FileText, Download, FileVideo, FileAudio } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getChatAttachmentUrl } from '@/db/api';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';

interface MessageAttachmentProps {
  attachmentUrl: string;
  attachmentType: 'image' | 'document' | 'video' | 'audio';
  attachmentName: string;
  attachmentSize?: number;
}

export function MessageAttachment({
  attachmentUrl,
  attachmentType,
  attachmentName,
  attachmentSize,
}: MessageAttachmentProps) {
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchSignedUrl = async () => {
      try {
        setLoading(true);
        setError(false);
        const url = await getChatAttachmentUrl(attachmentUrl);
        setSignedUrl(url);
      } catch (err) {
        console.error('Error fetching attachment URL:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchSignedUrl();
  }, [attachmentUrl]);

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleDownload = () => {
    if (!signedUrl) return;
    const link = document.createElement('a');
    link.href = signedUrl;
    link.download = attachmentName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="mt-2">
        <Skeleton className="h-32 w-48 rounded-lg bg-muted" />
      </div>
    );
  }

  if (error || !signedUrl) {
    return (
      <div className="mt-2 bg-destructive/10 text-destructive rounded-lg p-3 max-w-sm">
        <p className="text-sm">Failed to load attachment</p>
      </div>
    );
  }

  // Image attachment
  if (attachmentType === 'image') {
    return (
      <>
        <div 
          className="mt-2 cursor-pointer rounded-lg overflow-hidden max-w-xs"
          onClick={() => setImageViewerOpen(true)}
        >
          <img
            src={signedUrl}
            alt={attachmentName}
            className="w-full h-auto object-cover hover:opacity-90 transition-opacity"
            loading="lazy"
          />
        </div>

        {/* Image Viewer Dialog */}
        <Dialog open={imageViewerOpen} onOpenChange={setImageViewerOpen}>
          <DialogContent className="max-w-4xl p-0 bg-black/90">
            <div className="relative">
              <img
                src={signedUrl}
                alt={attachmentName}
                className="w-full h-auto max-h-[90vh] object-contain"
              />
              <Button
                variant="secondary"
                size="sm"
                className="absolute top-4 right-4"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // Video attachment
  if (attachmentType === 'video') {
    return (
      <div className="mt-2 rounded-lg overflow-hidden max-w-sm">
        <video
          src={signedUrl}
          controls
          className="w-full h-auto"
          preload="metadata"
        >
          Your browser does not support the video tag.
        </video>
        <div className="bg-muted px-3 py-2 text-xs text-muted-foreground">
          {attachmentName} {attachmentSize && `• ${formatFileSize(attachmentSize)}`}
        </div>
      </div>
    );
  }

  // Audio attachment
  if (attachmentType === 'audio') {
    return (
      <div className="mt-2 bg-muted rounded-lg p-3 max-w-sm">
        <div className="flex items-center gap-2 mb-2">
          <FileAudio className="h-5 w-5 text-muted-foreground" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{attachmentName}</p>
            {attachmentSize && (
              <p className="text-xs text-muted-foreground">{formatFileSize(attachmentSize)}</p>
            )}
          </div>
        </div>
        <audio
          src={signedUrl}
          controls
          className="w-full"
          preload="metadata"
        >
          Your browser does not support the audio tag.
        </audio>
      </div>
    );
  }

  // Document attachment
  return (
    <div className="mt-2 bg-muted rounded-lg p-3 flex items-center gap-3 max-w-sm">
      <div className="flex-shrink-0 w-10 h-10 bg-background rounded flex items-center justify-center">
        <FileText className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{attachmentName}</p>
        {attachmentSize && (
          <p className="text-xs text-muted-foreground">{formatFileSize(attachmentSize)}</p>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="flex-shrink-0"
        onClick={handleDownload}
      >
        <Download className="h-4 w-4" />
      </Button>
    </div>
  );
}
