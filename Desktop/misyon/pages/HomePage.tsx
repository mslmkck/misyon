
import React from 'react';
import type { Page, Theme, User } from '../types';
import DashboardCard from '../components/DashboardCard';
import AnnouncementBanner from '../components/AnnouncementBanner';
import {
  BookOpenIcon,
  QuestionMarkCircleIcon,
  ClipboardListIcon,
  CollectionIcon,
} from '../components/Icons';

interface HomePageProps {
  navigateTo: (page: Page) => void;
  theme: Theme;
  user: User;
}

const HomePage: React.FC<HomePageProps> = ({ navigateTo, theme, user }) => {
  const dashboardItems = [
    { page: 'lessons' as Page, title: 'Dersler', description: 'Konu anlatımları ve ders notları.', icon: <BookOpenIcon className="w-6 h-6 text-indigo-500 dark:text-indigo-400 group-hover:text-gray-800" /> },
    { page: 'questions' as Page, title: 'Sorular', description: 'Binlerce soru ile pratik yapın.', icon: <QuestionMarkCircleIcon className="w-6 h-6 text-indigo-500 dark:text-indigo-400 group-hover:text-gray-800" /> },
    { page: 'exams' as Page, title: 'Denemeler', description: 'Gerçek sınav formatında denemeler çözün.', icon: <ClipboardListIcon className="w-6 h-6 text-indigo-500 dark:text-indigo-400 group-hover:text-gray-800" /> },
    { page: 'flashcards' as Page, title: 'Bilgi Kartları', description: 'Önemli bilgileri hızlıca tekrar edin.', icon: <CollectionIcon className="w-6 h-6 text-indigo-500 dark:text-indigo-400 group-hover:text-gray-800" /> },
  ];

  return (
    <div className="space-y-12">
      <AnnouncementBanner />
      
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Hoş Geldiniz, {user.name}!</h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Sınav hazırlık yolculuğunuzda yanınızdayız.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardItems.map(item => (
          <DashboardCard
            key={item.page}
            title={item.title}
            description={item.description}
            icon={item.icon}
            onClick={() => navigateTo(item.page)}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;