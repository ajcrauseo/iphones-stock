'use client';

import { useState } from 'react';
import { deleteIphone } from '@/lib/iphoneActions';
import IphoneForm from './IphoneForm';
import { Edit2, Trash2, Smartphone, Battery, CreditCard, Tag } from 'lucide-react';

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

  const filteredIphones = initialIphones.filter((i) => i.branchId === activeBranchId);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Stock iPhones</h1>
          <p className="text-gray-500">Gestión de inventario por sucursal</p>
        </div>
        {role === 'admin' && (
          <button
            onClick={() => {
              setEditingIphone(null);
              setIsFormOpen(true);
            }}
            className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition-colors"
          >
            + Agregar iPhone
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200">
        {branches.map((branch) => {
          const isAbasto1 = branch.code === 'IC02';
          const isAbasto2 = branch.code === 'IC01';
          
          return (
            <button
              key={branch.id}
              onClick={() => setActiveBranchId(branch.id)}
              className={`px-4 py-3 text-sm font-medium transition-all border-b-2 flex flex-col items-center min-w-[140px] gap-1 ${
                activeBranchId === branch.id
                  ? 'border-gray-800 text-gray-800 bg-gray-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{branch.name}</span>
                {isAbasto1 && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold uppercase">
                    Abajo
                  </span>
                )}
                {isAbasto2 && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-700 font-bold uppercase">
                    Arriba
                  </span>
                )}
              </div>
              <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">
                Box: {branch.code}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 border-b border-gray-200">
              <th className="px-4 py-3 font-semibold">Modelo</th>
              <th className="px-4 py-3 font-semibold">Capacidad</th>
              <th className="px-4 py-3 font-semibold">IMEI</th>
              <th className="px-4 py-3 font-semibold">Batería</th>
              <th className="px-4 py-3 font-semibold">Precios</th>
              <th className="px-4 py-3 font-semibold">Descuentos</th>
              <th className="px-4 py-3 font-semibold">Financiación</th>
              <th className="px-4 py-3 font-semibold">Observaciones</th>
              {role === 'admin' && <th className="px-4 py-3 font-semibold text-center">Acciones</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredIphones.length > 0 ? (
              filteredIphones.map((iphone) => {
                const price = iphone.price;
                const contado = price * 0.85;
                
                let discountLabel = 'N/A';
                
                if (iphone.discountType === 'OFF1') {
                  discountLabel = 'OFF1';
                } else if (iphone.discountType === 'OFF2') {
                  discountLabel = 'OFF2';
                }

                const cuotas3 = price / 3;
                const cuotas6 = price / 6;

                return (
                  <tr key={iphone.id} className="hover:bg-gray-50 transition-colors">
                    {/* ... columns skipped for brevity in logic ... */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-gray-400" />
                        <div className="font-bold text-gray-900">{iphone.model}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-gray-500 font-mono font-medium">{iphone.capacity}</div>
                    </td>
                    <td className="px-4 py-4 font-mono text-xs text-gray-600">
                      {iphone.imei || '-'}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {iphone.batteryStatus === 'Original' ? (
                          <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md border ${
                            (iphone.batteryPercentage ?? 0) >= 90 
                              ? 'bg-green-50 border-green-200 text-green-700' 
                              : (iphone.batteryPercentage ?? 0) >= 80 
                                ? 'bg-yellow-50 border-yellow-200 text-yellow-700' 
                                : 'bg-red-50 border-red-200 text-red-700'
                          }`}>
                            <Battery className="w-3.5 h-3.5" />
                            <span className="font-bold text-xs">
                              {iphone.batteryPercentage}%
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md border bg-blue-50 border-blue-200 text-blue-700">
                            <Battery className="w-3.5 h-3.5" />
                            <span className="font-bold text-xs uppercase tracking-tighter">
                              Nueva 100%
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <div className="text-xs text-gray-400">Base: {formatCurrency(price)}</div>
                        <div className="text-green-700 font-bold flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          Contado: {formatCurrency(contado)}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <div className={`text-xs font-bold px-2 py-0.5 rounded-full inline-block ${
                          discountLabel === 'N/A' ? 'bg-gray-100 text-gray-400' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {discountLabel}
                        </div>
                        {discountLabel === 'OFF1' && (
                          <div className="text-blue-800 font-bold text-sm">
                            {formatCurrency(20000)}
                          </div>
                        )}
                        {discountLabel === 'OFF2' && (
                          <div className="text-blue-800 font-bold text-sm">
                            {formatCurrency(40000)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <CreditCard className="w-3 h-3" />
                          3x {formatCurrency(cuotas3)}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <CreditCard className="w-3 h-3" />
                          6x {formatCurrency(cuotas6)}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-gray-500 italic text-xs max-w-[150px] truncate" title={iphone.observations}>
                        {iphone.observations || '-'}
                      </p>
                    </td>
                    {role === 'admin' && (
                      <td className="px-4 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => {
                              setEditingIphone(iphone);
                              setIsFormOpen(true);
                            }}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={async () => {
                              if (confirm('¿Eliminar este iPhone?')) {
                                await deleteIphone(iphone.id);
                              }
                            }}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
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
                <td colSpan={role === 'admin' ? 9 : 8} className="px-4 py-10 text-center text-gray-400 italic">
                  No hay stock cargado en esta sucursal.
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
