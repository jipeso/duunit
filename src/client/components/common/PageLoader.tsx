import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

const SHOW_DELAY_MS = 200

const PageLoader = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setVisible(true)
    }, SHOW_DELAY_MS)
    return () => {
      clearTimeout(timeout)
    }
  }, [])

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}>
      {visible && <CircularProgress />}
    </Box>
  )
}

export default PageLoader
