/* =====================================================================
 * NASKAH ISI MUSEUM VIRTUAL SEJARAH
 * Disusun dari materi pembelajaran:
 * "Perang Dunia I · Perang Dunia II · Kolonialisme dan Perjuangan Indonesia"
 *
 * Struktur mengikuti peta besar isi museum (4 ruang pamer):
 *   Ruang 1 — Perang Dunia I (1914–1918)
 *   Ruang 2 — Perang Dunia II (1939–1945)
 *   Ruang 3 — Kolonialisme dan Perjuangan Indonesia
 *   Ruang 4 — Refleksi
 * Ditambah: daftar sumber museum/arsip dan bacaan akademik.
 * ===================================================================== */

export type Gallery = 'pd1' | 'pd2' | 'kolonial';

export interface Artifact {
  id: string;
  gallery?: Gallery;
  title: string;
  year: string;
  description: string;
  image: string;
  tag: string;
  /** Lokasi/periode tempat objek diketahui; tulis 'perkiraan' bila tidak pasti. */
  location?: string;
  /** Rujukan konten: nama museum/arsip yang menjadi sumber informasi. */
  source?: string;
}

export interface TimelineEvent {
  id?: string;
  gallery?: Gallery;
  year: string;
  title: string;
  description: string;
  side: 'left' | 'right';
}

export interface CauseItem {
  term: string;
  description: string;
}

export interface ExhibitPanel {
  title: string;
  text: string;
  source: string;
  image: string;
}

export interface Era {
  id: string;
  period: string;
  title: string;
  image: string;
  description: string;
  highlights: string[];
}

export interface MiniEra {
  id: string;
  period: string;
  title: string;
  image: string;
  description: string;
}

export interface ComparisonRow {
  aspect: string;
  ww1: string;
  ww2: string;
  colonial: string;
}

export interface SourceRef {
  name: string;
  description: string;
  url: string;
}

export interface StandardRow {
  element: string;
  content: string;
}

export interface CasualtyNote {
  value: string;
  label: string;
  note: string;
}

export const METHODOLOGY_NOTE =
  'Angka korban perang dan kolonialisme berbeda antarpeneliti karena definisi, periode, wilayah, dan kualitas catatan tidak selalu sama. Seluruh angka dalam museum ini merupakan perkiraan umum, bukan hitungan final yang seragam.';

/* =====================================================================
 * RUANG 1 — PERANG DUNIA I (1914–1918)
 * ===================================================================== */

export const WW1_INTRO =
  'Selama puluhan tahun Eropa menimbun bahan bakar: gerakan persatuan bangsa, perebutan koloni, dan perlombaan senjata. Cukup satu percikan untuk meledakkannya. Pada 28 Juni 1914, seorang pemuda Bosnia menembak Pangeran Franz Ferdinand di Sarajevo — dan dalam hitungan pekan, jaringan aliansi menyeret hampir seluruh kekuatan besar dunia ke dalam perang. Dari 28 Juli 1914 hingga gencatan senjata 11 November 1918, Blok Sentral — Jerman, Austria-Hongaria, Kesultanan Utsmaniyah, dan Bulgaria — berhadapan dengan Sekutu yang mencakup Britania Raya, Prancis, Rusia, Italia sejak 1915, serta Amerika Serikat sejak 1917, dalam perang total yang mengubah wajah dunia.';

export const WW1_CAUSES_TITLE = 'Latar belakang: rahasia di balik perang besar';

export const WW1_CAUSES: CauseItem[] = [
  {
    term: 'Pan-Slavisme',
    description:
      'Gerakan persatuan bangsa Slavia di Balkan yang dipimpin Serbia — di mata Austria-Hongaria, gerakan ini mengancam keutuhan kekaisarannya.',
  },
  {
    term: 'Pan-Jermanisme',
    description:
      'Cita-cita menyatukan seluruh wilayah berbahasa Jerman ke dalam satu negara besar di bawah Prusia, digarap sejak era Otto von Bismarck.',
  },
  {
    term: 'Imperialisme',
    description:
      'Negara-negara industri berebut koloni penghasil bahan mentah; friksi berulang terjadi, antara lain krisis Maroko (1905 dan 1911).',
  },
  {
    term: 'Persaingan ekonomi',
    description:
      'Kekuatan industri Jerman yang menanjak mulai menantang dominasi ekonomi dan perdagangan Britania Raya.',
  },
  {
    term: 'Perlombaan persenjataan',
    description:
      'Kaiser Wilhelm II membangun armada kapal selam U-Boat; Britania Raya menjawab dengan kapal tempur HMS Dreadnought — ketegangan terus menanjak.',
  },
  {
    term: 'Sistem aliansi + pemicu',
    description:
      'Triple Alliance (Jerman, Austria-Hongaria, Italia) berhadapan dengan Triple Entente (Britania, Prancis, Rusia) — cukup satu pembunuhan di Sarajevo, 28 Juni 1914, untuk menyalakan semuanya.',
  },
];

export const WW1_LIFE =
  'Perang yang diperkirakan selesai dalam beberapa pekan berubah menjadi perang parit empat tahun setelah rencana serangan kilat Jerman gagal di Sungai Marne (September 1914). Di Front Barat, artileri berat, senapan mesin, gas beracun, tank yang debut di Somme 1916, pesawat, dan kapal selam menciptakan skala kehancuran baru — Verdun dan Somme pada 1916 menelan jutaan korban. Perang meluas ke Gallipoli, Front Timur, dan lautan lewat blokade ekonomi; Italia belot ke Sekutu (1915), sementara Utsmaniyah dan Bulgaria bergabung ke Blok Sentral. Masuknya Amerika Serikat pada 1917 — dipicu perang kapal selam tanpa batas dan telegram Zimmermann — membalik keadaan: ofensif terakhir Jerman pada 1918 gagal, dan pukul 11.00 tanggal 11 November 1918 gencatan senjata mengakhiri pertempuran.';

