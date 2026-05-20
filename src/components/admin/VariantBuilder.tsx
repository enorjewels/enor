'use client';

import { useState } from 'react';

const METALS = ['YELLOW_GOLD', 'ROSE_GOLD', 'WHITE_GOLD', 'GREEN_GOLD', 'SILVER'] as const;
const KARATS = ['K9', 'K14', 'K18', 'K22', 'K24', 'SILVER_925'] as const;

export interface VariantRow {
  id?:            string;
  metal:          string;
  karat:          string;
  size:           string;
  weightGrams:    string;
  priceCad:       string; // display as CA$ — stored as cents
  comparePriceCad:string;
  sku:            string;
  stock:          string;
  isDefault:      boolean;
}

function emptyRow(): VariantRow {
  return {
    metal: 'YELLOW_GOLD', karat: 'K18',
    size: '', weightGrams: '', priceCad: '',
    comparePriceCad: '', sku: '', stock: '0', isDefault: false,
  };
}

interface Props {
  initial:  VariantRow[];
  onChange: (rows: VariantRow[]) => void;
}

export function VariantBuilder({ initial, onChange }: Props) {
  const [rows, setRows] = useState<VariantRow[]>(initial.length ? initial : [emptyRow()]);

  function update(i: number, field: keyof VariantRow, value: string | boolean) {
    const next = rows.map((r, idx) =>
      idx === i ? { ...r, [field]: value } : r
    );
    setRows(next);
    onChange(next);
  }

  function addRow() {
    const next = [...rows, emptyRow()];
    setRows(next);
    onChange(next);
  }

  function removeRow(i: number) {
    const next = rows.filter((_, idx) => idx !== i);
    setRows(next);
    onChange(next);
  }

  function setDefault(i: number) {
    const next = rows.map((r, idx) => ({ ...r, isDefault: idx === i }));
    setRows(next);
    onChange(next);
  }

  const TH = 'text-[10px] uppercase tracking-[0.12em] font-normal text-left py-2 px-2';
  const TD = 'px-2 py-1.5';
  const INPUT = 'w-full px-2 py-1.5 text-[13px] border bg-transparent outline-none focus:border-burgundy transition-colors';
  const SELECT = `${INPUT} appearance-none`;
  const BORDER = 'border-color: rgba(125,32,53,0.2)';

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(125,32,53,0.12)' }}>
              <th className={TH} style={{ color: 'var(--berry)' }}>Metal</th>
              <th className={TH} style={{ color: 'var(--berry)' }}>Karat</th>
              <th className={TH} style={{ color: 'var(--berry)' }}>Size</th>
              <th className={TH} style={{ color: 'var(--berry)' }}>Weight (g)</th>
              <th className={TH} style={{ color: 'var(--berry)' }}>Price CA$</th>
              <th className={TH} style={{ color: 'var(--berry)' }}>Compare CA$</th>
              <th className={TH} style={{ color: 'var(--berry)' }}>SKU</th>
              <th className={TH} style={{ color: 'var(--berry)' }}>Stock</th>
              <th className={TH} style={{ color: 'var(--berry)' }}>Default</th>
              <th className={TH} />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} style={{ borderBottom: '1px solid rgba(125,32,53,0.07)' }}>
                {/* Metal */}
                <td className={TD}>
                  <select
                    value={row.metal}
                    onChange={e => update(i, 'metal', e.target.value)}
                    className={SELECT}
                    style={{ borderColor: 'rgba(125,32,53,0.2)', color: 'var(--noir)' }}
                  >
                    {METALS.map(m => (
                      <option key={m} value={m}>
                        {m.replace('_GOLD','').replace('_',' ')} Gold
                      </option>
                    ))}
                  </select>
                </td>
                {/* Karat */}
                <td className={TD}>
                  <select
                    value={row.karat}
                    onChange={e => update(i, 'karat', e.target.value)}
                    className={SELECT}
                    style={{ borderColor: 'rgba(125,32,53,0.2)', color: 'var(--noir)', width: 80 }}
                  >
                    {KARATS.map(k => <option key={k} value={k}>{k}</option>)}
                  </select>
                </td>
                {/* Size */}
                <td className={TD}>
                  <input
                    type="text" placeholder="6.5"
                    value={row.size}
                    onChange={e => update(i, 'size', e.target.value)}
                    className={INPUT}
                    style={{ borderColor: 'rgba(125,32,53,0.2)', color: 'var(--noir)', width: 70 }}
                  />
                </td>
                {/* Weight */}
                <td className={TD}>
                  <input
                    type="number" placeholder="4.2"
                    value={row.weightGrams}
                    onChange={e => update(i, 'weightGrams', e.target.value)}
                    className={INPUT}
                    style={{ borderColor: 'rgba(125,32,53,0.2)', color: 'var(--noir)', width: 80 }}
                  />
                </td>
                {/* Price */}
                <td className={TD}>
                  <input
                    type="number" placeholder="2480"
                    value={row.priceCad}
                    onChange={e => update(i, 'priceCad', e.target.value)}
                    className={INPUT}
                    style={{ borderColor: 'rgba(125,32,53,0.2)', color: 'var(--noir)', width: 90 }}
                  />
                </td>
                {/* Compare price */}
                <td className={TD}>
                  <input
                    type="number" placeholder="2950"
                    value={row.comparePriceCad}
                    onChange={e => update(i, 'comparePriceCad', e.target.value)}
                    className={INPUT}
                    style={{ borderColor: 'rgba(125,32,53,0.2)', color: 'var(--noir)', width: 90 }}
                  />
                </td>
                {/* SKU */}
                <td className={TD}>
                  <input
                    type="text" placeholder="EN-001-YG-6"
                    value={row.sku}
                    onChange={e => update(i, 'sku', e.target.value)}
                    className={INPUT}
                    style={{ borderColor: 'rgba(125,32,53,0.2)', color: 'var(--noir)', width: 120 }}
                  />
                </td>
                {/* Stock */}
                <td className={TD}>
                  <input
                    type="number" min={0}
                    value={row.stock}
                    onChange={e => update(i, 'stock', e.target.value)}
                    className={INPUT}
                    style={{ borderColor: 'rgba(125,32,53,0.2)', color: 'var(--noir)', width: 64 }}
                  />
                </td>
                {/* Default radio */}
                <td className={TD} style={{ textAlign: 'center' }}>
                  <input
                    type="radio"
                    name="default_variant"
                    checked={row.isDefault}
                    onChange={() => setDefault(i)}
                  />
                </td>
                {/* Remove */}
                <td className={TD}>
                  <button
                    type="button"
                    onClick={() => removeRow(i)}
                    disabled={rows.length === 1}
                    className="opacity-40 hover:opacity-100 transition-opacity text-[16px]"
                    style={{ color: 'var(--rose)' }}
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        onClick={addRow}
        className="mt-3 text-[12px] uppercase tracking-[0.12em] px-4 py-2 border transition-colors"
        style={{ borderColor: 'rgba(125,32,53,0.2)', color: 'var(--burgundy)' }}
      >
        + Add variant
      </button>

      <p className="mt-2 text-[11px]" style={{ color: 'var(--berry)' }}>
        Prices in CA$ (whole number). Enter 2480 for CA$2,480. Leave Size blank for bangles, pendants, earrings.
      </p>
    </div>
  );
}
