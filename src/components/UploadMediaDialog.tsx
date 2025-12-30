import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface UploadMediaDialogProps {
  type: 'audio' | 'video';
  onSuccess?: () => void;
}

export const UploadMediaDialog = ({ type, onSuccess }: UploadMediaDialogProps) => {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const { toast } = useToast();

  const resetForm = () => {
    setTitle('');
    setAuthor('');
    setDescription('');
    setDuration('');
    setFile(null);
    setThumbnailFile(null);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result as string;
        resolve(base64.split(',')[1]);
      };
      reader.onerror = error => reject(error);
    });
  };

  const uploadFile = async (file: File, contentType: string) => {
    const base64Data = await fileToBase64(file);
    
    const response = await fetch('https://functions.poehali.dev/922c78c5-1c33-44e2-aa7d-c38249cd269b', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        file: base64Data,
        fileName: file.name,
        fileType: file.type,
        contentType: contentType
      }),
    });

    if (!response.ok) {
      throw new Error('Ошибка загрузки файла');
    }

    const data = await response.json();
    return data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !title) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все обязательные поля',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);

    try {
      const mediaUrl = await uploadFile(file, type);
      let thumbnailUrl = '';
      
      if (type === 'video' && thumbnailFile) {
        thumbnailUrl = await uploadFile(thumbnailFile, 'video');
      }

      const response = await fetch('https://functions.poehali.dev/8cdb8115-479c-47eb-8bba-55fcc3937026', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contentType: type,
          title,
          author: type === 'audio' ? author : undefined,
          description,
          duration,
          audioUrl: type === 'audio' ? mediaUrl : undefined,
          videoUrl: type === 'video' ? mediaUrl : undefined,
          thumbnailUrl: thumbnailUrl || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Ошибка сохранения данных');
      }

      toast({
        title: 'Успешно!',
        description: `${type === 'audio' ? 'Аудио' : 'Видео'} успешно загружено`,
      });

      resetForm();
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: error instanceof Error ? error.message : 'Произошла ошибка при загрузке',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Icon name="Upload" size={18} className="mr-2" />
          Загрузить {type === 'audio' ? 'аудио' : 'видео'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Загрузить {type === 'audio' ? 'аудио' : 'видео'}</DialogTitle>
          <DialogDescription>
            Заполните информацию и выберите файл для загрузки
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Название *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Введите название"
              required
            />
          </div>

          {type === 'audio' && (
            <div>
              <Label htmlFor="author">Автор *</Label>
              <Input
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Введите имя автора"
                required
              />
            </div>
          )}

          <div>
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Добавьте описание"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="duration">Длительность (например: 5:30)</Label>
            <Input
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="0:00"
            />
          </div>

          <div>
            <Label htmlFor="file">
              {type === 'audio' ? 'Аудиофайл' : 'Видеофайл'} *
            </Label>
            <Input
              id="file"
              type="file"
              accept={type === 'audio' ? 'audio/*' : 'video/*'}
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
            />
            {file && (
              <p className="text-sm text-muted-foreground mt-1">
                Выбран файл: {file.name}
              </p>
            )}
          </div>

          {type === 'video' && (
            <div>
              <Label htmlFor="thumbnail">Обложка видео (необязательно)</Label>
              <Input
                id="thumbnail"
                type="file"
                accept="image/*"
                onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
              />
              {thumbnailFile && (
                <p className="text-sm text-muted-foreground mt-1">
                  Выбран файл: {thumbnailFile.name}
                </p>
              )}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={uploading} className="flex-1">
              {uploading ? (
                <>
                  <Icon name="Loader2" size={18} className="mr-2 animate-spin" />
                  Загрузка...
                </>
              ) : (
                <>
                  <Icon name="Upload" size={18} className="mr-2" />
                  Загрузить
                </>
              )}
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={uploading}>
              Отмена
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
