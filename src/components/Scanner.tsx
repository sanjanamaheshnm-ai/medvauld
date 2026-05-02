import { useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, Camera } from 'lucide-react';

export default function Scanner({ onScan, onClose }) {
  const scannerRef = useRef(null);

  useEffect(() => {
    const html5QrCode = new Html5Qrcode("reader");
    
    const config = { 
      fps: 10, 
      qrbox: { width: 250, height: 250 } 
    };

    const startScanner = async () => {
      try {
        await html5QrCode.start(
          { facingMode: "environment" },
          config,
          (decodedText) => {
            html5QrCode.stop().then(() => {
              onScan(decodedText);
            });
          },
          () => {} // silent failure for frame scanning
        );
      } catch (err) {
        console.error("Camera start failed:", err);
      }
    };

    startScanner();

    return () => {
      if (html5QrCode.isScanning) {
        html5QrCode.stop().catch(err => console.error("Stop failed", err));
      }
    };
  }, [onScan]);

  return (
    <div className="relative w-full aspect-square bg-slate-900 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl">
      <div id="reader" className="w-full h-full"></div>
      
      {/* Overlay UI */}
      <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none">
        <div className="w-full h-full border-2 border-blue-500/50 rounded-2xl relative">
          {/* Animated Scanning Line */}
          <div className="absolute w-full h-0.5 bg-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.8)] top-0 animate-[scan_2s_linear_infinite]" />
        </div>
      </div>
      
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-20">
        <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2">
          <Camera className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">Live Scanner</span>
        </div>
        <button 
          onClick={onClose}
          className="p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        #reader video {
          object-fit: cover !important;
          width: 100% !important;
          height: 100% !important;
        }
      `}} />
    </div>
  );
}
