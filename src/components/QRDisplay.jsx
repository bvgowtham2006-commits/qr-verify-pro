import React from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'

const QRDisplay = () => {
  // Get current URL for the QR code
  const currentUrl = window.location.href.split('?')[0] + '?view=form'

  return (
    <motion.div 
      className="card"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1>Scan to Connect</h1>
      <p>Scan this QR code from your mobile device to share your details instantly.</p>
      
      <div className="qr-container">
        <QRCodeSVG 
          value={currentUrl} 
          size={220}
          bgColor={"#ffffff"}
          fgColor={"#0f172a"}
          level={"H"}
          includeMargin={false}
        />
      </div>

      {/* Removed the link display below QR code as per user request */}
    </motion.div>
  )
}

export default QRDisplay
