'use client';

import { useState } from 'react';
import { createIphone, updateIphone } from '@/lib/iphoneActions';
import { Edit2, Smartphone } from 'lucide-react';

import { Branch, Iphone } from '@/lib/types';

import { IPHONE_MODELS, IPHONE_CAPACITIES, IPHONE_COLORS_BY_MODEL, IPHONE_CAPACITIES_BY_MODEL } from '@/lib/constants';

interface IphoneFormProps {
  iphone?: Iphone | null;
  branches: Branch[];
  onClose: () => void;
}

export default function IphoneForm({ iphone, branches, onClose }: IphoneFormProps) {
  const [selectedModel, setSelectedModel] = useState(iphone?.model || IPHONE_MODELS[0]);
  const [batteryStatus, setBatteryStatus] = useState(iphone?.batteryStatus || 'Original');

  const availableColors = IPHONE_COLORS_BY_MODEL[selectedModel] || [];
  const availableCapacities = IPHONE_CAPACITIES_BY_MODEL[selectedModel] || IPHONE_CAPACITIES;

  const glassInput = "mt-1 block w-full bg-white/50 dark:bg-white/[0.06] backdrop-blur-xl border border-white/40 dark:border-white/[0.08] rounded-2xl p-2.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:focus:ring-blue-400/30 focus:border-blue-300/50 dark:focus:border-blue-400/20 transition-all duration-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] [&>option]:text-gray-900 [&>option]:bg-white dark:[&>option]:text-white dark:[&>option]:bg-gray-900";
  const glassSelect = `${glassInput} appearance-none cursor-pointer`;

  return (
    <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-xl flex items-center justify-center p-4 z-[70] transition-all duration-500">
      <div className="bg-white/70 dark:bg-white/[0.08] backdrop-blur-2xl rounded-[2rem] shadow-[0_24px_80px_rgba(0,0,0,0.15)] dark:shadow-[0_24px_80px_rgba(0,0,0,0.4)] p-6 w-full max-w-md border border-white/50 dark:border-white/[0.1] animate-in fade-in zoom-in-95 duration-300">
        <h2 className="text-2xl font-black mb-6 text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
          {iphone ? (
            <div className="w-10 h-10 bg-blue-500/10 dark:bg-blue-500/20 rounded-xl flex items-center justify-center border border-blue-500/20 backdrop-blur-sm">
              <Edit2 className="w-5 h-5 text-blue-500 dark:text-blue-400" />
            </div>
          ) : (
            <div className="w-10 h-10 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-xl flex items-center justify-center border border-emerald-500/20 backdrop-blur-sm">
              <Smartphone className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
            </div>
          )}
          {iphone ? 'Editar iPhone' : 'Nuevo iPhone'}
        </h2>
        
        <form
          action={async (formData) => {
            if (iphone) {
              await updateIphone(iphone.id, formData);
            } else {
              await createIphone(formData);
            }
            onClose();
          }}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">Sucursal</label>
            <select
              name="branchId"
              defaultValue={iphone?.branchId || branches[0]?.id}
              className={glassSelect}
            >
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">Modelo</label>
              <select
                name="model"
                required
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className={glassSelect}
              >
                {IPHONE_MODELS.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">Color</label>
              <select
                name="color"
                key={selectedModel}
                defaultValue={availableColors.includes(iphone?.color || '') ? iphone?.color || '' : ''}
                className={glassSelect}
              >
                <option value="">(Sin asignar)</option>
                {availableColors.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">Capacidad</label>
              <select
                key={selectedModel}
                name="capacity"
                required
                defaultValue={availableCapacities.includes(iphone?.capacity || '') ? iphone?.capacity || '' : availableCapacities[0]}
                className={glassSelect}
              >
                {availableCapacities.map((cap) => (
                  <option key={cap} value={cap}>
                    {cap}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">IMEI</label>
              <input
                type="text"
                name="imei"
                defaultValue={iphone?.imei || ''}
                placeholder="15 dígitos"
                className={`${glassInput} font-mono`}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">Batería Estado</label>
              <select
                name="batteryStatus"
                value={batteryStatus}
                onChange={(e) => setBatteryStatus(e.target.value)}
                className={glassSelect}
              >
                <option value="Original">Original</option>
                <option value="Nueva 100%">Nueva 100%</option>
              </select>
            </div>
            {batteryStatus === 'Original' && (
              <div className="space-y-1.5 animate-in fade-in slide-in-from-left-2 duration-200">
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">Porcentaje</label>
                <input
                  type="number"
                  name="batteryPercentage"
                  required
                  defaultValue={iphone?.batteryPercentage ?? undefined}
                  placeholder="%"
                  className={glassInput}
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">Precio Base</label>
              <input
                type="number"
                name="price"
                required
                step="0.01"
                defaultValue={iphone?.price}
                placeholder="0.00"
                className={`${glassInput} font-bold`}
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">Descuento</label>
              <select
                name="discountType"
                defaultValue={iphone?.discountType || 'N/A'}
                className={glassSelect}
              >
                <option value="N/A">N/A (Ninguno)</option>
                <option value="OFF1">OFF1 (-20.000)</option>
                <option value="OFF2">OFF2 (-40.000)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">Observaciones</label>
            <textarea
              name="observations"
              defaultValue={iphone?.observations ?? undefined}
              className={`${glassInput} resize-none`}
              rows={2}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-white/50 dark:bg-white/[0.08] backdrop-blur-xl text-gray-800 dark:text-gray-200 font-bold rounded-2xl hover:bg-white/70 dark:hover:bg-white/[0.12] transition-all duration-300 active:scale-95 border border-white/40 dark:border-white/[0.06]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-blue-500/80 dark:bg-blue-500/60 backdrop-blur-xl text-white font-bold rounded-2xl hover:bg-blue-600/90 dark:hover:bg-blue-500/70 transition-all duration-300 shadow-lg shadow-blue-500/20 active:scale-95 border border-blue-400/30 dark:border-blue-400/20"
            >
              {iphone ? 'Guardar Cambios' : 'Crear iPhone'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
