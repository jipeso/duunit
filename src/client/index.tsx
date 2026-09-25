import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router'
import { QueryClientProvider } from '@tanstack/react-query'

import queryClient from './util/queryClient'
import './util/i18n'
import App from './pages/App'
import ErrorBoundary from './components/ErrorBoundary'
import { NotificationProvider } from './components/Notification'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found')
}

createRoot(rootElement).render(
  <Router>
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </NotificationProvider>
    </QueryClientProvider>
  </Router>
)
