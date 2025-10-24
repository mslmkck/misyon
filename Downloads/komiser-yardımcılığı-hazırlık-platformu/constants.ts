import type { Subject, UserStatsData, QuizTest, Question, MockExam, FlashcardsBySubject, Topic } from './types';
import {
  BookOpenIcon,
  QuestionMarkCircleIcon,
  ClipboardListIcon,
} from './components/Icons';

export const SUBJECTS: Subject[] = [
  { 
    id: 'anayasa', 
    name: 'Anayasa Hukuku', 
    description: 'Temel anayasal kavramlar, devlet yapısı ve temel haklar.', 
    icon: BookOpenIcon,
    topics: [
        { id: 'anayasa-topic-1', title: 'Anayasal Gelişmeler', content: 'Osmanlı\'dan günümüze anayasal gelişmeler, Sened-i İttifak, Tanzimat Fermanı, Islahat Fermanı, Kanun-i Esasi ve Cumhuriyet dönemi anayasaları hakkında detaylı özet.' },
        { id: 'anayasa-topic-2', title: 'Yürütme', content: 'Cumhurbaşkanı, görev ve yetkileri, bakanlar ve merkezi idare teşkilatı. Yürütme organının işleyişi ve yapısı.' },
        { id: 'anayasa-topic-3', title: 'Yargı', content: 'Anayasa Mahkemesi, Yargıtay, Danıştay gibi yüksek mahkemeler, HSK ve Türk yargı sisteminin temel ilkeleri.' },
        { id: 'anayasa-topic-4', title: 'Seçimler', content: 'Seçimlerin genel ilkeleri, milletvekili seçimi, Cumhurbaşkanı seçimi ve seçim sistemleri hakkında temel bilgiler.' },
    ]
  },
  { id: 'idare', name: 'İdare Hukuku', description: 'İdarenin yapısı, işleyişi ve idari işlemler.', icon: BookOpenIcon, topics: [] },
  { id: 'ceza', name: 'Ceza Hukuku', description: 'Suç ve ceza kavramları, genel ve özel hükümler.', icon: BookOpenIcon, topics: [] },
  { id: 'ceza_muhakemesi', name: 'Ceza Muhakemesi Hukuku', description: 'Soruşturma, kovuşturma ve yargılama süreçleri.', icon: BookOpenIcon, topics: [] },
  { id: 'polis_mevzuati', name: 'Polis Mevzuatı', description: 'Polisin görev, yetki ve sorumlulukları.', icon: ClipboardListIcon, topics: [] },
  { id: 'ataturk', name: 'Atatürk İlkeleri ve İnkılap Tarihi', description: 'Türkiye Cumhuriyeti\'nin kuruluş ve gelişim süreci.', icon: BookOpenIcon, topics: [] },
  { id: 'insan_haklari', name: 'İnsan Hakları', description: 'Evrensel insan hakları beyannamesi ve sözleşmeler.', icon: BookOpenIcon, topics: [] },
  { id: 'genel_kultur', name: 'Genel Kültür', description: 'Tarih, coğrafya, vatandaşlık ve güncel konular.', icon: QuestionMarkCircleIcon, topics: [] },
];

export const USER_STATS_DATA: UserStatsData = {
  overallProgress: 76,
  lastExamScore: 82,
  questionsAnswered: 1245,
  correctAnswers: 987,
  subjectPerformance: [
    { subject: 'Anayasa', score: 85 },
    { subject: 'İdare', score: 72 },
    { subject: 'Ceza', score: 91 },
    { subject: 'CMK', score: 68 },
    { subject: 'Mevzuat', score: 88 },
    { subject: 'Tarih', score: 75 },
  ],
};

