'use client';

import { Box, Container, Typography, Stack, IconButton } from '@mui/material';
import { GitHub, LinkedIn, Email, WhatsApp } from '@mui/icons-material';

export default function Footer() {
  const year = new Date().getFullYear();
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP || '+541158094982';

  return (
    <Box
      component="footer"
      sx={(theme) => ({
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        py: 4,
        mt: 'auto',
        borderTop: `1px solid ${theme.palette.divider}`,
      })}
    >
      <Container maxWidth="lg">
        <Stack spacing={2} sx={{ textAlign: 'center' }}>
          <Stack direction="row" spacing={2} sx={{ justifyContent: 'center' }}>
            <IconButton
              href={process.env.NEXT_PUBLIC_GITHUB_URL || 'https://github.com/jciasenza'}
              target="_blank"
              rel="noopener noreferrer"
              sx={(theme) => ({ color: theme.palette.primary.main, '&:hover': { color: theme.palette.primary.light } })}
            >
              <GitHub />
            </IconButton>
            <IconButton
              href={process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://www.linkedin.com/in/juan-carlos-iasenza-8119501a9/'}
              target="_blank"
              rel="noopener noreferrer"
              sx={(theme) => ({ color: theme.palette.primary.main, '&:hover': { color: theme.palette.primary.light } })}
            >
              <LinkedIn />
            </IconButton>
            <IconButton
              href={`mailto:${process.env.NEXT_PUBLIC_EMAIL || 'iasenzajuancarlos@gmail.com'}`}
              sx={(theme) => ({ color: theme.palette.primary.main, '&:hover': { color: theme.palette.primary.light } })}
            >
              <Email />
            </IconButton>
            <IconButton
              href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              sx={(theme) => ({ color: theme.palette.primary.main, '&:hover': { color: theme.palette.primary.light } })}
            >
              <WhatsApp />
            </IconButton>
          </Stack>
          <Typography variant="body2" sx={(theme) => ({ color: theme.palette.text.secondary })}>
            © {year} Juan Carlos Iasenza. Todos los derechos reservados.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
