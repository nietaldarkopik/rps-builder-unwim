import { useState } from "react";

export default function MK() {
  const [tab, setTab] = useState("mk");

  const mataKuliah = [
    { kode: "C1E1101", nama: "Kalkulus", sks: 2 },
    { kode: "C1E1103", nama: "Geologi Lingkungan", sks: 3 },
  ];

  const prodi = [
    { kode: "TI", nama: "Teknik Informatika" },
    { kode: "SI", nama: "Sistem Informasi" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Master Data</h1>

      {/* Tabs */}
      <div className="flex space-x-2 border-b mb-4">
        <button
          onClick={() => setTab("mk")}
          className={`px-4 py-2 rounded-t-lg ${
            tab === "mk" ? "bg-blue-600 text-white" : "bg-gray-100"
          }`}
        >
          Mata Kuliah
        </button>
        <button
          onClick={() => setTab("prodi")}
          className={`px-4 py-2 rounded-t-lg ${
            tab === "prodi" ? "bg-blue-600 text-white" : "bg-gray-100"
          }`}
        >
          Program Studi
        </button>
        <button
          onClick={() => setTab("lain")}
          className={`px-4 py-2 rounded-t-lg ${
            tab === "lain" ? "bg-blue-600 text-white" : "bg-gray-100"
          }`}
        >
          Data Lainnya
        </button>
      </div>

      {/* Tab Content */}
      {tab === "mk" && (
        <div className="bg-white shadow-md rounded-lg p-4">
          <div className="flex justify-between mb-4">
            <input
              type="text"
              placeholder="Cari Mata Kuliah..."
              className="border rounded px-3 py-2 w-64"
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              + Tambah MK
            </button>
          </div>

          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-3 py-2">Kode</th>
                <th className="border px-3 py-2">Nama</th>
                <th className="border px-3 py-2">SKS</th>
                <th className="border px-3 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {mataKuliah.map((mk, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="border px-3 py-2">{mk.kode}</td>
                  <td className="border px-3 py-2">{mk.nama}</td>
                  <td className="border px-3 py-2">{mk.sks}</td>
                  <td className="border px-3 py-2">
                    <button className="border px-2 py-1 rounded hover:bg-gray-100">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "prodi" && (
        <div className="bg-white shadow-md rounded-lg p-4">
          <div className="flex justify-between mb-4">
            <input
              type="text"
              placeholder="Cari Prodi..."
              className="border rounded px-3 py-2 w-64"
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              + Tambah Prodi
            </button>
          </div>

          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-3 py-2">Kode</th>
                <th className="border px-3 py-2">Nama</th>
                <th className="border px-3 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {prodi.map((p, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="border px-3 py-2">{p.kode}</td>
                  <td className="border px-3 py-2">{p.nama}</td>
                  <td className="border px-3 py-2">
                    <button className="border px-2 py-1 rounded hover:bg-gray-100">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "lain" && (
        <div className="bg-white shadow-md rounded-lg p-4">
          <p className="text-gray-600">
            Data master lain (misalnya: dosen, ruang kuliah, dsb) bisa
            ditambahkan di sini.
          </p>
        </div>
      )}
    </div>
  );
}
