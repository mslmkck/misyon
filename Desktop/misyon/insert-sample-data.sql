-- ÖRNEK VERİLER

-- Konuları ekle
INSERT INTO public.subjects (id, name, description, icon_name) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Anayasa Hukuku', 'Temel anayasal kavramlar, devlet yapısı ve temel haklar.', 'BookOpenIcon'),
('550e8400-e29b-41d4-a716-446655440002', 'İdare Hukuku', 'İdarenin yapısı, işleyişi ve idari işlemler.', 'BookOpenIcon'),
('550e8400-e29b-41d4-a716-446655440003', 'Ceza Hukuku', 'Suç ve ceza kavramları, genel ve özel hükümler.', 'BookOpenIcon'),
('550e8400-e29b-41d4-a716-446655440004', 'Ceza Muhakemesi Hukuku', 'Soruşturma, kovuşturma ve yargılama süreçleri.', 'BookOpenIcon'),
('550e8400-e29b-41d4-a716-446655440005', 'Polis Mevzuatı', 'Polisin görev, yetki ve sorumlulukları.', 'ClipboardListIcon'),
('550e8400-e29b-41d4-a716-446655440006', 'Atatürk İlkeleri ve İnkılap Tarihi', 'Türkiye Cumhuriyeti''nin kuruluş ve gelişim süreci.', 'BookOpenIcon'),
('550e8400-e29b-41d4-a716-446655440007', 'İnsan Hakları', 'Evrensel insan hakları beyannamesi ve sözleşmeler.', 'BookOpenIcon'),
('550e8400-e29b-41d4-a716-446655440008', 'Genel Kültür', 'Tarih, coğrafya, vatandaşlık ve güncel konular.', 'QuestionMarkCircleIcon');

-- Anayasa Hukuku konularını ekle
INSERT INTO public.topics (subject_id, title, content, order_index) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Anayasal Gelişmeler', 'Osmanlı''dan günümüze anayasal gelişmeler, Sened-i İttifak, Tanzimat Fermanı, Islahat Fermanı, Kanun-i Esasi ve Cumhuriyet dönemi anayasaları hakkında detaylı özet.', 1),
('550e8400-e29b-41d4-a716-446655440001', 'Yürütme', 'Cumhurbaşkanı, görev ve yetkileri, bakanlar ve merkezi idare teşkilatı. Yürütme organının işleyişi ve yapısı.', 2),
('550e8400-e29b-41d4-a716-446655440001', 'Yargı', 'Anayasa Mahkemesi, Yargıtay, Danıştay gibi yüksek mahkemeler, HSK ve Türk yargı sisteminin temel ilkeleri.', 3),
('550e8400-e29b-41d4-a716-446655440001', 'Seçimler', 'Seçimlerin genel ilkeleri, milletvekili seçimi, Cumhurbaşkanı seçimi ve seçim sistemleri hakkında temel bilgiler.', 4);

-- Örnek sorular ekle
INSERT INTO public.questions (subject_id, question, options, correct_answer, explanation, difficulty_level) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Türkiye Cumhuriyeti''nin ilk anayasası hangisidir?', 
'["1921 Anayasası", "1924 Anayasası", "1961 Anayasası", "1982 Anayasası"]', 
'1921 Anayasası', 
'Türkiye Cumhuriyeti''nin ilk anayasası 20 Ocak 1921 tarihinde kabul edilen 1921 Anayasası''dır.', 1),

('550e8400-e29b-41d4-a716-446655440001', 'Cumhurbaşkanının görev süresi kaç yıldır?', 
'["4 yıl", "5 yıl", "6 yıl", "7 yıl"]', 
'5 yıl', 
'2017 Anayasa değişikliği ile Cumhurbaşkanının görev süresi 5 yıl olarak belirlenmiştir.', 1),

('550e8400-e29b-41d4-a716-446655440002', 'İdari işlemin temel unsurları aşağıdakilerden hangisinde doğru verilmiştir?', 
'["Yetki, şekil, sebep, konu, amaç", "Yetki, usul, neden, içerik, hedef", "Otorite, biçim, gerekçe, madde, gaye", "Salahiyet, form, dayanak, mevzu, maksat"]', 
'Yetki, şekil, sebep, konu, amaç', 
'İdari işlemin beş temel unsuru: yetki, şekil, sebep, konu ve amaçtır.', 2);

-- Örnek flashcard''lar ekle
INSERT INTO public.flashcards (subject_id, front, back) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Anayasa nedir?', 'Anayasa, devletin temel yapısını, organlarının görev ve yetkilerini, vatandaşların hak ve ödevlerini düzenleyen temel hukuki belgedir.'),
('550e8400-e29b-41d4-a716-446655440001', 'Hukuk devleti ilkesi nedir?', 'Hukuk devleti, devletin tüm organlarının hukuk kurallarına bağlı olduğu, keyfi uygulamaların önlendiği devlet anlayışıdır.'),
('550e8400-e29b-41d4-a716-446655440002', 'İdari işlem nedir?', 'İdari işlem, idarenin tek taraflı irade beyanı ile hukuki sonuç doğuran işlemidir.'),
('550e8400-e29b-41d4-a716-446655440003', 'Suç nedir?', 'Suç, kanunda açıkça tanımlanmış, hukuka aykırı ve kusurlu fiildir.');

-- Örnek deneme sınavı ekle
INSERT INTO public.mock_exams (name, description, duration, total_questions) VALUES
('Genel Deneme Sınavı 1', 'Tüm konulardan karma sorulardan oluşan deneme sınavı', 120, 100),
('Anayasa Hukuku Deneme Sınavı', 'Anayasa Hukuku konusundan sorular', 60, 50);