import '@/styles/globals.css'
import { WeddingProvider } from '@/context/WeddingContext'
import SearchModal from '@/components/SearchModal'
import NotificationToast from '@/components/NotificationToast'
import AnimatedCursor from '@/components/AnimatedCursor'

export default function App({ Component, pageProps }) {
  return (
    <WeddingProvider>
      <AnimatedCursor />
      <Component {...pageProps} />
      <SearchModal />
      <NotificationToast />
    </WeddingProvider>
  )
}
