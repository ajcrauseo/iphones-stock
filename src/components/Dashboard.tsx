'use client';

import { useState } from 'react';
import { deleteIphone } from '@/lib/iphoneActions';
import IphoneForm from './IphoneForm';
import { Edit2, Trash2, Smartphone, Battery, CreditCard, Tag, Search, Filter, X, Palette } from 'lucide-react';
import { IPHONE_MODELS, IPHONE_CAPACITIES, ALL_IPHONE_COLORS, COLOR_MAP } from '@/lib/constants';

import { Branch, Iphone } from '@/lib/types';

interface DashboardProps {
  branches: Branch[];
  initialIphones: Iphone[];
  role: 'admin' | 'viewer';
}

export default function Dashboard({ branches, initialIphones, role }: DashboardProps) {
  const [activeBranchId, setActiveBranchId] = useState(branches[0]?.id);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingIphone, setEditingIphone] = useState<Iphone | null>(null);

  // Filter and Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [modelFilter, setModelFilter] = useState('');
  const [capacityFilter, setCapacityFilter] = useState('');
  const [colorFilter, setColorFilter] = useState('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [batteryFilter, setBatteryFilter] = useState('');
  const [discountFilter, setDiscountFilter] = useState('');

  const searchTerms = searchQuery.toLowerCase().trim().split(/\s+/).filter(t => t !== '');

  const filteredIphones = initialIphones.filter((i) => {
    const matchesBranch = i.branchId === activeBranchId;
    
    const matchesSearch = searchQuery === '' || searchTerms.every(term => 
      i.model.toLowerCase().includes(term) || 
      i.capacity.toLowerCase().includes(term) ||
      (i.color?.toLowerCase().includes(term) ?? false) ||
      (i.observations?.toLowerCase().includes(term) ?? false)
    );

    const matchesModel = modelFilter === '' || i.model === modelFilter;
    const matchesCapacity = capacityFilter === '' || i.capacity === capacityFilter;
    const matchesColor = colorFilter === '' || i.color === colorFilter;
    const matchesPrice = maxPrice === '' || i.price <= parseFloat(maxPrice);
    const matchesBattery = batteryFilter === '' || i.batteryStatus === batteryFilter;
    const matchesDiscount = discountFilter === '' || i.discountType === discountFilter;

    return matchesBranch && matchesSearch && matchesModel && matchesCapacity && matchesColor && matchesPrice && matchesBattery && matchesDiscount;
  }).sort((a, b) => {
    // Sort by model generation (descending: newest first)
    // We use the index in IPHONE_MODELS as a reference
    const indexA = IPHONE_MODELS.indexOf(a.model);
    const indexB = IPHONE_MODELS.indexOf(b.model);
    
    if (indexA !== indexB) {
      return indexB - indexA; // Higher index in constant = newer model
    }
    
    // Secondary sort: capacity (descending)
    return b.capacity.localeCompare(a.capacity);
  });

  const getBranchResultCount = (branchId: number) => {
    return initialIphones.filter((i) => {
      const matchesSearch = searchQuery === '' || searchTerms.every(term => 
        i.model.toLowerCase().includes(term) || 
        i.capacity.toLowerCase().includes(term) ||
        (i.color?.toLowerCase().includes(term) ?? false) ||
        (i.observations?.toLowerCase().includes(term) ?? false)
      );
      
      const matchesModel = modelFilter === '' || i.model === modelFilter;
      const matchesCapacity = capacityFilter === '' || i.capacity === capacityFilter;
      const matchesColor = colorFilter === '' || i.color === colorFilter;
      const matchesPrice = maxPrice === '' || i.price <= parseFloat(maxPrice);
      const matchesBattery = batteryFilter === '' || i.batteryStatus === batteryFilter;
      const matchesDiscount = discountFilter === '' || i.discountType === discountFilter;

      return i.branchId === branchId && matchesSearch && matchesModel && matchesCapacity && matchesColor && matchesPrice && matchesBattery && matchesDiscount;
    }).length;
  };

  const clearFilters = () => {
    setSearchQuery('');
    setModelFilter('');
    setCapacityFilter('');
    setColorFilter('');
    setMaxPrice('');
    setBatteryFilter('');
    setDiscountFilter('');
  };

  const hasActiveFilters = searchQuery !== '' || modelFilter !== '' || capacityFilter !== '' || colorFilter !== '' || maxPrice !== '' || batteryFilter !== '' || discountFilter !== '';

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const activeBranch = branches.find(b => b.id === activeBranchId);

  return (
    <div className="p-4 md:p-8 space-y-6 bg-transparent transition-colors duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Stock iPhones</h1>
          <p className="text-gray-500 dark:text-gray-400">Gestión de inventario profesional</p>
        </div>
        {role === 'admin' && (
          <button
            onClick={() => {
              setEditingIphone(null);
              setIsFormOpen(true);
            }}
            className="w-full md:w-auto px-6 py-2.5 bg-green-600 dark:bg-green-500 text-white font-bold rounded-xl shadow-lg shadow-green-500/20 hover:bg-green-700 dark:hover:bg-green-600 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Smartphone className="w-5 h-5" />
            + Agregar iPhone
          </button>
        )}
      </div>

      {/* Stock Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-gray-900 dark:bg-white p-3 rounded-xl shadow-lg text-white dark:text-gray-900 flex flex-col justify-between min-h-[70px] border border-gray-800 dark:border-gray-200 transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-bold opacity-50 dark:opacity-40 uppercase tracking-widest">Stock Total</span>
            <Smartphone className="w-3.5 h-3.5 opacity-30 dark:opacity-20" />
          </div>
          <div className="text-2xl font-black leading-none">{initialIphones.length}</div>
        </div>
        {branches.map((branch) => {
          const count = initialIphones.filter(i => i.branchId === branch.id).length;
          return (
            <div key={branch.id} className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between min-h-[70px] transition-all">
              <div className="flex justify-between items-start">
                <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest truncate mr-2" title={branch.name}>
                  {branch.name}
                </span>
                <Tag className="w-3 h-3 text-gray-200 dark:text-gray-600" />
              </div>
              <div className="text-2xl font-black text-gray-800 dark:text-gray-100 leading-none">{count}</div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 bg-gray-100 dark:bg-gray-900 p-1 rounded-xl border border-gray-200 dark:border-gray-800">
        {branches.map((branch) => {
          const isSelected = activeBranchId === branch.id;
          const count = getBranchResultCount(branch.id);
          
          return (
            <button
              key={branch.id}
              onClick={() => setActiveBranchId(branch.id)}
              className={`flex-1 min-w-[120px] md:min-w-[140px] px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition-all flex flex-col items-center gap-0.5 relative ${
                isSelected
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg scale-[1.02] z-10'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              {hasActiveFilters && (
                <span className={`absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] md:min-w-[20px] h-[18px] md:h-[20px] px-1 text-[9px] md:text-[10px] font-black rounded-full border-2 ${
                  count > 0 
                    ? isSelected 
                      ? 'bg-green-500 text-white border-gray-900 dark:border-white' 
                      : 'bg-green-600 text-white border-white dark:border-gray-900'
                    : 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-white dark:border-gray-900'
                }`}>
                  {count}
                </span>
              )}
              <div className="flex items-center gap-2">
                <span>{branch.name}</span>
              </div>
              <span className={`text-[8px] md:text-[9px] uppercase font-black tracking-widest ${isSelected ? 'opacity-60' : 'opacity-40'}`}>
                BOX: {branch.code}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3 pt-2">
        <div className="h-8 w-1.5 bg-gray-900 dark:bg-white rounded-full"></div>
        <div>
          <h2 className="text-lg md:text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
            Viendo: {activeBranch?.name}
            <span className="text-[9px] md:text-[10px] bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-md font-black">
              BOX {activeBranch?.code}
            </span>
          </h2>
          <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 font-medium">
            Mostrando {filteredIphones.length} de {initialIphones.filter(i => i.branchId === activeBranchId).length} equipos en esta sucursal
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4 transition-all">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full space-y-1.5">
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase flex items-center gap-1.5">
              <Search className="w-3 h-3" />
              Buscador
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por modelo, capacidad u observaciones..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all shadow-sm"
              />
            </div>
          </div>
          
          <div className="w-full md:w-auto flex gap-2">
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="w-full md:w-auto flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors bg-gray-100 dark:bg-gray-800 rounded-lg border border-transparent hover:border-gray-300 dark:hover:border-gray-600"
              >
                <X className="w-4 h-4" />
                Limpiar
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase flex items-center gap-1.5">
              <Filter className="w-3 h-3" />
              Modelo
            </label>
            <select
              value={modelFilter}
              onChange={(e) => setModelFilter(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-xs md:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white transition-all appearance-none shadow-sm cursor-pointer"
            >
              <option value="">Todos los modelos</option>
              {IPHONE_MODELS.map((model) => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase flex items-center gap-1.5">
              <Palette className="w-3 h-3" />
              Color
            </label>
            <select
              value={colorFilter}
              onChange={(e) => setColorFilter(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-xs md:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white transition-all appearance-none shadow-sm cursor-pointer"
            >
              <option value="">Cualquiera</option>
              {ALL_IPHONE_COLORS.map((color) => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase flex items-center gap-1.5">
              <Filter className="w-3 h-3" />
              Capacidad
            </label>
            <select
              value={capacityFilter}
              onChange={(e) => setCapacityFilter(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-xs md:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white transition-all appearance-none shadow-sm cursor-pointer"
            >
              <option value="">Todas</option>
              {IPHONE_CAPACITIES.map((cap) => (
                <option key={cap} value={cap}>{cap}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase flex items-center gap-1.5">
              <Battery className="w-3 h-3" />
              Batería
            </label>
            <select
              value={batteryFilter}
              onChange={(e) => setBatteryFilter(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-xs md:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white transition-all appearance-none shadow-sm cursor-pointer"
            >
              <option value="">Cualquier estado</option>
              <option value="Original">Original</option>
              <option value="Nueva 100%">Nueva 100%</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase flex items-center gap-1.5">
              <Tag className="w-3 h-3" />
              Descuento
            </label>
            <select
              value={discountFilter}
              onChange={(e) => setDiscountFilter(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-xs md:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white transition-all appearance-none shadow-sm cursor-pointer"
            >
              <option value="">Cualquiera</option>
              <option value="OFF1">OFF1 (-20k)</option>
              <option value="OFF2">OFF2 (-40k)</option>
              <option value="N/A">Sin descuento</option>
            </select>
          </div>

          <div className="space-y-1.5 col-span-2 lg:col-span-1">
            <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase flex items-center gap-1.5">
              <CreditCard className="w-3 h-3" />
              Precio Máximo
            </label>
            <input
              type="number"
              placeholder="Ej: 800000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-xs md:text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm transition-all">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
              <th className="px-4 py-3 font-semibold text-[11px] uppercase tracking-wider">Modelo</th>
              <th className="px-4 py-3 font-semibold text-center text-[11px] uppercase tracking-wider">Color</th>
              <th className="px-4 py-3 font-semibold text-[11px] uppercase tracking-wider">Capacidad</th>
              <th className="px-4 py-3 font-semibold text-[11px] uppercase tracking-wider">IMEI</th>
              <th className="px-4 py-3 font-semibold text-[11px] uppercase tracking-wider">Batería</th>
              <th className="px-4 py-3 font-semibold text-[11px] uppercase tracking-wider">Precios</th>
              <th className="px-4 py-3 font-semibold text-[11px] uppercase tracking-wider">Descuentos</th>
              <th className="px-4 py-3 font-semibold text-center text-[11px] uppercase tracking-wider">Cuotas</th>
              <th className="px-4 py-3 font-semibold text-[11px] uppercase tracking-wider">Obs.</th>
              {role === 'admin' && <th className="px-4 py-3 font-semibold text-center text-[11px] uppercase tracking-wider">Acciones</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {filteredIphones.length > 0 ? (
              filteredIphones.map((iphone) => {
                const price = iphone.price;
                const contado = price * 0.85;
                const cuotas3 = price / 3;
                const cuotas6 = price / 6;
                const discountLabel = iphone.discountType !== 'N/A' ? iphone.discountType : 'N/A';

                return (
                  <tr key={iphone.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-gray-400 dark:text-gray-600" />
                        <div className="font-bold text-gray-900 dark:text-white">{iphone.model}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center whitespace-nowrap">
                      {iphone.color ? (() => {
                        const style = COLOR_MAP[iphone.color] || { bg: '#f3f4f6', text: '#374151' };
                        return (
                          <span 
                            className="px-2 py-1 rounded-md text-[10px] font-bold border uppercase tracking-wider shadow-sm"
                            style={{ 
                              backgroundColor: style.bg, 
                              color: style.text,
                              borderColor: style.border || 'transparent'
                            }}
                          >
                            {iphone.color}
                          </span>
                        );
                      })() : (
                        <span className="text-gray-300 dark:text-gray-700 italic text-xs">-</span>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-gray-500 dark:text-gray-400 font-mono font-medium">{iphone.capacity}</div>
                    </td>
                    <td className="px-4 py-4 font-mono text-xs text-gray-600 dark:text-gray-500 whitespace-nowrap">
                      {iphone.imei || '-'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {iphone.batteryStatus === 'Original' ? (
                          <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md border ${
                            (iphone.batteryPercentage ?? 0) >= 90 
                              ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900 text-green-700 dark:text-green-400' 
                              : (iphone.batteryPercentage ?? 0) >= 80 
                                ? 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900 text-yellow-700 dark:text-yellow-400' 
                                : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900 text-red-700 dark:text-red-400'
                          }`}>
                            <Battery className="w-3.5 h-3.5" />
                            <span className="font-bold text-xs">{iphone.batteryPercentage}%</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md border bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-400">
                            <Battery className="w-3.5 h-3.5" />
                            <span className="font-bold text-[10px] uppercase tracking-tighter">Nueva 100%</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="space-y-0.5">
                        <div className="text-sm font-black text-gray-900 dark:text-white">{formatCurrency(price)}</div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-green-600 dark:text-green-500">{formatCurrency(contado)}</span>
                          <span className="text-[8px] font-black bg-green-50 dark:bg-green-950/30 px-1 rounded border border-green-100 dark:border-green-900 text-green-700 dark:text-green-500">CONTADO</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        {discountLabel === 'N/A' ? (
                          <div className="text-[10px] font-bold px-2 py-0.5 rounded-full inline-block bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600">N/A</div>
                        ) : (
                          <div className={`text-[9px] font-black px-1.5 py-0.5 rounded-md inline-block uppercase tracking-wider border shadow-sm ${
                            discountLabel === 'OFF1' 
                              ? 'bg-blue-600 dark:bg-blue-500 text-white border-blue-700 dark:border-blue-400' 
                              : 'bg-indigo-700 dark:bg-indigo-600 text-white border-indigo-800 dark:border-indigo-500'
                          }`}>
                            {discountLabel}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="space-y-1 flex flex-col items-center">
                        <div className="text-xs font-bold text-gray-700 dark:text-gray-300">{formatCurrency(cuotas3)} <span className="text-[8px] text-gray-400">(3x)</span></div>
                        <div className="text-xs font-bold text-gray-700 dark:text-gray-300">{formatCurrency(cuotas6)} <span className="text-[8px] text-gray-400">(6x)</span></div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-gray-500 dark:text-gray-400 italic text-[10px] max-w-[100px] truncate" title={iphone.observations ?? undefined}>
                        {iphone.observations || '-'}
                      </p>
                    </td>
                    {role === 'admin' && (
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex justify-center gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => { setEditingIphone(iphone); setIsFormOpen(true); }}
                            className="p-1.5 text-gray-400 dark:text-gray-600 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-all"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={async () => { if (confirm('¿Eliminar este iPhone?')) await deleteIphone(iphone.id); }}
                            className="p-1.5 text-gray-400 dark:text-gray-600 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={role === 'admin' ? 10 : 9} className="px-4 py-12 text-center text-gray-400 dark:text-gray-600 italic">
                  {hasActiveFilters ? 'No hay resultados que coincidan.' : 'No hay stock.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isFormOpen && (
        <IphoneForm
          branches={branches}
          iphone={editingIphone}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
}
