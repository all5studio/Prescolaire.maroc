export interface Post {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  categorySlug: string;
  image: string;
  date: string;
  author: string;
  readTime: number;
  views: number;
  featured?: boolean;
  tags: string[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  count: number;
  color: string;
}

export const categories: Category[] = [
  { id: 1, name: 'أخبار ومستجدات',        slug: 'news',        icon: 'Newspaper',       count: 24, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
  { id: 2, name: 'مباريات التعليم الأولي', slug: 'competitions', icon: 'Trophy',          count: 18, color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' },
  { id: 3, name: 'المستوى الأول',           slug: 'level-1',     icon: 'BookOpen',        count: 35, color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
  { id: 4, name: 'المستوى الثاني',          slug: 'level-2',     icon: 'BookOpenCheck',   count: 32, color: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300' },
  { id: 5, name: 'أنشطة تربوية',           slug: 'activities',  icon: 'Palette',         count: 47, color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300' },
  { id: 6, name: 'ألعاب تربوية',           slug: 'games',       icon: 'Gamepad2',        count: 29, color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
  { id: 7, name: 'مستندات',                slug: 'documents',   icon: 'FileText',        count: 41, color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' },
  { id: 8, name: 'مقاطع تربوية',           slug: 'videos',      icon: 'Video',           count: 22, color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' },
  { id: 9, name: 'وثائق إدارية',           slug: 'admin-docs',  icon: 'FolderOpen',      count: 31, color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' },
  { id: 10,name: 'نصائح وإرشادات',         slug: 'tips',        icon: 'Lightbulb',       count: 19, color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' },
];

export const heroSlides = [
  {
    id: 1,
    title: 'مباريات التعليم الأولي 2026 – فتح باب الترشح',
    excerpt: 'أعلنت وزارة التربية الوطنية عن فتح باب الترشح لمباريات التعليم الأولي للموسم الدراسي 2026-2027، وذلك ابتداء من الخامس عشر من يناير.',
    category: 'مباريات التعليم الأولي',
    categorySlug: 'competitions',
    image: 'https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    date: '2026-01-15',
    badge: 'عاجل',
    badgeColor: 'bg-red-500',
  },
  {
    id: 2,
    title: 'برنامج الارتقاء بالتعليم الأولي على الصعيد الوطني 2025–2030',
    excerpt: 'تطلق وزارة التربية الوطنية برنامجاً شاملاً للارتقاء بجودة التعليم الأولي العمومي وتوسيع شبكته عبر المملكة المغربية.',
    category: 'أخبار ومستجدات',
    categorySlug: 'news',
    image: 'https://images.pexels.com/photos/8613103/pexels-photo-8613103.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    date: '2025-12-10',
    badge: 'مستجد',
    badgeColor: 'bg-primary-700',
  },
  {
    id: 3,
    title: 'الدليل البيداغوجي الجديد للتعليم الأولي – إصدار 2026',
    excerpt: 'صدر الدليل البيداغوجي المحدّث للتعليم الأولي متضمناً أحدث التوجيهات التربوية والمقاربات الحديثة في تعليم الأطفال.',
    category: 'أخبار ومستجدات',
    categorySlug: 'news',
    image: 'https://images.pexels.com/photos/8613164/pexels-photo-8613164.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    date: '2025-11-20',
    badge: 'جديد',
    badgeColor: 'bg-green-600',
  },
  {
    id: 4,
    title: 'نتائج مباريات التوظيف في التعليم الأولي – الموسم 2025',
    excerpt: 'أعلنت الأكاديميات الجهوية للتربية والتكوين عن نتائج مباريات توظيف مربيات التعليم الأولي للموسم 2024-2025.',
    category: 'مباريات التعليم الأولي',
    categorySlug: 'competitions',
    image: 'https://images.pexels.com/photos/8613325/pexels-photo-8613325.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    date: '2025-10-05',
    badge: 'نتائج',
    badgeColor: 'bg-amber-500',
  },
];

export const posts: Post[] = [
  // News
  { id: 1,  title: 'مستجدات الدخول المدرسي 2026 للتعليم الأولي', excerpt: 'كل ما يجب معرفته عن الدخول المدرسي 2026 في مجال التعليم الأولي العمومي والخاص بالمغرب.', category: 'أخبار ومستجدات', categorySlug: 'news', image: 'https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=800&dpr=1', date: '2026-01-18', author: 'فريق التحرير', readTime: 5, views: 1240, featured: true, tags: ['دخول مدرسي', '2026'] },
  { id: 2,  title: 'توجيهات إطار العمل الوطني للتعليم الأولي', excerpt: 'ملخص لأهم توجيهات إطار العمل الوطني المحدّث الخاص بالتعليم الأولي بالمغرب.', category: 'أخبار ومستجدات', categorySlug: 'news', image: 'https://images.pexels.com/photos/8613103/pexels-photo-8613103.jpeg?auto=compress&cs=tinysrgb&w=800&dpr=1', date: '2025-12-28', author: 'فريق التحرير', readTime: 4, views: 892, tags: ['إطار عمل', 'توجيهات'] },
  // Competitions
  { id: 3,  title: 'شروط الترشح لمباريات التعليم الأولي 2026', excerpt: 'دليل شامل بشروط ومتطلبات الترشح لمباريات التعليم الأولي للموسم الدراسي القادم.', category: 'مباريات التعليم الأولي', categorySlug: 'competitions', image: 'https://images.pexels.com/photos/8613164/pexels-photo-8613164.jpeg?auto=compress&cs=tinysrgb&w=800&dpr=1', date: '2026-01-10', author: 'فريق التحرير', readTime: 6, views: 3450, featured: true, tags: ['مباريات', 'ترشح'] },
  { id: 4,  title: 'نماذج اختبارات مباريات التعليم الأولي السابقة', excerpt: 'مجموعة من نماذج الاختبارات السابقة لمساعدتك على التحضير الجيد لمباريات التعليم الأولي.', category: 'مباريات التعليم الأولي', categorySlug: 'competitions', image: 'https://images.pexels.com/photos/8613325/pexels-photo-8613325.jpeg?auto=compress&cs=tinysrgb&w=800&dpr=1', date: '2025-11-05', author: 'فريق التحرير', readTime: 8, views: 5120, tags: ['نماذج', 'اختبارات'] },
  // Level 1
  { id: 5,  title: 'خطط دروس المستوى الأول – الفصل الأول', excerpt: 'مجموعة متكاملة من خطط الدروس الجاهزة للمستوى الأول في التعليم الأولي، موزعة على مجالات التعلم.', category: 'المستوى الأول', categorySlug: 'level-1', image: 'https://images.pexels.com/photos/8422069/pexels-photo-8422069.jpeg?auto=compress&cs=tinysrgb&w=800&dpr=1', date: '2025-10-15', author: 'المربية سمية', readTime: 7, views: 2680, featured: true, tags: ['خطط دروس', 'المستوى الأول'] },
  { id: 6,  title: 'بطاقات الحروف والأرقام للمستوى الأول', excerpt: 'بطاقات ملونة وجذابة لتعليم الحروف العربية والأرقام لأطفال المستوى الأول.', category: 'المستوى الأول', categorySlug: 'level-1', image: 'https://images.pexels.com/photos/8422100/pexels-photo-8422100.jpeg?auto=compress&cs=tinysrgb&w=800&dpr=1', date: '2025-09-22', author: 'المربية ليلى', readTime: 3, views: 4310, tags: ['بطاقات', 'حروف', 'أرقام'] },
  // Level 2
  { id: 7,  title: 'برنامج المستوى الثاني – أنشطة التهيؤ للكتابة', excerpt: 'سلسلة من الأنشطة التربوية المصممة لتقوية مهارات التهيؤ للكتابة لدى أطفال المستوى الثاني.', category: 'المستوى الثاني', categorySlug: 'level-2', image: 'https://images.pexels.com/photos/8612927/pexels-photo-8612927.jpeg?auto=compress&cs=tinysrgb&w=800&dpr=1', date: '2025-10-08', author: 'المربية نور', readTime: 6, views: 1890, featured: true, tags: ['كتابة', 'المستوى الثاني'] },
  { id: 8,  title: 'قصص مصوّرة للمستوى الثاني', excerpt: 'مجموعة من القصص المصوّرة المناسبة لتنمية الخيال وتطوير مهارات الاستماع والتعبير لأطفال المستوى الثاني.', category: 'المستوى الثاني', categorySlug: 'level-2', image: 'https://images.pexels.com/photos/8612897/pexels-photo-8612897.jpeg?auto=compress&cs=tinysrgb&w=800&dpr=1', date: '2025-09-18', author: 'المربية أمل', readTime: 4, views: 2150, tags: ['قصص', 'مصورة'] },
  // Activities
  { id: 9,  title: 'أنشطة الفن والرسم لتنمية الإبداع', excerpt: 'مقترحات لأنشطة فنية وإبداعية تساعد على تطوير مهارات الطفل الحسية والحركية الدقيقة في مرحلة التعليم الأولي.', category: 'أنشطة تربوية', categorySlug: 'activities', image: 'https://images.pexels.com/photos/8613012/pexels-photo-8613012.jpeg?auto=compress&cs=tinysrgb&w=800&dpr=1', date: '2025-11-28', author: 'فريق التحرير', readTime: 5, views: 3200, featured: true, tags: ['فن', 'رسم', 'إبداع'] },
  { id: 10, title: 'أنشطة تنمية الوعي الصوتي والفونولوجي', excerpt: 'ألعاب وأنشطة تربوية هادفة لتنمية الوعي الصوتي والفونولوجي لدى أطفال التعليم الأولي تمهيداً للقراءة.', category: 'أنشطة تربوية', categorySlug: 'activities', image: 'https://images.pexels.com/photos/8612954/pexels-photo-8612954.jpeg?auto=compress&cs=tinysrgb&w=800&dpr=1', date: '2025-10-30', author: 'المربية سمية', readTime: 6, views: 1780, tags: ['وعي صوتي', 'قراءة'] },
  // Games
  { id: 11, title: 'ألعاب تربوية لتنمية الذكاء الرياضي المنطقي', excerpt: 'مجموعة من الألعاب التربوية المصممة لتحفيز التفكير المنطقي وحل المشكلات لدى الأطفال.', category: 'ألعاب تربوية', categorySlug: 'games', image: 'https://images.pexels.com/photos/8612903/pexels-photo-8612903.jpeg?auto=compress&cs=tinysrgb&w=800&dpr=1', date: '2025-12-05', author: 'فريق التحرير', readTime: 5, views: 2890, featured: true, tags: ['ألعاب', 'ذكاء', 'منطق'] },
  { id: 12, title: 'لعبة الدومينو التربوي – حروف وأرقام', excerpt: 'نموذج جاهز للطباعة للعبة الدومينو التربوي الخاص بالحروف والأرقام العربية للأطفال.', category: 'ألعاب تربوية', categorySlug: 'games', image: 'https://images.pexels.com/photos/8613065/pexels-photo-8613065.jpeg?auto=compress&cs=tinysrgb&w=800&dpr=1', date: '2025-11-14', author: 'المربية ليلى', readTime: 3, views: 4520, tags: ['دومينو', 'طباعة'] },
  // Documents
  { id: 13, title: 'الدليل العملي للمربية في التعليم الأولي', excerpt: 'دليل عملي شامل يرشد المربية خلال جميع مراحل الموسم الدراسي في مجال التعليم الأولي.', category: 'مستندات', categorySlug: 'documents', image: 'https://images.pexels.com/photos/8613208/pexels-photo-8613208.jpeg?auto=compress&cs=tinysrgb&w=800&dpr=1', date: '2025-09-10', author: 'فريق التحرير', readTime: 10, views: 5670, featured: true, tags: ['دليل', 'مربية'] },
  { id: 14, title: 'نماذج بطاقات التقييم التكويني للتعليم الأولي', excerpt: 'نماذج جاهزة لبطاقات التقييم التكويني وفق المرجعية الرسمية للتعليم الأولي بالمغرب.', category: 'مستندات', categorySlug: 'documents', image: 'https://images.pexels.com/photos/8613240/pexels-photo-8613240.jpeg?auto=compress&cs=tinysrgb&w=800&dpr=1', date: '2025-10-22', author: 'فريق التحرير', readTime: 4, views: 3890, tags: ['تقييم', 'نماذج'] },
  // Tips
  { id: 15, title: '10 نصائح لتهيئة بيئة التعلم في قسم التعليم الأولي', excerpt: 'نصائح عملية لتجهيز فضاء القسم وتهيئة بيئة تعلم محفزة وآمنة لأطفال التعليم الأولي.', category: 'نصائح وإرشادات', categorySlug: 'tips', image: 'https://images.pexels.com/photos/8613275/pexels-photo-8613275.jpeg?auto=compress&cs=tinysrgb&w=800&dpr=1', date: '2025-12-18', author: 'فريق التحرير', readTime: 7, views: 2140, featured: true, tags: ['بيئة تعلم', 'نصائح'] },
  { id: 16, title: 'كيف تتعاملين مع الطفل الخجول في القسم؟', excerpt: 'إرشادات تربوية للمربية حول كيفية التعامل مع الطفل الخجول وتشجيعه على الانخراط في الأنشطة.', category: 'نصائح وإرشادات', categorySlug: 'tips', image: 'https://images.pexels.com/photos/8612871/pexels-photo-8612871.jpeg?auto=compress&cs=tinysrgb&w=800&dpr=1', date: '2025-11-07', author: 'المربية نور', readTime: 5, views: 1560, tags: ['طفل', 'خجل', 'إرشادات'] },
];

export const recentSliderPosts: Post[] = posts.slice(0, 8);
export const featuredPosts: Post[] = posts.filter(p => p.featured);

export const newsTickerItems = [
  'فتح باب الترشح لمباريات التعليم الأولي 2026 ابتداء من 15 يناير',
  'إصدار الدليل البيداغوجي الجديد للتعليم الأولي',
  'الإعلان عن نتائج مباريات التوظيف في التعليم الأولي – الموسم 2025',
  'تنظيم ملتقى وطني حول جودة التعليم الأولي بالرباط',
  'توزيع المناهج الدراسية الجديدة على أقسام التعليم الأولي العمومي',
];
