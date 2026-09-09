'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import {
  Avatar,
  Box,
  Fab,
  IconButton,
  Paper,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material';
import { ChatBubbleOutline, Close, Fullscreen, FullscreenExit, Send, SmartToy } from '@mui/icons-material';
import { useLanguage } from '@/context/LanguageContext';

type Message = { id: number; role: 'assistant' | 'user'; content: string };
type Provider = 'gemini' | 'groq';

function formatAssistantText(content: string) {
  return content
    .replace(/\|[- :|]+\|/g, '')
    .replace(/\|\s*/g, '\n')
    .replace(/\s*\|/g, '')
    .replace(/^\s*[-*]\s*/gm, '• ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

const copy = {
  es: {
    assistant: 'Asistente personal', greeting: '¡Hola! Soy el asistente de Juan Carlos.',
    intro: 'Puedo contarte sobre su experiencia, proyectos y formas de contacto.',
    placeholder: 'Escribe tu pregunta...', open: 'Abrir chat', close: 'Cerrar chat', send: 'Enviar mensaje',
    loading: 'Escribiendo...', error: 'No se pudo conectar con el agente. Intenta nuevamente.', provider: 'Proveedor', maximize: 'Maximizar', restore: 'Restaurar',
    questions: ['¿Qué tecnologías usa?', 'Háblame de sus proyectos', '¿Cómo puedo contactarlo?'],
  },
  en: {
    assistant: 'Personal assistant', greeting: "Hi! I'm Juan Carlos's personal assistant.",
    intro: 'I can tell you about his experience, projects, and ways to get in touch.',
    placeholder: 'Type your question...', open: 'Open chat', close: 'Close chat', send: 'Send message',
    loading: 'Typing...', error: 'The agent could not be reached. Please try again.', provider: 'Provider', maximize: 'Maximize', restore: 'Restore',
    questions: ['What technologies does he use?', 'Tell me about his projects', 'How can I contact him?'],
  },
};

export default function PortfolioChat() {
  const { language } = useLanguage();
  const t = copy[language];
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [provider, setProvider] = useState<Provider>('groq');
  const [maximized, setMaximized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const sendMessage = async (event?: FormEvent, presetQuestion?: string) => {
    event?.preventDefault();
    const question = (presetQuestion ?? input).trim();
    if (!question || isLoading) return;

    const userMessage: Message = { id: Date.now(), role: 'user', content: question };
    const history = [...messages, userMessage];
    setMessages(history);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language,
          provider,
          messages: history.map(({ role, content }) => ({ role, content })),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || t.error);
      setMessages((current) => [...current, { id: Date.now() + 1, role: 'assistant', content: data.message }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((current) => [...current, {
        id: Date.now() + 1,
        role: 'assistant',
        content: error instanceof Error ? error.message : t.error,
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {open && (
        <Paper
          elevation={16}
          role="dialog"
          aria-label={t.assistant}
          sx={(theme) => ({
            position: 'fixed', zIndex: theme.zIndex.modal,
            right: maximized ? { xs: 8, sm: 24 } : { xs: 12, sm: 24 },
            bottom: maximized ? { xs: 48, sm: 24 } : { xs: 82, sm: 96 },
            top: maximized ? { xs: 48, sm: 24 } : 'auto',
            width: maximized ? { xs: 'calc(100vw - 16px)', sm: 'min(760px, calc(100vw - 48px))' } : { xs: 'calc(100vw - 24px)', sm: 350 },
            height: maximized ? { xs: 'calc(100vh - 96px)', sm: 'min(760px, calc(100vh - 48px))' } : { xs: 'min(500px, calc(100vh - 96px))', sm: 500 },
            display: 'flex', flexDirection: 'column', overflow: 'hidden', border: `1px solid ${theme.palette.divider}`,
            borderRadius: 3, backgroundColor: theme.palette.background.paper,
          })}
        >
          <Box sx={(theme) => ({ px: 1.5, py: 1.25, display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#fff', background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})` })}>
            <Stack direction="row" spacing={1.25} alignItems="center">
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(255,255,255,0.18)', color: '#fff' }}><SmartToy fontSize="small" /></Avatar>
              <Box><Typography fontWeight={700}>{t.assistant}</Typography><Typography variant="caption" sx={{ opacity: 0.8 }}>Juan Carlos Iasenza</Typography></Box>
            </Stack>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <ToggleButtonGroup
                exclusive value={provider} size="small" aria-label={t.provider}
                onChange={(_, value: Provider | null) => value && setProvider(value)}
                sx={{ '& .MuiToggleButton-root': { color: 'rgba(255,255,255,0.75)', borderColor: 'rgba(255,255,255,0.35)', px: 0.75, py: 0.25, fontSize: '0.65rem', textTransform: 'none' }, '& .Mui-selected': { color: '#fff !important', backgroundColor: 'rgba(255,255,255,0.2) !important' } }}
              >
                <ToggleButton value="gemini">Gemini</ToggleButton><ToggleButton value="groq">Groq</ToggleButton>
              </ToggleButtonGroup>
              <Tooltip title={maximized ? t.restore : t.maximize}>
                <IconButton onClick={() => setMaximized((value) => !value)} aria-label={maximized ? t.restore : t.maximize} sx={{ color: '#fff' }}>
                  {maximized ? <FullscreenExit fontSize="small" /> : <Fullscreen fontSize="small" />}
                </IconButton>
              </Tooltip>
              <IconButton onClick={() => setOpen(false)} aria-label={t.close} sx={{ color: '#fff' }}><Close /></IconButton>
            </Stack>
          </Box>

          <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
            <Stack spacing={1.5}>
              <Box sx={(theme) => ({ alignSelf: 'flex-start', maxWidth: '88%', p: 1.5, borderRadius: '4px 16px 16px 16px', backgroundColor: theme.palette.action.hover })}>
                <Typography variant="body2" sx={{ lineHeight: 1.55 }}>{t.greeting}</Typography>
                <Typography variant="body2" sx={{ mt: 0.75, lineHeight: 1.55 }}>{t.intro}</Typography>
              </Box>
              {messages.map((message) => (
                <Box key={message.id} sx={(theme) => ({ alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '88%', p: 1.5, borderRadius: message.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px', color: message.role === 'user' ? theme.palette.primary.contrastText : theme.palette.text.primary, backgroundColor: message.role === 'user' ? theme.palette.primary.main : theme.palette.action.hover })}>
                  <Typography component="div" variant="body2" sx={{ lineHeight: 1.55, whiteSpace: 'pre-line', overflowWrap: 'anywhere' }}>{formatAssistantText(message.content)}</Typography>
                </Box>
              ))}
              {isLoading && <Typography variant="body2" sx={{ alignSelf: 'flex-start', color: 'text.secondary' }}>{t.loading}</Typography>}
              <div ref={messagesEndRef} />
            </Stack>
          </Box>

          <Box sx={(theme) => ({ px: 1.25, pt: 0.75, pb: 1, borderTop: `1px solid ${theme.palette.divider}` })}>
            {messages.length === 0 && <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, pb: 1 }}>
              {t.questions.map((question) => <Box component="button" key={question} type="button" onClick={() => void sendMessage(undefined, question)} sx={(theme) => ({ border: `1px solid ${theme.palette.divider}`, borderRadius: 2, px: 1, py: 0.5, color: theme.palette.text.secondary, background: 'transparent', cursor: 'pointer', font: 'inherit', fontSize: '0.68rem', '&:hover': { color: theme.palette.primary.main, borderColor: theme.palette.primary.main } })}>{question}</Box>)}
            </Box>}
            <Box component="form" onSubmit={(event) => void sendMessage(event)} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField value={input} onChange={(event) => setInput(event.target.value)} placeholder={t.placeholder} size="small" fullWidth inputProps={{ 'aria-label': t.placeholder }} />
              <IconButton type="submit" color="primary" aria-label={t.send} disabled={!input.trim() || isLoading}><Send /></IconButton>
            </Box>
          </Box>
        </Paper>
      )}
      <Tooltip title={open ? t.close : t.open} placement="left">
        <Fab color="primary" onClick={() => setOpen((current) => !current)} aria-label={open ? t.close : t.open} sx={{ position: 'fixed', right: { xs: 12, sm: 24 }, bottom: { xs: 12, sm: 24 }, zIndex: (theme) => theme.zIndex.modal + 1, boxShadow: '0 12px 30px rgba(79, 70, 229, 0.35)' }}>
          {open ? <Close /> : <ChatBubbleOutline />}
        </Fab>
      </Tooltip>
    </>
  );
}
