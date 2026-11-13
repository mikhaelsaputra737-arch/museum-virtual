import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = './public/museum';

type ImageSize = '1344x768' | '1024x1024' | '768x1344' | '864x1152' | '1152x864' | '1440x720' | '720x1440';

const IMAGES: Array<{ file: string; prompt: string; size: ImageSize }> = [
  // HERO
  {
    file: 'hero-museum.png',
    prompt:
      'Grand majestic virtual museum interior at night, vast marble hall with dramatic golden spotlights on glass display cases, sweeping staircase, dark atmosphere with warm amber light beams, volumetric light rays, cinematic wide angle, photorealistic, high quality, detailed',
    size: '1344x768',
  },
  {
    file: 'hero-portal.png',
    prompt:
      'Epic museum gate entrance with three grand archways glowing with warm golden light, dark stone walls with subtle carvings, dramatic fog and light rays, cinematic, symmetrical composition, photorealistic, high quality',
    size: '1344x768',
  },
  // WW1 GALLERY
  {
    file: 'ww1-trench.png',
    prompt:
      'World War 1 trench warfare scene 1916, soldiers in wooden muddy trench under grey overcast sky, barbed wire silhouettes, sepia toned historical painting style, dramatic atmosphere, detailed, high quality',
    size: '1344x768',
  },
  {
    file: 'ww1-tank.png',
    prompt:
      'British Mark I rhomboid tank from World War 1 1916 crossing muddy battlefield, sepia historical photograph style, dramatic smoke, detailed, museum artifact photography, high quality',
    size: '1024x1024',
  },
  {
    file: 'ww1-biplane.png',
    prompt:
      'World War 1 biplane fighter aircraft in dogfight above clouds 1917, vintage sepia aviation photograph style, dramatic sky, detailed, high quality',
    size: '1024x1024',
  },
  {
    file: 'ww1-armistice.png',
    prompt:
      'Field of red poppies under soft dawn light with old war memorial monument, symbolic of World War 1 armistice, melancholic peaceful atmosphere, painterly historical style, detailed, high quality',
    size: '1344x768',
  },
  // WW2 GALLERY
  {
    file: 'ww2-europe.png',
    prompt:
      'World War 2 European battlefield 1944, soldiers advancing through ruined city with rubble and smoke, dark dramatic war painting style, muted colors, detailed, high quality',
    size: '1344x768',
  },
  {
    file: 'ww2-pacific.png',
    prompt:
      'World War 2 Pacific naval battle with aircraft carriers and warships under dramatic sky 1942, historical war painting style, smoke and fire on horizon, detailed, high quality',
    size: '1024x1024',
  },
  {
    file: 'ww2-japan-indo.png',
    prompt:
      'Japanese occupation of Dutch East Indies 1942, soldiers marching through old Batavia street with colonial architecture, sepia historical photograph style, detailed, high quality',
    size: '1024x1024',
  },
  {
    file: 'ww2-d-day.png',
    prompt:
      'World War 2 D-Day landing craft approaching beach at dawn 1944, dramatic waves and silhouettes of soldiers, dark historical painting style, cinematic, detailed, high quality',
    size: '1344x768',
  },
  // INDONESIAN HISTORY GALLERY
  {
    file: 'id-prasejarah.png',
    prompt:
      'Prehistoric Java Man Homo erectus with stone tools near ancient river at dusk, dramatic primeval landscape with volcanoes, cave painting aesthetic with earthy ochre tones, detailed, high quality',
    size: '1024x1024',
  },
  {
    file: 'id-sriwijaya.png',
    prompt:
      'Srivijaya maritime empire golden age, majestic wooden sailing ships with ornate sails arriving at bustling ancient harbor with Buddhist temple, sunset golden light, epic historical painting, detailed, high quality',
    size: '1344x768',
  },
  {
    file: 'id-majapahit.png',
    prompt:
      'Majapahit kingdom golden era 14th century, grand stone candi temple with towering architecture, royal procession with golden umbrellas, lush tropical landscape, epic historical painting, rich warm colors, detailed, high quality',
    size: '1344x768',
  },
  {
    file: 'id-islam.png',
    prompt:
      'Ancient Indonesian Islamic sultanate palace with red brick mosque and tiered wooden roof, Javanese court ceremony with gamelan, golden hour light, historical painting style, detailed, high quality',
    size: '1024x1024',
  },
  {
    file: 'id-voc.png',
    prompt:
      'Dutch VOC colonial era Batavia 17th century, tall merchant sailing ships in harbor, warehouse and canal with Dutch colonial buildings, ships flying red white blue flag, historical painting style, detailed, high quality',
    size: '1024x1024',
  },
  {
    file: 'id-proklamasi.png',
    prompt:
      'Indonesian independence proclamation 17 August 1945, two men in white suits reading declaration before microphone and raising red white flag, dramatic patriotic painting style, emotional, historic moment, detailed, high quality',
    size: '1344x768',
  },
  // ---------- TAMBAHAN NASKAH PDF (Ruang 1-4) ----------
  {
    file: 'ww1-versailles.png',
    prompt:
      'Signing of the Treaty of Versailles 1919 inside grand Hall of Mirrors palace, long ornate hall with chandeliers and mirrors, diplomats seated at long table, formal historical painting style, warm golden light, detailed, high quality',
    size: '1344x768',
  },
  {
    file: 'ww2-surrender.png',
    prompt:
      'Formal surrender ceremony deck of battleship September 1945, military officers signing documents on table on ship deck, documentary historical painting style, dramatic cloudy sky, muted colors, detailed, high quality',
    size: '1344x768',
  },
  {
    file: 'ww2-memorial.png',
    prompt:
      'Holocaust memorial candles burning in dark room, six flickering white candles on stone surface with yellow rose, solemn respectful remembrance atmosphere, soft warm light against darkness, no people, tasteful memorial photography, high quality',
    size: '1024x1024',
  },
  {
    file: 'id-tanam-paksa.png',
    prompt:
      'Dutch East Indies forced cultivation era 19th century, Javanese farmers harvesting sugar cane and coffee plants under tropical sun, colonial plantation with supervisor on horseback, verdant green terraced fields, volcano in background, historical painting style, detailed, high quality',
    size: '1344x768',
  },
  {
    file: 'id-perlawanan.png',
    prompt:
      'Javanese Prince Diponegoro on horseback leading resistance warriors with keris daggers and bamboo spears 1825, misty Java highlands with Mount Merapi silhouette, heroic historical painting style, dramatic golden dawn light, detailed, high quality',
    size: '1344x768' as const,
  },
  {
    file: 'id-revolusi.png',
    prompt:
      'Indonesian national revolution 1945-1949, freedom fighters with red white flag marching through village street, civilians joining with raised fists, hopeful determined atmosphere, heroic patriotic painting style, dramatic morning light, detailed, high quality',
    size: '1344x768',
  },
  {
    file: 'refleksi-damai.png',
    prompt:
      'Peace reflection memorial garden at dusk, white stone monument with eternal flame, white doves flying above calm reflecting pool, olive branch and candles, serene hopeful atmosphere, soft purple and amber sky, photorealistic, detailed, high quality',
    size: '1344x768',
  },
];

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const zai = await ZAI.create();
  const results: Array<{ file: string; ok: boolean; error?: string }> = [];

  for (const img of IMAGES) {
    const outputPath = path.join(OUTPUT_DIR, img.file);
    if (fs.existsSync(outputPath)) {
      console.log(`SKIP (exists): ${img.file}`);
      results.push({ file: img.file, ok: true });
      continue;
    }
    let lastError = '';
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await zai.images.generations.create({
          prompt: img.prompt,
          size: img.size,
        });
        const base64 = res?.data?.[0]?.base64;
        if (!base64) throw new Error('empty base64 response');
        fs.writeFileSync(outputPath, Buffer.from(base64, 'base64'));
        console.log(`OK: ${img.file}`);
        results.push({ file: img.file, ok: true });
        lastError = '';
        break;
      } catch (e: unknown) {
        lastError = e instanceof Error ? e.message : String(e);
        console.error(`FAIL attempt ${attempt}: ${img.file} - ${lastError}`);
        await new Promise((r) => setTimeout(r, 1500 * attempt));
      }
    }
    if (lastError) results.push({ file: img.file, ok: false, error: lastError });
  }

  const failed = results.filter((r) => !r.ok);
  console.log(`\nDONE. success=${results.length - failed.length} failed=${failed.length}`);
  if (failed.length) console.log(JSON.stringify(failed, null, 2));
  process.exit(0);
}

main().catch((e) => {
  console.error('FATAL', e);
  process.exit(1);
});
