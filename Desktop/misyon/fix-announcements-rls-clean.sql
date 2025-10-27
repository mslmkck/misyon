-- Announcements tablosu için RLS politikalarını temizle ve yeniden oluştur
-- Bu script Supabase SQL Editor'da çalıştırılmalıdır

-- Önce TÜM mevcut politikaları kaldır
DROP POLICY IF EXISTS "Anyone can read active announcements" ON announcements;
DROP POLICY IF EXISTS "Only admins can manage announcements" ON announcements;
DROP POLICY IF EXISTS "Public can read active announcements" ON announcements;
DROP POLICY IF EXISTS "Admins can manage all announcements" ON announcements;
DROP POLICY IF EXISTS "Everyone can view active announcements" ON announcements;
DROP POLICY IF EXISTS "Temp admin access for announcements" ON announcements;

-- RLS'yi etkinleştir
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- 1. Herkes aktif duyuruları okuyabilir (kimlik doğrulama gerektirmez)
CREATE POLICY "public_read_active_announcements" ON announcements
    FOR SELECT
    USING (is_active = true);

-- 2. Authenticated kullanıcılar duyuru oluşturabilir (geçici çözüm)
CREATE POLICY "authenticated_manage_announcements" ON announcements
    FOR ALL
    USING (auth.role() = 'authenticated');

-- Test için basit bir duyuru ekle
INSERT INTO announcements (title, content, is_active) 
VALUES ('Test Duyurusu', 'Bu bir test duyurusudur.', true)
ON CONFLICT DO NOTHING;