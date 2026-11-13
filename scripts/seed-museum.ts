import { db } from '../src/lib/db';
import {
  ID_TOPICS,
  KOLONIAL_ARTIFACTS,
  KOLONIAL_EVENTS,
  WW1_ARTIFACTS,
  WW1_EVENTS,
  WW2_ARTIFACTS,
  WW2_EVENTS,
} from '../src/data/museum';

/**
 * Seed konten museum (naskah PDF) ke database.
 * - Tanpa argumen : hanya mengisi jika tabel masih kosong.
 * - --reset       : hapus seluruh isi lalu isi ulang dengan naskah terbaru.
 */
async function main() {
  const reset = process.argv.includes('--reset');

  if (reset) {
    await db.artifact.deleteMany();
    await db.timelineEvent.deleteMany();
    await db.era.deleteMany();
    console.log('RESET: seluruh konten museum dihapus.');
  }

  const artifactCount = await db.artifact.count();
  if (artifactCount === 0) {
    const pd1 = WW1_ARTIFACTS.map((a, i) => ({ ...a, gallery: 'pd1', order: i }));
    const pd2 = WW2_ARTIFACTS.map((a, i) => ({ ...a, gallery: 'pd2', order: i }));
    const kolonial = KOLONIAL_ARTIFACTS.map((a, i) => ({ ...a, gallery: 'kolonial', order: i }));
    await db.artifact.createMany({ data: [...pd1, ...pd2, ...kolonial] });
    console.log(`Seeded ${pd1.length + pd2.length + kolonial.length} artifacts`);
  } else {
    console.log(`Artifacts already seeded (${artifactCount})`);
  }

  const eventCount = await db.timelineEvent.count();
  if (eventCount === 0) {
    const ev1 = WW1_EVENTS.map((e, i) => ({ ...e, gallery: 'pd1', order: i }));
    const ev2 = WW2_EVENTS.map((e, i) => ({ ...e, gallery: 'pd2', order: i }));
    const evK = KOLONIAL_EVENTS.map((e, i) => ({ ...e, gallery: 'kolonial', order: i }));
    await db.timelineEvent.createMany({ data: [...ev1, ...ev2, ...evK] });
    console.log(`Seeded ${ev1.length + ev2.length + evK.length} timeline events`);
  } else {
    console.log(`Timeline events already seeded (${eventCount})`);
  }

  const eraCount = await db.era.count();
  if (eraCount === 0) {
    const eras = ID_TOPICS.map((e, i) => ({
      period: e.period,
      title: e.title,
      description: e.description,
      image: e.image,
      highlights: JSON.stringify(e.highlights),
      order: i,
    }));
    await db.era.createMany({ data: eras });
    console.log(`Seeded ${eras.length} narasi (topics)`);
  } else {
    console.log(`Topics already seeded (${eraCount})`);
  }
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
