
import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';
import UserAvatar from '../components/UserAvatar';
import type { User, Theme } from '../types';
import { SunIcon, MoonIcon } from '../components/Icons';

interface SettingsPageProps {
  navigateBack: () => void;
  user: User;
  setUser: (user: User) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const SettingsCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{title}</h3>
            {children}
        </div>
    </div>
);

const SettingsPage: React.FC<SettingsPageProps> = ({ navigateBack, user, setUser, theme, setTheme }) => {
  const [name, setName] = useState(user.name);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({ ...user, name });
    alert('Profil bilgileri güncellendi!');
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Yeni şifreler eşleşmiyor!');
      return;
    }
    if (!newPassword || !currentPassword) {
        alert('Lütfen tüm şifre alanlarını doldurun.');
        return;
    }
    // TODO: Gerçek bir uygulamada şifre güncelleme API çağrısı yapılır.
    alert('Şifre başarıyla güncellendi!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleResetProgress = () => {
    if (window.confirm("Emin misiniz? Tüm ilerlemeniz ve istatistikleriniz kalıcı olarak silinecektir. Bu işlem geri alınamaz.")) {
        // TODO: ilerleme verilerini temizle
        alert("İlerlemeniz sıfırlandı.");
    }
  };

  const handleDeleteAccount = () => {
     if (window.confirm("Hesabınızı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz ve tüm verileriniz kalıcı olarak silinir.")) {
        // TODO: hesap silme ve çıkış yapma
        alert("Hesabınız silindi.");
        // onLogout() gibi bir fonksiyon çağrılmalı
    }
  };

  return (
    <div>
      <PageHeader title="Hesap Ayarları" subtitle="Profil bilgilerinizi ve tercihlerinizi yönetin." onBack={navigateBack} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            {/* Profil Bilgileri Kartı */}
            <SettingsCard title="Profil Bilgileri">
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-600 dark:text-gray-400">Ad Soyad</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                     <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-600 dark:text-gray-400">E-posta Adresi</label>
                        <input
                            type="email"
                            id="email"
                            value={user.email}
                            readOnly
                            className="mt-1 block w-full bg-gray-200 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                        />
                    </div>
                     <div className="text-right">
                        <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition-colors">
                            Değişiklikleri Kaydet
                        </button>
                    </div>
                </form>
            </SettingsCard>

            {/* Şifre Değiştirme Kartı */}
            <SettingsCard title="Şifre Değiştir">
                 <form onSubmit={handlePasswordUpdate} className="space-y-4">
                    <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-600 dark:text-gray-400">Mevcut Şifre</label>
                        <input type="password" id="currentPassword" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                     <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-600 dark:text-gray-400">Yeni Şifre</label>
                        <input type="password" id="newPassword" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                     <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600 dark:text-gray-400">Yeni Şifre (Tekrar)</label>
                        <input type="password" id="confirmPassword" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                     <div className="text-right">
                        <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition-colors">
                           Şifreyi Güncelle
                        </button>
                    </div>
                </form>
            </SettingsCard>
        </div>
        
        <div className="space-y-8">
            {/* Profil Avatar Kartı */}
            <SettingsCard title="Profil Avatarı">
                <div className="text-center">
                    <div className="mb-4">
                        <UserAvatar name={user.name} email={user.email} size={80} className="mx-auto" />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Avatar otomatik olarak isminizin baş harflerinden oluşturulur.
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                        Profil bilgilerinizi güncelleyerek avatarınızı değiştirebilirsiniz.
                    </p>
                </div>
            </SettingsCard>

            {/* Görünüm Ayarları Kartı */}
            <SettingsCard title="Görünüm">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Uygulama arayüzünün görünümünü seçin.</p>
                <div className="flex space-x-4">
                    <button onClick={() => setTheme('light')} className={`flex-1 p-4 rounded-lg border-2 transition-colors flex flex-col items-center justify-center ${theme === 'light' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/50' : 'border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700/50 hover:border-indigo-400'}`}>
                        <SunIcon className="w-8 h-8 mb-2 text-yellow-500" />
                        <span className="font-semibold">Açık</span>
                    </button>
                    <button onClick={() => setTheme('dark')} className={`flex-1 p-4 rounded-lg border-2 transition-colors flex flex-col items-center justify-center ${theme === 'dark' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/50' : 'border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700/50 hover:border-indigo-400'}`}>
                        <MoonIcon className="w-8 h-8 mb-2 text-indigo-400" />
                        <span className="font-semibold">Koyu</span>
                    </button>
                </div>
            </SettingsCard>

             {/* Tehlikeli Alan Kartı */}
             <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-red-500/30">
                <div className="p-6">
                    <h3 className="text-xl font-bold text-red-500 dark:text-red-400 mb-4">Tehlikeli Alan</h3>
                    <div className="space-y-4">
                        <div>
                            <p className="text-gray-800 dark:text-gray-300 font-semibold">İlerlemeyi Sıfırla</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Tüm sınav ve soru çözümü istatistiklerinizi sıfırlayın.</p>
                            <button onClick={handleResetProgress} className="w-full bg-red-600/80 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors">
                                İlerlemeyi Sıfırla
                            </button>
                        </div>
                         <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-gray-800 dark:text-gray-300 font-semibold">Hesabı Sil</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Hesabınızı ve tüm verilerinizi kalıcı olarak silin.</p>
                             <button onClick={handleDeleteAccount} className="w-full bg-red-800 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors">
                                Hesabımı Sil
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default SettingsPage;