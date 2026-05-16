import React from 'react';
import { Container, Row, Col, Badge, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { 
  FaHeart, 
  FaStar, 
  FaAward, 
  FaGraduationCap, 
  FaGem,
  FaArrowRight,
  FaCheckCircle,
  FaUsers,
  FaTrophy,
  FaLeaf
} from 'react-icons/fa';
import { 
  Box, 
  Paper, 
  Typography, 
  Chip, 
  Avatar,
  useTheme,
  alpha
} from '@mui/material';
import './ImpactfulAboutSection.css';

const ImpactfulAboutSection = () => {
  const theme = useTheme();

  // Features data
  const features = [
    {
      icon: <FaGem />,
      title: "Imported Brands",
      description: "Training with premium imported product brands",
      color: "#FF6B9D"
    },
    {
      icon: <FaTrophy />,
      title: "17+ Years Expertise",
      description: "Industry veteran leadership with certified experience",
      color: "#FF8E53"
    },
    {
      icon: <FaLeaf />,
      title: "Uncompromising Quality",
      description: "Elite-level training with premium standards",
      color: "#27AE60"
    },
    {
      icon: <FaUsers />,
      title: "Student-Centric",
      description: "Affordable pricing without compromising quality",
      color: "#3498DB"
    }
  ];

  // Stats data
  const stats = [
    { number: "17+", label: "Years of Experience", icon: <FaAward /> },
    { number: "4000+", label: "Happy Students", icon: <FaUsers /> },
    { number: "100%", label: "Practical Training", icon: <FaCheckCircle /> },
    { number: "50+", label: "Expert Courses", icon: <FaGraduationCap /> }
  ];

  return (
    <Box className="impactful-section" component="section">
      <Container>
        <Row className="align-items-center g-5">
          {/* Left Column - Image/Visual */}
          <Col lg={6} md={12}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Paper elevation={0} className="impact-image-wrapper">
                <div className="image-overlay"></div>
                <div className="floating-badge experience-badge">
                  <FaAward className="me-2" />
                  17+ Years Excellence
                </div>
                <div className="floating-badge quality-badge">
                  <FaGem className="me-2" />
                  Premium Brands
                </div>
                <img 
                  src="https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg" 
                  alt="Beauty Training"
                  className="impact-image"
                />
                <div className="image-stats">
                  <div className="stat-circle">
                    <span className="stat-number">100%</span>
                    <span className="stat-label">Success Rate</span>
                  </div>
                </div>
              </Paper>
            </motion.div>
          </Col>

          {/* Right Column - Content */}
          <Col lg={6} md={12}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Badge className="passion-badge mb-3">
                <FaHeart className="me-2" /> Empowering Dreams
              </Badge>
              
              <Typography variant="h1" className="impact-headline">
                Empowering Your{' '}
                <span className="gradient-text">Beauty Career</span>
                <br />
                with Intense Passion.
              </Typography>

              <Typography variant="body1" className="impact-description">
                At <strong>Intense Beauty Academy</strong>, our mission is simple: 
                To provide elite-level beauty training at a price that empowers 
                everyone to follow their dreams.
              </Typography>

              {/* Trainer Highlight */}
              <Paper elevation={0} className="trainer-highlight">
                <Box className="trainer-avatar">
                  <Avatar className="avatar-image">
                    <FaGraduationCap />
                  </Avatar>
                </Box>
                <Box className="trainer-info">
                  <Typography variant="h6" className="trainer-name">
                    Led by <strong className="highlight-name">Tirumala</strong>
                  </Typography>
                  <Typography variant="body2" className="trainer-exp">
                    <FaAward className="me-1" /> Industry veteran with 17+ years of certified experience
                  </Typography>
                </Box>
              </Paper>

              {/* Philosophy Box */}
              <Paper elevation={0} className="philosophy-box">
                <Typography variant="body1" className="philosophy-text">
                  We pride ourselves on an <strong>"uncompromising quality"</strong> philosophy—using only{' '}
                  <strong className="imported-text">imported product brands</strong> to give our 
                  students a competitive edge.
                </Typography>
              </Paper>

              {/* Features Grid */}
              <Row className="features-grid g-3 mt-2">
                {features.map((feature, index) => (
                  <Col xs={6} key={index}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Paper elevation={0} className="feature-card">
                        <div className="feature-icon" style={{ color: feature.color }}>
                          {feature.icon}
                        </div>
                        <Typography variant="subtitle2" className="feature-title">
                          {feature.title}
                        </Typography>
                        <Typography variant="caption" className="feature-desc">
                          {feature.description}
                        </Typography>
                      </Paper>
                    </motion.div>
                  </Col>
                ))}
              </Row>

              {/* CTA Button */}
              <Box className="cta-wrapper mt-4">
                <Button variant="primary" className="impact-cta-btn">
                  Start Your Journey <FaArrowRight className="ms-2" />
                </Button>
                <Typography variant="caption" className="cta-note">
                  ✨ Join 4000+ successful beauty professionals
                </Typography>
              </Box>
            </motion.div>
          </Col>
        </Row>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <Row className="stats-row mt-5 g-4">
            {stats.map((stat, index) => (
              <Col md={3} sm={6} key={index}>
                <Paper elevation={0} className="stat-card">
                  <div className="stat-icon">{stat.icon}</div>
                  <Typography variant="h3" className="stat-number">
                    {stat.number}
                  </Typography>
                  <Typography variant="body2" className="stat-label-text">
                    {stat.label}
                  </Typography>
                </Paper>
              </Col>
            ))}
          </Row>
        </motion.div>
      </Container>
    </Box>
  );
};

export default ImpactfulAboutSection;