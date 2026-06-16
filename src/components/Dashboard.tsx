'use client';

import { useState } from 'react';
import Link from 'next/link';
import { deleteIphone } from '@/lib/iphoneActions';
import IphoneForm from './IphoneForm';
import { Edit2, Trash2, Smartphone, Battery, CreditCard, Tag, Search, Filter, X, Palette, AlertTriangle } from 'lucide-react';
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
  const [iphoneToDelete, setIphoneToDelete] = useState<Iphone | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  // Glass classes for reuse
  const glassPanel = "bg-white/60 dark:bg-white/[0.06] backdrop-blur-2xl border border-white/40 dark:border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.4)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.05)]";
  const glassInput = "bg-white/50 dark:bg-white/[0.06] backdrop-blur-xl border border-white/40 dark:border-white/[0.08] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:focus:ring-blue-400/30 focus:border-blue-300/50 dark:focus:border-blue-400/20 transition-all duration-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] [&>option]:text-gray-900 [&>option]:bg-white dark:[&>option]:text-white dark:[&>option]:bg-gray-900";
  const glassSelect = `${glassInput} appearance-none cursor-pointer`;

  return (
    <div className="p-4 md:p-8 space-y-6 transition-colors duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Stock iPhones</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Gestión de inventario profesional</p>
        </div>
        {role === 'admin' && (
          <div className="flex gap-2 w-full md:w-auto">
            <Link 
              href="/prices"
              className="w-full md:w-auto px-5 py-2.5 bg-blue-500/80 dark:bg-blue-500/60 backdrop-blur-xl text-white font-bold rounded-2xl shadow-lg shadow-blue-500/20 hover:bg-blue-600/90 dark:hover:bg-blue-500/70 transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 border border-blue-400/30 dark:border-blue-400/20 hover:shadow-xl hover:shadow-blue-500/30"
            >
              Lista de Precios
            </Link>
            <button
              onClick={() => {
                setEditingIphone(null);
                setIsFormOpen(true);
              }}
              className="w-full md:w-auto px-5 py-2.5 bg-emerald-500/80 dark:bg-emerald-500/60 backdrop-blur-xl text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-600/90 dark:hover:bg-emerald-500/70 transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 border border-emerald-400/30 dark:border-emerald-400/20 hover:shadow-xl hover:shadow-emerald-500/30"
            >
              <Smartphone className="w-5 h-5" />
              + Agregar iPhone
            </button>
          </div>
        )}
      </div>

      {/* Stock Summary Cards - Compact iOS Style */}
      <div className="flex flex-wrap items-center gap-2 md:gap-3">
        <div className={`px-4 py-2 rounded-xl flex items-center gap-3 transition-all duration-300 bg-gradient-to-br from-blue-500/80 to-indigo-600/80 dark:from-blue-600/50 dark:to-indigo-700/50 backdrop-blur-xl text-white border border-blue-400/30 dark:border-blue-500/20 shadow-md shadow-blue-500/20`}>
          <div className="flex items-center gap-1.5 opacity-80">
            <Smartphone className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Total</span>
          </div>
          <div className="text-xl font-black leading-none">{initialIphones.length}</div>
        </div>
        
        {branches.map((branch) => {
          const count = initialIphones.filter(i => i.branchId === branch.id).length;
          return (
            <div key={branch.id} className={`${glassPanel} px-3 py-2 rounded-xl flex items-center gap-2.5 transition-all duration-300`}>
              <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                <Tag className="w-3.5 h-3.5 opacity-70" />
                <span className="text-[10px] font-bold uppercase tracking-widest truncate max-w-[80px]" title={branch.name}>
                  {branch.name}
                </span>
              </div>
              <div className="text-lg font-black text-gray-800 dark:text-gray-200 leading-none">{count}</div>
            </div>
          );
        })}
      </div>

      {/* Segmented Control Tabs (iOS 26 Style) */}
      <div className="relative p-1.5 rounded-[1.5rem] bg-black/[0.03] dark:bg-white/[0.02] backdrop-blur-md border border-gray-200/50 dark:border-gray-700/30 flex flex-wrap sm:flex-nowrap shadow-inner">
        {branches.map((branch) => {
          const isSelected = activeBranchId === branch.id;
          const count = getBranchResultCount(branch.id);
          
          return (
            <button
              key={branch.id}
              onClick={() => setActiveBranchId(branch.id)}
              className={`flex-1 min-w-[120px] relative z-10 flex flex-col items-center justify-center py-2.5 md:py-3 px-2 rounded-[1.25rem] text-xs md:text-sm font-bold transition-all duration-300 ${
                isSelected
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-black/[0.02] dark:hover:bg-white/[0.02]'
              }`}
            >
              {isSelected && (
                <div className="absolute inset-0 -z-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-[1.25rem] shadow-[0_4px_12px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,1)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)] border border-gray-200/50 dark:border-gray-700/50" />
              )}
              
              <div className="flex items-center gap-2">
                <span>{branch.name}</span>
                {hasActiveFilters && (
                  <span className={`flex items-center justify-center px-1.5 py-0.5 min-w-[20px] text-[9px] font-black rounded-md ${
                    count > 0 
                      ? isSelected 
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300' 
                        : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                      : 'bg-gray-200/50 dark:bg-gray-600/50 text-gray-500 dark:text-gray-400'
                  }`}>
                    {count}
                  </span>
                )}
              </div>
              <span className={`text-[9px] uppercase font-bold tracking-widest mt-0.5 ${isSelected ? 'text-blue-400 dark:text-blue-300/60' : 'opacity-50'}`}>
                BOX: {branch.code}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3 pt-2">
        <div className="h-8 w-1.5 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full shadow-sm shadow-blue-500/30" />
        <div>
          <h2 className="text-lg md:text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
            Viendo: {activeBranch?.name}
            <span className="text-[9px] md:text-[10px] bg-white/50 dark:bg-white/[0.08] backdrop-blur-md text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-lg font-black border border-white/30 dark:border-white/[0.06]">
              BOX {activeBranch?.code}
            </span>
          </h2>
          <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 font-medium">
            Mostrando {filteredIphones.length} de {initialIphones.filter(i => i.branchId === activeBranchId).length} equipos en esta sucursal
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className={`${glassPanel} p-4 rounded-2xl space-y-4 transition-all duration-300`}>
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full space-y-1.5">
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase flex items-center gap-1.5">
              <Search className="w-3 h-3" />
              Buscador
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Buscar por modelo, capacidad u observaciones..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm ${glassInput}`}
              />
            </div>
          </div>
          
          <div className="w-full md:w-auto flex gap-2">
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="w-full md:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-300 bg-white/40 dark:bg-white/[0.06] backdrop-blur-xl rounded-xl border border-white/30 dark:border-white/[0.06] hover:bg-white/60 dark:hover:bg-white/[0.1]"
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
              className={`w-full px-3 py-2.5 rounded-xl text-xs md:text-sm ${glassSelect}`}
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
              className={`w-full px-3 py-2.5 rounded-xl text-xs md:text-sm ${glassSelect}`}
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
              className={`w-full px-3 py-2.5 rounded-xl text-xs md:text-sm ${glassSelect}`}
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
              className={`w-full px-3 py-2.5 rounded-xl text-xs md:text-sm ${glassSelect}`}
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
              className={`w-full px-3 py-2.5 rounded-xl text-xs md:text-sm ${glassSelect}`}
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
              className={`w-full px-3 py-2.5 rounded-xl text-xs md:text-sm ${glassInput}`}
            />
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className={`overflow-x-auto rounded-2xl ${glassPanel} transition-all duration-300`}>
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-white/20 dark:border-white/[0.06]">
              <th className="px-4 py-3 font-semibold text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400">Modelo</th>
              <th className="px-4 py-3 font-semibold text-center text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400">Color</th>
              <th className="px-4 py-3 font-semibold text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400">Capacidad</th>
              <th className="px-4 py-3 font-semibold text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400">IMEI</th>
              <th className="px-4 py-3 font-semibold text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400">Batería</th>
              <th className="px-4 py-3 font-semibold text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400">Precios</th>
              <th className="px-4 py-3 font-semibold text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400">Descuentos</th>
              <th className="px-4 py-3 font-semibold text-center text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400">Cuotas</th>
              <th className="px-4 py-3 font-semibold text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400">Obs.</th>
              {role === 'admin' && <th className="px-4 py-3 font-semibold text-center text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400">Acciones</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 dark:divide-white/[0.04]">
            {filteredIphones.length > 0 ? (
              filteredIphones.map((iphone) => {
                const price = iphone.price;
                const contado = price * 0.85;
                const cuotas3 = price / 3;
                const cuotas6 = price / 6;
                const discountLabel = iphone.discountType !== 'N/A' ? iphone.discountType : 'N/A';

                return (
                  <tr key={iphone.id} className="hover:bg-white/30 dark:hover:bg-white/[0.04] transition-colors duration-200 group">
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
                            className="px-2 py-1 rounded-lg text-[10px] font-bold border uppercase tracking-wider shadow-sm backdrop-blur-sm"
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
                    <td className="px-4 py-4 font-mono text-xs text-gray-500 dark:text-gray-500 whitespace-nowrap">
                      {iphone.imei || '-'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {iphone.batteryStatus === 'Original' ? (
                          <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border backdrop-blur-sm ${
                            (iphone.batteryPercentage ?? 0) >= 90 
                              ? 'bg-emerald-500/10 dark:bg-emerald-500/10 border-emerald-500/20 dark:border-emerald-500/15 text-emerald-700 dark:text-emerald-400' 
                              : (iphone.batteryPercentage ?? 0) >= 80 
                                ? 'bg-amber-500/10 dark:bg-amber-500/10 border-amber-500/20 dark:border-amber-500/15 text-amber-700 dark:text-amber-400' 
                                : 'bg-red-500/10 dark:bg-red-500/10 border-red-500/20 dark:border-red-500/15 text-red-700 dark:text-red-400'
                          }`}>
                            <Battery className="w-3.5 h-3.5" />
                            <span className="font-bold text-xs">{iphone.batteryPercentage}%</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg border backdrop-blur-sm bg-blue-500/10 dark:bg-blue-500/10 border-blue-500/20 dark:border-blue-500/15 text-blue-700 dark:text-blue-400">
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
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(contado)}</span>
                          <span className="text-[8px] font-black bg-emerald-500/10 px-1.5 rounded-md border border-emerald-500/20 text-emerald-700 dark:text-emerald-400">CONTADO</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        {discountLabel === 'N/A' ? (
                          <div className="text-[10px] font-bold px-2 py-0.5 rounded-full inline-block bg-white/30 dark:bg-white/[0.06] text-gray-400 dark:text-gray-600 border border-white/20 dark:border-white/[0.04]">N/A</div>
                        ) : (
                          <div className={`text-[9px] font-black px-1.5 py-0.5 rounded-lg inline-block uppercase tracking-wider border shadow-sm backdrop-blur-sm ${
                            discountLabel === 'OFF1' 
                              ? 'bg-blue-500/80 dark:bg-blue-500/60 text-white border-blue-400/30' 
                              : 'bg-indigo-600/80 dark:bg-indigo-500/60 text-white border-indigo-400/30'
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
                        <div className="flex justify-center gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={() => { setEditingIphone(iphone); setIsFormOpen(true); }}
                            className="p-1.5 text-gray-400 dark:text-gray-600 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all duration-200"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setIphoneToDelete(iphone)}
                            className="p-1.5 text-gray-400 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200"
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

      {/* Delete Confirmation Modal */}
      {iphoneToDelete && (
        <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-xl flex items-center justify-center p-4 z-[60]">
          <div className="bg-white/70 dark:bg-white/[0.08] backdrop-blur-2xl rounded-3xl shadow-[0_24px_80px_rgba(0,0,0,0.15)] dark:shadow-[0_24px_80px_rgba(0,0,0,0.4)] p-6 w-full max-w-sm border border-white/50 dark:border-white/[0.1]">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-red-500/10 dark:bg-red-500/15 rounded-full flex items-center justify-center border border-red-500/20 backdrop-blur-sm">
                <AlertTriangle className="w-8 h-8 text-red-500 dark:text-red-400" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
                  ¿Eliminar equipo?
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  Estás por eliminar el <span className="font-bold text-gray-900 dark:text-gray-200">{iphoneToDelete.model}</span> ({iphoneToDelete.capacity}). Esta acción no se puede deshacer.
                </p>
              </div>

              <div className="flex w-full gap-3 pt-2">
                <button
                  onClick={() => setIphoneToDelete(null)}
                  disabled={isDeleting}
                  className="flex-1 py-2.5 bg-white/50 dark:bg-white/[0.08] backdrop-blur-xl text-gray-800 dark:text-gray-200 font-bold rounded-2xl hover:bg-white/70 dark:hover:bg-white/[0.12] transition-all duration-300 active:scale-95 disabled:opacity-50 border border-white/40 dark:border-white/[0.06]"
                >
                  Cancelar
                </button>
                <button
                  onClick={async () => {
                    setIsDeleting(true);
                    await deleteIphone(iphoneToDelete.id);
                    setIsDeleting(false);
                    setIphoneToDelete(null);
                  }}
                  disabled={isDeleting}
                  className="flex-1 py-2.5 bg-red-500/80 dark:bg-red-500/60 backdrop-blur-xl text-white font-bold rounded-2xl hover:bg-red-600/90 dark:hover:bg-red-500/70 transition-all duration-300 shadow-lg shadow-red-500/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 border border-red-400/30"
                >
                  {isDeleting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : 'Eliminar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
