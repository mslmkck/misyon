-- Announcements tablosu için RLS politikalarını düzelt
-- Bu script Supabase SQL Editor'da çalıştırılmalıdır

-- Önce mevcut politikaları kaldır
DROP POLICY IF EXISTS "Anyone can read active announcements" ON announcements;
DROP POLICY IF EXISTS "Admins can manage announcements" ON announcements;

-- RLS'yi devre dışı bırak (geçici olarak)
ALTER TABLE announcements DISABLE ROW LEVEL SECURITY;

-- Yeni politikalar oluştur
-- Herkes aktif duyuruları okuyabilir (kimlik doğrulama gerektirmez)
CREATE POLICY "Public can read active announcements" ON announcements
    FOR SELECT
    USING (is_active = true);

-- Admin kullanıcılar tüm duyuruları yönetebilir
CREATE POLICY "Admins can manage all announcements" ON announcements
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.is_admin = true
        )
    );

-- RLS'yi tekrar etkinleştir
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Test için bir duyuru ekle
INSERT INTO announcements (title, content, is_active, created_by) 
VALUES (
    'Hoş Geldiniz!', 
    'ProSınav platformuna hoş geldiniz. Başarılı bir sınav hazırlığı için buradayız!', 
    true,
    (SELECT id FROM user_profiles WHERE is_admin = true LIMIT 1)
) ON CONFLICT DO NOTHING;