'use client';

import { Container, Box } from '@mui/material';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import FeaturedProjects from '@/components/FeaturedProjects';
import Projects from '@/components/Projects';
import CV from '@/components/CV';
import Footer from '@/components/Footer';
import PortfolioChat from '@/components/PortfolioChat';

export default function Home() {
  return (
    <Box sx={(theme) => ({ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: theme.palette.background.default, pt: '64px' })}>
      <Header />
      <Box component="main" sx={{ flex: 1 }}>
        <Hero />
        <FeaturedProjects />
        <Projects />
        <CV />
      </Box>
      <Footer />
      <PortfolioChat />
    </Box>
  );
}
