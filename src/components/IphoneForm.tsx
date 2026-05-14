'use client';

import { useState } from 'react';
import { createIphone, updateIphone } from '@/lib/iphoneActions';
import { Edit2, Smartphone } from 'lucide-react';

import { Branch, Iphone } from '@/lib/types';

import { IPHONE_MODELS, IPHONE_CAPACITIES, IPHONE_COLORS_BY_MODEL } from '@/lib/constants';

interface IphoneFormProps {
  iphone?: Iphone | null;
  branches: Branch[];
  onClose: () => void;
}

export default function IphoneForm({ iphone, branches, onClose }: IphoneFormProps) {
  const [selectedModel, setSelectedModel] = useState(iphone?.model || IPHONE_MODELS[0]);
  const [batteryStatus, setBatteryStatus] = useState(iphone?.batteryStatus || 'Original');

  const availableColors = IPHONE_COLORS_BY_MODEL[selectedModel] || [];

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 w-full max-w-md border border-gray-200 dark:border-gray-800 animate-in fade-in zoom-in duration-200">
        <h2 className="text-2xl font-black mb-6 text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
          {iphone ? (
            <>
              <Edit2 className="w-6 h-6 text-blue-500" />
              Editar iPhone
            </>
          ) : (
            <>
              <Smartphone className="w-6 h-6 text-green-500" />
              Nuevo iPhone
            </>
          )}
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
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">Sucursal</label>
            <select
              name="branchId"
              defaultValue={iphone?.branchId || branches[0]?.id}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-xl p-2.5 text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:outline-none transition-all"
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
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">Modelo</label>
              <select
                name="model"
                required
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-xl p-2.5 text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:outline-none transition-all"
              >
                {IPHONE_MODELS.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">Color</label>
              <select
                name="color"
                key={selectedModel}
                defaultValue={availableColors.includes(iphone?.color || '') ? iphone?.color || '' : ''}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-xl p-2.5 text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:outline-none transition-all"
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
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">Capacidad</label>
              <select
                name="capacity"
                required
                defaultValue={iphone?.capacity || IPHONE_CAPACITIES[1]}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-xl p-2.5 text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:outline-none transition-all"
              >
                {IPHONE_CAPACITIES.map((cap) => (
                  <option key={cap} value={cap}>
                    {cap}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">IMEI</label>
              <input
                type="text"
                name="imei"
                defaultValue={iphone?.imei || ''}
                placeholder="15 dígitos"
                className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-xl p-2.5 text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 font-mono focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">Batería Estado</label>
              <select
                name="batteryStatus"
                value={batteryStatus}
                onChange={(e) => setBatteryStatus(e.target.value)}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-xl p-2.5 text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:outline-none transition-all"
              >
                <option value="Original">Original</option>
                <option value="Nueva 100%">Nueva 100%</option>
              </select>
            </div>
            {batteryStatus === 'Original' && (
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">Porcentaje</label>
                <input
                  type="number"
                  name="batteryPercentage"
                  required
                  defaultValue={iphone?.batteryPercentage ?? undefined}
                  placeholder="%"
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-xl p-2.5 text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:outline-none transition-all"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">Precio Base</label>
              <input
                type="number"
                name="price"
                required
                step="0.01"
                defaultValue={iphone?.price}
                placeholder="0.00"
                className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-xl p-2.5 text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 font-bold focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:outline-none transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">Descuento</label>
              <select
                name="discountType"
                defaultValue={iphone?.discountType || 'N/A'}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-xl p-2.5 text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:outline-none transition-all"
              >
                <option value="N/A">N/A (Ninguno)</option>
                <option value="OFF1">OFF1 (-20.000)</option>
                <option value="OFF2">OFF2 (-40.000)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">Observaciones</label>
            <textarea
              name="observations"
              defaultValue={iphone?.observations ?? undefined}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-xl p-2.5 text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:outline-none transition-all"
              rows={2}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all active:scale-95"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:bg-black dark:hover:bg-gray-100 transition-all shadow-lg active:scale-95"
            >
              {iphone ? 'Guardar Cambios' : 'Crear iPhone'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
