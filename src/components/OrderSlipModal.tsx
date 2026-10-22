import React, { useState } from 'react';
import {
  X, Printer, Phone, MapPin, Package, CheckCircle2, ShieldCheck,
  Calendar, Hash, Layers, CheckSquare, Square, FileText, AlertTriangle
} from 'lucide-react';
import { Order, SiteSettings } from '../types';

interface OrderSlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  bulkOrders?: Order[];
  siteSettings: SiteSettings;
}

export const OrderSlipModal: React.FC<OrderSlipModalProps> = ({
  isOpen,
  onClose,
  order,
  bulkOrders = [],
  siteSettings,
}) => {
  if (!isOpen) return null;

  // Determine list of orders to display/print:
  // If bulkOrders is provided and has items, use that; otherwise fallback to single [order]
  const initialOrders: Order[] = bulkOrders.length > 0 ? bulkOrders : order ? [order] : [];
  if (initialOrders.length === 0) return null;

  // Selected orders state for bulk checkbox toggling
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>(
    initialOrders.map((o) => o.id)
  );
  
  // Label format state: '4x6' (thermal/courier sticker) or 'a4' (standard invoice/slip)
  const [labelFormat, setLabelFormat] = useState<'4x6' | 'a4'>('4x6');

  const currencySymbol = siteSettings?.currencySymbol || '৳';
  const storePhone = siteSettings.contactPhone || siteSettings.whatsappNumber || '+880 1712-345678';
  const storeEmail = siteSettings.contactEmail || 'care@eclat.com';

  const ordersToPrint = initialOrders.filter((o) => selectedOrderIds.includes(o.id));

  const toggleSelectOrder = (id: string) => {
    setSelectedOrderIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedOrderIds.length === initialOrders.length) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(initialOrders.map((o) => o.id));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Helper to extract clean customer phone
  const getCustomerPhone = (o: Order) => {
    if (o.customerPhone) return o.customerPhone;
    const match = o.shippingAddress.match(/\+?\d[\d\s-]{9,}/);
    return match ? match[0] : 'N/A';
  };

  // Helper to clean address
  const getCleanAddress = (o: Order) => {
    return o.shippingAddress.replace(/\(\+?\d[\d\s-]{8,}\)/g, '').trim();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white print:static">
      
      {/* Modal Dialog Container */}
      <div className="bg-[#faf8f5] w-full max-w-4xl rounded-3xl border border-[#d8c8bd] shadow-2xl overflow-hidden relative my-auto flex flex-col max-h-[96vh] print:max-h-none print:shadow-none print:border-none print:w-full print:rounded-none">
        
        {/* Top Control Bar (Hidden during Print) */}
        <div className="p-4 sm:px-6 bg-[#182320] text-white flex flex-wrap items-center justify-between gap-3 shrink-0 print:hidden border-b border-[#283833]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#78988b] text-white flex items-center justify-center shadow-xs">
              <Printer className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif-title font-bold text-sm sm:text-base text-white">
                  {initialOrders.length > 1
                    ? `Bulk Shipping Labels & Packing Slips (${ordersToPrint.length}/${initialOrders.length})`
                    : `Parcel Shipping Label #${initialOrders[0].id}`}
                </h2>
                <span className="text-[10px] bg-[#78988b] text-white px-2 py-0.5 rounded-full font-bold">
                  {labelFormat === '4x6' ? '4" × 6" Courier Standard' : 'A4 Invoice Format'}
                </span>
              </div>
              <p className="text-[11px] text-[#c0dfe1] mt-0.5">
                কুরিয়ার পার্সেল লেবেল সাইজ ও ব্যাচ প্রিন্ট ম্যানেজার (Steadfast, Pathao, RedX ready)
              </p>
            </div>
          </div>

          {/* Right Header Buttons: Format switch & Print */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Format Switcher */}
            <div className="bg-[#20302b] p-0.5 rounded-xl border border-[#2e423b] flex items-center text-xs">
              <button
                type="button"
                onClick={() => setLabelFormat('4x6')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  labelFormat === '4x6'
                    ? 'bg-[#78988b] text-white shadow-2xs'
                    : 'text-[#c0dfe1]/80 hover:text-white'
                }`}
                title="4 x 6 inch standard thermal sticker parcel label"
              >
                4" × 6" Label
              </button>
              <button
                type="button"
                onClick={() => setLabelFormat('a4')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  labelFormat === 'a4'
                    ? 'bg-[#78988b] text-white shadow-2xs'
                    : 'text-[#c0dfe1]/80 hover:text-white'
                }`}
                title="Full A4 packing sheet"
              >
                A4 Packing Slip
              </button>
            </div>

            <button
              onClick={handlePrint}
              disabled={ordersToPrint.length === 0}
              className="bg-[#78988b] hover:bg-[#638275] disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>
                {ordersToPrint.length > 1
                  ? `Print All ${ordersToPrint.length} Labels`
                  : 'Print Label (প্রিন্ট)'}
              </span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Bulk Selector Toolbar if multiple orders */}
        {initialOrders.length > 1 && (
          <div className="bg-[#eae8d9] px-4 py-2.5 sm:px-6 border-b border-[#d8c8bd] flex flex-wrap items-center justify-between gap-2 shrink-0 print:hidden text-xs text-[#1f2d29]">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleSelectAll}
                className="flex items-center gap-1.5 font-bold text-[#1f2d29] hover:text-[#78988b] cursor-pointer"
              >
                {selectedOrderIds.length === initialOrders.length ? (
                  <CheckSquare className="w-4 h-4 text-[#78988b]" />
                ) : (
                  <Square className="w-4 h-4 text-gray-500" />
                )}
                <span>Select All ({initialOrders.length} Orders)</span>
              </button>
              <span className="text-gray-400">|</span>
              <span className="text-gray-600 font-medium">
                {ordersToPrint.length} Selected to Print
              </span>
            </div>

            {/* Quick Filter chips */}
            <div className="flex flex-wrap items-center gap-1.5">
              {initialOrders.slice(0, 5).map((o) => (
                <button
                  key={o.id}
                  onClick={() => toggleSelectOrder(o.id)}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-mono font-bold border transition-colors ${
                    selectedOrderIds.includes(o.id)
                      ? 'bg-[#1f2d29] text-white border-[#1f2d29]'
                      : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  #{o.id}
                </button>
              ))}
              {initialOrders.length > 5 && (
                <span className="text-[11px] text-gray-500 font-mono">
                  +{initialOrders.length - 5} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Printable Scroll Container */}
        <div
          className="p-3 sm:p-6 overflow-y-auto flex-1 print:p-0 print:overflow-visible space-y-6"
          id="printable-slips-container"
        >
          {ordersToPrint.length === 0 ? (
            <div className="text-center py-12 text-gray-500 space-y-2">
              <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
              <p className="font-bold text-sm">কোনো অর্ডার নির্বাচন করা হয়নি।</p>
              <p className="text-xs">প্রিন্ট করার জন্য অন্তত একটি অর্ডার সিলেক্ট করুন।</p>
            </div>
          ) : (
            ordersToPrint.map((ord, idx) => {
              const customerPhone = getCustomerPhone(ord);
              const cleanAddress = getCleanAddress(ord);

              return (
                <div
                  key={ord.id}
                  className={`printable-order-page bg-white mx-auto border-2 border-[#1f2d29] rounded-2xl p-4 sm:p-5 text-[#1f2d29] shadow-sm print:shadow-none print:rounded-none print:border-2 print:border-black ${
                    labelFormat === '4x6'
                      ? 'max-w-[105mm] min-h-[148mm] label-4x6'
                      : 'max-w-2xl'
                  }`}
                >
                  {/* SLIP TOP HEADER: Store Identity + Order Barcode */}
                  <div className="flex items-start justify-between border-b-2 border-black pb-3 gap-2">
                    <div className="flex items-center gap-2">
                      {siteSettings.websiteLogoUrl && (
                        <img
                          src={siteSettings.websiteLogoUrl}
                          alt={siteSettings.websiteName}
                          className="w-9 h-9 object-contain rounded-full border border-gray-300"
                        />
                      )}
                      <div>
                        <h1 className="font-serif-title font-black text-base sm:text-lg tracking-tight uppercase leading-none">
                          {siteSettings.websiteName || 'Éclat Botanicals'}
                        </h1>
                        <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mt-0.5">
                          {siteSettings.tagline || 'Artisanal Beauty & Organic Care'}
                        </p>
                        <p className="text-[10px] font-semibold text-gray-800 mt-1">
                          Hotline: <strong>{storePhone}</strong>
                        </p>
                      </div>
                    </div>

                    {/* Barcode & Parcel Badge */}
                    <div className="text-right shrink-0">
                      <div className="inline-block bg-black text-white text-[10px] font-black px-2 py-0.5 rounded-xs uppercase tracking-wider">
                        {ord.deliveryArea === 'outside_dhaka' ? 'Outside Dhaka' : 'Inside Dhaka'}
                      </div>
                      
                      {/* Simulated Thermal Barcode SVG */}
                      <div className="mt-1 flex flex-col items-end">
                        <svg className="w-28 h-6" viewBox="0 0 100 24" preserveAspectRatio="none">
                          <rect x="2" y="0" width="2" height="24" fill="#000" />
                          <rect x="6" y="0" width="3" height="24" fill="#000" />
                          <rect x="11" y="0" width="1" height="24" fill="#000" />
                          <rect x="14" y="0" width="4" height="24" fill="#000" />
                          <rect x="20" y="0" width="2" height="24" fill="#000" />
                          <rect x="24" y="0" width="1" height="24" fill="#000" />
                          <rect x="27" y="0" width="3" height="24" fill="#000" />
                          <rect x="32" y="0" width="2" height="24" fill="#000" />
                          <rect x="36" y="0" width="4" height="24" fill="#000" />
                          <rect x="42" y="0" width="2" height="24" fill="#000" />
                          <rect x="46" y="0" width="1" height="24" fill="#000" />
                          <rect x="49" y="0" width="3" height="24" fill="#000" />
                          <rect x="54" y="0" width="2" height="24" fill="#000" />
                          <rect x="58" y="0" width="4" height="24" fill="#000" />
                          <rect x="64" y="0" width="1" height="24" fill="#000" />
                          <rect x="67" y="0" width="3" height="24" fill="#000" />
                          <rect x="72" y="0" width="2" height="24" fill="#000" />
                          <rect x="76" y="0" width="4" height="24" fill="#000" />
                          <rect x="82" y="0" width="1" height="24" fill="#000" />
                          <rect x="85" y="0" width="3" height="24" fill="#000" />
                          <rect x="90" y="0" width="2" height="24" fill="#000" />
                          <rect x="94" y="0" width="3" height="24" fill="#000" />
                        </svg>
                        <span className="font-mono font-black text-xs text-black tracking-widest mt-0.5">
                          #{ord.id}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* RECIPIENT & SENDER 2-COLUMN BLOCK */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 border-b-2 border-black py-2.5">
                    
                    {/* SENDER BLOCK */}
                    <div className="bg-[#faf8f5] p-2 rounded-lg border border-gray-300 print:bg-transparent print:border-gray-400 text-[10px] space-y-0.5">
                      <div className="font-bold uppercase tracking-wider text-gray-500 print:text-black">
                        From (প্রেরক):
                      </div>
                      <div className="font-black text-xs text-black uppercase">
                        {siteSettings.websiteName || 'Éclat Botanicals Store'}
                      </div>
                      <div>Contact: {storePhone}</div>
                      <div>Gulshan 2, Dhaka, Bangladesh</div>
                    </div>

                    {/* RECIPIENT BLOCK (Crucial for Courier Delivery) */}
                    <div className="bg-[#f0f5f3] p-2.5 rounded-lg border-2 border-black print:bg-transparent text-[11px] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-black uppercase tracking-wider text-black text-[10px]">
                          To (প্রাপক / কাস্টমার):
                        </span>
                        <span className="bg-black text-white text-[9px] font-bold px-1.5 rounded-xs">
                          COD Parcel
                        </span>
                      </div>

                      <div className="font-black text-sm text-black uppercase">
                        {ord.customerName}
                      </div>

                      <div className="flex items-center gap-1 font-mono font-black text-xs bg-white px-1.5 py-0.5 rounded-xs border border-gray-300 print:bg-transparent">
                        <Phone className="w-3 h-3 text-black" />
                        <span>{customerPhone}</span>
                      </div>

                      <div className="text-[10px] font-semibold text-gray-900 leading-tight">
                        <span className="font-bold">ঠিকানা:</span> {cleanAddress}
                      </div>

                      {ord.notes && (
                        <div className="text-[9px] font-bold text-red-700 bg-red-50 p-1 rounded-xs border border-red-200 print:bg-transparent print:text-black print:border-black">
                          নোট / Instructions: {ord.notes}
                        </div>
                      )}
                    </div>

                  </div>

                  {/* COD AMOUNT HIGHLIGHT STRIP (High Visibility for Delivery Rider) */}
                  <div className="bg-black text-white p-2.5 rounded-lg my-2 flex items-center justify-between print:border print:border-black">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#eae8d9]">
                        Total Cash on Delivery (ক্যাশ কালেকশন):
                      </span>
                      <div className="text-xl font-black font-mono">
                        {currencySymbol}{ord.totalAmount.toFixed(0)} <span className="text-xs font-normal">BDT</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="inline-block bg-[#eae8d9] text-black text-[9px] font-black px-2 py-0.5 rounded-xs uppercase">
                        Cash On Delivery
                      </span>
                      <p className="text-[9px] text-gray-300 mt-0.5">
                        পণ্য হস্তান্তর করে টাকা গ্রহণ করুন
                      </p>
                    </div>
                  </div>

                  {/* ITEMIZATION TABLE */}
                  <div className="border border-black rounded-lg overflow-hidden my-2">
                    <table className="w-full text-[10px] border-collapse">
                      <thead>
                        <tr className="bg-gray-100 border-b border-black print:bg-gray-200">
                          <th className="p-1.5 text-left font-bold">আইটেম / Description</th>
                          <th className="p-1.5 text-center font-bold w-12">পরিমাণ</th>
                          <th className="p-1.5 text-right font-bold w-16">মূল্য</th>
                          <th className="p-1.5 text-right font-bold w-18">মোট</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ord.items.map((item, i) => (
                          <tr key={i} className="border-b border-gray-200 print:border-gray-400">
                            <td className="p-1.5">
                              <span className="font-bold text-black">{item.productName}</span>
                              {item.variantName && (
                                <span className="block text-[9px] text-gray-600">
                                  ভ্যারিয়েন্ট: {item.variantName}
                                </span>
                              )}
                            </td>
                            <td className="p-1.5 text-center font-bold font-mono">
                              {item.quantity}
                            </td>
                            <td className="p-1.5 text-right font-mono">
                              {currencySymbol}{item.price}
                            </td>
                            <td className="p-1.5 text-right font-bold font-mono">
                              {currencySymbol}{item.price * item.quantity}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-t border-black bg-gray-50 print:bg-transparent font-semibold text-[10px]">
                          <td colSpan={3} className="p-1.5 text-right">ডেলিভারি চার্জ:</td>
                          <td className="p-1.5 text-right font-mono font-bold">
                            {currencySymbol}{ord.deliveryCharge}
                          </td>
                        </tr>
                        <tr className="border-t-2 border-black bg-gray-100 font-bold text-xs print:bg-transparent">
                          <td colSpan={3} className="p-1.5 text-right">সর্বমোট প্রদেয় (Total):</td>
                          <td className="p-1.5 text-right font-mono font-black text-black">
                            {currencySymbol}{ord.totalAmount.toFixed(0)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  {/* FOOTER: Courier Instructions & Return Policy */}
                  <div className="pt-2 border-t border-black text-[9px] text-gray-700 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-black">
                        * ডেলিভারি ম্যানের উপস্থিতিতে পার্সেল চেক করে গ্রহণ করুন।
                      </p>
                      <p>সমস্যা হলে সাথে সাথে আমাদের হটলাইনে যোগাযোগ করুন: {storePhone}</p>
                    </div>
                    <div className="text-right font-mono font-bold">
                      Date: {ord.date}
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>

        {/* Modal Bottom Action Bar (Hidden during Print) */}
        <div className="p-4 bg-[#faf8f5] border-t border-[#d8c8bd] flex flex-wrap items-center justify-between gap-3 shrink-0 print:hidden text-xs">
          <div className="text-gray-600">
            {ordersToPrint.length > 1 ? (
              <span>
                বর্তমানে <strong>{ordersToPrint.length} টি অর্ডারের লেবেল</strong> একসাথে প্রিন্ট হওয়ার জন্য প্রস্তুত।
              </span>
            ) : (
              <span>
                এই লেবেলটি ৪x৬" স্ট্যান্ডার্ড স্টিকার আকারে বা A4 পেপারে প্রিন্ট করে সহজেই পার্সেলের গায়ে লাগানো যাবে।
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 font-semibold text-gray-700 hover:text-black cursor-pointer"
            >
              বাতিল (Close)
            </button>
            <button
              onClick={handlePrint}
              disabled={ordersToPrint.length === 0}
              className="bg-[#182320] hover:bg-[#78988b] text-white font-bold px-5 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <Printer className="w-4 h-4" />
              <span>
                {ordersToPrint.length > 1
                  ? `একসাথে ${ordersToPrint.length} টি প্রিন্ট করুন (Bulk Print)`
                  : 'প্রিন্ট করুন (Print Now)'}
              </span>
            </button>
          </div>
        </div>

      </div>

      {/* Embedded Print Styles for Exact 4x6" and A4 Page Breaks */}
      <style>{`
        @media print {
          @page {
            size: auto;
            margin: 4mm;
          }
          body * {
            visibility: hidden !important;
          }
          #printable-slips-container,
          #printable-slips-container * {
            visibility: visible !important;
          }
          #printable-slips-container {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .printable-order-page {
            page-break-after: always !important;
            break-after: page !important;
            margin-bottom: 20px !important;
            border: 2px solid #000 !important;
          }
          .label-4x6 {
            width: 100mm !important;
            max-width: 100mm !important;
            min-height: 145mm !important;
            margin: 0 auto 10mm auto !important;
          }
        }
      `}</style>
    </div>
  );
};
