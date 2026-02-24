import { useEffect } from 'react'
import { CheckCircle } from 'lucide-react'
import './Toast.css'

function Toast({ message, onClose }) {
  // Auto-close after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 3000)

    return () => clearTimeout(timer) // Cleanup
  }, [onClose])

  return (
    <div className="toast">
      <CheckCircle size={20} className="toast-icon" />
      <span className="toast-message">{message}</span>
    </div>
  )
}

export default Toast