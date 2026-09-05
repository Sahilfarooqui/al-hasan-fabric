'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatINR } from '@/lib/utils';
import type { ProductDTO } from '@/types';

const empty = {
  name: '', description: '', price: '', compareAtPrice: '', images: '', category: 'Sarees',
  fabricType: 'Silk', sizes: 'S,M,L', colors: 'Emerald,Gold', stock: '10', featured: false, published: true,
};

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [msg, setMsg] = useState('');

  const load = () =>
    fetch('/api/admin/products').then(async (r) => {
      if (r.status === 401) { router.push('/admin/login'); return; }
      const d = await r.json();
      setProducts(d.products || []);
    });

  useEffect(() => { load(); }, [router]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : null,
      images: form.images.split('\n').map((s) => s.trim()).filter(Boolean),
      category: form.category,
      fabricType: form.fabricType,
      sizes: form.sizes.split(',').map((s) => s.trim()).filter(Boolean),
      colors: form.colors.split(',').map((s) => s.trim()).filter(Boolean),
      stock: Number(form.stock),
      featured: form.featured,
      published: form.published,
    };
    const url = editing ? `/api/admin/products/${editing}` : '/api/admin/products';
    const res = await fetch(url, {
      method: editing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) { setMsg('Save failed'); return; }
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
      images: p.images.join('\n'),
      category: p.category,
      fabricType: p.fabricType,
      sizes: p.sizes.join(','),
      colors: p.colors.join(','),
      stock: String(p.stock),
      featured: p.featured,
      published: p.published,
    });
  };

  const remove = async (id: string) => {
    if (!confirm('Delete product?')) return;
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
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
        <textarea className="input-field md:col-span-2" rows={3} placeholder="Image URLs (one per line)" value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Published</label>
        <div className="md:col-span-2 flex gap-2">
          <button type="submit" className="btn-primary">{editing ? 'Update' : 'Create'} product</button>
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
