-- Announcements tablosu için RLS politikalarını düzelt
-- Bu script Supabase SQL Editor'da çalıştırılmalıdır

-- Önce mevcut politikaları kaldır
DROP POLICY IF EXISTS "Anyone can read active announcements" ON announcements;
DROP POLICY IF EXISTS "Only admins can manage announcements" ON announcements;
DROP POLICY IF EXISTS "Public can read active announcements" ON announcements;
DROP POLICY IF EXISTS "Admins can manage all announcements" ON announcements;
DROP POLICY IF EXISTS "Everyone can view active announcements" ON announcements;

-- RLS'yi etkinleştir
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Herkes aktif duyuruları okuyabilir (kimlik doğrulama gerektirmez)
CREATE POLICY "Public can read active announcements" ON announcements
    FOR SELECT
    USING (is_active = true);

-- Admin kullanıcılar tüm duyuruları yönetebilir
-- user_profiles tablosunu kullanarak admin kontrolü
CREATE POLICY "Admins can manage all announcements" ON announcements
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.is_admin = true
        )
    );

-- Test için admin kullanıcı kontrolü
-- Eğer user_profiles tablosu yoksa veya admin kullanıcı yoksa, 
-- geçici olarak tüm authenticated kullanıcılara izin ver
CREATE POLICY "Temp admin access for announcements" ON announcements
    FOR ALL
    USING (auth.role() = 'authenticated');

-- Bu politikayı sadece geçici olarak kullanın!
-- Admin sistemi düzgün çalıştıktan sonra kaldırın.