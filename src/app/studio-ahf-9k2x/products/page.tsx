'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatINR } from '@/lib/utils';
import type { ProductDTO } from '@/types';
import { ADMIN_BASE, adminFetch } from '@/lib/admin-fetch';
import { compressImageFile } from '@/lib/compress-image';
import SafeImage from '@/components/ui/SafeImage';

const empty = {
  name: '', description: '', price: '', compareAtPrice: '', images: [] as string[], category: 'Sarees',
  fabricType: 'Silk', sizes: 'S,M,L', colors: 'Emerald,Gold', stock: '10', featured: false, published: true,
  videoUrl: '',
  imageUrlDraft: '',
};

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [msg, setMsg] = useState('');
  const [uploading, setUploading] = useState(false);
  const galleryRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const load = () =>
    adminFetch('/api/admin/products').then(async (r) => {
      if (r.status === 401) { router.push(`${ADMIN_BASE}/login`); return; }
      const d = await r.json();
      setProducts(d.products || []);
    });

  useEffect(() => { load(); }, [router]);

  const onFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    if (form.images.length >= 8) {
      setMsg('Max 8 images per product');
      return;
    }
    setUploading(true);
    setMsg('Compressing…');
    try {
      const remaining = 8 - form.images.length;
      const selected = Array.from(files).slice(0, remaining);
      const compressed = [];
      for (const f of selected) {
        compressed.push(await compressImageFile(f));
      }
      setMsg('Uploading…');
      const res = await adminFetch('/api/admin/uploads', {
        method: 'POST',
        body: JSON.stringify({ images: compressed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setForm((prev) => ({ ...prev, images: [...prev.images, ...data.urls].slice(0, 8) }));
      setMsg(`Added ${data.urls.length} image(s)`);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (galleryRef.current) galleryRef.current.value = '';
      if (cameraRef.current) cameraRef.current.value = '';
    }
  };

  const addUrl = () => {
    const u = form.imageUrlDraft.trim();
    if (!u) return;
    if (!/^https?:\/\//i.test(u) && !u.startsWith('/')) {
      setMsg('URL must start with https:// or /');
      return;
    }
    if (form.images.length >= 8) {
      setMsg('Max 8 images');
      return;
    }
    setForm({ ...form, images: [...form.images, u], imageUrlDraft: '' });
  };

  const removeImage = (idx: number) => {
    setForm({ ...form, images: form.images.filter((_, i) => i !== idx) });
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : null,
      images: form.images,
      category: form.category,
      fabricType: form.fabricType,
      sizes: form.sizes.split(',').map((s) => s.trim()).filter(Boolean),
      colors: form.colors.split(',').map((s) => s.trim()).filter(Boolean),
      stock: Number(form.stock),
      featured: form.featured,
      published: form.published,
      videoUrl: form.videoUrl.trim() || null,
    };
    const url = editing ? `/api/admin/products/${editing}` : '/api/admin/products';
    const res = await adminFetch(url, {
      method: editing ? 'PUT' : 'POST',
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setMsg(d.error || 'Save failed');
      return;
    }
    setMsg(editing ? 'Updated' : 'Created');
    setForm(empty);
    setEditing(null);
    load();
  };

  const edit = (p: ProductDTO) => {
    setEditing(p.id);
    setForm({
      name: p.name,
      description: p.description,
      price: String(p.price),
      compareAtPrice: p.compareAtPrice != null ? String(p.compareAtPrice) : '',
      images: p.images,
      category: p.category,
      fabricType: p.fabricType,
      sizes: p.sizes.join(','),
      colors: p.colors.join(','),
      stock: String(p.stock),
      featured: p.featured,
      published: p.published,
      videoUrl: p.videoUrl || '',
      imageUrlDraft: '',
    });
  };

  const remove = async (id: string) => {
    if (!confirm('Delete product?')) return;
    await adminFetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Products</h1>
      <form onSubmit={onSubmit} className="card mt-6 grid gap-3 p-5 md:grid-cols-2">
        <input className="input-field" placeholder="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="input-field" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        <input className="input-field" placeholder="Fabric type" value={form.fabricType} onChange={(e) => setForm({ ...form, fabricType: e.target.value })} />
        <input className="input-field" placeholder="Price" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        <input className="input-field" placeholder="Compare at price" value={form.compareAtPrice} onChange={(e) => setForm({ ...form, compareAtPrice: e.target.value })} />
        <input className="input-field" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
        <input className="input-field" placeholder="Sizes (comma)" value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} />
        <input className="input-field" placeholder="Colors (comma)" value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })} />
        <textarea className="input-field md:col-span-2" rows={2} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

        <div className="md:col-span-2 space-y-3 rounded-xl border border-emerald/10 bg-cream p-4">
          <p className="text-sm font-semibold">Product photos <span className="font-normal text-emerald-deep/50">(up to 8 · JPEG/PNG/WebP preferred)</span></p>
          <div className="flex flex-wrap gap-2">
            <button type="button" disabled={uploading} className="btn-outline py-2 text-xs" onClick={() => galleryRef.current?.click()}>
              {uploading ? 'Working…' : 'Upload from gallery'}
            </button>
            <button type="button" disabled={uploading} className="btn-outline py-2 text-xs" onClick={() => cameraRef.current?.click()}>
              Take photo
            </button>
            <input
              ref={galleryRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => onFiles(e.target.files)}
            />
            <input
              ref={cameraRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => onFiles(e.target.files)}
            />
          </div>
          <div className="flex gap-2">
            <input
              className="input-field"
              placeholder="Or paste image URL (https://…)"
              value={form.imageUrlDraft}
              onChange={(e) => setForm({ ...form, imageUrlDraft: e.target.value })}
            />
            <button type="button" className="btn-outline shrink-0 px-4 py-2 text-xs" onClick={addUrl}>Add URL</button>
          </div>
          {form.images.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {form.images.map((img, i) => (
                <div key={`${i}-${img.slice(0, 32)}`} className="relative h-20 w-20 overflow-hidden rounded-lg border border-emerald/10">
                  <SafeImage src={img} alt="" fill className="object-cover" sizes="80px" />
                  <button type="button" onClick={() => removeImage(i)} className="absolute right-0.5 top-0.5 rounded bg-red-600 px-1 text-[10px] text-white">×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-emerald-deep/80">Instagram reel / video URL <span className="font-normal text-emerald-deep/50">(optional)</span></label>
          <input
            className="input-field"
            type="url"
            placeholder="https://www.instagram.com/reel/…"
            value={form.videoUrl}
            onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
          />
          <p className="mt-1 text-xs text-emerald-deep/50">Must be an https Instagram link. Leave blank to show the store Instagram CTA instead.</p>
        </div>

        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Published</label>
        <div className="md:col-span-2 flex gap-2">
          <button type="submit" className="btn-primary" disabled={uploading}>{editing ? 'Update' : 'Create'} product</button>
          {editing && <button type="button" className="btn-outline" onClick={() => { setEditing(null); setForm(empty); }}>Cancel</button>}
        </div>
        {msg && <p className="text-sm text-emerald md:col-span-2">{msg}</p>}
      </form>
      <div className="mt-8 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead><tr className="border-b border-emerald/10 text-xs uppercase text-gold"><th className="py-2">Name</th><th>Price</th><th>Stock</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-emerald/5">
                <td className="py-3 font-medium">{p.name}</td>
                <td>{formatINR(p.price)}</td>
                <td>{p.stock}</td>
                <td>{p.published ? 'Live' : 'Draft'}{p.featured ? ' · Featured' : ''}</td>
                <td className="space-x-2 text-right">
                  <button onClick={() => edit(p)} className="text-emerald">Edit</button>
                  <button onClick={() => remove(p.id)} className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