export const WW1_CASUALTY: CasualtyNote = {
  value: '15–20 juta',
  label: 'Perkiraan korban jiwa',
  note: 'Perang total menelan sekitar 9–10 juta tentara dan 7–10 juta warga sipil — termasuk korban kelaparan dan penyakit akibat blokade. Dalam perang ini warga sipil ikut menjadi sasaran, bukan lagi penonton.',
};

export const WW1_EVENTS: TimelineEvent[] = [
  {
    year: '28 Juni 1914',
    title: 'Satu Tembakan di Sarajevo',
    description:
      'Gavrilo Princip menembak Pangeran Franz Ferdinand — percikan api di atas tumpukan bahan bakar yang sudah lama menimbun.',
    side: 'left',
  },
  {
    year: '28 Juli 1914',
    title: 'Austria-Hongaria Menyerang Serbia',
    description:
      'Sebulan setelah pembunuhan, Austria-Hongaria menyatakan perang pada Serbia; krisis diplomatik berubah menjadi perang.',
    side: 'right',
  },
  {
    year: 'Agustus 1914',
    title: 'Aliansi Menyala, Eropa Terjerat',
    description:
      'Rusia membela Serbia, Jerman menyatakan perang pada Rusia dan Prancis; serangan ke Belgia yang netral menarik Britania Raya masuk perang.',
    side: 'left',
  },
  {
    year: 'September 1914',
    title: 'Marne: Rencana Kilat Gagal',
    description:
      'Sekutu menghentikan serangan Jerman di Sungai Marne. Perang bergerak berubah menjadi perang parit yang membentang ratusan kilometer.',
    side: 'right',
  },
  {
    year: '1915',
    title: 'Perang Meluas ke Balkan dan Laut',
    description:
      'Kampanye Gallipoli gagal, Italia belot ke Sekutu, Utsmaniyah masuk Blok Sentral, dan kapal selam U-Boat mulai berburu di Atlantik.',
    side: 'left',
  },
  {
    year: '1916',
    title: 'Verdun dan Somme: Tahun Terberat',
    description:
      'Dua pertempuran terbesar Front Barat menelan jutaan korban; tank pertama kali dikerahkan Britania di Somme.',
    side: 'right',
  },
  {
    year: '1917',
    title: 'Rusia Mundur, Amerika Masuk',
    description:
      'Revolusi menarik Rusia keluar dari perang, sementara perang kapal selam tanpa batas dan telegram Zimmermann membawa AS ke pihak Sekutu.',
    side: 'left',
  },
  {
    year: 'Musim semi 1918',
    title: 'Pertaruhan Terakhir Jerman',
    description:
      'Ofensif musim semi Jerman gagal menembus pertahanan Sekutu; kekuatan dan moral Blok Sentral menipis.',
    side: 'right',
  },
  {
    year: '11 November 1918',
    title: 'Gencatan Senjata Pukul 11.00',
    description:
      'Pada jam ke-11, hari ke-11, bulan ke-11, armistice mengakhiri pertempuran — tanggal ini masih diperingati untuk mengenang korban perang.',
    side: 'left',
  },
  {
    year: '1919',
    title: 'Versailles: Damai yang Berat',
    description:
      'Jerman dinyatakan bertanggung jawab atas perang dan dikenai reparasi berat — kekecewaan yang kelak dimanfaatkan para ekstremis.',
    side: 'right',
  },
];

export const WW1_ARTIFACTS: Artifact[] = [
  {
    id: 'ww1-trench',
    title: 'Hidup dan Mati di Parit Front Barat',
    year: '1914–1918',
    location: 'Front Barat, Prancis & Belgia',
    description:
      'Dari Laut Utara hingga perbatasan Swiss, jutaan tentara hidup dalam parit: lumpur, tikus, dingin, hujan pecahan, dan menunggu. Serangan "keluar dari parit" melawan tembok senapan mesin menjadikan Front Barat simbol kebuntuan perang. Arsip foto dan surat prajurit memaparkan keseharian ini tanpa menampilkan gambar grafis.',
    image: '/museum/ww1-trench.png',
    tag: 'Medan Perang',
    source: 'Imperial War Museums (IWM)',
  },
  {
    id: 'ww1-artillery',
    title: 'Tank dan Perang Industri',
    year: '1914–1918',
    location: 'Medan perang Eropa',
    description:
      'Perang Dunia I adalah perang pertama yang digerakkan pabrik: artileri berat, senapan mesin, dan tank — dikerahkan pertama kali Britania di Somme (September 1916) — lahir dari lini produksi. Perlombaan persenjataan sebelum 1914 membuat semua pihak lebih siap berperang daripada berdamai.',
    image: '/museum/ww1-tank.png',
    tag: 'Teknologi Perang',
    source: 'Imperial War Museums (IWM)',
  },
  {
    id: 'ww1-biplane',
    title: 'Dari Pengintai Menjadi Perang Udara',
    year: '1915–1918',
    location: 'Langit Eropa',
    description:
      'Pesawat yang semula hanya memotret posisi musuh berkembang menjadi pesawat tempur dan pengebom. Bersama gas beracun dan kapal selam, udara menjadi medan perang baru — salah satu wajah "perang modern" yang diceritakan video ini sampai hari ini.',
    image: '/museum/ww1-biplane.png',
    tag: 'Perang Udara',
    source: 'Imperial War Museums (IWM)',
  },
  {
    id: 'ww1-armistice',
    title: 'Gencatan Senjata 11 November 1918',
    year: '11 November 1918',
    location: 'Compiègne, Prancis',
    description:
      'Ditandatangani di gerbong kereta Compiègne dan berlaku pukul 11.00 pada 11 November — jam ke-11, hari ke-11, bulan ke-11. Empat tahun pertempuran berhenti; tanggal ini kini diperingati sebagai hari mengenang korban perang di banyak negara.',
    image: '/museum/ww1-armistice.png',
    tag: 'Peristiwa Penutup',
    source: 'The National Archives (UK)',
  },
  {
    id: 'ww1-versailles',
    title: 'Perjanjian Versailles 1919',
    year: '1919',
    location: 'Versailles, Prancis',
    description:
      'Ditandatangani 28 Juni 1919 — tepat lima tahun setelah Sarajevo. Artikel 231 menyatakan Jerman bertanggung jawab atas perang, disusul reparasi berat dan pemotongan wilayah. "Damai" inilah yang kelak dikutip para pemimpin Nazi untuk menyalakan perang berikutnya.',
    image: '/museum/ww1-versailles.png',
    tag: 'Diplomasi',
    source: 'The National Archives (UK)',
  },
];

