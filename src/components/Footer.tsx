export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200 mt-8">
            <div className="max-w-[480px] mx-auto px-4 py-6">
                {/* Disclaimer */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-xs text-gray-500 leading-relaxed">
                        <span className="font-semibold text-gray-600">Disclaimer:</span> Gudang Diskon adalah katalog afiliasi.
                        Semua transaksi dan pengiriman dilakukan secara aman melalui platform resmi Shopee.
                        Kami tidak memproses pembayaran atau pengiriman apapun.
                    </p>
                </div>

                {/* Bottom */}
                <div className="text-center">
                    <p className="text-xs text-gray-400">
                        © 2026 Gudang Diskon. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
