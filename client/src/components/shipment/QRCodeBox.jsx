import { QRCodeSVG } from 'qrcode.react';

const QRCodeBox = ({ value, size = 200 }) => {
  if (!value) return null;

  return (
    <div className="inline-flex flex-col items-center gap-3 p-5 bg-[#181818] border border-[#2a2a2a] rounded-2xl">
      <div className="bg-white p-3 rounded-xl">
        <QRCodeSVG value={typeof value === 'string' ? value : JSON.stringify(value)} size={size} bgColor="#ffffff" fgColor="#000000" level="H" includeMargin={false} />
      </div>
      <p className="text-cyan-400 text-xs font-mono font-semibold">{typeof value === 'string' ? value : value.trackingId}</p>
    </div>
  );
};

export default QRCodeBox;