export const WW1_IMPACTS: string[] = [
  'Sekitar 15–20 juta jiwa melayang; jutaan lainnya terluka, cacat, dan trauma — Eropa kehilangan "generasinya sendiri".',
  'Empat kekaisaran besar runtuh: Jerman, Austria-Hongaria, Rusia (melalui Revolusi Bolshevik 1917), dan Utsmaniyah.',
  'Peta Eropa dan Timur Tengah digambar ulang: Polandia, Yugoslavia, dan Cekoslovakia lahir; wilayah lama dibagi para pemenang lewat sistem mandat.',
  'Perjanjian Versailles membebani Jerman tanggung jawab moral dan reparasi berat — humiliasi yang kemudian ditaburkan dalam propaganda politik.',
  'Liga Bangsa-Bangsa (1920) didirikan untuk mencegah perang lagi, namun lemah: Amerika Serikat memilih tidak ikut.',
  'Krisis ekonomi 1929 dan kekecewaan pascaperang membuka jalan bagi Nazi di Jerman — perang ini sebenarnya hanya jeda menuju perang berikutnya.',
];

export const WW1_IDEAS: string[] = [
  'Infografis "1 tembakan → perang dunia": rantai kejadian dari Sarajevo ke deklarasi perang melalui jaringan aliansi.',
  'Peta Eropa 1914 dengan Blok Sentral vs Sekutu serta panah rencana serangan awal kedua kubu.',
  'Garis waktu 1914–1919 dengan penanda tahun-tahun paling berdarah (Verdun dan Somme 1916).',
  'Panel "Perang total": blokade, kelaparan warga sipil, dan pabrik-pabrik yang berubah menjadi pabrik senjata.',
  'Infografis "dari Versailles ke 1939": bagaimana ketentuan perdamaian menanam benih perang berikutnya.',
];

/* =====================================================================
 * RUANG 2 — PERANG DUNIA II (1939–1945)
 * ===================================================================== */

export const WW2_INTRO =
  'Perang Dunia II adalah konflik global yang berlangsung dari 1939 hingga 1945. Di Eropa, perang dimulai ketika Jerman menyerbu Polandia pada 1 September 1939, disusul deklarasi perang Britania Raya dan Prancis. Di Asia, ekspansi Jepang telah berlangsung sebelum 1939, termasuk perang besar di Tiongkok sejak 1937. Perang berakhir pada 1945 setelah Jerman menyerah pada Mei dan Jepang menerima ketentuan penyerahan pada Agustus, yang ditandatangani secara resmi pada September.';

export const WW2_CAUSES_TITLE = 'Latar belakang';

export const WW2_CAUSES: CauseItem[] = [
  {
    term: 'Luka pasca Perang Dunia I',
    description: 'Ketidakpuasan dan ketegangan setelah Perang Dunia I, termasuk dampak Perjanjian Versailles.',
  },
  {
    term: 'Krisis ekonomi dunia',
    description: 'Krisis ekonomi dan melemahnya sejumlah sistem demokrasi di Eropa.',
  },
  {
    term: 'Bangkitnya rezim agresif',
    description: 'Rezim Nazi di Jerman, fasis di Italia, dan militerisme ekspansionis Jepang.',
  },
  {
    term: 'Gagalnya diplomasi',
    description: 'Upaya diplomasi dan keamanan kolektif gagal menghentikan agresi.',
  },
];

export const WW2_CASUALTY: CasualtyNote = {
  value: '70–85 juta',
  label: 'Perkiraan korban jiwa',
  note: 'Perang Dunia II menimbulkan sekitar 70–85 juta kematian menurut banyak perkiraan sejarah — mencakup militer dan warga sipil. Variasi terjadi karena catatan korban tidak lengkap dan definisi berbeda.',
};

export const WW2_EVENTS: TimelineEvent[] = [
  {
    year: '1 September 1939',
    title: 'Jerman Menyerbu Polandia',
    description:
      'Awal perang di Eropa; Britania dan Prancis menyatakan perang terhadap Jerman.',
    side: 'left',
  },
  {
    year: '1940',
    title: 'Jerman Menguasai Eropa Barat',
    description:
      'Sejumlah wilayah Eropa Barat jatuh; Prancis menyerah pada Juni 1940.',
    side: 'right',
  },
  {
    year: '22 Juni 1941',
    title: 'Jerman Menyerbu Uni Soviet',
    description:
      'Front Timur menjadi salah satu medan perang terbesar dalam sejarah manusia.',
    side: 'left',
  },
  {
    year: '7 Desember 1941',
    title: 'Serangan Jepang ke Pearl Harbor',
    description:
      'Amerika Serikat kemudian masuk perang; konflik meluas di kawasan Asia-Pasifik.',
    side: 'right',
  },
  {
    year: '6 Juni 1944',
    title: 'Pendaratan Sekutu di Normandia (D-Day)',
    description:
      'Operasi besar Sekutu membuka front baru di Eropa Barat dan memulai pembebasan Eropa.',
    side: 'left',
  },
  {
    year: '8 Mei 1945',
    title: 'Hari Kemenangan di Eropa (VE Day)',
    description:
      'Penyerahan Jerman telah berlaku; perang di Eropa berakhir.',
    side: 'right',
  },
  {
    year: 'Agustus–September 1945',
    title: 'Jepang Menerima Penyerahan',
    description:
      'Upacara resmi berlangsung 2 September 1945 — Perang Dunia II berakhir. Di Asia, akhir pendudukan Jepang membuka jalan bagi kemerdekaan Indonesia.',
    side: 'left',
  },
];

