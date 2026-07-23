import '@/styles/globals.css'
import { WeddingProvider } from '@/context/WeddingContext'
import SearchModal from '@/components/SearchModal'
import NotificationToast from '@/components/NotificationToast'
import BigDayGate from '@/components/BigDayGate'
import FloatingBigDayCountdown from '@/components/FloatingBigDayCountdown'

export default function App({ Component, pageProps }) {
  return (
    <WeddingProvider>
      <Component {...pageProps} />
      <BigDayGate />
      <FloatingBigDayCountdown />
      <SearchModal />
      <NotificationToast />
    </WeddingProvider>
  )
}
