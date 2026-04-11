'use client';

import { AppBar, Toolbar, Typography, Container, Box, Button, IconButton, Menu, MenuItem, Tooltip, Switch, SvgIcon, SvgIconProps, Drawer, List, ListItemButton, ListItemText } from '@mui/material';
import { DarkMode, LightMode, Menu as MenuIcon } from '@mui/icons-material';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { useState, useEffect, type MouseEvent } from 'react';

const SpainFlagIcon = (props: SvgIconProps) => (
  <SvgIcon viewBox="0 0 60 40" {...props}>
    <rect width="60" height="40" fill="#c60b1e" />
    <rect y="10" width="60" height="20" fill="#ffc400" />
    <rect x="22" y="10" width="16" height="20" fill="#c60b1e" />
  </SvgIcon>
);

const UkFlagIcon = (props: SvgIconProps) => (
  <SvgIcon viewBox="0 0 60 40" {...props}>
    <rect width="60" height="40" fill="#012169" />
    <path d="M0 0 L60 40 M60 0 L0 40" stroke="#fff" strokeWidth="8" />
    <path d="M0 0 L60 40 M60 0 L0 40" stroke="#c8102e" strokeWidth="4" />
    <path d="M30 0 L30 40 M0 20 L60 20" stroke="#fff" strokeWidth="8" />
    <path d="M30 0 L30 40 M0 20 L60 20" stroke="#c8102e" strokeWidth="4" />
  </SvgIcon>
);

export default function Header() {
  const { language, setLanguage } = useLanguage();
  const { themeMode, toggleTheme } = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevOpen) => !prevOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (lang: 'es' | 'en') => {
    setLanguage(lang);
    handleMenuClose();
  };

  const translations = {
    es: {
      portfolio: 'Mi Portafolio',
      aboutMe: 'Acerca de mí',
      projects: 'Mis proyectos',
      cv: 'Curriculum Vitae',
      technicalSkills: 'Habilidades Técnicas',
      education: 'Educación',
    },
    en: {
      portfolio: 'My Portfolio',
      aboutMe: 'About Me',
      projects: 'My Projects',
      cv: 'Curriculum Vitae',
      technicalSkills: 'Technical Skills',
      education: 'Education',
    },
  };

  const t = translations[language];

  return (
    <AppBar
      position="fixed"
      elevation={0}
      color="transparent"
      sx={(theme) => ({
        color: theme.palette.text.primary,
        backgroundColor: isScrolled
          ? theme.palette.background.paper
          : theme.palette.mode === 'dark'
          ? 'rgba(15, 23, 42, 0.88)'
          : 'rgba(255, 255, 255, 0.92)',
        borderBottom: isScrolled ? `1px solid ${theme.palette.divider}` : 'none',
        backdropFilter: isScrolled ? 'blur(0px)' : 'blur(10px)',
        top: 0,
        zIndex: 1000,
        transition: 'all 0.3s ease',
      })}
    >
      <Toolbar>
        <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 0 }}>
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {t.portfolio}
          </Typography>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, alignItems: 'center' }}>
            <Button color="inherit" href="#about" sx={{ textTransform: 'none' }}>
              {t.aboutMe}
            </Button>
            <Button color="inherit" href="#projects" sx={{ textTransform: 'none' }}>
              {t.projects}
            </Button>
            <Button color="inherit" href="#cv" sx={{ textTransform: 'none' }}>
              {t.cv}
            </Button>
            <Button color="inherit" href="#skills" sx={{ textTransform: 'none' }}>
              {t.technicalSkills}
            </Button>
            <Button color="inherit" href="#education" sx={{ textTransform: 'none' }}>
              {t.education}
            </Button>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 1 }}>
            <LightMode sx={(theme) => ({ color: theme.palette.text.secondary, fontSize: 18 })} />
            <Switch
              checked={themeMode === 'dark'}
              onChange={toggleTheme}
              color="primary"
              size="small"
              inputProps={{ 'aria-label': 'toggle theme' }}
              sx={(theme) => ({
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: theme.palette.primary.main,
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: theme.palette.primary.main,
                },
              })}
            />
            <DarkMode sx={(theme) => ({ color: theme.palette.text.secondary, fontSize: 18 })} />
          </Box>

          <Tooltip title={language === 'es' ? 'Español' : 'English'}>
            <IconButton
              onClick={handleMenuOpen}
              size="small"
              aria-label="change language"
            >
              {language === 'es' ? (
                <SpainFlagIcon sx={{ width: 24, height: 20 }} />
              ) : (
                <UkFlagIcon sx={{ width: 24, height: 20 }} />
              )}
            </IconButton>
          </Tooltip>

          <IconButton
            color="inherit"
            edge="end"
            onClick={handleDrawerToggle}
            sx={{ display: { xs: 'inline-flex', md: 'none' }, ml: 1 }}
            aria-label="open navigation menu"
          >
            <MenuIcon />
          </IconButton>

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              <MenuItem onClick={() => handleLanguageChange('es')} selected={language === 'es'}>
                <SpainFlagIcon sx={{ mr: 1, width: 24, height: 20 }} /> Español
              </MenuItem>
              <MenuItem onClick={() => handleLanguageChange('en')} selected={language === 'en'}>
                <UkFlagIcon sx={{ mr: 1, width: 24, height: 20 }} /> English
              </MenuItem>
            </Menu>

            <Drawer anchor="right" open={mobileOpen} onClose={handleDrawerToggle}>
              <Box sx={{ width: 250, p: 2 }} role="presentation" onClick={handleDrawerToggle} onKeyDown={handleDrawerToggle}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                  {t.portfolio}
                </Typography>
                <List>
                  <ListItemButton component="a" href="#about">
                    <ListItemText primary={t.aboutMe} />
                  </ListItemButton>
                  <ListItemButton component="a" href="#projects">
                    <ListItemText primary={t.projects} />
                  </ListItemButton>
                  <ListItemButton component="a" href="#cv">
                    <ListItemText primary={t.cv} />
                  </ListItemButton>
                  <ListItemButton component="a" href="#skills">
                    <ListItemText primary={t.technicalSkills} />
                  </ListItemButton>
                  <ListItemButton component="a" href="#education">
                    <ListItemText primary={t.education} />
                  </ListItemButton>
                </List>
              </Box>
            </Drawer>
        </Container>
      </Toolbar>
    </AppBar>
  );
}
