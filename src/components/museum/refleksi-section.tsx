'use client';

import { motion } from 'framer-motion';
import {
  CheckCircle2,
  ClipboardCheck,
  HelpCircle,
  Landmark,
  Scale,
  Table2,
} from 'lucide-react';
import {
  COMPARISON_ROWS,
  DATA_ETHICS,
  EDU_NOTE,
  EXHIBIT_STANDARDS,
  PUBLISH_CHECKLIST,
  REFLECTION_QUESTIONS,
  REFLEKSI_INTRO,
} from '@/data/museum';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

/**
 * RefleksiSection — Ruang 4: perbandingan tiga periode, pertanyaan refleksi,
 * etika penyajian angka, standar objek pamer, dan daftar periksa publikasi.
 */
export function RefleksiSection() {
  return (
    <section id="refleksi" className="relative scroll-mt-20 overflow-hidden bg-zinc-950 py-20 sm:py-28">
      {/* Latar tenang */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.06]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/museum/refleksi-damai.png)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-transparent to-zinc-950" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* Kepala ruangan */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-xs font-bold tracking-[0.4em] text-amber-400 uppercase">Ruang Pamer 4</p>
          <h2 className="mt-3 text-3xl font-black text-zinc-50 sm:text-5xl">Refleksi</h2>
          <p className="mt-2 text-sm font-semibold text-amber-200/90 sm:text-base">
            Dampak bagi warga sipil · Ingatan sejarah · Perdamaian
          </p>
          <p className="mt-5 leading-relaxed text-zinc-400 sm:text-lg">{REFLEKSI_INTRO}</p>
        </motion.div>

        {/* Perbandingan tiga periode */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
          className="mt-16"
        >
          <h3 className="inline-flex items-center gap-2 text-xl font-bold text-zinc-100 sm:text-2xl">
            <Table2 className="h-5 w-5 text-amber-400" aria-hidden />
            Perbandingan Tiga Periode
          </h3>
          <div className="mt-5 overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900/50">
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-800 hover:bg-transparent">
                  <TableHead className="w-36 text-zinc-400">Aspek</TableHead>
                  <TableHead className="min-w-44 text-amber-300">Perang Dunia I</TableHead>
                  <TableHead className="min-w-44 text-amber-300">Perang Dunia II</TableHead>
                  <TableHead className="min-w-44 text-amber-300">Kolonialisme Indonesia</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {COMPARISON_ROWS.map((row) => (
                  <TableRow key={row.aspect} className="border-zinc-800">
                    <TableCell className="align-top font-semibold text-zinc-200">{row.aspect}</TableCell>
                    <TableCell className="align-top text-sm leading-relaxed text-zinc-400">{row.ww1}</TableCell>
                    <TableCell className="align-top text-sm leading-relaxed text-zinc-400">{row.ww2}</TableCell>
                    <TableCell className="align-top text-sm leading-relaxed text-zinc-400">{row.colonial}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </motion.div>

        {/* Pertanyaan refleksi */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
          className="mt-16"
        >
          <h3 className="inline-flex items-center gap-2 text-xl font-bold text-zinc-100 sm:text-2xl">
            <HelpCircle className="h-5 w-5 text-amber-400" aria-hidden />
            Pertanyaan Refleksi
          </h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {REFLECTION_QUESTIONS.map((q, i) => (
              <div
                key={q}
                className="flex items-start gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 transition-colors hover:border-amber-500/30"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-amber-500/40 bg-amber-500/10 text-sm font-black text-amber-300">
                  {i + 1}
                </span>
                <p className="pt-1.5 text-sm leading-relaxed text-zinc-200 sm:text-base">{q}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Etika penyajian angka */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
          className="mt-16"
        >
          <h3 className="inline-flex items-center gap-2 text-xl font-bold text-zinc-100 sm:text-2xl">
            <Scale className="h-5 w-5 text-amber-400" aria-hidden />
            Menyajikan Angka secara Bertanggung Jawab
          </h3>
          <ol className="mt-5 grid gap-4 sm:grid-cols-2">
            {DATA_ETHICS.map((rule, i) => (
              <li
                key={rule}
                className="flex items-start gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5"
              >
                <span className="text-2xl font-black text-amber-400/70" aria-hidden>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="pt-0.5 text-sm leading-relaxed text-zinc-300">{rule}</p>
              </li>
            ))}
          </ol>
        </motion.div>

        {/* Standar objek pamer + daftar periksa */}
        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7 }}
          >
            <h3 className="inline-flex items-center gap-2 text-xl font-bold text-zinc-100 sm:text-2xl">
              <Landmark className="h-5 w-5 text-amber-400" aria-hidden />
              Standar Setiap Objek Pamer
            </h3>
            <div className="mt-5 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50">
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-800 hover:bg-transparent">
                    <TableHead className="w-40 text-zinc-400">Elemen</TableHead>
                    <TableHead className="text-zinc-400">Isi yang perlu dicantumkan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {EXHIBIT_STANDARDS.map((s) => (
                    <TableRow key={s.element} className="border-zinc-800">
                      <TableCell className="align-top font-semibold text-amber-200/90">
                        {s.element}
                      </TableCell>
                      <TableCell className="align-top text-sm leading-relaxed text-zinc-400">
                        {s.content}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <h3 className="inline-flex items-center gap-2 text-xl font-bold text-zinc-100 sm:text-2xl">
              <ClipboardCheck className="h-5 w-5 text-amber-400" aria-hidden />
              Daftar Periksa Sebelum Dipublikasikan
            </h3>
            <ul className="mt-5 space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
              {PUBLISH_CHECKLIST.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-zinc-300">
                  <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-emerald-400" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Penutup */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto mt-16 max-w-4xl rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 text-center sm:p-8"
        >
          <p className="text-sm leading-relaxed text-zinc-400">{EDU_NOTE}</p>
        </motion.div>
      </div>
    </section>
  );
}
