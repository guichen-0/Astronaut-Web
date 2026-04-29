import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import planetsData from "../../src/data/planets.json";
import constellationsData from "../../src/data/constellations.json";
import starsData from "../../src/data/stars.json";
import moonsData from "../../src/data/moons.json";
import eventsData from "../../src/data/events.json";
import articlesData from "../../src/data/articles.json";

const prisma = new PrismaClient();

async function main() {
  console.log("🌌 开始种子数据导入...");

  // 清理现有数据
  await prisma.favorite.deleteMany();
  await prisma.userNote.deleteMany();
  await prisma.starMapPreset.deleteMany();
  await prisma.moon.deleteMany();
  await prisma.star.deleteMany();
  await prisma.celestialEvent.deleteMany();
  await prisma.article.deleteMany();
  await prisma.articleCategory.deleteMany();
  await prisma.constellation.deleteMany();
  await prisma.planet.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
  await prisma.crawlSource.deleteMany();
  await prisma.verificationToken.deleteMany();

  // 1. 创建管理员用户
  const adminPassword = await hash("admin123456", 12);
  const admin = await prisma.user.create({
    data: {
      name: "管理员",
      email: "admin@astronomy.com",
      passwordHash: adminPassword,
      role: "ADMIN",
    },
  });
  console.log(`✅ 管理员用户: ${admin.email} (密码: admin123456)`);

  // 2. 导入行星数据
  for (const planet of planetsData as typeof planetsData) {
    await prisma.planet.create({
      data: {
        name: planet.name,
        slug: planet.slug,
        englishName: planet.englishName,
        planetType: planet.planetType,
        diameterKm: planet.diameterKm,
        massKg: planet.massKg,
        distanceFromSunAu: planet.distanceFromSunAu,
        orbitalPeriodDays: planet.orbitalPeriodDays,
        rotationPeriodHours: planet.rotationPeriodHours,
        numberOfMoons: planet.numberOfMoons,
        hasRings: planet.hasRings,
        temperatureMin: planet.temperatureMin,
        temperatureMax: planet.temperatureMax,
        atmosphereComposition: planet.atmosphereComposition,
        description: planet.description,
        funFact: planet.funFact,
        imageUrl: planet.imageUrl,
        iconName: planet.iconName,
      },
    });
  }
  console.log(`✅ 已导入 ${planetsData.length} 颗行星`);

  // 3. 导入卫星数据
  for (const moon of moonsData as typeof moonsData) {
    const planet = await prisma.planet.findUnique({ where: { slug: moon.planetSlug } });
    if (planet) {
      await prisma.moon.create({
        data: {
          name: moon.name,
          planetId: planet.id,
          diameterKm: moon.diameterKm,
          massKg: moon.massKg,
          discoverer: moon.discoverer,
          discoveryYear: moon.discoveryYear,
          description: moon.description,
        },
      });
    }
  }
  console.log(`✅ 已导入 ${moonsData.length} 颗卫星`);

  // 4. 导入星座数据
  for (const constellation of constellationsData as typeof constellationsData) {
    await prisma.constellation.create({
      data: {
        name: constellation.name,
        abbreviation: constellation.abbreviation,
        genitive: constellation.genitive,
        meaning: constellation.meaning,
        season: constellation.season,
        areaSqDeg: constellation.areaSqDeg,
        description: constellation.description,
        mythos: constellation.mythos,
      },
    });
  }
  console.log(`✅ 已导入 ${constellationsData.length} 个星座`);

  // 5. 导入恒星数据
  for (const star of starsData as typeof starsData) {
    // Find constellation by abbreviation (case-insensitive matching)
    let constellation: Awaited<ReturnType<typeof prisma.constellation.findFirst>> | null = null;
    if (star.constellationAbbreviation) {
      constellation = await prisma.constellation.findFirst({
        where: { abbreviation: star.constellationAbbreviation },
      });
    }

    await prisma.star.create({
      data: {
        name: star.name,
        bayerDesignation: star.bayerDesignation,
        hipId: star.hipId,
        hdId: star.hdId,
        hrId: star.hrId,
        rightAscension: star.rightAscension,
        declination: star.declination,
        apparentMagnitude: star.apparentMagnitude,
        absoluteMagnitude: star.absoluteMagnitude,
        colorIndexBv: star.colorIndexBv,
        distanceParsecs: star.distanceParsecs,
        spectralType: star.spectralType,
        luminosity: star.luminosity,
        temperatureK: star.temperatureK,
        radiusSolar: star.radiusSolar,
        constellationAbbreviation: constellation?.abbreviation ?? null,
        x: star.x,
        y: star.y,
        z: star.z,
      },
    });
  }
  console.log(`✅ 已导入 ${starsData.length} 颗恒星`);

  // 6. 导入天文事件
  for (const event of eventsData as typeof eventsData) {
    await prisma.celestialEvent.create({
      data: {
        ...event,
        startDate: new Date(event.startDate),
        endDate: event.endDate ? new Date(event.endDate) : null,
        peakDate: event.peakDate ? new Date(event.peakDate) : null,
      },
    });
  }
  console.log(`✅ 已导入 ${eventsData.length} 个天文事件`);

  // 7. 创建文章分类
  const categories = [
    { name: "天文新闻", slug: "astronomy-news", description: "最新天文发现和新闻" },
    { name: "太空探索", slug: "space-exploration", description: "航天器和探测任务" },
    { name: "天文摄影", slug: "astrophotography", description: "天文摄影作品和技巧" },
  ];

  for (const cat of categories) {
    await prisma.articleCategory.create({ data: cat });
  }
  console.log(`✅ 已创建 ${categories.length} 个文章分类`);

  // 8. 导入文章数据
  for (const article of articlesData as typeof articlesData) {
    const category = await prisma.articleCategory.findUnique({
      where: { slug: article.categorySlug },
    });
    if (category) {
      await prisma.article.create({
        data: {
          title: article.title,
          slug: article.slug,
          summary: article.summary,
          content: article.content,
          imageUrl: article.imageUrl,
          sourceUrl: article.sourceUrl,
          sourceName: article.sourceName,
          author: article.author,
          publishedAt: new Date(article.publishedAt),
          categoryId: category.id,
        },
      });
    }
  }
  console.log(`✅ 已导入 ${articlesData.length} 篇文章`);

  // 9. 创建默认爬虫源
  const crawlSources = [
    {
      name: "NASA Breaking News",
      baseUrl: "https://www.nasa.gov",
      feedUrl: "https://www.nasa.gov/rss/dyn/breaking_news.rss",
      categoryId: categories[0].slug,
    },
    {
      name: "ESA Space News",
      baseUrl: "https://www.esa.int",
      feedUrl: "https://www.esa.int/rssfeed/space-news",
      categoryId: categories[0].slug,
    },
    {
      name: "中国天眼FAST",
      baseUrl: "https://www.bao.ac.cn",
      feedUrl: "https://www.bao.ac.cn/xwzx/kydt/",
      categoryId: categories[0].slug,
    },
    {
      name: "中国科学院国家天文台",
      baseUrl: "https://www.nao.cas.cn",
      feedUrl: "https://www.nao.cas.cn/xwzx/",
      categoryId: categories[1].slug,
    },
    {
      name: "中国航天局(CNSA)",
      baseUrl: "https://www.cnsa.gov.cn",
      feedUrl: "https://www.cnsa.gov.cn/n6758824/n6758839/index.html",
      categoryId: categories[1].slug,
    },
    {
      name: "Space.com",
      baseUrl: "https://www.space.com",
      feedUrl: "https://www.space.com/feeds/all",
      categoryId: categories[0].slug,
    },
    {
      name: "Sky & Telescope",
      baseUrl: "https://skyandtelescope.org",
      feedUrl: "https://skyandtelescope.org/feed/",
      categoryId: categories[0].slug,
    },
    {
      name: "天文爱好者杂志",
      baseUrl: "https://www.astronomy.com.cn",
      feedUrl: "https://www.astronomy.com.cn/bbs/feed/",
      categoryId: categories[0].slug,
    },
    {
      name: "JAXA Space News",
      baseUrl: "https://www.jaxa.jp",
      feedUrl: "https://www.jaxa.jp/press/rss_feed.xml",
      categoryId: categories[0].slug,
    },
  ];

  for (const source of crawlSources) {
    await prisma.crawlSource.create({ data: source });
  }
  console.log(`✅ 已创建 ${crawlSources.length} 个爬虫源`);

  console.log("\n🎉 种子数据导入完成!");
  console.log("   - 8 颗行星 + 卫星");
  console.log(`   - ${starsData.length} 颗恒星`);
  console.log("   - 31 个星座");
  console.log(`   - ${eventsData.length} 个天文事件`);
  console.log(`   - ${articlesData.length} 篇文章`);
  console.log("   管理员账号: admin@astronomy.com / admin123456");
}

main()
  .catch((e) => {
    console.error("❌ 种子数据导入失败:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
