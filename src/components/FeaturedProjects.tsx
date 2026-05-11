'use client';

import { Container, Grid, Card, CardContent, CardActions, Typography, Button, Box, Chip } from '@mui/material';
import { OpenInNew } from '@mui/icons-material';
import { useLanguage } from '@/context/LanguageContext';
import { useEffect, useState } from 'react';

interface FeaturedProject {
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  url: string;
  githubRepo: string;
  technologies: string[];
  image?: string;
}

export default function FeaturedProjects() {
  const { language } = useLanguage();

  const projects: FeaturedProject[] = [
    {
      title: 'Panorama',
      titleEn: 'Panorama',
      description: 'Plataforma avanzada de análisis de estudiantes multi-LMS que proporciona insights integrales sobre el rendimiento estudiantil, compromiso y resultados de aprendizaje en múltiples plataformas incluyendo Open edX y otras soluciones LMS mejoradas por agente de IA Owly.',
      descriptionEn: 'Advanced multi-LMS student analytics platform that provides comprehensive insights into student performance, engagement and learning outcomes across multiple platforms including Open edX and other LMS solutions enhanced by Owly AI agent.',
      url: 'https://panorama.aulasneo.com/',
      githubRepo: '',
      technologies: ['React', 'TypeScript', 'Python', 'Django', 'Sass'],
    },
    {
      title: 'Owly',
      titleEn: 'Owly',
      description: 'Agente de IA revolucionario que transforma la forma en que educadores y estudiantes interactúan con plataformas LMS. Owly proporciona asistencia inteligente, flujos de trabajo automatizados y experiencias de aprendizaje personalizadas mejoradas por análisis de aprendizaje.',
      descriptionEn: 'Revolutionary AI agent that transforms how educators and students interact with LMS platforms. Owly provides intelligent assistance, automated workflows and personalized learning experiences enhanced by learning analytics.',
      url: 'https://www.owly.aulasneo.com/',
      githubRepo: '',
      technologies: ['React', 'TypeScript', 'Python', 'Django', 'Sass'],
    },
  ];

  const translations = {
    es: {
      featuredProjects: 'Proyectos Destacados',
      viewProject: 'Ver Proyecto',
    },
    en: {
      featuredProjects: 'Featured Projects',
      viewProject: 'View Project',
    },
  };

  const t = translations[language];
  const [repoLanguages, setRepoLanguages] = useState<Record<number, string[]>>({});

  useEffect(() => {
    const githubToken = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json',
    };

    if (githubToken) {
      headers.Authorization = `Bearer ${githubToken}`;
    }

    const loadLanguages = async () => {
      const results = await Promise.all(
        projects.map(async (project, index) => {
          if (!project.githubRepo || !project.githubRepo.includes('/')) {
            return [index, []] as const;
          }

          try {
            const res = await fetch(`https://api.github.com/repos/${project.githubRepo}/languages`, {
              headers,
            });

            if (!res.ok) {
              return [index, []] as const;
            }

            const data: Record<string, number> = await res.json();
            const langs = Object.entries(data)
              .sort(([, a], [, b]) => b - a)
              .map(([lang]) => lang)
              .slice(0, 5);

            return [index, langs] as const;
          } catch {
            return [index, []] as const;
          }
        })
      );

      setRepoLanguages(Object.fromEntries(results));
    };

    loadLanguages();
  }, []);

  return (
    <Box sx={(theme) => ({ py: 8, backgroundColor: theme.palette.background.default })}>
      <Container maxWidth="lg">
        <Typography 
          variant="h3" 
          component="h2" 
          gutterBottom 
          sx={(theme) => ({ 
            textAlign: 'center', 
            fontWeight: 700, 
            mb: 6, 
            borderBottom: `2px solid ${theme.palette.primary.main}`, 
            pb: 3,
            color: theme.palette.text.primary,
          })}
        >
          {t.featuredProjects}
        </Typography>

        <Grid container spacing={4}>
          {projects.map((project, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card 
                sx={(theme) => ({ 
                  height: '100%',
                  backgroundColor: theme.palette.background.paper,
                  backdropFilter: 'blur(10px)',
                  border: `2px solid ${theme.palette.divider}`,
                  borderRadius: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    boxShadow: `0 0 30px ${theme.palette.primary.main}30`,
                    transform: 'translateY(-8px)',
                  },
                })}
              >
                <CardContent sx={{ flex: 1 }}>
                  <Typography 
                    variant="h5" 
                    component="h3" 
                    gutterBottom 
                    sx={(theme) => ({ 
                      fontWeight: 700, 
                      color: theme.palette.primary.main,
                      mb: 2
                    })}
                  >
                    {language === 'es' ? project.title : project.titleEn}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={(theme) => ({ 
                      color: theme.palette.text.secondary,
                      mb: 3,
                      lineHeight: 1.6
                    })}
                  >
                    {language === 'es' ? project.description : project.descriptionEn}
                  </Typography>

                  {repoLanguages[index]?.length ? (
                    <Box sx={(theme) => ({ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 })}>
                      {repoLanguages[index].map((lang) => (
                        <Chip
                          key={lang}
                          label={lang}
                          size="small"
                          sx={(theme) => ({
                            backgroundColor: theme.palette.action.selected,
                            color: theme.palette.text.primary,
                            fontWeight: 500,
                          })}
                        />
                      ))}
                    </Box>
                  ) : null}

                  {/* Tecnologías */}
                  <Box sx={(theme) => ({ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 })}>
                    {project.technologies.map((tech, idx) => (
                      <Box
                        key={idx}
                        sx={(theme) => ({
                          px: 2,
                          py: 0.5,
                          borderRadius: '4px',
                          backgroundColor: theme.palette.action.hover,
                          border: `1px solid ${theme.palette.primary.main}`,
                          color: theme.palette.primary.main,
                          fontSize: '0.85rem',
                          fontWeight: 500,
                        })}
                      >
                        {tech}
                      </Box>
                    ))}
                  </Box>
                </CardContent>

                {/* Acciones */}
                <CardActions sx={(theme) => ({ pt: 0, borderTop: `1px solid ${theme.palette.divider}` })}>
                  <Button
                    fullWidth
                    size="small"
                    endIcon={<OpenInNew />}
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={(theme) => ({
                      color: theme.palette.primary.contrastText,
                      backgroundColor: theme.palette.primary.main,
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                        color: theme.palette.secondary.main,
                      },
                      transition: 'all 0.3s ease',
                    })}
                  >
                    {t.viewProject}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