export const WW2_ARTIFACTS: Artifact[] = [
  {
    id: 'ww2-europe',
    title: 'Perang di Eropa',
    year: '1939–1945',
    location: 'Eropa',
    description:
      'Invasi Polandia menyalakan perang total di Eropa: kota-kota dibom, pengungsian massal, dan pendudukan yang berlangsung bertahun-tahun sampai Jerman menyerah pada Mei 1945.',
    image: '/museum/ww2-europe.png',
    tag: 'Teater Eropa',
    source: 'The National WWII Museum',
  },
  {
    id: 'ww2-dday',
    title: 'Pendaratan D-Day di Normandia',
    year: '6 Juni 1944',
    location: 'Normandia, Prancis',
    description:
      'Pendaratan besar Sekutu di pantai Normandia membuka front di Eropa Barat. Operasi ini menjadi salah satu momen penentu kekalahan Jerman.',
    image: '/museum/ww2-d-day.png',
    tag: 'Operasi Sekutu',
    source: 'Imperial War Museums (IWM)',
  },
  {
    id: 'ww2-pacific',
    title: 'Perang di Asia-Pasifik',
    year: '1941–1945',
    location: 'Kawasan Asia dan Pasifik',
    description:
      'Perang Asia-Pasifik melibatkan Jepang, Tiongkok, Amerika Serikat, Britania Raya, Belanda, Australia, dan banyak masyarakat Asia serta Kepulauan Pasifik. Pendudukan, kerja paksa, kekurangan pangan, dan perpindahan penduduk berdampak besar pada kehidupan masyarakat.',
    image: '/museum/ww2-pacific.png',
    tag: 'Teater Pasifik',
    source: 'The National WWII Museum',
  },
  {
    id: 'ww2-japan-indo',
    title: 'Pendudukan Jepang di Hindia Belanda',
    year: '1942–1945',
    location: 'Hindia Belanda (Indonesia)',
    description:
      'Pemerintahan militer Jepang mengerahkan tenaga dan sumber daya masyarakat untuk kebutuhan perang. Kerja paksa (romusha), kekurangan pangan, dan kontrol sosial berdampak berat pada penduduk — penderitaan yang tidak dihapus oleh perubahan politik menjelang 1945.',
    image: '/museum/ww2-japan-indo.png',
    tag: 'Indonesia dalam PD II',
    source: 'Arsip Nasional Republik Indonesia (ANRI)',
  },
  {
    id: 'ww2-surrender',
    title: 'Penyerahan Jepang dan Akhir Perang',
    year: 'Agustus–September 1945',
    location: 'Tokyo Bay (upacara resmi 2 September 1945)',
    description:
      'Jepang menerima ketentuan penyerahan pada Agustus 1945 dan menandatanganinya secara resmi pada 2 September — menutup Perang Dunia II. Dari kehancuran ini lahirlah tatanan dunia baru: PBB dan gelombang dekolonisasi.',
    image: '/museum/ww2-surrender.png',
    tag: 'Akhir Perang',
    source: 'The National Archives (UK)',
  },
];

/** Panel khusus yang disajikan dengan bahasa hormat dan tanpa gambar grafis. */
export const WW2_PANELS: ExhibitPanel[] = [
  {
    title: 'Holocaust dan kejahatan kemanusiaan',
    text: 'Holocaust adalah penganiayaan dan pembunuhan sistematis terhadap enam juta orang Yahudi Eropa oleh rezim Nazi Jerman dan para kolaboratornya. Nazi juga menganiaya kelompok lain: orang Roma dan Sinti, penyandang disabilitas, tawanan perang Soviet, warga sipil Polandia, serta orang-orang yang dianggap musuh politik. Bagian ini disajikan dengan bahasa hormat, sumber sejarah yang kuat, dan tanpa gambar grafis.',
    source: 'United States Holocaust Memorial Museum',
    image: '/museum/ww2-memorial.png',
  },
  {
    title: 'Indonesia di bawah pendudukan Jepang',
    text: 'Indonesia berada di bawah pendudukan Jepang sejak 1942 hingga 1945. Pendudukan mengakhiri pemerintahan Hindia Belanda, tetapi bukan berarti masyarakat Indonesia langsung merdeka: kerja paksa, pengawasan ketat, kekurangan bahan kebutuhan, dan kekerasan menjadi pengalaman sehari-hari. Pada saat yang sama, perubahan organisasi dan pelatihan pada masa pendudukan ikut membentuk dinamika politik menjelang 1945.',
    source: 'Arsip Nasional Republik Indonesia (ANRI)',
    image: '/museum/ww2-japan-indo.png',
  },
];

export const WW2_IMPACTS: string[] = [
  'Perserikatan Bangsa-Bangsa didirikan pada 1945 untuk mendorong kerja sama dan perdamaian internasional.',
  'Proses dekolonisasi menguat di Asia dan Afrika setelah perang.',
  'Perang mempercepat perubahan kekuatan global, termasuk meningkatnya pengaruh Amerika Serikat dan Uni Soviet.',
  'Pengadilan pascaperang dan perkembangan hukum internasional memperkuat pembahasan kejahatan perang dan kejahatan terhadap kemanusiaan.',
];

export const WW2_IDEAS: string[] = [
  'Peta dunia 1939 dan 1945 yang memperlihatkan perubahan wilayah secara bertahap, bukan satu peta statis.',
  'Garis waktu Eropa dan Asia-Pasifik dalam dua jalur yang berjalan berdampingan.',
  'Panel khusus Holocaust berbasis sumber United States Holocaust Memorial Museum.',
  'Panel dampak terhadap warga sipil: pengungsian, kehancuran kota, kelaparan, dan pemulihan.',
];

/* =====================================================================
 * RUANG 3 — KOLONIALISME DAN PERJUANGAN INDONESIA
 * ===================================================================== */

export const ID_INTRO =
  'Sejarah kolonial Indonesia berlangsung panjang dan tidak dapat disederhanakan menjadi satu peristiwa kedatangan bangsa Eropa. Berbagai kerajaan dan masyarakat Nusantara telah memiliki jaringan perdagangan, politik, dan budaya sebelum ekspansi Eropa. Portugis merebut Malaka pada 1511 dan kemudian hadir di sejumlah wilayah kepulauan. Perusahaan dagang Belanda VOC didirikan pada 1602 dan memperoleh hak istimewa untuk berdagang, membuat perjanjian, serta menjalankan kekuasaan bersenjata. Setelah VOC dibubarkan pada 1799, aset dan utangnya diambil alih pemerintah Belanda.';

