'use client';

import { Box, Container, Typography, Paper, Card, CardContent, Grid, Chip, Button } from '@mui/material';
import { useLanguage } from '@/context/LanguageContext';
import { Download, GitHub, LinkedIn, Email } from '@mui/icons-material';
import { useEffect, useState } from 'react';

interface CVData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
  summary: string;
  experience: Array<{
    position: string;
    company: string;
    period: string;
    description: string;
  }>;
  skills: {
    [key: string]: string[];
  };
  education: Array<{
    degree: string;
    school: string;
    duration: string;
  }>;
  courses: Array<{
    name: string;
    provider: string;
  }>;
  languages: Array<{
    language: string;
    level: string;
  }>;
}

export default function CV() {
  const { language } = useLanguage();
  const [cvData, setCvData] = useState<CVData | null>(null);

  useEffect(() => {
    const loadCV = async () => {
      try {
        const fileName = language === 'es' ? 'cv_es.json' : 'cv_en.json';
        const response = await fetch(`/data/${fileName}`);
        if (!response.ok) {
          throw new Error(`Failed to load CV: ${response.status}`);
        }
        const data = await response.json();
        setCvData(data);
      } catch (error) {
        console.error('Error loading CV:', error);
        // Mostrar un mensaje de error
      }
    };
    loadCV();
  }, [language]);

  if (!cvData) return <Typography>Loading...</Typography>;

  const translations = {
    es: {
      cv: 'Currículum Vitae',
      experience: 'Experiencia Profesional',
      education: 'Educación',
      skills: 'Habilidades Técnicas',
      courses: 'Cursos',
      languages: 'Idiomas',
      download: 'Descargar PDF',
    },
    en: {
      cv: 'Curriculum Vitae',
      experience: 'Professional Experience',
      education: 'Education',
      skills: 'Technical Skills',
      courses: 'Courses',
      languages: 'Languages',
      download: 'Download PDF',
    },
  };

  const t = translations[language];

  const downloadCV = () => {
    const pdfName = language === 'es' 
      ? 'CV_Juan_Carlos_Iasenza_ES.docx(03-26).pdf'
      : 'CV_Juan_Carlos_Iasenza_EN.docx(03-26).pdf';
    
    const link = document.createElement('a');
    link.href = `/CV/${pdfName}`;
    link.download = pdfName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box id="cv" sx={(theme) => ({ py: 8, backgroundColor: theme.palette.background.default })}>
      <Container maxWidth="lg">
        <Typography variant="h4" component="h2" gutterBottom sx={(theme) => ({ textAlign: 'center', fontWeight: 600, mb: 6, borderBottom: `2px solid ${theme.palette.primary.main}`, pb: 2, color: theme.palette.text.primary })}>
          {t.cv}
        </Typography>

        {/* Download CV Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={downloadCV}
            sx={(theme) => ({
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              },
            })}
          >
            {t.download}
          </Button>
        </Box>

        {/* Experience */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" sx={(theme) => ({ fontWeight: 600, mb: 3, borderBottom: `2px solid ${theme.palette.primary.main}`, pb: 2, color: theme.palette.text.primary })}>
            {t.experience}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {cvData.experience.map((exp, idx) => (
              <Card key={idx} sx={(theme) => ({ border: `1px solid ${theme.palette.divider}`, backgroundColor: theme.palette.background.paper })}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {exp.position}
                      </Typography>
                      <Typography variant="body2" sx={(theme) => ({ color: theme.palette.primary.main })}>
                        {exp.company}
                      </Typography>
                    </Box>
                    <Chip label={exp.period} variant="outlined" size="small" />
                  </Box>
                  <Typography variant="body2" sx={(theme) => ({ color: theme.palette.text.secondary, mt: 2 })}>
                    {exp.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>

        {/* Skills */}
        <Box id="skills" sx={{ mb: 6 }}>
          <Typography variant="h4" sx={(theme) => ({ fontWeight: 600, mb: 3, borderBottom: `2px solid ${theme.palette.primary.main}`, pb: 2, color: theme.palette.text.primary })}>
            {t.skills}
          </Typography>
          <Grid container spacing={2}>
            {Object.entries(cvData.skills).map(([category, skillList]) => (
              <Grid item xs={12} sm={6} md={4} key={category}>
                <Card sx={(theme) => ({ border: `1px solid ${theme.palette.divider}`, backgroundColor: theme.palette.background.paper })}>
                  <CardContent>
                    <Typography variant="h6" sx={(theme) => ({ fontWeight: 600, mb: 2, textTransform: 'capitalize', color: theme.palette.text.primary })}>
                      {category}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {skillList.map((skill, idx) => (
                        <Chip
                          key={idx}
                          label={skill}
                          variant="outlined"
                          size="small"
                          sx={{ justifyContent: 'flex-start' }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Education & Courses */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} md={6} id="education">
          <Typography variant="h4" sx={(theme) => ({ fontWeight: 600, mb: 3, borderBottom: `2px solid ${theme.palette.primary.main}`, pb: 2, color: theme.palette.text.primary })}>
              {t.education}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {cvData.education.map((edu, idx) => (
                <Card key={idx} sx={(theme) => ({ border: `1px solid ${theme.palette.divider}`, backgroundColor: theme.palette.background.paper })}>
                  <CardContent>
                    <Typography variant="h6" sx={(theme) => ({ fontWeight: 600, color: theme.palette.text.primary })}>
                      {edu.degree}
                    </Typography>
                    <Typography variant="body2" sx={(theme) => ({ color: theme.palette.primary.main })}>
                      {edu.school}
                    </Typography>
                    {edu.duration && (
                      <Chip label={edu.duration} variant="outlined" size="small" sx={{ mt: 1 }} />
                    )}
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
          <Typography variant="h4" sx={(theme) => ({ fontWeight: 600, mb: 3, borderBottom: `2px solid ${theme.palette.primary.main}`, pb: 2, color: theme.palette.text.primary })}>
              {t.courses}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {cvData.courses.map((course, idx) => (
                <Card key={idx} sx={(theme) => ({ border: `1px solid ${theme.palette.divider}`, backgroundColor: theme.palette.background.paper })}>
                  <CardContent>
                    <Typography variant="h6" sx={(theme) => ({ fontWeight: 600, color: theme.palette.text.primary })}>
                      {course.name}
                    </Typography>
                    <Typography variant="body2" sx={(theme) => ({ color: theme.palette.primary.main })}>
                      {course.provider}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Grid>
        </Grid>

        {/* Languages */}
        <Box>
          <Typography variant="h4" sx={(theme) => ({ fontWeight: 600, mb: 3, borderBottom: `2px solid ${theme.palette.primary.main}`, pb: 2, color: theme.palette.text.primary })}>
            {t.languages}
          </Typography>
          <Grid container spacing={2}>
            {cvData.languages.map((lang, idx) => (
              <Grid item xs={12} sm={6} key={idx}>
                <Card sx={(theme) => ({ border: `1px solid ${theme.palette.divider}`, backgroundColor: theme.palette.background.paper })}>
                  <CardContent>
                    <Typography variant="h6" sx={(theme) => ({ fontWeight: 600, color: theme.palette.text.primary })}>
                      {lang.language}
                    </Typography>
                    <Chip label={lang.level} variant="outlined" size="small" sx={{ mt: 1 }} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
