import React from 'react';
import Avatar from 'react-avatar';

interface UserAvatarProps {
  name?: string;
  email?: string;
  size?: string | number;
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ 
  name, 
  email, 
  size = 40, 
  className = '' 
}) => {
  // Avatar için isim veya email kullan
  const displayName = name || email || 'Kullanıcı';
  
  return (
    <Avatar
      name={displayName}
      size={typeof size === 'number' ? size.toString() : size}
      round={true}
      className={`shadow-md ${className}`}
      color="#4F46E5" // Indigo rengi
      fgColor="#FFFFFF" // Beyaz metin
      textSizeRatio={1.75}
    />
  );
};

export default UserAvatar;