/** Konteks singkat: Nusantara sebelum dan di awal ekspansi Eropa. */
export const PRE_EUROPE_ERAS: MiniEra[] = [
  {
    id: 'prasejarah',
    period: 'Sejak ± 1,8 juta tahun lalu',
    title: 'Zaman Prasejarah',
    image: '/museum/id-prasejarah.png',
    description: 'Jejak penghunian tertua — fosil dan lukisan gua — membuktikan kepulauan ini telah lama dihuni.',
  },
  {
    id: 'kerajaan',
    period: 'Abad ke-4 – abad ke-15 M',
    title: 'Era Kerajaan',
    image: '/museum/id-sriwijaya.png',
    description: 'Sriwijaya hingga Majapahit membangun jaringan dagang dan politik lintas lautan.',
  },
  {
    id: 'islam',
    period: 'Abad ke-13 – abad ke-17 M',
    title: 'Kesultanan Islam',
    image: '/museum/id-islam.png',
    description: 'Samudera Pasai, Aceh, Demak, hingga Gowa-Tallo — jaringan dagang dan budaya yang kuat.',
  },
];

export const KOLONIAL_EVENTS: TimelineEvent[] = [
  {
    year: '1511',
    title: 'Portugis Merebut Malaka',
    description:
      'Mengubah persaingan perdagangan di kawasan — bukan awal tunggal sejarah Nusantara.',
    side: 'left',
  },
  {
    year: '1602',
    title: 'VOC Didirikan',
    description:
      'Perusahaan dagang Belanda dengan hak istimewa dari negara: berdagang, membuat perjanjian, dan menjalankan kekuasaan bersenjata.',
    side: 'right',
  },
  {
    year: '1799',
    title: 'VOC Dibubarkan',
    description:
      'Pemerintah Belanda mengambil alih aset dan kewajiban VOC.',
    side: 'left',
  },
  {
    year: '1830–1870',
    title: 'Sistem Tanam Paksa (Cultuurstelsel)',
    description:
      'Mendorong produksi tanaman ekspor; menimbulkan beban berat di banyak wilayah.',
    side: 'right',
  },
  {
    year: '1901',
    title: 'Politik Etis Diumumkan',
    description:
      'Kebijakan kolonial yang dikaitkan dengan irigasi, edukasi, dan emigrasi; pelaksanaannya terbatas dan tidak setara.',
    side: 'left',
  },
  {
    year: '1942',
    title: 'Jepang Menduduki Hindia Belanda',
    description:
      'Pemerintahan kolonial Belanda runtuh di wilayah Indonesia.',
    side: 'right',
  },
  {
    year: '17 Agustus 1945',
    title: 'Proklamasi Kemerdekaan Indonesia',
    description:
      'Soekarno dan Mohammad Hatta memproklamasikan kemerdekaan.',
    side: 'left',
  },
  {
    year: '1945–1949',
    title: 'Revolusi dan Perjuangan Kemerdekaan',
    description:
      'Konflik diplomatik dan bersenjata berakhir dengan pengakuan kedaulatan oleh Belanda pada 27 Desember 1949.',
    side: 'right',
  },
];

/** Narasi utama Ruang 3 — dikelola lewat model "Era" di database. */
export const ID_TOPICS: Era[] = [
  {
    id: 'voc',
    period: '1602 – 1799',
    title: 'VOC dan Pemerintahan Kolonial',
    image: '/museum/id-voc.png',
    description:
      'VOC bukan sekadar perusahaan dagang biasa. VOC memiliki monopoli perdagangan tertentu, membangun benteng dan kantor dagang, membuat perjanjian dengan penguasa lokal, serta menggunakan kekuatan untuk mempertahankan kepentingannya. Kekuasaan kolonial berkembang tidak merata dan menghadapi perlawanan di berbagai daerah.',
    highlights: ['Monopoli perdagangan', 'Benteng dan kantor dagang', 'Perjanjian dengan penguasa lokal'],
  },
  {
    id: 'tanam-paksa',
    period: '1830 – 1870',
    title: 'Tanam Paksa dan Perubahan Ekonomi',
    image: '/museum/id-tanam-paksa.png',
    description:
      'Sistem Tanam Paksa diperkenalkan pemerintah kolonial pada 1830. Dalam ketentuannya, desa diwajibkan menyediakan sebagian tanah atau tenaga untuk tanaman ekspor. Dalam praktiknya, pelaksanaan di banyak tempat menyimpang dan dapat menimbulkan beban kerja, tekanan terhadap lahan pangan, serta kelaparan. Dampaknya berbeda menurut daerah dan kondisi setempat.',
    highlights: ['Cultuurstelsel 1830', 'Beban kerja dan lahan pangan', 'Dampak berbeda tiap daerah'],
  },
  {
    id: 'perlawanan',
    period: '1803 – 1904 dan sesudahnya',
    title: 'Perlawanan Masyarakat Nusantara',
    image: '/museum/id-perlawanan.png',
    description:
      'Perlawanan terhadap kolonialisme berlangsung dalam bentuk dan periode yang beragam. Contoh yang sering dibahas meliputi Perang Diponegoro (1825–1830), Perang Padri (1803–1837, dengan fase dan periodisasi yang berbeda dalam literatur), Perang Aceh (1873–1904 dan sesudahnya), serta perlawanan di berbagai wilayah lain. Gerakan politik modern pada awal abad ke-20 memperluas bentuk perjuangan melalui organisasi, pendidikan, pers, dan diplomasi.',
    highlights: ['Perang Diponegoro 1825–1830', 'Perang Padri 1803–1837', 'Perang Aceh 1873–1904'],
  },
  {
    id: 'jepang',
    period: '1942 – 1945',
    title: 'Pendudukan Jepang',
    image: '/museum/ww2-japan-indo.png',
    description:
      'Pendudukan Jepang mengakhiri pemerintahan Hindia Belanda, tetapi bukan berarti masyarakat Indonesia langsung merdeka. Pemerintahan militer Jepang mengerahkan sumber daya untuk kepentingan perang. Banyak penduduk mengalami kerja paksa (romusha), pengawasan ketat, kekurangan bahan kebutuhan, dan kekerasan. Pada saat yang sama, perubahan organisasi dan pelatihan pada masa pendudukan ikut membentuk dinamika politik menjelang 1945 — hal ini tidak menghapus penderitaan masyarakat.',
    highlights: ['Kerja paksa (romusha)', 'Kekurangan bahan kebutuhan', 'Organisasi dan pelatihan pemuda'],
  },
  {
    id: 'proklamasi',
    period: '1945 – 1949',
    title: 'Proklamasi dan Revolusi Kemerdekaan',
    image: '/museum/id-proklamasi.png',
    description:
      'Pada 17 Agustus 1945, Soekarno didampingi Mohammad Hatta membacakan Proklamasi Kemerdekaan Indonesia di Jakarta. Proklamasi menjadi pernyataan kemerdekaan, tetapi pengakuan dan penguasaan wilayah harus diperjuangkan melalui revolusi, diplomasi, dan konflik 1945–1949. Pada 27 Desember 1949, Belanda menyerahkan kedaulatan kepada Republik Indonesia Serikat — dengan persoalan Papua Barat saat itu belum diselesaikan.',
    highlights: ['Proklamasi 17 Agustus 1945', 'Revolusi dan diplomasi 1945–1949', 'Kedaulatan 27 Desember 1949'],
  },
];

