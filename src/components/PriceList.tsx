'use client';

import { useState } from 'react';
import { createCatalogPrice, deleteCatalogPrice } from '@/lib/priceActions';
import { Plus, Trash2, Edit2, Check, X, ChevronDown, ChevronRight, Loader2 } from 'lucide-react';
import { CatalogPrice } from '@prisma/client';
import { IPHONE_MODELS, IPHONE_CAPACITIES, IPHONE_COLORS_BY_MODEL } from '@/lib/constants';

export default function PriceList({ initialPrices }: { initialPrices: CatalogPrice[] }) {
  const [prices, setPrices] = useState(initialPrices);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedSeries, setExpandedSeries] = useState<Record<string, boolean>>({});

  const toggleSeries = (series: string) => {
    setExpandedSeries(prev => ({ ...prev, [series]: !prev[series] }));
  };

  // Form states
  const [model, setModel] = useState('');
  const [capacity, setCapacity] = useState('');
  const [color, setColor] = useState('');
  const [price, setPrice] = useState('');
  const [updateStock, setUpdateStock] = useState(true);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const startEdit = (p: CatalogPrice) => {
    setEditingId(p.id);
    setModel(p.model);
    setCapacity(p.capacity);
    setColor(p.color || '');
    setPrice(p.price.toString());
    setUpdateStock(true); // Default to updating stock when editing
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    resetForm();
  };

  const resetForm = () => {
    setModel('');
    setCapacity('');
    setColor('');
    setPrice('');
    setUpdateStock(true);
  };

  const handleSubmit = async () => {
    if (!model || !capacity || !price) return;
    
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('model', model);
      formData.append('capacity', capacity);
      formData.append('color', color);
      formData.append('price', price);
      formData.append('updateStock', updateStock.toString());

      await createCatalogPrice(formData);
      
      // Refresh page to get new data
      window.location.reload();
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
      alert('Hubo un error al guardar. Inténtalo de nuevo.');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este precio base?')) {
      await deleteCatalogPrice(id);
      setPrices(prices.filter(p => p.id !== id));
    }
  };

  // Group by Model + Capacity
  const groupedPrices: Record<string, CatalogPrice[]> = {};
  
  // First, populate all combinations as stubs
  IPHONE_MODELS.forEach(m => {
    IPHONE_CAPACITIES.forEach(c => {
      const key = `${m} - ${c}`;
      groupedPrices[key] = [{
        id: Math.floor(Math.random() * -1000000), // Synthetic negative ID
        model: m,
        capacity: c,
        color: '',
        price: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }];
    });
  });

  // Then override with actual prices
  prices.forEach(p => {
    const key = `${p.model} - ${p.capacity}`;
    if (!groupedPrices[key] || (groupedPrices[key].length === 1 && groupedPrices[key][0].id < 0)) {
      groupedPrices[key] = [];
    }
    groupedPrices[key].push(p);
  });

  // Group by Series -> Model + Capacity
  const groupedBySeries: Record<string, Record<string, CatalogPrice[]>> = {};

  Object.entries(groupedPrices).forEach(([groupKey, groupPrices]) => {
    // Extract series number, e.g., "iPhone 13 Pro Max - 128GB" -> "13"
    const seriesMatch = groupKey.match(/iPhone (\d+)/);
    const series = seriesMatch ? `Serie ${seriesMatch[1]}` : 'Otros Modelos';

    if (!groupedBySeries[series]) {
      groupedBySeries[series] = {};
    }
    groupedBySeries[series][groupKey] = groupPrices;
  });

  // Sort series names (Serie 12, Serie 13, ..., Otros)
  const sortedSeries = Object.keys(groupedBySeries).sort((a, b) => {
    if (a === 'Otros Modelos') return 1;
    if (b === 'Otros Modelos') return -1;
    // Extract the number to sort numerically instead of alphabetically
    const numA = parseInt(a.replace(/\D/g, '')) || 0;
    const numB = parseInt(b.replace(/\D/g, '')) || 0;
    return numA - numB;
  });

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50 dark:bg-gray-900/50">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Lista de Precios Base</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Configura el precio base por modelo y capacidad.</p>
        </div>
        {!isAdding && !editingId && (
          <button 
            onClick={() => setIsAdding(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black px-4 py-2.5 rounded-lg font-medium text-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
          >
            <Plus className="w-4 h-4" /> Nuevo Precio
          </button>
        )}
      </div>

      <div className="p-4 md:p-6">
        {(isAdding || editingId) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
              <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Edit2 className="w-5 h-5 text-blue-600" />
                  {isAdding ? 'Agregar Nuevo Precio Base' : 'Editar Precio Base'}
                </h3>
                <button onClick={cancelEdit} className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors bg-white dark:bg-gray-800 rounded-full shadow-sm hover:bg-red-50 dark:hover:bg-red-950/30">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Modelo *</label>
                    <input 
                      type="text" 
                      value={model} onChange={e => setModel(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="ej. iPhone 13"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Capacidad *</label>
                    <input 
                      type="text" 
                      value={capacity} onChange={e => setCapacity(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="ej. 128GB"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Color (Opcional)</label>
                    <select 
                      value={color} onChange={e => setColor(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none"
                    >
                      <option value="">Todos los colores</option>
                      {(IPHONE_COLORS_BY_MODEL[model] || []).map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Precio ($) *</label>
                    <input 
                      type="number" 
                      value={price} onChange={e => setPrice(e.target.value)}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-900 border-2 border-blue-500 rounded-xl font-bold text-gray-900 dark:text-white focus:ring-4 focus:ring-blue-500/20 outline-none transition-all text-lg"
                      placeholder="ej. 500"
                    />
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                  <input 
                    type="checkbox" 
                    id="updateStock" 
                    checked={updateStock}
                    onChange={(e) => setUpdateStock(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded text-blue-600 focus:ring-blue-500 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 cursor-pointer"
                  />
                  <label htmlFor="updateStock" className="text-sm text-blue-900 dark:text-blue-300 cursor-pointer select-none">
                    <strong className="block mb-1">Actualizar stock existente</strong>
                    Si activas esto, se le cambiará el precio a todos los equipos en tu inventario que coincidan con estas características.
                  </label>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 flex justify-end gap-3">
                <button 
                  onClick={cancelEdit}
                  className="px-6 py-2.5 rounded-xl font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={!model || !capacity || !price || isSubmitting}
                  className="flex items-center gap-2 bg-blue-600 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> 
                      {updateStock ? 'Actualizando stock...' : 'Guardando...'}
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" /> Guardar
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {sortedSeries.map(seriesName => (
            <div key={seriesName} className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden bg-white dark:bg-gray-900 shadow-sm">
              <button 
                onClick={() => toggleSeries(seriesName)}
                className="w-full flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm">
                    {seriesName.replace(/\D/g, '') || '?'}
                  </div>
                  <span className="font-bold text-lg text-gray-900 dark:text-white">{seriesName}</span>
                </div>
                {expandedSeries[seriesName] ? (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-500" />
                )}
              </button>
              
              {expandedSeries[seriesName] && (
                <div className="p-4 space-y-4 bg-white dark:bg-gray-900/50">
                  {Object.entries(groupedBySeries[seriesName]).map(([groupKey, groupPrices]) => (
                    <div key={groupKey} className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
                      <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-3 font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-800">
                        {groupKey}
                      </div>
                      <div className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900">
                        {groupPrices.map(p => (
                          <div key={p.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors gap-3 sm:gap-4">
                            <div className="flex items-center w-full sm:w-auto">
                              <span className={`text-sm font-medium px-2.5 py-1 rounded-md ${p.color ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'}`}>
                                {p.color || 'Todos los colores'}
                              </span>
                            </div>
                            <div className="flex items-center justify-between w-full sm:w-auto sm:justify-end gap-4 sm:gap-6 border-t sm:border-t-0 border-gray-100 dark:border-gray-800 pt-3 sm:pt-0">
                              {p.id < 0 ? (
                                <span className="font-bold text-lg text-gray-400 dark:text-gray-600 italic">Sin precio</span>
                              ) : (
                                <span className="font-bold text-lg text-gray-900 dark:text-white">{formatCurrency(p.price)}</span>
                              )}
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => startEdit({ ...p, price: p.price || '' } as any)}
                                  className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 bg-gray-100 dark:bg-gray-800 rounded-lg transition-colors"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                {p.id >= 0 && (
                                  <button 
                                    onClick={() => handleDelete(p.id)}
                                    className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400 bg-gray-100 dark:bg-gray-800 rounded-lg transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