const generateMockQuestions = (subject: string, questionPrefix: string, count: number): Question[] => {
    return Array.from({ length: count }, (_, i) => ({
        id: `${subject}-q-${i + 1}`,
        question: `${questionPrefix} ${i + 1}: Bu bir örnek sorudur. Doğru cevap nedir?`,
        options: [`Cevap A`, `Cevap B`, `Cevap C`, `Cevap D`],
        answer: `Cevap A`,
        explanation: `Bu sorunun doğru cevabı 'Cevap A' çünkü bu bir örnek açıklamadır ve sorunun mantığını açıklar. Her sorunun kendine özgü bir açıklaması olabilir.`
    }));
};

export const QUESTIONS_BY_SUBJECT: Record<string, QuizTest[]> = {
    'anayasa': [
        { id: 'anayasa-test-1', name: 'Test 1', questions: generateMockQuestions('anayasa-1', 'Anayasa Sorusu', 20) },
        { id: 'anayasa-test-2', name: 'Test 2', questions: generateMockQuestions('anayasa-2', 'Anayasa Sorusu', 20) },
    ],
    'idare': [
        { id: 'idare-test-1', name: 'Test 1', questions: generateMockQuestions('idare-1', 'İdare Hukuku Sorusu', 20) },
    ],
    'ceza': [
        { id: 'ceza-test-1', name: 'Test 1', questions: generateMockQuestions('ceza-1', 'Ceza Hukuku Sorusu', 20) },
        { id: 'ceza-test-2', name: 'Test 2', questions: generateMockQuestions('ceza-2', 'Ceza Hukuku Sorusu', 20) },
    ],
    // Diğer dersler için de benzer şekilde testler eklenebilir.
};


export const MOCK_EXAMS: MockExam[] = [
    { id: 1, name: "Genel Deneme Sınavı 1", duration: 120, questions: generateMockQuestions('exam-1', 'Genel Deneme 1 Sorusu', 100) },
    { id: 2, name: "Anayasa Hukuku Özel Denemesi", duration: 60, questions: generateMockQuestions('exam-2', 'Anayasa Deneme Sorusu', 50) },
    { id: 3, name: "Polis Mevzuatı Tarama Testi", duration: 90, questions: generateMockQuestions('exam-3', 'Mevzuat Deneme Sorusu', 75) },
    { id: 4, name: "Genel Deneme Sınavı 2", duration: 120, questions: generateMockQuestions('exam-4', 'Genel Deneme 2 Sorusu', 100) },
  ];

export const FLASHCARDS_BY_SUBJECT: FlashcardsBySubject = {
    'anayasa': [
        {
            id: 'fc-ana-1',
            front: "Kanunsuz suç ve ceza olmaz ilkesi nedir?",
            back: "Hiç kimsenin, işlendiği zaman yürürlükte bulunan kanunun suç saymadığı bir fiilden dolayı cezalandırılamayacağını ifade eden temel ceza hukuku ilkesidir."
        },
        {
            id: 'fc-ana-2',
            front: "Anayasa Mahkemesi'nin görevleri nelerdir?",
            back: "Kanunların, Cumhurbaşkanlığı kararnamelerinin ve TBMM İçtüzüğünün Anayasaya şekil ve esas bakımlarından uygunluğunu denetlemek ve bireysel başvuruları karara bağlamak."
        }
    ],
    'idare': [
        {
            id: 'fc-idare-1',
            front: "İdari vesayet nedir?",
            back: "Merkezi idarenin, yerinden yönetim kuruluşları üzerinde sahip olduğu, hukuka uygunluk ve yerindelik denetimini kapsayan yetkidir."
        }
    ],
    'polis_mevzuati': [
        {
            id: 'fc-polis-1',
            front: "Polisin zor kullanma yetkisinin sınırları nelerdir?",
            back: "Polis, görevini yaparken direnişle karşılaşması halinde, bu direnişi kırmak amacıyla ve kıracak ölçüde zor kullanmaya yetkilidir. Zor kullanma, kademeli olarak artan bir şekilde bedeni kuvvet, maddi güç ve son çare olarak silah kullanmayı içerir."
        }
    ]
};