export const KOLONIAL_ARTIFACTS: Artifact[] = [
  {
    id: 'kol-voc',
    title: 'VOC: Monopoli, Benteng, dan Perjanjian',
    year: '1602–1799',
    location: 'Batavia dan berbagai pelabuhan Nusantara',
    description:
      'VOC memperoleh hak istimewa dari negara Belanda untuk berdagang, membuat perjanjian, dan menjalankan kekuasaan bersenjata. Benteng, kantor dagang, dan monopoli perdagangan menjadi instrumen kekuasaan yang memicu perlawanan di berbagai daerah.',
    image: '/museum/id-voc.png',
    tag: 'Perusahaan Dagang',
    source: 'Nationaal Archief (Belanda)',
  },
  {
    id: 'kol-tanam-paksa',
    title: 'Sistem Tanam Paksa (Cultuurstelsel)',
    year: '1830–1870',
    location: 'Terutama di Jawa',
    description:
      'Desa diwajibkan menyediakan sebagian tanah atau tenaga untuk tanaman ekspor. Dalam praktiknya aturan ini sering menyimpang: beban kerja bertambah, lahan pangan tertekan, dan kelaparan terjadi di sejumlah wilayah — dengan dampak yang berbeda menurut daerah.',
    image: '/museum/id-tanam-paksa.png',
    tag: 'Ekonomi Kolonial',
    source: 'Leiden University Libraries — Digital Collections',
  },
  {
    id: 'kol-diponegoro',
    title: 'Perang Diponegoro',
    year: '1825–1830',
    location: 'Jawa',
    description:
      'Salah satu perlawanan terbesar terhadap kolonialisme di Nusantara. Perang Diponegoro menjadi contoh perjuangan berkepanjangan yang dipicu beragam sebab — dari perlakuan kolonial hingga persoalan tanah dan agama — dan menelan korban besar di kedua belah pihak.',
    image: '/museum/id-perlawanan.png',
    tag: 'Perlawanan',
    source: 'Arsip Nasional Republik Indonesia (ANRI)',
  },
  {
    id: 'kol-romusha',
    title: 'Romusha: Kerja Paksa Masa Pendudukan',
    year: '1942–1945',
    location: 'Hindia Belanda',
    description:
      'Pemerintahan militer Jepang mengerahkan tenaga dan sumber daya masyarakat untuk kebutuhan perang. Kerja paksa, kekurangan pangan, dan kontrol sosial berdampak berat pada penduduk — kesaksian yang dapat diverifikasi menjadi rujukan utama bagian ini.',
    image: '/museum/ww2-japan-indo.png',
    tag: 'Pendudukan Jepang',
    source: 'Arsip Nasional Republik Indonesia (ANRI)',
  },
  {
    id: 'kol-proklamasi',
    title: 'Proklamasi Kemerdekaan',
    year: '17 Agustus 1945',
    location: 'Jakarta',
    description:
      'Proklamasi dibacakan oleh Soekarno didampingi Mohammad Hatta di Jakarta. Pernyataan ini menandai lahirnya Indonesia merdeka, tetapi perjuangan untuk mempertahankan kemerdekaan terus berlangsung melalui perlawanan rakyat dan diplomasi.',
    image: '/museum/id-proklamasi.png',
    tag: 'Peristiwa Kunci',
    source: 'Arsip Nasional Republik Indonesia (ANRI)',
  },
  {
    id: 'kol-revolusi',
    title: 'Revolusi dan Pengakuan Kedaulatan',
    year: '1945–1949',
    location: 'Indonesia & meja perundingan internasional',
    description:
      'Pengakuan dan penguasaan wilayah harus diperjuangkan melalui revolusi, diplomasi, dan konflik 1945–1949. Pada 27 Desember 1949 Belanda menyerahkan kedaulatan kepada Republik Indonesia Serikat — dengan persoalan Papua Barat saat itu belum diselesaikan.',
    image: '/museum/id-revolusi.png',
    tag: 'Revolusi Nasional',
    source: 'Arsip Nasional Republik Indonesia (ANRI)',
  },
];

export const ID_NOTE =
  'Hindari narasi bahwa kemerdekaan merupakan hadiah pihak lain. Tampilkan peran masyarakat, organisasi pergerakan, pemuda, perempuan, tokoh daerah, diplomat, dan perjuangan rakyat yang beragam.';

/* =====================================================================
 * RUANG 4 — REFLEKSI
 * ===================================================================== */

