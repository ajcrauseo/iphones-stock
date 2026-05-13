'use client';

import { useState } from 'react';
import { createIphone, updateIphone } from '@/lib/iphoneActions';

import { Branch, Iphone } from '@/lib/types';

import { IPHONE_MODELS, IPHONE_CAPACITIES } from '@/lib/constants';

interface IphoneFormProps {
  iphone?: Iphone | null;
  branches: Branch[];
  onClose: () => void;
}

export default function IphoneForm({ iphone, branches, onClose }: IphoneFormProps) {
  const [batteryStatus, setBatteryStatus] = useState(iphone?.batteryStatus || 'Original');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md border border-gray-200">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
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
          <div>
            <label className="block text-sm font-medium text-gray-700">Sucursal</label>
            <select
              name="branchId"
              defaultValue={iphone?.branchId || branches[0]?.id}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-900 bg-gray-50"
            >
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Modelo</label>
              <select
                name="model"
                required
                defaultValue={iphone?.model || IPHONE_MODELS[0]}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-900 bg-gray-50"
              >
                {IPHONE_MODELS.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Capacidad</label>
              <select
                name="capacity"
                required
                defaultValue={iphone?.capacity || IPHONE_CAPACITIES[1]}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-900 bg-gray-50"
              >
                {IPHONE_CAPACITIES.map((cap) => (
                  <option key={cap} value={cap}>
                    {cap}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">IMEI</label>
            <input
              type="text"
              name="imei"
              defaultValue={iphone?.imei || ''}
              placeholder="15 dígitos"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-900 bg-gray-50 font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Batería Estado</label>
              <select
                name="batteryStatus"
                value={batteryStatus}
                onChange={(e) => setBatteryStatus(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-900 bg-gray-50"
              >
                <option value="Original">Original</option>
                <option value="Nueva 100%">Nueva 100%</option>
              </select>
            </div>
            {batteryStatus === 'Original' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Porcentaje</label>
                <input
                  type="number"
                  name="batteryPercentage"
                  required
                  defaultValue={iphone?.batteryPercentage}
                  placeholder="%"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-900 bg-gray-50"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Precio Base</label>
              <input
                type="number"
                name="price"
                required
                step="0.01"
                defaultValue={iphone?.price}
                placeholder="0.00"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-900 bg-gray-50 font-bold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Descuento Especial</label>
              <select
                name="discountType"
                defaultValue={iphone?.discountType || 'N/A'}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-900 bg-gray-50"
              >
                <option value="N/A">N/A (Ninguno)</option>
                <option value="OFF1">OFF1 (-20.000)</option>
                <option value="OFF2">OFF2 (-40.000)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Observaciones</label>
            <textarea
              name="observations"
              defaultValue={iphone?.observations}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-900 bg-gray-50"
              rows={2}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              {iphone ? 'Guardar Cambios' : 'Crear iPhone'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
