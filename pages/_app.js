import '@/styles/globals.css'
import { WeddingProvider } from '@/context/WeddingContext'
import SearchModal from '@/components/SearchModal'
import NotificationToast from '@/components/NotificationToast'
import BigDayGate from '@/components/BigDayGate'

export default function App({ Component, pageProps }) {
  return (
    <WeddingProvider>
      <Component {...pageProps} />
      <BigDayGate />
      <SearchModal />
      <NotificationToast />
    </WeddingProvider>
  )
}
