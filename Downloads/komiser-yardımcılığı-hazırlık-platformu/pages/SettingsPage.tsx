
import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import PageHeader from '../components/PageHeader';
import type { User } from '../types';

const SettingsCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
            {children}
        </div>
    </div>
);

const SettingsPage: React.FC = () => {
  const { user, setUser } = useAppStore();
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
      <PageHeader title="Hesap Ayarları" subtitle="Profil bilgilerinizi ve tercihlerinizi yönetin." />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            {/* Profil Bilgileri Kartı */}
            <SettingsCard title="Profil Bilgileri">
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-400">Ad Soyad</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                     <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-400">E-posta Adresi</label>
                        <input
                            type="email"
                            id="email"
                            value={user.email}
                            readOnly
                            className="mt-1 block w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-gray-400 cursor-not-allowed"
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
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-400">Mevcut Şifre</label>
                        <input type="password" id="currentPassword" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                     <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-400">Yeni Şifre</label>
                        <input type="password" id="newPassword" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                     <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-400">Yeni Şifre (Tekrar)</label>
                        <input type="password" id="confirmPassword" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
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
             {/* Tehlikeli Alan Kartı */}
             <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-red-500/30">
                <div className="p-6">
                    <h3 className="text-xl font-bold text-red-400 mb-4">Tehlikeli Alan</h3>
                    <div className="space-y-4">
                        <div>
                            <p className="text-gray-300 font-semibold">İlerlemeyi Sıfırla</p>
                            <p className="text-sm text-gray-400 mb-2">Tüm sınav ve soru çözümü istatistiklerinizi sıfırlayın.</p>
                            <button onClick={handleResetProgress} className="w-full bg-red-600/80 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors">
                                İlerlemeyi Sıfırla
                            </button>
                        </div>
                         <div className="pt-4 border-t border-gray-700">
                            <p className="text-gray-300 font-semibold">Hesabı Sil</p>
                            <p className="text-sm text-gray-400 mb-2">Hesabınızı ve tüm verilerinizi kalıcı olarak silin.</p>
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