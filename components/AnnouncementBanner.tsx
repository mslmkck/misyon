import React, { useState, useEffect } from 'react';
import { supabase } from '../src/lib/supabase';

interface Announcement {
  id: string;
  title: string;
  content: string;
  is_active: boolean;
  created_at: string;
}

const AnnouncementBanner: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      // Kimlik doğrulama gerektirmeyen direkt sorgu
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Duyurular yüklenirken hata:', error);
        setAnnouncements([]);
      } else {
        setAnnouncements(data || []);
      }
    } catch (error) {
      console.error('Duyurular yüklenirken hata:', error);
      setAnnouncements([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3">
        <div className="flex items-center justify-center">
          <span className="text-sm">Duyurular yükleniyor...</span>
        </div>
      </div>
    );
  }

  if (announcements.length === 0) {
    return (
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3">
        <div className="flex items-center justify-center">
          <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium mr-4">
            📢 DUYURU
          </span>
          <span className="text-sm">Henüz aktif duyuru bulunmamaktadır.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 overflow-hidden relative">
      <div className="flex items-center">
        <div className="flex-shrink-0 px-4">
          <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
            📢 DUYURU
          </span>
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="animate-marquee whitespace-nowrap">
            {announcements.map((announcement, index) => (
              <span key={announcement.id} className="inline-block">
                <span className="font-medium">{announcement.title}:</span>
                <span className="ml-2">{announcement.content}</span>
                {index < announcements.length - 1 && (
                  <span className="mx-8 text-white/60">•</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes marquee {
            0% {
              transform: translateX(100%);
            }
            100% {
              transform: translateX(-100%);
            }
          }
          
          .animate-marquee {
            animation: marquee 30s linear infinite;
          }
          
          .animate-marquee:hover {
            animation-play-state: paused;
          }
        `
      }} />
    </div>
  );
};

export default AnnouncementBanner;