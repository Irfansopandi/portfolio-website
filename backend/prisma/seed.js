const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('Admin123!', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@irfansopandi.dev' },
    update: {},
    create: {
      email: 'admin@irfansopandi.dev',
      password: hashedPassword,
      role: 'admin',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create or update profile
  const profileData = {
    name: 'Irfan Sopandi',
    profession: 'Full-Stack Developer & UI/UX Designer',
    professionEn: 'Full-Stack Developer & UI/UX Designer',
    bio: 'Developer berpengalaman dari Karawang, Indonesia. Saya membangun aplikasi web modern dengan fokus pada kode bersih, UI indah, dan pengalaman pengguna yang luar biasa.',
    bioEn: 'Passionate developer from Karawang, Indonesia. I build modern web applications with a focus on clean code, beautiful UI, and great user experience.',
    aboutText: `Halo! Saya Irfan Sopandi, seorang Full-Stack Developer yang berdomisili di Karawang, Indonesia. Saya menspesialisasikan diri dalam membangun aplikasi web modern dan scalable menggunakan teknologi terkini.\n\nDengan fondasi yang kuat dalam Ilmu Komputer dari Universitas Bina Sarana Informatika, saya membawa pengetahuan teoritis dan pengalaman praktis ke dalam setiap proyek. Saya selalu belajar dan terus meningkatkan kemampuan dalam pengembangan web.\n\nKetika tidak sedang coding, Anda bisa menemukan saya menjelajahi teknologi baru, berkontribusi pada proyek open-source, atau merancang antarmuka pengguna yang indah.`,
    aboutTextEn: `Hi! I'm Irfan Sopandi, a passionate Full-Stack Developer based in Karawang, Indonesia. I specialize in building modern, scalable web applications using cutting-edge technologies.\n\nWith a strong foundation in Computer Science from Bina Sarana Informatika University, I bring both theoretical knowledge and practical experience to every project. I'm constantly learning and pushing the boundaries of what's possible in web development.\n\nWhen I'm not coding, you'll find me exploring new technologies, contributing to open-source projects, or designing beautiful user interfaces.`,
    email: 'irfansopandi1212@email.com',
    phone: '+62 859-4665-3103',
    location: 'Karawang, Indonesia',
  };

  const profile = await prisma.profile.upsert({
    where: { id: 'default-profile' },
    update: profileData,
    create: {
      id: 'default-profile',
      ...profileData,
    },
  });
  console.log('✅ Profile created/updated:', profile.name);

  // Create/update educations
  const educations = [
    {
      institution: 'Bina Sarana Informatika University',
      degree: 'S1 Ilmu Komputer',
      degreeEn: 'Bachelor of Computer Science',
      startDate: '2020',
      endDate: 'Present',
      description: 'Mempelajari Ilmu Komputer dengan fokus pada rekayasa perangkat lunak, struktur data, algoritma, dan pengembangan web modern.',
      descriptionEn: 'Studying Computer Science with focus on software engineering, data structures, algorithms, and modern web development.',
      order: 4,
    },
    {
      institution: 'SMAN 1 Abung Semuli',
      degree: 'SMA - MIPA',
      degreeEn: 'Senior High School - Science',
      startDate: '2017',
      endDate: '2020',
      description: 'Lulus dengan nilai sangat baik dalam Matematika dan IPA. Aktif dalam organisasi siswa dan klub komputer.',
      descriptionEn: 'Graduated with excellent grades in Mathematics and Natural Sciences. Active in student organization and computer club.',
      order: 3,
    },
    {
      institution: 'SMPN 1 Abung Selatan',
      degree: 'SMP',
      degreeEn: 'Junior High School',
      startDate: '2014',
      endDate: '2017',
      description: 'Menyelesaikan pendidikan sekolah menengah pertama dengan prestasi akademik yang memuaskan.',
      descriptionEn: 'Completed junior high school education with outstanding academic performance.',
      order: 2,
    },
    {
      institution: 'SDN 1 Kalibalangan',
      degree: 'Sekolah Dasar',
      degreeEn: 'Elementary School',
      startDate: '2008',
      endDate: '2014',
      description: 'Menyelesaikan pendidikan dasar dengan fondasi yang kuat pada mata pelajaran inti.',
      descriptionEn: 'Completed elementary education with strong foundation in core subjects.',
      order: 1,
    },
  ];

  for (const edu of educations) {
    const existing = await prisma.education.findFirst({
      where: { institution: edu.institution }
    });
    if (existing) {
      await prisma.education.update({
        where: { id: existing.id },
        data: edu,
      });
    } else {
      await prisma.education.create({ data: edu });
    }
  }
  console.log('✅ Education data updated');

  // Create/update skills
  const skills = [
    // Programming
    { name: 'Python', category: 'Programming', percentage: 85, icon: 'python', order: 1 },
    { name: 'JavaScript', category: 'Programming', percentage: 90, icon: 'javascript', order: 2 },
    { name: 'TypeScript', category: 'Programming', percentage: 80, icon: 'typescript', order: 3 },
    { name: 'Rust', category: 'Programming', percentage: 60, icon: 'rust', order: 4 },
    // Framework
    { name: 'React', category: 'Framework', percentage: 88, icon: 'react', order: 1 },
    { name: 'Next.js', category: 'Framework', percentage: 82, icon: 'nextjs', order: 2 },
    { name: 'Tailwind CSS', category: 'Framework', percentage: 92, icon: 'tailwind', order: 3 },
    { name: 'Express.js', category: 'Framework', percentage: 78, icon: 'express', order: 4 },
    // Tools
    { name: 'Figma', category: 'Tools', percentage: 85, icon: 'figma', order: 1 },
    { name: 'MATLAB', category: 'Tools', percentage: 70, icon: 'matlab', order: 2 },
    { name: 'Microsoft Excel', category: 'Tools', percentage: 80, icon: 'excel', order: 3 },
    { name: 'Git', category: 'Tools', percentage: 88, icon: 'git', order: 4 },
    // Database
    { name: 'PostgreSQL', category: 'Database', percentage: 80, icon: 'postgresql', order: 1 },
    { name: 'MySQL', category: 'Database', percentage: 75, icon: 'mysql', order: 2 },
    { name: 'MongoDB', category: 'Database', percentage: 70, icon: 'mongodb', order: 3 },
    { name: 'Redis', category: 'Database', percentage: 65, icon: 'redis', order: 4 },
  ];

  for (const skill of skills) {
    const existing = await prisma.skill.findFirst({
      where: { name: skill.name, category: skill.category }
    });
    if (!existing) {
      await prisma.skill.create({ data: skill });
    }
  }
  console.log('✅ Skills processed');

  // Create social media
  const socials = [
    { platform: 'GitHub', url: 'https://github.com/Irfansopandi/', icon: 'github' },
    { platform: 'LinkedIn', url: '#', icon: 'linkedin' },
    { platform: 'Instagram', url: 'https://www.instagram.com/irfan_sopandi_/', icon: 'instagram' },
    { platform: 'WhatsApp', url: 'https://wa.me/6285946653103', icon: 'whatsapp' },
  ];

  for (const social of socials) {
    await prisma.socialMedia.upsert({
      where: { platform: social.platform },
      update: { url: social.url },
      create: social,
    });
  }
  console.log('✅ Social media created');

  // Create sample projects
  const projects = [
    {
      title: 'Platform E-Commerce',
      titleEn: 'E-Commerce Platform',
      slug: 'e-commerce-platform',
      category: 'Web Application',
      description: 'Platform e-commerce fitur lengkap dengan manajemen produk, keranjang belanja, integrasi pembayaran, dan pelacakan pesanan.',
      descriptionEn: 'A full-featured e-commerce platform with product management, shopping cart, payment integration, and order tracking.',
      challenge: 'Building a scalable architecture that handles high traffic and complex inventory management.',
      challengeEn: 'Building a scalable architecture that handles high traffic and complex inventory management.',
      solution: 'Implemented microservices architecture with Redis caching, optimized database queries, and CDN for static assets.',
      solutionEn: 'Implemented microservices architecture with Redis caching, optimized database queries, and CDN for static assets.',
      features: 'Menggunakan arsitektur microservices dengan caching Redis, optimasi query database, dan CDN untuk aset statis.',
      featuresEn: 'Implemented microservices architecture with Redis caching, optimized database queries, and CDN for static assets.',
      githubUrl: 'https://github.com/irfansopandi/ecommerce',
      demoUrl: 'https://ecommerce-demo.vercel.app',
      featured: true,
    },
    {
      title: 'Asisten Chat AI',
      titleEn: 'AI Chat Assistant',
      slug: 'ai-chat-assistant',
      category: 'Web Application',
      description: 'Aplikasi obrolan cerdas yang ditenagai oleh GPT-4 dengan memori konteks, pengunggahan berkas, dan dukungan multi-bahasa.',
      descriptionEn: 'An intelligent chat application powered by GPT-4 with context memory, file upload, and multi-language support.',
      challenge: 'Managing conversation context and providing real-time streaming responses.',
      challengeEn: 'Managing conversation context and providing real-time streaming responses.',
      solution: 'Used Server-Sent Events for streaming, implemented conversation history with token optimization.',
      solutionEn: 'Used Server-Sent Events for streaming, implemented conversation history with token optimization.',
      features: 'Menggunakan Server-Sent Events untuk streaming balasan, serta riwayat percakapan dengan optimasi token.',
      featuresEn: 'Used Server-Sent Events for streaming, implemented conversation history with token optimization.',
      githubUrl: 'https://github.com/irfansopandi/ai-chat',
      demoUrl: 'https://ai-chat-demo.vercel.app',
      featured: true,
    },
    {
      title: 'Prediktor Nilai Siswa',
      titleEn: 'Student Grade Predictor',
      slug: 'student-grade-predictor',
      category: 'Machine Learning',
      description: 'Model machine learning yang memprediksi performa akademik siswa berdasarkan berbagai faktor pendukung.',
      descriptionEn: 'Machine learning model that predicts student academic performance based on various factors.',
      challenge: 'Collecting quality training data and achieving high prediction accuracy.',
      challengeEn: 'Collecting quality training data and achieving high prediction accuracy.',
      solution: 'Used ensemble methods combining Random Forest and XGBoost, achieved 89% accuracy.',
      solutionEn: 'Used ensemble methods combining Random Forest and XGBoost, achieved 89% accuracy.',
      features: 'Menggabungkan algoritma Random Forest dan XGBoost, mencapai tingkat akurasi prediksi hingga 89%.',
      featuresEn: 'Used ensemble methods combining Random Forest and XGBoost, achieved 89% accuracy.',
      githubUrl: 'https://github.com/irfansopandi/grade-predictor',
      demoUrl: '',
      featured: false,
    },
  ];

  for (const project of projects) {
    const created = await prisma.project.upsert({
      where: { slug: project.slug },
      update: project,
      create: project,
    });
    
    // Add technologies if not present
    const techCount = await prisma.projectTechnology.count({ where: { projectId: created.id } });
    if (techCount === 0) {
      const techMap = {
        'e-commerce-platform': ['React', 'Next.js', 'Node.js', 'PostgreSQL', 'Stripe', 'Redis'],
        'ai-chat-assistant': ['React', 'TypeScript', 'OpenAI API', 'Express.js', 'MongoDB'],
        'student-grade-predictor': ['Python', 'Scikit-learn', 'Pandas', 'Flask', 'NumPy'],
      };
      
      const techs = techMap[project.slug] || [];
      for (const tech of techs) {
        await prisma.projectTechnology.create({
          data: { projectId: created.id, technology: tech },
        });
      }
    }
  }
  console.log('✅ Projects processed');

  // Create certificates
  const certificates = [
    {
      title: 'Bootcamp Pemrograman Web Full-Stack',
      titleEn: 'Full-Stack Web Development Bootcamp',
      issuer: 'Udemy',
      date: '2023-06',
      credentialUrl: 'https://udemy.com/certificate/xxx',
    },
    {
      title: 'Sertifikasi AWS Cloud Practitioner',
      titleEn: 'AWS Cloud Practitioner Certification',
      issuer: 'Amazon Web Services',
      date: '2023-09',
      credentialUrl: 'https://aws.amazon.com/verification/xxx',
    },
    {
      title: 'Sertifikasi Google Analytics',
      titleEn: 'Google Analytics Certification',
      issuer: 'Google',
      date: '2022-12',
      credentialUrl: 'https://skillshop.google.com/xxx',
    },
  ];

  for (const cert of certificates) {
    const existing = await prisma.certificate.findFirst({ where: { issuer: cert.issuer, date: cert.date } });
    if (existing) {
      await prisma.certificate.update({
        where: { id: existing.id },
        data: cert,
      });
    } else {
      await prisma.certificate.create({ data: cert });
    }
  }
  console.log('✅ Certificates processed');

  // Create/update experiences
  const experiencesData = [
    {
      type: 'organization',
      organization: 'Himpunan Mahasiswa Teknik Informatika (HMTI)',
      institution: 'Bina Sarana Informatika University',
      role: 'Ketua Divisi IPTEK & Riset',
      roleEn: 'Head of Science & Research Division',
      startDate: 'Januari 2022',
      endDate: 'Desember 2023',
      description: 'Memimpin divisi IPTEK dalam menyelenggarakan Tech Hackathon kampus, workshop Fullstack Web Development, dan pelatihan rutin coding untuk mahasiswa baru.',
      descriptionEn: 'Led the IPTEK division in organizing campus Tech Hackathons, Full-Stack Web Development workshops, and coding training for freshmen.',
      order: 1,
    },
    {
      type: 'organization',
      organization: 'BEM Fakultas Ilmu Komputer',
      institution: 'Bina Sarana Informatika University',
      role: 'Staff Publikasi & Dokumentasi (Humas)',
      roleEn: 'Publication & Documentation Staff',
      startDate: 'Februari 2021',
      endDate: 'Januari 2022',
      description: 'Bertanggung jawab atas materi publikasi visual, pengelolaan media sosial organisasi, serta dokumentasi seluruh event besar tingkat fakultas.',
      descriptionEn: 'Responsible for visual publication materials, organization social media management, and documentation of faculty events.',
      order: 2,
    },
    {
      type: 'work',
      organization: 'PT Digital Solusi Indonesia',
      institution: 'Software House - Jakarta Pusat',
      role: 'Full-Stack Web Developer',
      roleEn: 'Full-Stack Web Developer',
      startDate: 'Maret 2023',
      endDate: 'Sekarang',
      description: 'Mengembangkan dan merawat aplikasi web enterprise menggunakan React, Express.js, dan MySQL. Berkontribusi dalam percepatan load time hingga 40% dan pembuatan dashboard admin multi-tenant.',
      descriptionEn: 'Developed and maintained enterprise web applications using React, Express.js, and MySQL. Improved page load times by 40% and built multi-tenant admin dashboards.',
      order: 3,
    },
    {
      type: 'work',
      organization: 'Studio Inovasi Karawang',
      institution: 'Agency Creative',
      role: 'Magang Frontend Developer',
      roleEn: 'Frontend Developer Intern',
      startDate: 'September 2022',
      endDate: 'Februari 2023',
      description: 'Membangun landing page interaktif dengan Framer Motion dan Tailwind CSS untuk 5+ klien UMKM lokal. Memastikan desain responsive dan performa SEO optimal.',
      descriptionEn: 'Built interactive landing pages with Framer Motion and Tailwind CSS for 5+ local business clients. Ensured responsive design and optimal SEO.',
      order: 4,
    }
  ];

  for (const exp of experiencesData) {
    const existing = await prisma.experience.findFirst({
      where: { organization: exp.organization }
    });
    if (existing) {
      await prisma.experience.update({
        where: { id: existing.id },
        data: exp,
      });
    } else {
      await prisma.experience.create({ data: exp });
    }
  }
  console.log('✅ Experiences processed');

  console.log('\n🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
