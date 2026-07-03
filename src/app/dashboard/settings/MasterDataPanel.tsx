"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

type OptionType = "skills" | "interests";

interface OptionItem {
  id: string;
  name: string;
  category: string;
  is_active: boolean;
}

export default function MasterDataPanel() {
  const [activeTab, setActiveTab] = useState<OptionType>("skills");
  const [items, setItems] = useState<OptionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const supabase = createClient();

  const fetchItems = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from(activeTab)
      .select("*")
      .order("name");
    
    if (error) {
      alert("Gagal memuat data opsi");
    } else {
      setItems(data as OptionItem[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchItems();
    // Reset forms when switching tabs
    setNewItemName("");
    setNewItemCategory("");
    setEditingId(null);
    setCurrentPage(1);
  }, [activeTab]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName || !newItemCategory) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/settings/options", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: activeTab, name: newItemName, category: newItemCategory }),
      });
      if (!res.ok) throw new Error("Gagal menambah opsi");
      setNewItemName("");
      setNewItemCategory("");
      fetchItems();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (id: string) => {
    if (!editName.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/settings/options", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: activeTab, id, name: editName }),
      });
      if (!res.ok) throw new Error("Gagal mengupdate opsi");
      setEditingId(null);
      fetchItems();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menonaktifkan opsi ini? (Data di mahasiswa lama tidak akan terhapus)")) return;
    
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/settings/options", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: activeTab, id }),
      });
      if (!res.ok) throw new Error("Gagal menonaktifkan opsi");
      fetchItems();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = activeTab === "skills" 
    ? [{ val: "hard_skill", label: "Hard Skill" }, { val: "soft_skill", label: "Soft Skill" }]
    : [{ val: "akademik", label: "Akademik" }, { val: "non_akademik", label: "Non Akademik" }];

  const totalPages = Math.max(1, Math.ceil(items.length / ITEMS_PER_PAGE));
  const currentData = items.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm mt-6 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">Manajemen Opsi Formulir</h3>
        <p className="text-sm text-gray-500 mt-1">
          Kelola master data untuk opsi dropdown Keterampilan dan Minat di form pendataan mahasiswa.
        </p>
      </div>

      <div className="border-b border-gray-200 flex">
        <button
          onClick={() => setActiveTab("skills")}
          className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "skills" ? "border-yellow-400 text-yellow-600 bg-yellow-50/50" : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          }`}
        >
          Daftar Keterampilan (Skills)
        </button>
        <button
          onClick={() => setActiveTab("interests")}
          className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "interests" ? "border-yellow-400 text-yellow-600 bg-yellow-50/50" : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          }`}
        >
          Daftar Minat (Interests)
        </button>
      </div>

      <div className="p-6 bg-gray-50/30">
        {/* Form Tambah */}
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3 mb-6 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder={`Nama ${activeTab === 'skills' ? 'Skill' : 'Minat'} Baru...`}
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 text-sm"
            required
            disabled={isSubmitting}
          />
          <select
            value={newItemCategory}
            onChange={(e) => setNewItemCategory(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 text-sm sm:w-48"
            required
            disabled={isSubmitting}
          >
            <option value="" disabled>Pilih Kategori</option>
            {categories.map(c => (
              <option key={c.val} value={c.val}>{c.label}</option>
            ))}
          </select>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-yellow-900 bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50"
          >
            Tambah
          </button>
        </form>

        {/* Tabel Data */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Opsi
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-sm text-gray-500">
                    <div className="flex justify-center items-center">
                      <svg className="animate-spin h-5 w-5 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Memuat data...
                    </div>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                    Belum ada data opsi untuk kategori ini.
                  </td>
                </tr>
              ) : (
                currentData.map((item) => (
                  <tr key={item.id} className={item.is_active ? "" : "bg-gray-50"}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {editingId === item.id ? (
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 text-sm py-1"
                        />
                      ) : (
                        <span className={item.is_active ? "font-medium" : "text-gray-400 line-through"}>{item.name}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        {item.category.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {item.is_active ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                          Nonaktif
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {editingId === item.id ? (
                        <div className="flex justify-end gap-2">
                          <button onClick={() => setEditingId(null)} className="text-gray-500 hover:text-gray-700">Batal</button>
                          <button onClick={() => handleEdit(item.id)} disabled={isSubmitting} className="text-yellow-600 hover:text-yellow-900">Simpan</button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => { setEditingId(item.id); setEditName(item.name); }}
                            className="text-yellow-600 hover:text-yellow-900 transition-colors"
                          >
                            Edit
                          </button>
                          {item.is_active && (
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              Hapus
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {items.length > 0 && (
          <div className="mt-4 flex items-center justify-between bg-white px-4 py-3 border border-gray-200 rounded-lg shadow-sm">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Sebelumnya
            </button>
            <span className="text-sm text-gray-600">
              Halaman <span className="font-semibold text-gray-900">{currentPage}</span> dari <span className="font-semibold text-gray-900">{totalPages}</span>
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Selanjutnya
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