export const REFLEKSI_INTRO =
  'Ketiga tema ini saling berkaitan. Perang Dunia I membentuk tatanan internasional yang rapuh; Perang Dunia II mengubah peta kekuasaan dunia dan mempercepat dekolonisasi; sementara pengalaman kolonial dan pendudukan Jepang menjadi bagian penting dari jalan panjang menuju kemerdekaan Indonesia. Museum virtual yang baik bukan hanya menampilkan peristiwa, tetapi juga membantu pengunjung memahami sebab, pengalaman manusia, sumber bukti, dan dampak sejarah hingga masa kini.';

export const COMPARISON_ROWS: ComparisonRow[] = [
  {
    aspect: 'Rentang utama',
    ww1: '1914–1918',
    ww2: '1939–1945 (konflik Asia meluas sejak 1937)',
    colonial: 'Berabad-abad; pemerintahan kolonial Belanda hingga 1942, revolusi 1945–1949',
  },
  {
    aspect: 'Skala',
    ww1: 'Konflik antarimperium dan negara, terutama Eropa',
    ww2: 'Konflik global di Eropa, Afrika, Asia, dan Pasifik',
    colonial: 'Ekspansi dagang, penguasaan politik-ekonomi, perlawanan, dan dekolonisasi',
  },
  {
    aspect: 'Dampak',
    ww1: 'Runtuhnya kekaisaran dan perubahan perbatasan',
    ww2: 'Kehancuran luas, Holocaust, PBB, dekolonisasi',
    colonial: 'Eksploitasi, perubahan sosial-ekonomi, tumbuhnya gerakan nasional, kemerdekaan',
  },
  {
    aspect: 'Pertanyaan refleksi',
    ww1: 'Bagaimana aliansi memperluas krisis?',
    ww2: 'Bagaimana propaganda dan rasisme negara memicu kekerasan?',
    colonial: 'Bagaimana masyarakat mempertahankan kedaulatan dan identitas?',
  },
];

export const DATA_ETHICS: string[] = [
  'Jangan mencampur korban militer, korban sipil, orang hilang, pengungsi, dan korban kelaparan tanpa menjelaskan definisinya.',
  'Untuk angka korban perang, tulis rentang perkiraan dan sumber yang menggunakannya.',
  'Untuk kolonialisme, hindari satu angka korban total untuk seluruh masa kolonial karena cakupan wilayah dan periode sangat luas serta tidak sebanding.',
  'Jika membuat grafik, tampilkan tahun, satuan, wilayah, definisi, dan sumber data pada grafik itu sendiri.',
];

export const REFLECTION_QUESTIONS: string[] = [
  'Bagaimana aliansi dapat memperluas krisis regional menjadi perang dunia?',
  'Bagaimana propaganda dan rasisme negara memicu kekerasan massal?',
  'Bagaimana masyarakat mempertahankan kedaulatan dan identitasnya di tengah penjajahan?',
  'Apa arti perdamaian, hak asasi manusia, dan ingatan sejarah bagi kita hari ini?',
];

export const EXHIBIT_STANDARDS: StandardRow[] = [
  { element: 'Judul', content: 'Nama peristiwa, tokoh, dokumen, atau artefak.' },
  { element: 'Tanggal dan lokasi', content: 'Tanggal/periode dan lokasi yang diketahui; tulis "perkiraan" bila tidak pasti.' },
  { element: 'Keterangan sejarah', content: 'Penjelasan 2–4 kalimat tentang konteks dan arti objek.' },
  { element: 'Sumber', content: 'Nama museum/arsip, nomor koleksi bila tersedia, dan tautan katalog.' },
  { element: 'Hak penggunaan', content: 'Status lisensi/hak cipta dan ketentuan atribusi.' },
  { element: 'Aksesibilitas', content: 'Teks alternatif gambar, transkrip audio/video, dan ukuran huruf terbaca.' },
];

export const PUBLISH_CHECKLIST: string[] = [
  'Setiap foto memiliki asal koleksi dan keterangan yang dapat ditelusuri.',
  'Setiap peta memiliki tahun, legenda, dan penjelasan batas wilayah.',
  'Angka statistik disertai sumber dan definisi.',
  'Peristiwa sensitif ditampilkan secara hormat dan tidak sensasional.',
  'Perbedaan sudut pandang dan pengalaman masyarakat lokal dijelaskan.',
  'Konten diperiksa oleh guru sejarah atau pembimbing sebelum dipublikasikan.',
];

/* =====================================================================
 * SUMBER MUSEUM, ARSIP, DAN PENELITIAN
 * ===================================================================== */

export const SOURCES_INTRO =
  'Gunakan katalog lembaga berikut untuk mencari foto, peta, dokumen, rekaman sejarah lisan, dan artikel penelitian. Katalog dapat berubah; periksa metadata dan ketentuan penggunaan sebelum mengunduh atau memasukkan materi ke website.';

export const MUSEUM_SOURCES: SourceRef[] = [
  {
    name: 'Kanal YouTube Sobat History',
    description:
      'Video "Perang Dunia 1: Latar Belakang, Proses, dan Dampaknya Bagi Dunia" — rujukan utama penyusunan materi Ruang Pamer 1.',
    url: 'https://www.youtube.com/watch?v=q7ZcvelOokc',
  },
  {
    name: 'Imperial War Museums (IWM)',
    description: 'Koleksi foto, poster, benda, dan cerita Perang Dunia I/II.',
    url: 'https://www.iwm.org.uk/collections',
  },
  {
    name: 'The National WWII Museum',
    description: 'Kronologi, artikel edukasi, peta, dan materi Perang Dunia II.',
    url: 'https://www.nationalww2museum.org/',
  },
  {
    name: 'United States Holocaust Memorial Museum',
    description: 'Ensiklopedia Holocaust, dokumen, foto, peta, dan kesaksian.',
    url: 'https://encyclopedia.ushmm.org/',
  },
  {
    name: 'The National Archives (UK)',
    description: 'Dokumen pemerintah, peta, dan panduan riset Perang Dunia I/II.',
    url: 'https://www.nationalarchives.gov.uk/',
  },
  {
    name: 'Nationaal Archief (Belanda)',
    description: 'Arsip pemerintahan Belanda dan koleksi terkait sejarah kolonial.',
    url: 'https://www.nationaalarchief.nl/',
  },
  {
    name: 'Arsip Nasional Republik Indonesia (ANRI)',
    description: 'Arsip statis dan layanan informasi kearsipan Indonesia.',
    url: 'https://anri.go.id/',
  },
  {
    name: 'Leiden University Libraries — Digital Collections',
    description: 'Koleksi digital terkait sejarah Asia dan Indonesia, termasuk foto dan peta.',
    url: 'https://digitalcollections.universiteitleiden.nl/',
  },
  {
    name: 'KITLV / Leiden University Libraries',
    description: 'Koleksi dan publikasi kajian sejarah, bahasa, dan budaya Indonesia.',
    url: 'https://www.kitlv.nl/',
  },
  {
    name: 'Perpustakaan Nasional Republik Indonesia',
    description: 'Katalog buku, surat kabar, manuskrip, dan sumber sejarah Indonesia.',
    url: 'https://www.perpusnas.go.id/',
  },
  {
    name: 'Museum Nasional Indonesia',
    description: 'Koleksi dan informasi sejarah-budaya Indonesia.',
    url: 'https://www.museumnasional.or.id/',
  },
];

