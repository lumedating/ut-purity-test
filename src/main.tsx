import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PostHogProvider } from '@posthog/react'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PostHogProvider
      apiKey={import.meta.env.VITE_POSTHOG_KEY}
      options={{
        api_host: import.meta.env.VITE_POSTHOG_HOST,
      }}
    >
      <App />
    </PostHogProvider>
  </StrictMode>,
)
