'use client';

import { Container, Typography, Box, Button, IconButton } from '@mui/material';
import { GitHub, LinkedIn, Mail, WhatsApp, Download } from '@mui/icons-material';
import { useLanguage } from '@/context/LanguageContext';

export default function Hero() {
  const { language } = useLanguage();

  const translations = {
    es: {
      greeting: '¡Hola! Soy',
      name: 'Juan Carlos Iasenza',
      subtitle: 'Especializado en crear aplicaciones web modernas y escalables',
      description: 'Desarrollador Full Stack con varios años de experiencia desarrollando aplicaciones web modernas. Sólido conocimiento en React, JavaScript, Node.js y Python.',
      viewProjects: 'Ver mis proyectos',
      downloadCV: 'Descargar CV',
    },
    en: {
      greeting: 'Hello! I\'m',
      name: 'Juan Carlos Iasenza',
      subtitle: 'Specialized in creating modern and scalable web applications',
      description: 'Full Stack Developer with several years of experience developing modern web applications. Solid knowledge in React, JavaScript, Node.js and Python.',
      viewProjects: 'View my projects',
      downloadCV: 'Download CV',
    },
  };

  const t = translations[language];
  const email = process.env.NEXT_PUBLIC_EMAIL || 'iasenzajuancarlos@gmail.com';
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP || '+541158094982';
  const githubUrl = process.env.NEXT_PUBLIC_GITHUB_URL || 'https://github.com/jciasenza';
  const linkedinUrl = process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://www.linkedin.com/in/juan-carlos-iasenza-8119501a9/';

  const downloadCV = () => {
    const pdfName = language === 'es' 
      ? process.env.NEXT_PUBLIC_CV_ES || 'CV_Juan_Carlos_Iasenza_ES.docx(03-26).pdf'
      : process.env.NEXT_PUBLIC_CV_EN || 'CV_Juan_Carlos_Iasenza_EN.docx(03-26).pdf';
    
    const link = document.createElement('a');
    link.href = `/CV/${pdfName}`;
    link.download = pdfName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box id="about"
      sx={(theme) => ({
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, #0f172a 0%, #111827 100%)'
          : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        color: theme.palette.text.primary,
        py: 12,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '@keyframes neonBorder': {
          '0%': { boxShadow: '0 0 10px #6366f1, inset 0 0 10px #6366f1, 0 0 20px rgba(99, 102, 241, 0.5)' },
          '25%': { boxShadow: '0 0 20px #ec4899, inset 0 0 20px #ec4899, 0 0 30px rgba(236, 72, 153, 0.5)' },
          '50%': { boxShadow: '0 0 30px #6366f1, inset 0 0 30px #6366f1, 0 0 40px rgba(99, 102, 241, 0.5)' },
          '75%': { boxShadow: '0 0 20px #ec4899, inset 0 0 20px #ec4899, 0 0 30px rgba(236, 72, 153, 0.5)' },
          '100%': { boxShadow: '0 0 10px #6366f1, inset 0 0 10px #6366f1, 0 0 20px rgba(99, 102, 241, 0.5)' },
        },
      })}
    >
      <Container maxWidth="lg">
        {/* Tarjeta con borde animado neón */}
        <Box
          sx={(theme) => ({
            position: 'relative',
            p: 4,
            borderRadius: '12px',
            background: theme.palette.mode === 'dark' ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: `2px solid ${theme.palette.primary.main}`,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            transition: 'all 0.3s ease',
            '&:hover': {
              animation: 'neonBorder 2s ease-in-out infinite',
            },
            flexDirection: { xs: 'column', md: 'row' },
          })}
        >
          {/* Contenido de texto */}
          <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
            <Typography 
              variant="h3" 
              component="h1" 
              gutterBottom 
              sx={{ fontWeight: 700, mb: 2, fontSize: { xs: '1.8rem', md: '2.5rem' } }}
            >
              {t.greeting} <span style={{ color: '#6366f1' }}>{t.name}</span>
            </Typography>
            <Typography 
              variant="h6" 
              paragraph 
              sx={{ mb: 3, opacity: 0.9, fontSize: { xs: '0.95rem', md: '1.1rem' } }}
            >
              {t.subtitle}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ opacity: 0.85, mb: 4, fontSize: { xs: '0.9rem', md: '1rem' } }}
            >
              {t.description}
            </Typography>

            {/* Botones principales */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, justifyContent: { xs: 'center', md: 'flex-start' }, alignItems: { xs: 'center', md: 'flex-start' }, mb: 3 }}>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                <Button
                  variant="contained"
                  size="large"
                  href="#projects"
                  sx={(theme) => ({
                    fontSize: '1rem',
                    padding: '12px 32px',
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark,
                    },
                  })}
                >
                  {t.viewProjects}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<Download />}
                  onClick={downloadCV}
                  sx={(theme) => ({
                    fontSize: '1rem',
                    padding: '12px 32px',
                    borderColor: theme.palette.text.primary,
                    color: theme.palette.text.primary,
                    '&:hover': {
                      borderColor: theme.palette.secondary.main,
                      color: theme.palette.secondary.main,
                      backgroundColor: 'rgba(236, 72, 153, 0.1)',
                    },
                  })}
                >
                  {t.downloadCV}
                </Button>
              </Box>

              {/* Iconos sin texto */}
              <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                <IconButton
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={(theme) => ({ color: theme.palette.text.primary, '&:hover': { color: theme.palette.secondary.main, transform: 'scale(1.1)' }, transition: 'all 0.3s ease' })}
                >
                  <GitHub />
                </IconButton>
                <IconButton
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={(theme) => ({ color: theme.palette.text.primary, '&:hover': { color: theme.palette.secondary.main, transform: 'scale(1.1)' }, transition: 'all 0.3s ease' })}
                >
                  <LinkedIn />
                </IconButton>
                <IconButton
                  href={`mailto:${email}`}
                  sx={(theme) => ({ color: theme.palette.text.primary, '&:hover': { color: theme.palette.secondary.main, transform: 'scale(1.1)' }, transition: 'all 0.3s ease' })}
                >
                  <Mail />
                </IconButton>
                <IconButton
                  href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={(theme) => ({ color: theme.palette.text.primary, '&:hover': { color: theme.palette.secondary.main, transform: 'scale(1.1)' }, transition: 'all 0.3s ease' })}
                >
                  <WhatsApp />
                </IconButton>
              </Box>
            </Box>
          </Box>

          {/* Foto de perfil */}
          <Box
            sx={{
              position: 'relative',
              width: { xs: '100%', md: '220px' },
              maxWidth: { xs: '240px', md: '220px' },
              height: 'auto',
              flexShrink: 0,
              textAlign: 'center',
            }}
          >
            <Box
              component="img"
              src="/images/profile.jpg"
              alt="Perfil"
              sx={{
                width: '100%',
                maxWidth: '220px',
                height: 'auto',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid rgba(99, 102, 241, 0.5)',
                boxSizing: 'border-box',
                transition: 'all 0.3s ease',
              }}
            />
            {/* Contacto directo abajo de la foto */}
            <Box sx={{ mt: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5, alignItems: 'center' }}>
              <Box
                component="a"
                href={`mailto:${email}`}
                sx={(theme) => ({
                  color: theme.palette.text.primary,
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  display: 'block',
                  width: '100%',
                  maxWidth: { xs: '240px', md: '220px' },
                  textAlign: 'center',
                  whiteSpace: 'normal',
                  overflowWrap: 'anywhere',
                  wordBreak: 'break-word',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: theme.palette.secondary.main,
                    textDecoration: 'underline',
                  },
                })}
              >
                {email}
              </Box>
              <Box
                component="a"
                href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                sx={(theme) => ({
                  color: theme.palette.text.primary,
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: theme.palette.secondary.main,
                    textDecoration: 'underline',
                  },
                })}
              >
                {whatsapp}
              </Box>
            </Box>
          </Box>
        </Box>

      </Container>
    </Box>
  );
}
