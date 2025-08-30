import React, { useEffect, useMemo, useRef, useState } from "react";
import {Label,Input,Textarea,Button,Card,Badge} from "../partials/Ui.jsx";

/**
 * RPS Builder – Single-file React component (TailwindCSS)
 * Fits: Rencana Pembelajaran Semester (RPS) editor for Indonesian HEIs
 * - No external UI libs required (pure Tailwind)
 * - Persistent (localStorage) draft
 * - Export/Import JSON, Print-friendly
 * - Dynamic sections: CPL, CPMK, Mingguan (RPP), Penilaian, Referensi, Matriks Pemetaan
 *
 * Tip: Drop this into a React app, ensure Tailwind is enabled. This file exports <RPSBuilder/>.
 */



// ---------- Types & Defaults ----------
const defaultRPS = {
  meta: {
    prodi: "",
    mataKuliah: "",
    kodeMK: "",
    semester: "",
    sks: "",
    dosen: "",
    tahunAjaran: "",
    deskripsi: "",
    prasyarat: "",
  },
  cpl: ["Mampu berkomunikasi efektif", "Menguasai dasar-dasar keilmuan program studi"],
  cpmk: [
    { kode: "CPMK1", deskripsi: "Menjelaskan konsep dasar topik mata kuliah" },
    { kode: "CPMK2", deskripsi: "Menerapkan konsep pada studi kasus sederhana" },
  ],
  materiMingguan: [
    // minggu, topik, subtopik, aktivitas, metode, bahan, penilaian, bobot
    { minggu: 1, topik: "Pendahuluan", subtopik: "Kontrak kuliah, overview", aktivitas: "Ceramah, diskusi", metode: "Problem-based", bahan: "Slide, artikel", penilaian: "Kuis 1", bobot: 5 },
    { minggu: 2, topik: "Konsep Inti 1", subtopik: "Definisi & contoh", aktivitas: "Ceramah, latihan", metode: "Project-based", bahan: "Buku Bab 1", penilaian: "Tugas 1", bobot: 5 },
  ],
  penilaian: [
    { komponen: "Kuis", bobot: 10, kriteria: "Ketepatan jawaban, waktu" },
    { komponen: "Tugas", bobot: 30, kriteria: "Kelengkapan, orisinalitas" },
    { komponen: "UTS", bobot: 25, kriteria: "Pemahaman konsep" },
    { komponen: "UAS", bobot: 35, kriteria: "Analisis & sintesis" },
  ],
  referensi: [
    { jenis: "Utama", sitasi: "Nama Penulis. (Tahun). Judul Buku. Penerbit." },
    { jenis: "Tambahan", sitasi: "Artikel Jurnal/Website terkait" },
  ],
  kebijakan: {
    kehadiran: "Minimal 75% kehadiran untuk dapat mengikuti UAS.",
    keterlambatan: "Toleransi 10 menit. Lebih dari itu dianggap terlambat.",
    plagiarisme: "Plagiarisme dilarang dan akan diberi sanksi sesuai aturan.",
  },
};

// ---------- Helpers ----------
const uid = () => Math.random().toString(36).slice(2, 9);
const sum = (arr) => arr.reduce((a, b) => a + (Number(b) || 0), 0);

// Persist to localStorage
const STORAGE_KEY = "rps_builder_draft_v1";

