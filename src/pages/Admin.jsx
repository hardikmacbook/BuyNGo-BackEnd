import React, { useEffect, useMemo, useState } from "react";

const API_BASE = "http://localhost:3000";

// Helper function: Convert file to base64 string
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new window.FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

// Empty product data structure
const emptyProduct = {
  product_id: "",
  name: "",
  description: "",
  short_description: "",
  category: "",
  subcategory: "",
  brand: "",
  sku: "",
  price: "",
  special_price: "",
  currency: "INR",
  stock_quantity: "",
  stock_status: "in_stock",
  weight: "",
  color: "",
  size: "",
  images: [
    { url: "", alt: "" },
    { url: "", alt: "" },
    { url: "", alt: "" }
  ]
};

// Product editor with upload + scrollable
function ProductEditor({ product, onChange }) {
  const [local, setLocal] = useState(product);

  useEffect(() => { setLocal(product); }, [product]);

  const setField = (k, v) => {
    setLocal(l => ({ ...l, [k]: v }));
    onChange({ ...local, [k]: v });
  };

  const updateImg = (idx, field, value) => {
    const imgs = [...(local.images || [])];
    imgs[idx][field] = value;
    setLocal(l => ({ ...l, images: imgs }));
    onChange({ ...local, images: imgs });
  };

  const uploadImg = async (idx, file) => {
    if (!file) return;
    const base64 = await fileToBase64(file);
    updateImg(idx, 'url', base64);
  };

  return (
    <div style={{ maxHeight: "66vh", overflowY: "auto", paddingRight: 8 }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="text" className="border p-2 rounded" placeholder="Name" value={local.name} onChange={e => setField("name", e.target.value)} />
        <input type="text" className="border p-2 rounded" placeholder="Brand" value={local.brand} onChange={e => setField("brand", e.target.value)} />
        <input type="text" className="border p-2 rounded" placeholder="SKU" value={local.sku} onChange={e => setField("sku", e.target.value)} />
        <input type="text" className="border p-2 rounded" placeholder="Category" value={local.category} onChange={e => setField("category", e.target.value)} />

        <textarea className="border p-2 rounded col-span-2" placeholder="Description" value={local.description} onChange={e => setField("description", e.target.value)} />
        <textarea className="border p-2 rounded col-span-2" placeholder="Short Description" value={local.short_description} onChange={e => setField("short_description", e.target.value)} />

        <input className="border p-2 rounded" type="number" placeholder="Price" value={local.price} onChange={e => setField("price", e.target.value)} />
        <input className="border p-2 rounded" type="number" placeholder="Special Price" value={local.special_price} onChange={e => setField("special_price", e.target.value)} />
        <input className="border p-2 rounded" type="number" placeholder="Stock Quantity" value={local.stock_quantity} onChange={e => setField("stock_quantity", e.target.value)} />
        <input type="text" className="border p-2 rounded" placeholder="Stock Status" value={local.stock_status} onChange={e => setField("stock_status", e.target.value)} />

        <input type="text" className="border p-2 rounded" placeholder="Weight" value={local.weight} onChange={e => setField("weight", e.target.value)} />
        <input type="text" className="border p-2 rounded" placeholder="Color" value={local.color} onChange={e => setField("color", e.target.value)} />
        <input type="text" className="border p-2 rounded" placeholder="Size" value={local.size} onChange={e => setField("size", e.target.value)} />
        <input type="text" className="border p-2 rounded" placeholder="Subcategory" value={local.subcategory} onChange={e => setField("subcategory", e.target.value)} />
      </div>
      <div className="my-4">
        <div className="font-bold text-sm mb-1">Images (2-3, upload or URL):</div>
        {local.images?.map((img, idx) => (
          <div key={idx} className="flex flex-col md:flex-row gap-2 mb-2">
            <input
              type="text"
              className="border p-2 rounded flex-1 min-w-0"
              placeholder={`Image ${idx + 1} URL or leave blank to upload`}
              value={img.url}
              onChange={e => updateImg(idx, 'url', e.target.value)}
              style={{ marginBottom: "4px" }}
            />
            <input
              type="text"
              className="border p-2 rounded flex-1 min-w-0"
              placeholder="Alt text"
              value={img.alt}
              onChange={e => updateImg(idx, 'alt', e.target.value)}
              style={{ marginBottom: "4px" }}
            />
            <input
              type="file"
              accept="image/*"
              onChange={e => uploadImg(idx, e.target.files[0])}
              className="rounded bg-gray-100 p-2 text-xs"
              style={{ marginBottom: "4px" }}
            />
            {img.url && img.url.startsWith("data:") &&
              <img src={img.url} alt={img.alt || ''} style={{ width: 36, height: 36, borderRadius: 4, marginLeft: 8 }} />
            }
          </div>
        ))}
      </div>
    </div>
  );
}

// Hero slider editor
function HeroSliderEditor({ data, onChange }) {
  const [local, setLocal] = useState(data);

  useEffect(() => { setLocal(data); }, [data]);

  const setVal = (k, v) => {
    setLocal(l => ({ ...l, [k]: v }));
    onChange({ ...local, [k]: v });
  };

  const uploadImg = async (field, file) => {
    if (!file) return;
    const base64 = await fileToBase64(file);
    setVal(field, base64);
  };

  return (
    <div style={{ maxHeight: "55vh", overflowY: "auto", paddingRight: 8 }}>
      <div className="flex flex-col gap-4">
        <input type="text" className="border p-2 rounded" placeholder="Type (image/video)" value={local.type} onChange={e => setVal("type", e.target.value)} />
        <input type="text" className="border p-2 rounded" placeholder="Image URL" value={local.url} onChange={e => setVal("url", e.target.value)} />
        <input type="file" accept="image/*"
          onChange={e => uploadImg('url', e.target.files[0])}
          className="rounded bg-gray-100 p-2 text-xs"
        />
        {local.url && local.url.startsWith("data:") &&
          <img src={local.url} alt="Preview" style={{ width: 60, height: 60, borderRadius: 5 }} />}
        <input type="text" className="border p-2 rounded" placeholder="Thumbnail URL" value={local.thumbnail} onChange={e => setVal("thumbnail", e.target.value)} />
        <input type="file" accept="image/*"
          onChange={e => uploadImg('thumbnail', e.target.files[0])}
          className="rounded bg-gray-100 p-2 text-xs"
        />
        {local.thumbnail && local.thumbnail.startsWith("data:") &&
          <img src={local.thumbnail} alt="Preview" style={{ width: 45, height: 45, borderRadius: 4 }} />}
      </div>
    </div>
  );
}


// Universal admin section
function AdminSection({ title, endpoint, sample }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editorOpenId, setEditorOpenId] = useState(null);
  const [editorText, setEditorText] = useState("");
  const [productDraft, setProductDraft] = useState(emptyProduct);
  const [sliderDraft, setSliderDraft] = useState(sample);

  const url = useMemo(() => `${API_BASE}/${endpoint}`, [endpoint]);
  const isProduct = endpoint === "products";
  const isHeroSlider = endpoint === "hero-slider";

  const load = async () => {
    try {
      setLoading(true); setError("");
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [url]);

  const openEditorFor = (item) => {
    setEditorOpenId(item ? item.id : "new");
    if (isProduct) {
      setProductDraft(item ? { ...emptyProduct, ...item } : emptyProduct);
    } else if (isHeroSlider) {
      setSliderDraft(item ? { ...sample, ...item } : sample);
    } else {
      setEditorText(JSON.stringify(item ? item : sample, null, 2));
    }
  };

  const closeEditor = () => {
    setEditorOpenId(null); setEditorText(""); setProductDraft(emptyProduct); setSliderDraft(sample);
  };

  const saveEditor = async () => {
    let payload;
    try {
      if (isProduct) {
        payload = productDraft;
        if (editorOpenId === "new" && payload.id !== undefined) { delete payload.id; }
        if (editorOpenId !== "new") { delete payload.id; }
      } else if (isHeroSlider) {
        payload = sliderDraft;
        if (editorOpenId === "new" && payload.id !== undefined) { delete payload.id; }
        if (editorOpenId !== "new") { delete payload.id; }
      }
      else {
        payload = JSON.parse(editorText);
        if (editorOpenId === "new" && payload.id !== undefined) { delete payload.id; }
        if (editorOpenId !== "new") { delete payload.id; }
      }
    } catch (e) {
      alert("Invalid data: " + e.message);
      return;
    }
    try {
      const isNew = editorOpenId === "new";
      const method = isNew ? "POST" : "PUT";
      const target = isNew ? url : `${url}/${editorOpenId}`;
      const res = await fetch(target, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errText = await res.text();
        let errMessage;
        try {
          const errJson = JSON.parse(errText);
          errMessage = errJson.error || errJson.details || errJson.message || `Request failed ${res.status}`;
        } catch {
          errMessage = `Request failed ${res.status}: ${errText.substring(0, 200)}`;
        }
        throw new Error(errMessage);
      }
      await load(); closeEditor();
    } catch (e) {
      alert("Save failed: " + e.message); console.error("Save error:", e);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      const res = await fetch(`${url}/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.text();
        let errMessage;
        try { const errJson = JSON.parse(err); errMessage = errJson.error || errJson.details || `Delete failed ${res.status}`; }
        catch { errMessage = `Delete failed ${res.status}: ${err.substring(0, 100)}`; }
        throw new Error(errMessage);
      }
      await load();
    } catch (e) {
      alert("Delete failed: " + e.message); console.error("Delete error:", e);
    }
  };

  return (
    <section className="bg-white border-2 border-gray-200 rounded-2xl p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-black">{title}</h2>
        <button onClick={() => openEditorFor(null)} className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
          Add New
        </button>
      </div>
      {loading && <p className="text-gray-600">Loading...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      <div className="divide-y divide-gray-100">
        {items.map((it) => (
          <div key={it.id || it.product_id} className="py-3 flex items-center justify-between">
            <div className="text-sm text-gray-800" style={{ paddingRight: 8 }}>
              <span className="font-medium">{it.title || it.name || it.type || "Untitled"}</span>
              <span className="text-gray-500 ml-2 text-xs">(id: {it.id || it.product_id})</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEditorFor(it)} className="px-3 py-1 border-2 border-gray-300 rounded-lg hover:border-gray-900 transition-colors">Edit</button>
              <button onClick={() => remove(it.id || it.product_id)}
                className="px-3 py-1 border-2 border-red-300 text-red-700 rounded-lg hover:border-red-600 transition-colors">Delete</button>
            </div>
          </div>
        ))}
        {items.length === 0 && !loading && (
          <p className="text-gray-500 py-4">No items yet.</p>
        )}
      </div>

      {editorOpenId !== null && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 overflow-auto">
          <div className="bg-white rounded-xl w-full max-w-3xl p-6 border-2 border-gray-200 shadow-xl" style={{ maxHeight: "90vh", overflow: "auto" }}>
            <h3 className="text-lg font-semibold mb-3">
              {editorOpenId === "new" ? "Add" : "Edit"} {title}
            </h3>
            {isProduct ? (
              <ProductEditor product={productDraft} onChange={setProductDraft} />
            ) : isHeroSlider ? (
              <HeroSliderEditor data={sliderDraft} onChange={setSliderDraft} />
            ) : (
              <textarea value={editorText} onChange={e => setEditorText(e.target.value)}
                className="w-full h-80 p-3 border-2 border-gray-200 rounded-lg font-mono text-sm focus:border-gray-400 focus:outline-none"
                spellCheck={false} />
            )}
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={closeEditor} className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-colors">Cancel</button>
              <button onClick={saveEditor} className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">Save</button>
            </div>
            <p className="mt-3 text-xs text-gray-500">
              {isProduct
                ? "Fill all the product fields. For images, you can paste a URL or upload an image from your computer. Maximum 3 images."
                : isHeroSlider
                  ? "Add/Change hero slider image by pasting a URL or by uploading. Thumbnail is optional."
                  : "Edit the JSON to match the schema for this section."}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

export default function Admin() {
  return (
    <div className="min-h-screen bg-gray-50 px-2 md:px-0">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-black mb-6">Admin Dashboard</h1>
        <AdminSection
          title="Hero Slider"
          endpoint="hero-slider"
          sample={{
            type: "image",
            url: "",
            thumbnail: ""
          }}
        />
        <AdminSection
          title="Core Values"
          endpoint="core-values"
          sample={{
            title: "Innovation",
            description: "We constantly push the boundaries of what's possible."
          }}
        />
        <AdminSection
          title="Products"
          endpoint="products"
          sample={emptyProduct}
        />
        <AdminSection
          title="Reviews"
          endpoint="review"
          sample={{
            name: "John Doe",
            date: "2024-10-02",
            review: "Great product! Highly recommended.",
            verified: true,
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
            rating: 5
          }}
        />
      </div>
    </div>
  );
}
