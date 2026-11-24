import Typography from '@mui/material/Typography'

interface Props {
  title: string
  subtitle?: string
}

const PageHeading = ({ title, subtitle }: Props) => (
  <>
    <Typography
      component='h1'
      variant='h5'
      gutterBottom={Boolean(subtitle)}
      sx={subtitle ? undefined : { mb: 3 }}
    >
      {title}
    </Typography>
    {subtitle && (
      <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
        {subtitle}
      </Typography>
    )}
  </>
)

export default PageHeading
