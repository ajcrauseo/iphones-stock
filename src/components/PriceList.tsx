'use client';

import { useState } from 'react';
import { createCatalogPrice, deleteCatalogPrice } from '@/lib/priceActions';
import { Plus, Trash2, Edit2, Check, X, ChevronDown, ChevronRight, Loader2 } from 'lucide-react';
import { CatalogPrice } from '@prisma/client';
import { IPHONE_MODELS, IPHONE_CAPACITIES, IPHONE_COLORS_BY_MODEL, IPHONE_CAPACITIES_BY_MODEL } from '@/lib/constants';

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
    const capacities = IPHONE_CAPACITIES_BY_MODEL[m] || IPHONE_CAPACITIES;
    capacities.forEach(c => {
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

  const glassPanel = "bg-white/60 dark:bg-white/[0.06] backdrop-blur-2xl border border-white/40 dark:border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.4)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.05)]";
  const glassInput = "w-full px-4 py-3 bg-white/50 dark:bg-white/[0.06] backdrop-blur-xl border border-white/40 dark:border-white/[0.08] rounded-2xl text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/40 dark:focus:ring-blue-400/30 focus:border-blue-300/50 dark:focus:border-blue-400/20 outline-none transition-all duration-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] [&>option]:text-gray-900 [&>option]:bg-white dark:[&>option]:text-white dark:[&>option]:bg-gray-900";

  return (
    <>
    <div className={`rounded-[2rem] ${glassPanel} overflow-hidden transition-all duration-500`}>
      <div className="p-5 md:p-8 border-b border-white/20 dark:border-white/[0.06] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/30 dark:bg-white/[0.02]">
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Lista de Precios Base</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">Configura el precio base por modelo y capacidad.</p>
        </div>
        {!isAdding && !editingId && (
          <button 
            onClick={() => setIsAdding(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-500/80 dark:bg-blue-500/60 backdrop-blur-xl text-white px-5 py-2.5 rounded-2xl font-bold hover:bg-blue-600/90 dark:hover:bg-blue-500/70 transition-all duration-300 shadow-lg shadow-blue-500/20 active:scale-95 border border-blue-400/30 dark:border-blue-400/20"
          >
            <Plus className="w-4 h-4" /> Nuevo Precio
          </button>
        )}
      </div>

      <div className="p-4 md:p-8">


        <div className="space-y-4">
          {sortedSeries.map(seriesName => (
            <div key={seriesName} className="rounded-[1.5rem] border border-white/40 dark:border-white/[0.08] bg-white/40 dark:bg-white/[0.04] backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] overflow-hidden transition-all duration-300">
              <button 
                onClick={() => toggleSeries(seriesName)}
                className="w-full flex justify-between items-center p-5 hover:bg-white/50 dark:hover:bg-white/[0.06] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-black border border-blue-500/20 shadow-sm">
                    {seriesName.replace(/\D/g, '') || '?'}
                  </div>
                  <span className="font-bold text-lg text-gray-900 dark:text-white tracking-tight">{seriesName}</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/50 dark:bg-white/10 flex items-center justify-center border border-white/40 dark:border-white/[0.05]">
                  {expandedSeries[seriesName] ? (
                    <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  )}
                </div>
              </button>
              
              {expandedSeries[seriesName] && (
                <div className="p-4 space-y-4 bg-white/20 dark:bg-black/10 border-t border-white/20 dark:border-white/[0.05]">
                  {Object.entries(groupedBySeries[seriesName]).map(([groupKey, groupPrices]) => (
                    <div key={groupKey} className="rounded-2xl border border-white/40 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.04] backdrop-blur-md overflow-hidden shadow-sm">
                      <div className="px-5 py-3 font-bold text-sm text-gray-800 dark:text-gray-200 border-b border-white/30 dark:border-white/[0.05] bg-white/40 dark:bg-white/[0.02]">
                        {groupKey}
                      </div>
                      <div className="divide-y divide-white/20 dark:divide-white/[0.04]">
                        {groupPrices.map(p => (
                          <div key={p.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-5 hover:bg-white/40 dark:hover:bg-white/[0.04] transition-colors gap-3 sm:gap-4 group">
                            <div className="flex items-center w-full sm:w-auto">
                              <span className={`text-xs font-bold px-3 py-1.5 rounded-lg border backdrop-blur-sm ${p.color ? 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20' : 'bg-gray-500/10 text-gray-700 dark:text-gray-300 border-gray-500/20'}`}>
                                {p.color || 'Todos los colores'}
                              </span>
                            </div>
                            <div className="flex items-center justify-between w-full sm:w-auto sm:justify-end gap-4 sm:gap-6 pt-3 sm:pt-0">
                              {p.id < 0 ? (
                                <span className="font-black text-lg text-gray-400 dark:text-gray-500 italic">Sin precio</span>
                              ) : (
                                <span className="font-black text-lg text-gray-900 dark:text-white">{formatCurrency(p.price)}</span>
                              )}
                              <div className="flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
                                <button 
                                  onClick={() => startEdit({ ...p, price: p.price || '' } as any)}
                                  className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-xl transition-all border border-transparent hover:border-blue-500/20"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                {p.id >= 0 && (
                                  <button 
                                    onClick={() => handleDelete(p.id)}
                                    className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20"
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
    
    {/* Modal for adding/editing price moved outside to fix stacking context issues */}
        {(isAdding || editingId) && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-xl transition-all duration-500">
            <div className="bg-white/70 dark:bg-white/[0.08] backdrop-blur-2xl rounded-[2rem] shadow-[0_24px_80px_rgba(0,0,0,0.15)] dark:shadow-[0_24px_80px_rgba(0,0,0,0.4)] border border-white/50 dark:border-white/[0.1] w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-300">
              <div className="p-6 border-b border-white/20 dark:border-white/[0.06] flex justify-between items-center bg-white/30 dark:bg-white/[0.02]">
                <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/10 dark:bg-blue-500/20 rounded-xl flex items-center justify-center border border-blue-500/20 backdrop-blur-sm">
                    <Edit2 className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                  </div>
                  {isAdding ? 'Agregar Nuevo Precio Base' : 'Editar Precio Base'}
                </h3>
                <button onClick={cancelEdit} className="p-2.5 text-gray-500 hover:text-red-500 transition-colors bg-white/50 dark:bg-white/[0.06] backdrop-blur-xl border border-white/40 dark:border-white/[0.08] rounded-xl hover:bg-red-500/10 dark:hover:bg-red-500/20 hover:border-red-500/30">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">Modelo *</label>
                    <input 
                      type="text" 
                      value={model} onChange={e => setModel(e.target.value)}
                      className={glassInput}
                      placeholder="ej. iPhone 13"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">Capacidad *</label>
                    <input 
                      type="text" 
                      value={capacity} onChange={e => setCapacity(e.target.value)}
                      className={glassInput}
                      placeholder="ej. 128GB"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">Color (Opcional)</label>
                    <select 
                      value={color} onChange={e => setColor(e.target.value)}
                      className={`${glassInput} appearance-none cursor-pointer`}
                    >
                      <option value="">Todos los colores</option>
                      {(IPHONE_COLORS_BY_MODEL[model] || []).map(c => (
                         <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">Precio ($) *</label>
                    <input 
                      type="number" 
                      value={price} onChange={e => setPrice(e.target.value)}
                      className={`${glassInput} font-black text-lg border-blue-400/50 dark:border-blue-500/40 ring-1 ring-blue-500/20`}
                      placeholder="ej. 500"
                    />
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-5 bg-blue-500/5 dark:bg-blue-500/10 rounded-2xl border border-blue-500/20 backdrop-blur-sm">
                  <div className="relative flex items-start">
                    <input 
                      type="checkbox" 
                      id="updateStock" 
                      checked={updateStock}
                      onChange={(e) => setUpdateStock(e.target.checked)}
                      className="peer mt-1 w-5 h-5 appearance-none rounded-lg border-2 border-blue-500/30 bg-white/50 dark:bg-white/10 checked:bg-blue-500 checked:border-blue-500 transition-all cursor-pointer"
                    />
                    <Check className="absolute top-[5px] left-[3px] w-3.5 h-3.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                  <label htmlFor="updateStock" className="text-sm text-blue-900 dark:text-blue-300 cursor-pointer select-none">
                    <strong className="block mb-1 font-bold">Actualizar stock existente</strong>
                    <span className="opacity-80">Si activas esto, se le cambiará el precio a todos los equipos en tu inventario que coincidan con estas características.</span>
                  </label>
                </div>
              </div>

              <div className="p-6 border-t border-white/20 dark:border-white/[0.06] bg-white/30 dark:bg-white/[0.02] flex justify-end gap-3">
                <button 
                  onClick={cancelEdit}
                  className="px-6 py-3 rounded-2xl font-bold text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-white/[0.08] transition-all duration-300 border border-white/40 dark:border-white/[0.06]"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={!model || !capacity || !price || isSubmitting}
                  className="flex items-center gap-2 bg-blue-500/90 dark:bg-blue-500/80 backdrop-blur-xl text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-600 transition-all duration-300 shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed border border-blue-400/40"
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
    </>
  );
}
