import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // 1. Create Users
  console.log('👤 Creating users...')
  const hashedPassword = await bcrypt.hash('password123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@nakbaharchive.com' },
    update: {},
    create: {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@nakbaharchive.com',
      password: hashedPassword,
      isVerified: true,
      role: 'admin',
      bio: 'Administrator of the Nakbah Archive',
      avatar: '/api/placeholder/100/100',
    },
  })

  const user1 = await prisma.user.upsert({
    where: { email: 'ahmed@example.com' },
    update: {},
    create: {
      firstName: 'Ahmed',
      lastName: 'Hassan',
      email: 'ahmed@example.com',
      password: hashedPassword,
      isVerified: true,
      bio: 'Palestinian historian and researcher',
      avatar: '/api/placeholder/100/100',
    },
  })

  // 2. Create Categories
  console.log('📁 Creating categories...')
  const historyCategory = await prisma.category.upsert({
    where: { slug: 'history' },
    update: {},
    create: {
      name: 'History',
      slug: 'history',
      description: 'Historical articles and timelines',
      icon: '📚',
      color: '#C9A96E',
      order: 1,
    },
  })

  const cultureCategory = await prisma.category.upsert({
    where: { slug: 'culture' },
    update: {},
    create: {
      name: 'Culture',
      slug: 'culture',
      description: 'Cultural heritage and traditions',
      icon: '🎨',
      color: '#8B7355',
      order: 2,
    },
  })

  // 3. Create Tags
  console.log('🏷️  Creating tags...')
  const nakbaTag = await prisma.tag.upsert({
    where: { slug: 'nakba' },
    update: {},
    create: { name: 'Nakba', slug: 'nakba' },
  })

  const jerusalemTag = await prisma.tag.upsert({
    where: { slug: 'jerusalem' },
    update: {},
    create: { name: 'Jerusalem', slug: 'jerusalem' },
  })

  // 4. Create Contributors
  console.log('✍️  Creating contributors...')
  const contributor1 = await prisma.contributor.upsert({
    where: { slug: 'ahmed-sameer' },
    update: {},
    create: {
      name: 'Ahmed Sameer',
      slug: 'ahmed-sameer',
      bio: 'Lead researcher and historian',
      avatar: '/api/placeholder/40/40',
      email: 'ahmed.sameer@example.com',
    },
  })

  // 5. Create Thread
  console.log('🧵 Creating threads...')
  const palestineThread = await prisma.thread.upsert({
    where: { slug: 'palestine-timeline' },
    update: {},
    create: {
      title: 'The History of the State of Palestine',
      slug: 'palestine-timeline',
      description: 'A comprehensive timeline of key historical events',
      readingTime: '2.4 hours',
      totalArticles: 5,
      publishedAt: new Date(),
    },
  })

  // 6. Create Articles
  console.log('📝 Creating articles...')
  const article1 = await prisma.article.upsert({
    where: { slug: 'daily-life-jerusalem' },
    update: {},
    create: {
      title: 'Daily Life in Jerusalem: Stories from Old City',
      slug: 'daily-life-jerusalem',
      excerpt: "Inside the walls of Jerusalem's Old City, markets, mosques, churches, and homes coexist.",
      type: 'standard',
      content: JSON.stringify([
        {
          type: 'paragraph',
          text: 'Inside the walls of Jerusalem\'s Old City, daily life unfolds in a unique tapestry of cultures and traditions.',
        },
      ]),
      heroImage: '/api/placeholder/1200/571',
      label: 'Featured',
      readingTime: '8 min read',
      status: 'published',
      isFeatured: true,
      publishedAt: new Date(),
      authorId: user1.id,
      categoryId: historyCategory.id,
      threadId: palestineThread.id,
    },
  })

  const article2 = await prisma.article.upsert({
    where: { slug: 'nakba-remembering-1948' },
    update: {},
    create: {
      title: 'The Nakba: Remembering 1948',
      slug: 'nakba-remembering-1948',
      excerpt: 'Known as "The Catastrophe," the Nakba refers to the mass displacement of Palestinians in 1948.',
      type: 'video',
      heroVideo: 'https://www.example.com/video.mp4',
      heroImage: '/api/placeholder/1200/571',
      label: 'Documentary',
      readingTime: '25 min watch',
      status: 'published',
      isFeatured: true,
      publishedAt: new Date(),
      authorId: user1.id,
      categoryId: historyCategory.id,
      threadId: palestineThread.id,
    },
  })

  // 7. Create Collection
  console.log('📚 Creating collections...')
  await prisma.collection.upsert({
    where: { slug: 'palestine-historical-timeline' },
    update: {},
    create: {
      title: 'Palestine Historical Timeline',
      slug: 'palestine-historical-timeline',
      description: 'A curated collection documenting key historical events.',
      coverImage: '/api/placeholder/400/300',
      totalDuration: '2.5 hours',
      publishedAt: new Date(),
      authorId: admin.id,
      categoryId: historyCategory.id,
    },
  })

  // 8. Create Trip
  console.log('🗺️  Creating trips...')
  await prisma.trip.upsert({
    where: { slug: 'journey-through-palestine' },
    update: {},
    create: {
      title: 'Journey Through Palestine',
      slug: 'journey-through-palestine',
      description: 'A visual journey through historic Palestinian cities.',
      coverImage: '/api/placeholder/800/600',
      location: 'Palestine',
      coordinates: JSON.stringify({ lat: 31.9522, lng: 35.2332 }),
      publishedAt: new Date(),
      authorId: admin.id,
      categoryId: cultureCategory.id,
    },
  })

  console.log('✅ Seeding completed!')
  console.log('\n🔐 Test credentials:')
  console.log(`  Email: admin@nakbaharchive.com`)
  console.log(`  Password: password123`)
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
