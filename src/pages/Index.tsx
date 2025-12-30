import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { AudioPlayer } from '@/components/AudioPlayer';

const Index = () => {
  const [currentAudio, setCurrentAudio] = useState<number | null>(null);
  const [comments, setComments] = useState<{ [key: string]: Array<{ author: string; text: string; date: string }> }>({});
  const [newComment, setNewComment] = useState<{ [key: string]: { author: string; text: string } }>({});

  const audioContent = [
    {
      id: 1,
      title: "Русские просторы",
      author: "Автор произведения",
      duration: "5:30",
      description: "Аудиопроизведение о красоте русской природы",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    },
    {
      id: 2,
      title: "Родные напевы",
      author: "Автор произведения",
      duration: "4:15",
      description: "Традиционные мелодии нашей земли",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
    },
    {
      id: 3,
      title: "Голоса предков",
      author: "Автор произведения",
      duration: "6:45",
      description: "Истории и сказания русского народа",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
    }
  ];

  const videoContent = [
    {
      id: 1,
      title: "Времена года России",
      duration: "12:30",
      thumbnail: "https://cdn.poehali.dev/projects/23a6611e-5dd1-4bb1-b1a1-0449d1a88e06/files/f1358683-346a-43d2-bdfa-a59ef02c7f60.jpg",
      description: "Документальный фильм о красоте русской природы"
    },
    {
      id: 2,
      title: "Культурное наследие",
      duration: "15:20",
      thumbnail: "https://cdn.poehali.dev/projects/23a6611e-5dd1-4bb1-b1a1-0449d1a88e06/files/94b5573a-e968-47a2-9242-2e10261c4a54.jpg",
      description: "Обзор традиций и обычаев"
    }
  ];

  const photoGallery = [
    {
      id: 1,
      src: "https://cdn.poehali.dev/projects/23a6611e-5dd1-4bb1-b1a1-0449d1a88e06/files/f1358683-346a-43d2-bdfa-a59ef02c7f60.jpg",
      title: "Золотая осень",
      description: "Березовая роща в закатных лучах"
    },
    {
      id: 2,
      src: "https://cdn.poehali.dev/projects/23a6611e-5dd1-4bb1-b1a1-0449d1a88e06/files/93c47059-39cf-45c8-9b2c-9a8e72ca01e0.jpg",
      title: "Зимняя сказка",
      description: "Заснеженный лес и деревенька"
    },
    {
      id: 3,
      src: "https://cdn.poehali.dev/projects/23a6611e-5dd1-4bb1-b1a1-0449d1a88e06/files/94b5573a-e968-47a2-9242-2e10261c4a54.jpg",
      title: "Народное искусство",
      description: "Традиционные узоры хохломы"
    }
  ];

  const handleAddComment = (contentId: string, contentType: string) => {
    const key = `${contentType}-${contentId}`;
    const comment = newComment[key];
    
    if (comment && comment.author && comment.text) {
      const newCommentObj = {
        author: comment.author,
        text: comment.text,
        date: new Date().toLocaleDateString('ru-RU')
      };
      
      setComments({
        ...comments,
        [key]: [...(comments[key] || []), newCommentObj]
      });
      
      setNewComment({
        ...newComment,
        [key]: { author: '', text: '' }
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://cdn.poehali.dev/projects/23a6611e-5dd1-4bb1-b1a1-0449d1a88e06/files/f1358683-346a-43d2-bdfa-a59ef02c7f60.jpg')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-background"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 animate-fade-in">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 drop-shadow-lg">
            ОТЧИЗНА МОЯ
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto drop-shadow">
            Авторский портал аудио и видео контента о русской культуре и природе
          </p>
        </div>
      </header>

      <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <span className="font-semibold text-lg">ОТЧИЗНА МОЯ</span>
            <div className="hidden md:flex gap-6">
              <a href="#audio" className="hover:text-primary transition-colors">Аудио</a>
              <a href="#video" className="hover:text-primary transition-colors">Видео</a>
              <a href="#gallery" className="hover:text-primary transition-colors">Галерея</a>
              <a href="#about" className="hover:text-primary transition-colors">О проекте</a>
              <a href="#contact" className="hover:text-primary transition-colors">Контакты</a>
            </div>
          </div>
        </div>
      </nav>

      <section id="audio" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 animate-fade-in">
            <Icon name="Music" size={48} className="mx-auto mb-4 text-primary" />
            <h2 className="text-5xl font-bold mb-4">Аудиотека</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Коллекция авторских аудиопроизведений о русской культуре
            </p>
          </div>

          <div className="grid gap-6">
            {audioContent.map((audio) => (
              <Card key={audio.id} className="overflow-hidden hover:shadow-lg transition-shadow animate-scale-in">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl mb-2">{audio.title}</CardTitle>
                      <CardDescription className="text-base">{audio.description}</CardDescription>
                    </div>
                    <span className="text-sm text-muted-foreground whitespace-nowrap ml-4">
                      {audio.duration}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  {currentAudio === audio.id ? (
                    <div className="mb-6">
                      <AudioPlayer
                        currentTrack={audio}
                        playlist={audioContent}
                        onClose={() => setCurrentAudio(null)}
                        onTrackChange={(trackId) => setCurrentAudio(trackId)}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-4 mb-4">
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => setCurrentAudio(audio.id)}
                      >
                        <Icon name="Play" size={20} className="mr-2" />
                        Воспроизвести
                      </Button>
                    </div>
                  )}

                  <Separator className="my-6" />

                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Icon name="MessageCircle" size={18} />
                      Комментарии ({(comments[`audio-${audio.id}`] || []).length})
                    </h4>
                    
                    {(comments[`audio-${audio.id}`] || []).map((comment, idx) => (
                      <div key={idx} className="bg-muted/30 p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{comment.author}</span>
                          <span className="text-xs text-muted-foreground">{comment.date}</span>
                        </div>
                        <p className="text-sm">{comment.text}</p>
                      </div>
                    ))}

                    <div className="space-y-2 bg-card p-4 rounded-lg border">
                      <Input
                        placeholder="Ваше имя"
                        value={newComment[`audio-${audio.id}`]?.author || ''}
                        onChange={(e) => setNewComment({
                          ...newComment,
                          [`audio-${audio.id}`]: {
                            ...(newComment[`audio-${audio.id}`] || { text: '' }),
                            author: e.target.value
                          }
                        })}
                      />
                      <Textarea
                        placeholder="Ваш комментарий..."
                        value={newComment[`audio-${audio.id}`]?.text || ''}
                        onChange={(e) => setNewComment({
                          ...newComment,
                          [`audio-${audio.id}`]: {
                            ...(newComment[`audio-${audio.id}`] || { author: '' }),
                            text: e.target.value
                          }
                        })}
                      />
                      <Button onClick={() => handleAddComment(String(audio.id), 'audio')}>
                        <Icon name="Send" size={16} className="mr-2" />
                        Отправить
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="video" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 animate-fade-in">
            <Icon name="Video" size={48} className="mx-auto mb-4 text-primary" />
            <h2 className="text-5xl font-bold mb-4">Видеогалерея</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Авторские видеопроизведения о русской природе и культуре
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {videoContent.map((video) => (
              <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow animate-scale-in">
                <div className="relative aspect-video overflow-hidden group cursor-pointer">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white/90 rounded-full p-4">
                      <Icon name="Play" size={32} className="text-primary" />
                    </div>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-sm">
                    {video.duration}
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{video.title}</CardTitle>
                  <CardDescription>{video.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Separator className="mb-4" />
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Icon name="MessageCircle" size={18} />
                      Комментарии ({(comments[`video-${video.id}`] || []).length})
                    </h4>
                    
                    {(comments[`video-${video.id}`] || []).map((comment, idx) => (
                      <div key={idx} className="bg-muted/30 p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{comment.author}</span>
                          <span className="text-xs text-muted-foreground">{comment.date}</span>
                        </div>
                        <p className="text-sm">{comment.text}</p>
                      </div>
                    ))}

                    <div className="space-y-2 bg-card p-3 rounded-lg border">
                      <Input
                        placeholder="Ваше имя"
                        value={newComment[`video-${video.id}`]?.author || ''}
                        onChange={(e) => setNewComment({
                          ...newComment,
                          [`video-${video.id}`]: {
                            ...(newComment[`video-${video.id}`] || { text: '' }),
                            author: e.target.value
                          }
                        })}
                      />
                      <Textarea
                        placeholder="Ваш комментарий..."
                        rows={2}
                        value={newComment[`video-${video.id}`]?.text || ''}
                        onChange={(e) => setNewComment({
                          ...newComment,
                          [`video-${video.id}`]: {
                            ...(newComment[`video-${video.id}`] || { author: '' }),
                            text: e.target.value
                          }
                        })}
                      />
                      <Button size="sm" onClick={() => handleAddComment(String(video.id), 'video')}>
                        <Icon name="Send" size={14} className="mr-2" />
                        Отправить
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="gallery" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 animate-fade-in">
            <Icon name="Image" size={48} className="mx-auto mb-4 text-primary" />
            <h2 className="text-5xl font-bold mb-4">Фотогалерея</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Красота русских пейзажей и народного искусства
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {photoGallery.map((photo) => (
              <Card key={photo.id} className="overflow-hidden hover:shadow-lg transition-shadow animate-scale-in">
                <div className="relative aspect-square overflow-hidden group cursor-pointer">
                  <img 
                    src={photo.src} 
                    alt={photo.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <div className="text-white">
                      <h3 className="font-semibold text-lg mb-1">{photo.title}</h3>
                      <p className="text-sm text-white/90">{photo.description}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12 animate-fade-in">
            <Icon name="Heart" size={48} className="mx-auto mb-4 text-primary" />
            <h2 className="text-5xl font-bold mb-4">О проекте</h2>
          </div>

          <Card className="animate-scale-in">
            <CardContent className="p-8">
              <div className="prose prose-lg max-w-none">
                <p className="text-lg leading-relaxed mb-6">
                  <span className="text-3xl font-bold text-primary">ОТЧИЗНА МОЯ</span> — это авторский культурный проект, 
                  посвященный сохранению и популяризации русской культуры, природы и традиций.
                </p>
                <Separator className="my-6" />
                <h3 className="text-2xl font-semibold mb-4">Миссия проекта</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Наша цель — создать пространство, где каждый может прикоснуться к красоте русской земли, 
                  узнать о её культурном наследии через авторские аудио и видео произведения.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Мы верим, что через искусство и творчество можно передать любовь к родной земле, 
                  её истории и традициям следующим поколениям.
                </p>
                <Separator className="my-6" />
                <h3 className="text-2xl font-semibold mb-4">Об авторе</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Автор проекта — энтузиаст и любитель русской культуры, создающий уникальный контент 
                  о природе, истории и традициях нашей страны.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="contact" className="py-20 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-12 animate-fade-in">
            <Icon name="Mail" size={48} className="mx-auto mb-4 text-primary" />
            <h2 className="text-5xl font-bold mb-4">Связаться с нами</h2>
            <p className="text-muted-foreground text-lg">
              Есть вопросы или предложения? Напишите нам!
            </p>
          </div>

          <Card className="animate-scale-in">
            <CardContent className="p-8">
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Ваше имя</label>
                  <Input placeholder="Иван Иванов" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input type="email" placeholder="ivan@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Тема сообщения</label>
                  <Input placeholder="О чём вы хотите написать?" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Сообщение</label>
                  <Textarea rows={6} placeholder="Ваше сообщение..." />
                </div>
                <Button size="lg" className="w-full">
                  <Icon name="Send" size={20} className="mr-2" />
                  Отправить сообщение
                </Button>
              </form>

              <Separator className="my-8" />

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Контактная информация</h3>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Icon name="Mail" size={20} />
                  <span>info@otchiznamoya.ru</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Icon name="Phone" size={20} />
                  <span>+7 (XXX) XXX-XX-XX</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="bg-accent text-accent-foreground py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <h3 className="text-3xl font-bold mb-4">ОТЧИЗНА МОЯ</h3>
            <p className="text-accent-foreground/80 mb-6">
              Авторский портал русской культуры и природы
            </p>
            <div className="flex justify-center gap-6 mb-6">
              <a href="#audio" className="hover:text-secondary transition-colors">Аудио</a>
              <a href="#video" className="hover:text-secondary transition-colors">Видео</a>
              <a href="#gallery" className="hover:text-secondary transition-colors">Галерея</a>
              <a href="#about" className="hover:text-secondary transition-colors">О проекте</a>
              <a href="#contact" className="hover:text-secondary transition-colors">Контакты</a>
            </div>
            <Separator className="my-6 bg-accent-foreground/20" />
            <p className="text-sm text-accent-foreground/60">
              © 2024 ОТЧИЗНА МОЯ. Все права защищены.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;