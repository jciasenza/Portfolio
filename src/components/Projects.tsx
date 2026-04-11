'use client';

import { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  Pagination,
  PaginationItem,
} from '@mui/material';
import { GitHub, OpenInNew, ArrowBack, ArrowForward } from '@mui/icons-material';
import { useLanguage } from '@/context/LanguageContext';

interface Repository {
  id: number;
  name: string;
  description: string;
  url: string;
  html_url: string;
  language: string;
  stargazers_count: number;
  languages?: Record<string, number>;
}

const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: '#f7df1e',
  TypeScript: '#3178c6',
  Python: '#3776ab',
  CSS: '#2965f1',
  HTML: '#e34f26',
  SCSS: '#c6538c',
  Java: '#b07219',
  PHP: '#777bb4',
  Go: '#00add8',
  Ruby: '#701516',
};

const ITEMS_PER_PAGE = 6;

export default function Projects() {
  const { language } = useLanguage();
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const translations = {
    es: {
      title: 'Mis Proyectos',
      error: 'No se pudieron cargar los repositorios',
      empty: 'No hay repositorios disponibles. Configura tu usuario de GitHub.',
      viewCode: 'Ver Código',
      visit: 'Visitar',
    },
    en: {
      title: 'My Projects',
      error: 'Failed to load repositories',
      empty: 'No repositories available. Configure your GitHub user.',
      viewCode: 'View Code',
      visit: 'Visit',
    },
  };

  const t = translations[language];

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        const response = await fetch('/api/repositories');
        if (!response.ok) throw new Error('Error fetching repositories');
        const data = await response.json();
        setRepositories(data);
      } catch (err) {
        setError(t.error);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRepositories();
  }, [language, t.error]);

  // Calcular paginación
  const totalPages = Math.ceil(repositories.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedRepos = repositories.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    // Scroll al inicio de la sección de proyectos
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Box id="projects" sx={(theme) => ({ py: 8, backgroundColor: theme.palette.background.default })}>
      <Container maxWidth="lg">
        <Typography variant="h4" component="h2" gutterBottom sx={(theme) => ({ textAlign: 'center', fontWeight: 600, mb: 6, borderBottom: `2px solid ${theme.palette.primary.main}`, pb: 2, color: theme.palette.text.primary })}>
          {t.title}
        </Typography>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress sx={(theme) => ({ color: theme.palette.primary.main })} />
          </Box>
        )}

        {error && <Alert severity="error">{error}</Alert>}

        {!loading && !error && repositories.length === 0 && (
          <Alert severity="info">{t.empty}</Alert>
        )}

        {!loading && !error && repositories.length > 0 && (
          <>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {paginatedRepos.map((repo) => (
                <Grid item xs={12} sm={6} md={4} key={repo.id}>
                  <Card
                    sx={(theme) => ({
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      border: `1px solid ${theme.palette.divider}`,
                      backgroundColor: theme.palette.background.paper,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: `0 20px 25px -5px ${theme.palette.primary.main}33`,
                        borderColor: theme.palette.primary.main,
                      },
                    })}
                  >
                    <CardContent sx={{ flex: 1 }}>
                      <Typography variant="h6" component="h3" gutterBottom sx={(theme) => ({ fontWeight: 600, color: theme.palette.text.primary })}>
                        {repo.name}
                      </Typography>
                      <Typography variant="body2" sx={(theme) => ({ color: theme.palette.text.secondary, mb: 2 })}>
                        {repo.description || 'Sin descripción'}
                      </Typography>

                      {repo.languages && Object.keys(repo.languages).length > 0 ? (
                        <>
                          <Box sx={{ display: 'flex', width: '100%', height: 10, borderRadius: '999px', overflow: 'hidden', mb: 1 }}>
                            {Object.entries(repo.languages)
                              .sort(([, a], [, b]) => b - a)
                              .map(([lang, bytes]) => (
                                <Box
                                  key={lang}
                                  sx={{
                                    flex: bytes,
                                    minWidth: '2px',
                                    backgroundColor: LANGUAGE_COLORS[lang] ?? '#64748b',
                                  }}
                                />
                              ))}
                          </Box>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                            {Object.entries(repo.languages)
                              .sort(([, a], [, b]) => b - a)
                              .slice(0, 3)
                              .map(([lang, bytes]) => {
                                const totalBytes = Object.values(repo.languages!).reduce((sum, value) => sum + value, 0);
                                const percentage = totalBytes ? Math.round((bytes / totalBytes) * 100) : 0;
                                return (
                                  <Button
                                    key={lang}
                                    size="small"
                                    variant="outlined"
                                    sx={(theme) => ({
                                      color: theme.palette.primary.main,
                                      borderColor: theme.palette.primary.main,
                                      pointerEvents: 'none',
                                      textTransform: 'none',
                                      fontSize: '0.75rem',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '6px',
                                    })}
                                  >
                                    <Box
                                      component="span"
                                      sx={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: '50%',
                                        backgroundColor: LANGUAGE_COLORS[lang] ?? '#64748b',
                                        display: 'inline-block',
                                      }}
                                    />
                                    {lang} {percentage}%
                                  </Button>
                                );
                              })}
                          </Box>
                        </>
                      ) : (
                        repo.language && (
                          <Typography variant="caption" sx={(theme) => ({ backgroundColor: theme.palette.action.hover, padding: '4px 8px', borderRadius: '4px', color: theme.palette.primary.main, mb: 2, display: 'inline-block' })}>
                            {repo.language}
                          </Typography>
                        )
                      )}

                      {repo.stargazers_count > 0 && (
                        <Typography variant="body2" sx={(theme) => ({ mt: 1, color: theme.palette.text.secondary })}>
                          ⭐ {repo.stargazers_count} stars
                        </Typography>
                      )}
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        startIcon={<GitHub />}
                        sx={(theme) => ({ color: theme.palette.primary.main })}
                      >
                        {t.viewCode}
                      </Button>
                      {repo.url && (
                        <Button
                          size="small"
                          href={repo.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          startIcon={<OpenInNew />}
                          sx={(theme) => ({ color: theme.palette.primary.main })}
                        >
                          {t.visit}
                        </Button>
                      )}
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Paginación */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  sx={(theme) => ({
                    '& .MuiPaginationItem-root': {
                      color: theme.palette.text.secondary,
                      borderColor: theme.palette.divider,
                    },
                    '& .MuiPaginationItem-page.Mui-selected': {
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                    },
                    '& .MuiPaginationItem-page:hover': {
                      backgroundColor: theme.palette.action.hover,
                    },
                  })}
                />
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
}
