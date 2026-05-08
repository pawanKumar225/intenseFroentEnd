import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box, Paper, List, ListItem, ListItemText, Divider } from '@mui/material';
import { services } from '../../data/servicesData';

export default function ServiceDetail() {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  // Find the unique data for this specific URL
  const service = services.find((s) => s.id === serviceId);

  if (!service) {
    return (
      <Container sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h4">Service Not Found</Typography>
        <Button onClick={() => navigate('/')}>Return to Services</Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 5, borderRadius: 4, textAlign: 'center', background: 'linear-gradient(to bottom, #ffffff, #fff5f8)' }}>
        {/* <Typography variant="h5" color="primary" gutterBottom>
  Course Curriculum:
</Typography>

<ul style={{ textAlign: 'left', display: 'inline-block' }}>
  {service.topics.map((item, index) => (
    <li key={index} style={{ marginBottom: '10px', fontSize: '1.1rem' }}>
      {item}
    </li>
  ))}
</ul> */}
        {/* Header Section */}
        <Typography variant="h1" sx={{ fontSize: '4rem', mb: 2 }}>{service.icon}</Typography>
        <Typography variant="h3" fontWeight="bold" gutterBottom color="primary">
          {service.title}
        </Typography>
        <Typography variant="h6" color="secondary" fontWeight="bold" sx={{ mb: 3 }}>
          Duration: {service.duration}
        </Typography>

        <Divider sx={{ mb: 4 }} />

        {/* Detailed Description */}
        <Typography variant="body1" sx={{ fontSize: '1.1rem', mb: 4, lineHeight: 1.8, color: '#555' }}>
          {service.details}
        </Typography>

        {/* Specific Curriculum/Topics */}
        <Box sx={{ textAlign: 'left', mb: 5 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            What you will learn:
          </Typography>
          <List>
            {service.topics.map((topic, index) => (
              <ListItem key={index} sx={{ borderBottom: '1px solid #eee' }}>
                <ListItemText primary={`✔ ${topic}`} />
              </ListItem>
            ))}
          </List>
        
        </Box>
        {/* RESPONSIVE YOUTUBE CONTAINER */}
        {service.youtubeId && (
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              paddingBottom: '56.25%', // 16:9 Aspect Ratio
              height: 0,
              overflow: 'hidden',
              borderRadius: 10,
              my: 4,
            //   boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            //   backgroundColor: '#000', // Black bg prevents white flash while loading
            }}
          >
            <iframe
              src={`https://www.youtube.com/embed/${service.youtubeId}`}
              title="YouTube video player"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 0,
              }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </Box>
        )}

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button 
            variant="contained" 
            size="large"
            sx={{ bgcolor: '#e91e63', '&:hover': { bgcolor: '#c2185b' } }}
          >
            Enroll Now
          </Button>
          <Button variant="outlined" size="large" onClick={() => navigate('/')}>
            Back to All Services
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}