export const ACADEMIC_BOOKS: { author: string; title: string; note: string }[] = [
  { author: 'J. M. Roberts & Odd Arne Westad', title: 'The History of the World', note: 'Konteks sejarah global modern.' },
  { author: 'Margaret MacMillan', title: 'The War That Ended Peace: The Road to 1914', note: 'Latar belakang Perang Dunia I.' },
  { author: 'Jay Winter (ed.)', title: 'The Cambridge History of the First World War', note: 'Kajian akademik Perang Dunia I.' },
  { author: 'Richard Overy', title: 'The Second World War', note: 'Gambaran menyeluruh Perang Dunia II.' },
  { author: 'Gerhard L. Weinberg', title: 'A World at Arms: A Global History of World War II', note: 'Sejarah global Perang Dunia II.' },
  { author: 'M. C. Ricklefs', title: 'A History of Modern Indonesia Since c. 1200', note: 'Sejarah Indonesia modern.' },
  { author: 'Anne Booth', title: 'Colonial Legacies: Economic and Social Development in East and Southeast Asia', note: 'Warisan kolonial dalam konteks kawasan.' },
  { author: 'Jan Breman', title: 'Mobilizing Labour for the Global Coffee Market', note: 'Kajian kerja dan ekonomi kolonial di Jawa.' },
];

export const BIBLIO_NOTE =
  'Catatan bibliografi: pastikan edisi, tahun terbit, penerbit, dan halaman yang benar saat menyusun daftar pustaka akhir. Gunakan katalog perpustakaan atau penerbit akademik untuk memverifikasi detail bibliografis.';

export const EDU_NOTE =
  'Museum ini merupakan bahan edukasi awal, bukan pengganti penelitian arsip. Untuk penggunaan akademik, cocokkan setiap klaim khusus dengan sumber primer atau kajian ilmiah yang relevan.';

export const IMAGE_DISCLAIMER =
  'Seluruh gambar dalam museum ini merupakan ilustrasi rekonstruksi digital berbasis AI untuk keperluan pembelajaran — bukan foto arsip asli. Nama lembaga yang dicantumkan adalah rujukan sumber informasi, bukan pemilik gambar.';

/* =====================================================================
 * PETA LOBI & NAVIGASI
 * ===================================================================== */

export interface LobbyHall {
  href: string;
  badge: string;
  title: string;
  topics: string;
  visuals: string;
  image: string;
  accent: string;
}

export const LOBBY_HALLS: LobbyHall[] = [
  {
    href: '#ruang-pd1',
    badge: 'Ruang 1',
    title: 'Perang Dunia I',
    topics: 'Sebab, aliansi, perang parit, perubahan politik, dan dampaknya.',
    visuals: 'Peta Eropa 1914 · foto parit · poster · dokumen gencatan senjata',
    image: '/museum/ww1-trench.png',
    accent: 'from-stone-900/90 via-stone-900/40',
  },
  {
    href: '#ruang-pd2',
    badge: 'Ruang 2',
    title: 'Perang Dunia II',
    topics: 'Ekspansi fasis, perang global, Holocaust, perang Pasifik, akhir perang.',
    visuals: 'Peta 1939–1945 · foto kota · arsip pengungsi · dokumen penyerahan',
    image: '/museum/ww2-europe.png',
    accent: 'from-red-950/90 via-red-950/40',
  },
  {
    href: '#ruang-indonesia',
    badge: 'Ruang 3',
    title: 'Indonesia dalam Kolonialisme',
    topics: 'VOC, pemerintahan kolonial, perlawanan, pendudukan Jepang, kemerdekaan.',
    visuals: 'Peta Hindia Belanda · arsip tanam paksa · proklamasi',
    image: '/museum/id-voc.png',
    accent: 'from-amber-950/90 via-amber-950/40',
  },
  {
    href: '#refleksi',
    badge: 'Ruang 4',
    title: 'Refleksi',
    topics: 'Dampak terhadap warga sipil, ingatan sejarah, dan perdamaian.',
    visuals: 'Kesaksian · garis waktu interaktif · pertanyaan refleksi',
    image: '/museum/refleksi-damai.png',
    accent: 'from-emerald-950/90 via-emerald-950/40',
  },
];

export const NAV_LINKS = [
  { href: '#ruang-pd1', label: 'PD I' },
  { href: '#ruang-pd2', label: 'PD II' },
  { href: '#ruang-indonesia', label: 'Indonesia' },
  { href: '#refleksi', label: 'Refleksi' },
  { href: '#sumber', label: 'Sumber' },
];

export const MUSEUM_STATS = [
  { value: '4', label: 'Ruang pamer utama' },
  { value: '21', label: 'Titik kronologi sejarah' },
  { value: '16', label: 'Artefak proyeksi 3D' },
  { value: '10', label: 'Arsip & museum rujukan' },
];

export const MUSEUM_EDITION = 'Edisi materi pembelajaran · 6 November 2026';