// ---------- Main Component ----------
export default function RPSBuilder() {
  const [rps, setRps] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : defaultRPS;
    } catch (e) {
      return defaultRPS;
    }
  });
  const [showJSON, setShowJSON] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rps));
  }, [rps]);

  const totalBobotPenilaian = useMemo(() => sum(rps.penilaian.map((p) => Number(p.bobot))), [rps.penilaian]);
  const totalBobotMingguan = useMemo(() => sum(rps.materiMingguan.map((m) => Number(m.bobot))), [rps.materiMingguan]);

  // ---- Handlers
  const updateMeta = (key, val) => setRps((d) => ({ ...d, meta: { ...d.meta, [key]: val } }));
  const addCPL = () => setRps((d) => ({ ...d, cpl: [...d.cpl, ""] }));
  const updateCPL = (i, val) => setRps((d) => ({ ...d, cpl: d.cpl.map((v, idx) => (idx === i ? val : v)) }));
  const removeCPL = (i) => setRps((d) => ({ ...d, cpl: d.cpl.filter((_, idx) => idx !== i) }));

  const addCPMK = () => setRps((d) => ({ ...d, cpmk: [...d.cpmk, { kode: `CPMK${d.cpmk.length + 1}`, deskripsi: "" }] }));
  const updateCPMK = (i, key, val) => setRps((d) => ({ ...d, cpmk: d.cpmk.map((v, idx) => (idx === i ? { ...v, [key]: val } : v)) }));
  const removeCPMK = (i) => setRps((d) => ({ ...d, cpmk: d.cpmk.filter((_, idx) => idx !== i) }));

  const addMinggu = () =>
    setRps((d) => ({
      ...d,
      materiMingguan: [
        ...d.materiMingguan,
        { minggu: d.materiMingguan.length + 1, topik: "", subtopik: "", aktivitas: "", metode: "", bahan: "", penilaian: "", bobot: 0 },
      ],
    }));
  const updateMinggu = (i, key, val) =>
    setRps((d) => ({ ...d, materiMingguan: d.materiMingguan.map((v, idx) => (idx === i ? { ...v, [key]: val } : v)) }));
  const removeMinggu = (i) =>
    setRps((d) => ({ ...d, materiMingguan: d.materiMingguan.filter((_, idx) => idx !== i).map((v, idx2) => ({ ...v, minggu: idx2 + 1 })) }));

  const addPenilaian = () => setRps((d) => ({ ...d, penilaian: [...d.penilaian, { komponen: "", bobot: 0, kriteria: "" }] }));
  const updatePenilaian = (i, key, val) => setRps((d) => ({ ...d, penilaian: d.penilaian.map((v, idx) => (idx === i ? { ...v, [key]: val } : v)) }));
  const removePenilaian = (i) => setRps((d) => ({ ...d, penilaian: d.penilaian.filter((_, idx) => idx !== i) }));

  const addReferensi = () => setRps((d) => ({ ...d, referensi: [...d.referensi, { jenis: "Utama", sitasi: "" }] }));
  const updateReferensi = (i, key, val) => setRps((d) => ({ ...d, referensi: d.referensi.map((v, idx) => (idx === i ? { ...v, [key]: val } : v)) }));
  const removeReferensi = (i) => setRps((d) => ({ ...d, referensi: d.referensi.filter((_, idx) => idx !== i) }));

  const updateKebijakan = (key, val) => setRps((d) => ({ ...d, kebijakan: { ...d.kebijakan, [key]: val } }));

  const resetDraft = () => {
    if (confirm("Hapus semua data dan kembali ke template awal?")) setRps(defaultRPS);
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(rps, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `RPS_${rps?.meta?.mataKuliah || "Draft"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJSON = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        setRps(data);
      } catch (err) {
        alert("File JSON tidak valid.");
      }
    };
    reader.readAsText(file);
  };

  // Simple derived: matriks Pemetaan CPL-CPMK -> Penilaian (checkbox-like text fields)
  const [pemetaan, setPemetaan] = useState(() => ({}));
  useEffect(() => {
    // Ensure matrix keys exist when cpl/cpmk change
    setPemetaan((prev) => {
      const next = { ...prev };
      rps.cpl.forEach((_, i) => {
        rps.cpmk.forEach((c, j) => {
          const key = `${i}_${j}`;
          if (!(key in next)) next[key] = ""; // e.g., tingkat kontribusi: L/M/H
        });
      });
      return next;
    });
  }, [rps.cpl.length, rps.cpmk.length]);

  const printRef = useRef(null);
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <div className="h-9 w-9 rounded-2xl bg-gray-900 text-white grid place-items-center font-bold">RPS</div>
          <div className="flex-1">
            <h1 className="text-lg sm:text-2xl font-semibold">RPS Builder</h1>
            <p className="text-xs sm:text-sm text-gray-600">Susun Rencana Pembelajaran Semester secara cepat dan rapi.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => setShowJSON((v) => !v)} variant="outline">{showJSON ? "Sembunyikan JSON" : "Lihat JSON"}</Button>
            <Button onClick={exportJSON} title="Unduh berkas JSON">Export</Button>
            <Button variant="outline" onClick={() => fileRef.current?.click()}>Import</Button>
            <input ref={fileRef} type="file" accept="application/json" hidden onChange={(e) => e.target.files?.[0] && importJSON(e.target.files[0])} />
            <Button onClick={handlePrint}>Print</Button>
            <Button variant="ghost" onClick={resetDraft}>Reset</Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 print:space-y-3" ref={printRef}>
        {/* Meta */}
        <Card title="Informasi Mata Kuliah" right={<Badge>Header</Badge>}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="prodi">Program Studi</Label>
              <Input id="prodi" value={rps.meta.prodi} onChange={(e) => updateMeta("prodi", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="mk">Mata Kuliah</Label>
              <Input id="mk" value={rps.meta.mataKuliah} onChange={(e) => updateMeta("mataKuliah", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="kode">Kode MK</Label>
              <Input id="kode" value={rps.meta.kodeMK} onChange={(e) => updateMeta("kodeMK", e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="semester">Semester</Label>
                <Input id="semester" value={rps.meta.semester} onChange={(e) => updateMeta("semester", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="sks">SKS</Label>
                <Input id="sks" value={rps.meta.sks} onChange={(e) => updateMeta("sks", e.target.value)} />
              </div>
            </div>
            <div>
              <Label htmlFor="dosen">Dosen Pengampu</Label>
              <Input id="dosen" value={rps.meta.dosen} onChange={(e) => updateMeta("dosen", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="ta">Tahun Ajaran</Label>
              <Input id="ta" value={rps.meta.tahunAjaran} onChange={(e) => updateMeta("tahunAjaran", e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="deskripsi">Deskripsi Singkat MK</Label>
              <Textarea id="deskripsi" rows={3} value={rps.meta.deskripsi} onChange={(e) => updateMeta("deskripsi", e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="prasyarat">Prasyarat</Label>
              <Input id="prasyarat" value={rps.meta.prasyarat} onChange={(e) => updateMeta("prasyarat", e.target.value)} />
            </div>
          </div>
        </Card>

        {/* CPL */}
        <Card title="CPL (Capaian Pembelajaran Lulusan)" right={<Badge>Outcomes</Badge>}>
          <div className="space-y-3">
            {rps.cpl.map((v, i) => (
              <div key={i} className="flex items-start gap-2">
                <Input value={v} onChange={(e) => updateCPL(i, e.target.value)} />
                <Button variant="ghost" onClick={() => removeCPL(i)} title="Hapus">✕</Button>
              </div>
            ))}
            <Button onClick={addCPL}>+ Tambah CPL</Button>
          </div>
        </Card>

        {/* CPMK */}
        <Card title="CPMK (Capaian Pembelajaran Mata Kuliah)">
          <div className="space-y-3">
            {rps.cpmk.map((row, i) => (
              <div key={i} className="grid grid-cols-12 gap-2">
                <div className="col-span-12 sm:col-span-2">
                  <Label>Kode</Label>
                  <Input value={row.kode} onChange={(e) => updateCPMK(i, "kode", e.target.value)} />
                </div>
                <div className="col-span-12 sm:col-span-9">
                  <Label>Deskripsi</Label>
                  <Input value={row.deskripsi} onChange={(e) => updateCPMK(i, "deskripsi", e.target.value)} />
                </div>
                <div className="col-span-12 sm:col-span-1 flex items-end">
                  <Button variant="ghost" onClick={() => removeCPMK(i)}>✕</Button>
                </div>
              </div>
            ))}
            <Button onClick={addCPMK}>+ Tambah CPMK</Button>
          </div>
        </Card>

        {/* Rencana Mingguan */}
        <Card title="Rencana Pembelajaran Mingguan (14–16 pertemuan)" right={<Badge>{rps.materiMingguan.length} Minggu</Badge>}>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  {[
                    "Minggu",
                    "Topik",
                    "Subtopik/Tujuan",
                    "Aktivitas & Strategi",
                    "Metode",
                    "Bahan/Media",
                    "Penilaian",
                    "Bobot %",
                    "",
                  ].map((h) => (
                    <th key={h} className="px-3 py-2 text-left font-medium border-b border-gray-200">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rps.materiMingguan.map((row, i) => (
                  <tr key={i} className="odd:bg-white even:bg-gray-50">
                    <td className="px-3 py-2 align-top w-20">
                      <Input type="number" value={row.minggu} onChange={(e) => updateMinggu(i, "minggu", Number(e.target.value))} />
                    </td>
                    <td className="px-3 py-2 align-top min-w-[180px]">
                      <Input value={row.topik} onChange={(e) => updateMinggu(i, "topik", e.target.value)} />
                    </td>
                    <td className="px-3 py-2 align-top min-w-[220px]">
                      <Textarea rows={2} value={row.subtopik} onChange={(e) => updateMinggu(i, "subtopik", e.target.value)} />
                    </td>
                    <td className="px-3 py-2 align-top min-w-[220px]">
                      <Textarea rows={2} value={row.aktivitas} onChange={(e) => updateMinggu(i, "aktivitas", e.target.value)} />
                    </td>
                    <td className="px-3 py-2 align-top min-w-[140px]">
                      <Input value={row.metode} onChange={(e) => updateMinggu(i, "metode", e.target.value)} />
                    </td>
                    <td className="px-3 py-2 align-top min-w-[160px]">
                      <Input value={row.bahan} onChange={(e) => updateMinggu(i, "bahan", e.target.value)} />
                    </td>
                    <td className="px-3 py-2 align-top min-w-[140px]">
                      <Input value={row.penilaian} onChange={(e) => updateMinggu(i, "penilaian", e.target.value)} />
                    </td>
                    <td className="px-3 py-2 align-top w-28">
                      <Input type="number" value={row.bobot} onChange={(e) => updateMinggu(i, "bobot", Number(e.target.value))} />
                    </td>
                    <td className="px-3 py-2 align-top w-10">
                      <Button variant="ghost" onClick={() => removeMinggu(i)}>✕</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={7} className="px-3 py-2 text-right font-medium">Total Bobot</td>
                  <td className="px-3 py-2 font-semibold">{totalBobotMingguan}%</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
          <div className="mt-3 flex gap-2">
            <Button onClick={addMinggu}>+ Tambah Minggu</Button>
          </div>
        </Card>

        {/* Penilaian */}
        <Card title="Komponen Penilaian & Bobot" right={<Badge>Total {totalBobotPenilaian}%</Badge>}>
          <div className="grid grid-cols-12 gap-2 items-end">
            <div className="col-span-5 sm:col-span-4"><Label>Komponen</Label></div>
            <div className="col-span-3 sm:col-span-2"><Label>Bobot %</Label></div>
            <div className="col-span-4 sm:col-span-5"><Label>Kriteria/Rubrik Singkat</Label></div>
            <div className="col-span-0 sm:col-span-1"></div>
          </div>
          <div className="space-y-2">
            {rps.penilaian.map((p, i) => (
              <div key={i} className="grid grid-cols-12 gap-2">
                <div className="col-span-5 sm:col-span-4">
                  <Input value={p.komponen} onChange={(e) => updatePenilaian(i, "komponen", e.target.value)} />
                </div>
                <div className="col-span-3 sm:col-span-2">
                  <Input type="number" value={p.bobot} onChange={(e) => updatePenilaian(i, "bobot", Number(e.target.value))} />
                </div>
                <div className="col-span-4 sm:col-span-5">
                  <Input value={p.kriteria} onChange={(e) => updatePenilaian(i, "kriteria", e.target.value)} />
                </div>
                <div className="col-span-12 sm:col-span-1 flex items-center">
                  <Button variant="ghost" onClick={() => removePenilaian(i)}>✕</Button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-3">
            <Button onClick={addPenilaian}>+ Tambah Komponen</Button>
            {totalBobotPenilaian !== 100 && (
              <span className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-1">⚠️ Total bobot ideal 100%.</span>
            )}
          </div>
        </Card>

        {/* Pemetaan CPL ↔ CPMK */}
        <Card title="Matriks Pemetaan CPL ↔ CPMK (isi L/M/H atau skala 1–3)">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-left border-b">CPL \ CPMK</th>
                  {rps.cpmk.map((c, j) => (
                    <th key={j} className="px-3 py-2 text-left border-b">{c.kode}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rps.cpl.map((cpl, i) => (
                  <tr key={i} className="odd:bg-white even:bg-gray-50">
                    <td className="px-3 py-2 align-top min-w-[220px]"><div className="font-medium">CPL{i + 1}</div><div className="text-gray-600 text-xs">{cpl}</div></td>
                    {rps.cpmk.map((c, j) => (
                      <td key={j} className="px-3 py-2 align-top min-w-[90px]">
                        <Input value={pemetaan[`${i}_${j}`] || ""} onChange={(e) => setPemetaan((prev) => ({ ...prev, [`${i}_${j}`]: e.target.value }))} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Referensi */}
        <Card title="Referensi">
          <div className="space-y-3">
            {rps.referensi.map((r, i) => (
              <div key={i} className="grid grid-cols-12 gap-2">
                <div className="col-span-12 sm:col-span-2">
                  <Label>Jenis</Label>
                  <select
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
                    value={r.jenis}
                    onChange={(e) => updateReferensi(i, "jenis", e.target.value)}
                  >
                    <option>Utama</option>
                    <option>Tambahan</option>
                  </select>
                </div>
                <div className="col-span-12 sm:col-span-9">
                  <Label>Sitasi</Label>
                  <Input value={r.sitasi} onChange={(e) => updateReferensi(i, "sitasi", e.target.value)} />
                </div>
                <div className="col-span-12 sm:col-span-1 flex items-end">
                  <Button variant="ghost" onClick={() => removeReferensi(i)}>✕</Button>
                </div>
              </div>
            ))}
            <Button onClick={addReferensi}>+ Tambah Referensi</Button>
          </div>
        </Card>

        {/* Kebijakan Kelas */}
        <Card title="Kebijakan Kelas">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label>Kehadiran</Label>
              <Textarea value={rps.kebijakan.kehadiran} onChange={(e) => updateKebijakan("kehadiran", e.target.value)} />
            </div>
            <div>
              <Label>Keterlambatan</Label>
              <Textarea value={rps.kebijakan.keterlambatan} onChange={(e) => updateKebijakan("keterlambatan", e.target.value)} />
            </div>
            <div>
              <Label>Plagiarisme</Label>
              <Textarea value={rps.kebijakan.plagiarisme} onChange={(e) => updateKebijakan("plagiarisme", e.target.value)} />
            </div>
          </div>
        </Card>

        {/* Validasi Ringkas */}
        <Card title="Validasi Cepat" right={<Badge>Quality Check</Badge>}>
          <ul className="list-disc pl-5 text-sm space-y-1">
            <li className={rps.meta.mataKuliah ? "text-gray-700" : "text-red-700"}>Nama MK terisi.</li>
            <li className={totalBobotPenilaian === 100 ? "text-gray-700" : "text-amber-700"}>Total bobot penilaian = 100%.</li>
            <li className={rps.materiMingguan.length >= 14 ? "text-gray-700" : "text-amber-700"}>Pertemuan minimal 14 minggu.</li>
          </ul>
        </Card>

        {/* Footer actions */}
        <div className="flex flex-wrap items-center gap-2 justify-end">
          <Button onClick={exportJSON}>Simpan sebagai JSON</Button>
          <Button variant="outline" onClick={handlePrint}>Cetak / PDF</Button>
        </div>

        {/* JSON Drawer */}
        {showJSON && (
          <pre className="whitespace-pre-wrap text-xs bg-gray-900 text-gray-100 p-4 rounded-2xl overflow-auto border border-gray-800">
            {JSON.stringify(rps, null, 2)}
          </pre>
        )}
      </main>

      {/* Print styles */}
      <style>{`
        @media print {
          header, button, input[type=file] { display: none !important; }
          .print\\:space-y-3 > * + * { margin-top: 0.75rem; }
          section { break-inside: avoid; box-shadow: none !important; border-color: #e5e7eb; }
          body { background: white; }
        }
      `}</style>
    </div>
  );
}
