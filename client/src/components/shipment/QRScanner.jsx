import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const QRScanner = ({ onScan, onError }) => {
  const scannerRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    if (!scannerRef.current) {
      const scanner = new Html5QrcodeScanner('qr-reader', {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1,
        showTorchButtonIfSupported: true,
      }, false);

      scanner.render(
        (decodedText) => {
          try {
            const data = JSON.parse(decodedText);
            onScan(data.trackingId || decodedText);
          } catch {
            onScan(decodedText);
          }
          scanner.clear();
        },
        (error) => {
          if (onError) onError(error);
        }
      );

      scannerRef.current = scanner;
      setIsScanning(true);
    }

    return () => {
      if (scannerRef.current) {
        try { scannerRef.current.clear(); } catch (e) { /* ignore */ }
      }
    };
  }, []);

  return (
    <div className="w-full max-w-md mx-auto">
      <div id="qr-reader" className="rounded-2xl overflow-hidden" />
      <style>{`
        #qr-reader { border: none !important; }
        #qr-reader__scan_region { background: #1e293b !important; border-radius: 12px; }
        #qr-reader__dashboard { background: transparent !important; color: #94a3b8 !important; }
        #qr-reader__dashboard button { background: #6366f1 !important; color: white !important; border: none !important; border-radius: 8px !important; padding: 8px 16px !important; }
        #qr-reader__dashboard select { background: #334155 !important; color: white !important; border: 1px solid #475569 !important; border-radius: 8px !important; padding: 6px !important; }
      `}</style>
    </div>
  );
};

export default QRScanner;
