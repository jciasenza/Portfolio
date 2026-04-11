'use client';

import { Container, Typography, Box, Grid, Card, CardContent } from '@mui/material';
import { Code, Palette, Rocket } from '@mui/icons-material';
import { useLanguage } from '@/context/LanguageContext';

export default function About() {
  const { language } = useLanguage();

  const translations = {
    es: {
      title: 'Acerca de Mí',
      intro: 'Soy un desarrollador apasionado por crear soluciones web innovadoras. Tengo experiencia en:',
      frontend: 'Frontend: React, Next.js, TypeScript',
      backend: 'Backend: Node.js, Express, API REST',
      databases: 'Bases de datos: MongoDB, PostgreSQL',
      tools: 'Herramientas: Git, Linux, AWS',
      development: 'Desarrollo',
      devDesc: 'Código limpio y mantenible',
      design: 'Diseño',
      designDesc: 'Interfaces responsivas',
      performance: 'Performance',
      perfDesc: 'Aplicaciones rápidas y escalables',
    },
    en: {
      title: 'About Me',
      intro: 'I\'m a passionate developer creating innovative web solutions. I have experience in:',
      frontend: 'Frontend: React, Next.js, TypeScript',
      backend: 'Backend: Node.js, Express, REST API',
      databases: 'Databases: MongoDB, PostgreSQL',
      tools: 'Tools: Git, Linux, AWS',
      development: 'Development',
      devDesc: 'Clean and maintainable code',
      design: 'Design',
      designDesc: 'Responsive interfaces',
      performance: 'Performance',
      perfDesc: 'Fast and scalable applications',
    },
  };

  const t = translations[language];

  return (
    <Box id="about" sx={(theme) => ({ py: 8, backgroundColor: theme.palette.background.default })}>
      <Container maxWidth="lg">
        <Typography variant="h4" component="h2" gutterBottom sx={(theme) => ({ textAlign: 'center', fontWeight: 600, mb: 6, borderBottom: `2px solid ${theme.palette.primary.main}`, pb: 2, color: theme.palette.text.primary })}>
          {t.title}
        </Typography>

        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="body1" paragraph sx={(theme) => ({ color: theme.palette.text.secondary })}>
              {t.intro}
            </Typography>
            <Typography component="ul" sx={(theme) => ({ pl: 2, color: theme.palette.text.secondary })}>
              <li>{t.frontend}</li>
              <li>{t.backend}</li>
              <li>{t.databases}</li>
              <li>{t.tools}</li>
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Card sx={(theme) => ({ border: `1px solid ${theme.palette.divider}`, backgroundColor: theme.palette.background.paper })}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Code sx={(theme) => ({ fontSize: 40, color: theme.palette.primary.main, mb: 1 })} />
                    <Typography variant="h6" sx={(theme) => ({ color: theme.palette.text.primary })}>{t.development}</Typography>
                    <Typography variant="body2" sx={(theme) => ({ color: theme.palette.text.secondary })}>
                      {t.devDesc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card sx={(theme) => ({ border: `1px solid ${theme.palette.divider}`, backgroundColor: theme.palette.background.paper })}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Palette sx={(theme) => ({ fontSize: 40, color: theme.palette.secondary.main, mb: 1 })} />
                    <Typography variant="h6" sx={(theme) => ({ color: theme.palette.text.primary })}>{t.design}</Typography>
                    <Typography variant="body2" sx={(theme) => ({ color: theme.palette.text.secondary })}>
                      {t.designDesc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card sx={(theme) => ({ border: `1px solid ${theme.palette.divider}`, backgroundColor: theme.palette.background.paper })}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Rocket sx={(theme) => ({ fontSize: 40, color: theme.palette.primary.main, mb: 1 })} />
                    <Typography variant="h6" sx={(theme) => ({ color: theme.palette.text.primary })}>{t.performance}</Typography>
                    <Typography variant="body2" sx={(theme) => ({ color: theme.palette.text.secondary })}>
                      {t.perfDesc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
