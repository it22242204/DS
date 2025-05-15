import React, { useState } from "react";
import ResturentSidebar from "../../components/Layout/ResturentSidebar";
import { useNavigate } from "react-router-dom";

interface CustomizationOption {
  name: string;
  options: { name: string; price: number }[];
  required: boolean;
}

const spiceLevels = ["Mild", "Medium", "Hot", "Extra Hot"];

const AddMenuItem: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 0,
    image: "",
    category: "",
    isAvailable: true,
    preparationTime: 15,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    spiceLevel: "Medium",
    tags: [] as string[],
    customizationOptions: [] as CustomizationOption[],
  });

  // Add customization option
  const addCustomization = () => {
    setForm({
      ...form,
      customizationOptions: [
        ...form.customizationOptions,
        { name: "", options: [{ name: "", price: 0 }], required: false },
      ],
    });
  };

  // Update customization option
  const updateCustomization = (idx: number, field: string, value: any) => {
    const updated = [...form.customizationOptions];
    (updated as any)[idx][field] = value;
    setForm({ ...form, customizationOptions: updated });
  };

  // Update option inside customization
  const updateOption = (custIdx: number, optIdx: number, field: string, value: any) => {
    const updated = [...form.customizationOptions];
    (updated as any)[custIdx].options[optIdx][field] = value;
    setForm({ ...form, customizationOptions: updated });
  };

  // Add option to customization
  const addOption = (custIdx: number) => {
    const updated = [...form.customizationOptions];
    (updated as any)[custIdx].options.push({ name: "", price: 0 });
    setForm({ ...form, customizationOptions: updated });
  };

  // Remove customization option
  const removeCustomization = (idx: number) => {
    const updated = [...form.customizationOptions];
    updated.splice(idx, 1);
    setForm({ ...form, customizationOptions: updated });
  };

  // Remove option inside customization
  const removeOption = (custIdx: number, optIdx: number) => {
    const updated = [...form.customizationOptions];
    (updated as any)[custIdx].options.splice(optIdx, 1);
    setForm({ ...form, customizationOptions: updated });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, tags: e.target.value.split(",").map((t) => t.trim()) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would POST to your backend API
    alert("Menu item added (mock)!");
    navigate("/resturent/menu");
  };

  return (
    <div className="flex h-[85vh] bg-softWhite dark:bg-gray-900 text-deepCharcoal dark:text-white">
      <ResturentSidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Add Menu Item</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required className="w-full p-2 border rounded" />
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" required className="w-full p-2 border rounded" />
            <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="Price" required className="w-full p-2 border rounded" />
            <input name="image" value={form.image} onChange={handleChange} placeholder="Image URL" className="w-full p-2 border rounded" />
            <input name="category" value={form.category} onChange={handleChange} placeholder="Category" required className="w-full p-2 border rounded" />
            <input name="preparationTime" type="number" value={form.preparationTime} onChange={handleChange} placeholder="Preparation Time (min)" className="w-full p-2 border rounded" />
            <div className="flex gap-4">
              <label>
                <input type="checkbox" name="isAvailable" checked={form.isAvailable} onChange={handleChange} /> Available
              </label>
              <label>
                <input type="checkbox" name="isVegetarian" checked={form.isVegetarian} onChange={handleChange} /> Vegetarian
              </label>
              <label>
                <input type="checkbox" name="isVegan" checked={form.isVegan} onChange={handleChange} /> Vegan
              </label>
              <label>
                <input type="checkbox" name="isGlutenFree" checked={form.isGlutenFree} onChange={handleChange} /> Gluten Free
              </label>
            </div>
            <div>
              <label>Spice Level: </label>
              <select name="spiceLevel" value={form.spiceLevel} onChange={handleChange}>
                {spiceLevels.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
            <input name="tags" value={form.tags.join(", ")} onChange={handleTagsChange} placeholder="Tags (comma separated)" className="w-full p-2 border rounded" />
            <hr />
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">Customization Options</span>
                <button type="button" className="text-blue-600 hover:underline" onClick={addCustomization}>Add Customization</button>
              </div>
              {form.customizationOptions.map((cust, idx) => (
                <div key={idx} className="border p-2 rounded mb-2 bg-gray-50 dark:bg-gray-700">
                  <input
                    value={cust.name}
                    onChange={e => updateCustomization(idx, "name", e.target.value)}
                    placeholder="Customization Name (e.g. Size)"
                    className="w-full p-1 border rounded mb-2"
                  />
                  <div className="flex gap-2 items-center mb-2">
                    <label>
                      <input
                        type="checkbox"
                        checked={cust.required}
                        onChange={e => updateCustomization(idx, "required", (e.target as HTMLInputElement).checked)}
                      /> Required
                    </label>
                    <button type="button" className="text-red-600 hover:underline ml-auto" onClick={() => removeCustomization(idx)}>Remove</button>
                  </div>
                  <div>
                    <span className="text-sm">Options:</span>
                    {cust.options.map((opt, optIdx) => (
                      <div key={optIdx} className="flex gap-2 mb-1">
                        <input
                          value={opt.name}
                          onChange={e => updateOption(idx, optIdx, "name", e.target.value)}
                          placeholder="Option Name (e.g. Large)"
                          className="p-1 border rounded"
                        />
                        <input
                          type="number"
                          value={opt.price}
                          onChange={e => updateOption(idx, optIdx, "price", parseFloat(e.target.value))}
                          placeholder="Price"
                          className="p-1 border rounded w-24"
                        />
                        <button type="button" className="text-red-600 hover:underline" onClick={() => removeOption(idx, optIdx)}>Remove</button>
                      </div>
                    ))}
                    <button type="button" className="text-blue-600 hover:underline" onClick={() => addOption(idx)}>Add Option</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-4 justify-end">
              <button type="button" className="px-4 py-2 rounded bg-gray-300" onClick={() => navigate("/resturent/menu")}>Cancel</button>
              <button type="submit" className="px-4 py-2 rounded bg-[#FF6B00] text-white">Add Item</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddMenuItem;
