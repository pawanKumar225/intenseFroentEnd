import React from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { 
  FaClock, 
  FaCheckCircle, 
  FaArrowRight, 
  FaStar, 
  FaUsers,
  FaCertificate,
  FaAward,
  FaHandsHelping
} from 'react-icons/fa';
import './ServicesPage.css';

// Your exact service data with enhanced details
const services = [
  {
    id: 1,
    title: "Beauty Therapist",
    desc: "Comprehensive training in skincare, facials, and client consultation techniques.",
    icon: "🧖‍♀️",
    tagline: "Become a certified beauty therapist in 3 months",
    duration: "12 weeks • 24 sessions",
    students: "450+ trained",
    format: "Theory + Practical",
    rating: "4.9",
    link: "/services/beauty-therapist" // Your existing link
  },
  {
    id: 2,
    title: "Hair Dressing",
    desc: "Learn cutting, coloring, and professional salon hair styling techniques.",
    icon: "✂️",
    tagline: "Master professional hair styling techniques",
    duration: "10 weeks • 20 sessions",
    students: "380+ trained",
    format: "Live models",
    rating: "4.8",
    link: "/services/hair-dressing"
  },
  {
    id: 3,
    title: "Cosmetology",
    desc: "Advanced beauty science including skin, hair, and cosmetic treatments.",
    icon: "🧴",
    tagline: "Complete beauty science certification",
    duration: "16 weeks • 32 sessions",
    students: "520+ trained",
    format: "Advanced course",
    rating: "4.9",
    link: "/services/cosmetology"
  },
  {
    id: 4,
    title: "Make-up",
    desc: "Professional makeup techniques for bridal, fashion, and special occasions.",
    icon: "💄",
    tagline: "From basic to pro makeup artist",
    duration: "8 weeks • 16 sessions",
    students: "680+ trained",
    format: "Hands-on training",
    rating: "5.0",
    link: "/services/make-up"
  },
  {
    id: 5,
    title: "Hair Style",
    desc: "Master modern and traditional hairstyles for events and bridal looks.",
    icon: "💇‍♀️",
    tagline: "Create stunning hairstyles for every occasion",
    duration: "6 weeks • 12 sessions",
    students: "290+ trained",
    format: "Practical focus",
    rating: "4.7",
    link: "/services/hair-style"
  },
  {
    id: 6,
    title: "Mehandi",
    desc: "Beautiful mehndi designs for weddings and special occasions, featuring intricate patterns and traditional artistry.",
    icon: "🌿",
    tagline: "From basic to bridal mehndi artist",
    duration: "8 weeks • 16 sessions",
    students: "560+ trained",
    format: "Design mastery",
    rating: "4.9",
    link: "/services/mehandi"
  },
  {
    id: 7,
    title: "Saree Draping",
    desc: "Learn elegant saree draping styles for weddings and special occasions.",
    icon: "👗",
    tagline: "Master 20+ saree draping styles",
    duration: "4 weeks • 8 sessions",
    students: "320+ trained",
    format: "Quick mastery",
    rating: "4.8",
    link: "/services/saree-draping"
  },
  {
    id: 8,
    title: "Flower Making",
    desc: "Create beautiful floral accessories for bridal hairstyles and decorations.",
    icon: "🌸",
    tagline: "Professional floral accessory design",
    duration: "5 weeks • 10 sessions",
    students: "210+ trained",
    format: "Creative course",
    rating: "4.7",
    link: "/services/flower-making"
  },
  {
    id: 9,
    title: "Nail Art",
    desc: "Creative nail design techniques including extensions, gel, and polish art.",
    icon: "💅",
    tagline: "Become a certified nail artist",
    duration: "6 weeks • 12 sessions",
    students: "440+ trained",
    format: "Kit included",
    rating: "4.8",
    link: "/services/nail-art"
  }
];

const ServicesPage = () => {
  const handleShowMore = (link) => {
    // Preserves your existing navigation from flip cards
    if (typeof window !== 'undefined') {
      window.location.href = link;
      // If using React Router, use:
      // navigate(link);
    }
  };

  return (
    <div className="services-page">
      {/* Hero Section */}
      <section className="services-hero">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="hero-title">
              Our <span className="highlight">Premium Services</span>
            </h1>
            <p className="hero-subtitle">
              Transform your passion into profession with industry-leading courses
            </p>
            <div className="hero-badges">
  <Badge className="info-badge course-badge">
    <FaStar className="me-1" /> 9+ Expert Courses
  </Badge>
  <Badge className="info-badge students-badge ms-2">
    <FaUsers className="me-1" /> 4000+ Students Trained
  </Badge>
</div>
          </motion.div>
        </Container>
      </section>

      {/* Services Grid Section */}
      <section className="services-grid-section">
        <Container>
          <Row className="g-4">
            {services.map((service, index) => (
              <Col key={service.id} lg={4} md={6} sm={12}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  whileHover={{ y: -8 }}
                >
                  <Card className="service-card h-100">
                    <div className="card-icon-wrapper">
                      <div className="card-icon">
                        <span className="icon-emoji">{service.icon}</span>
                      </div>
                      <Badge className="rating-badge">
                        <FaStar className="me-1" /> {service.rating}
                      </Badge>
                    </div>
                    
                    <Card.Body>
                      <Card.Title className="service-title">
                        {service.title}
                      </Card.Title>
                      
                      <p className="service-tagline">{service.tagline}</p>
                      
                      <p className="service-description">{service.desc}</p>
                      
                      <div className="service-features">
                        <div className="feature-item">
                          <FaClock className="feature-icon" />
                          <span>{service.duration}</span>
                        </div>
                        <div className="feature-item">
                          <FaUsers className="feature-icon" />
                          <span>{service.students}</span>
                        </div>
                        <div className="feature-item">
                          <FaCertificate className="feature-icon" />
                          <span>{service.format}</span>
                        </div>
                      </div>

                      <Button 
                        variant="primary"
                        className="show-more-btn"
                        onClick={() => handleShowMore(service.link)}
                      >
                        Show more <FaArrowRight className="ms-2" />
                      </Button>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>

          {/* Navigation Consistency Note */}
          <div className="navigation-note text-center mt-5">
            <p className="text-muted">
              💡 <strong>Note:</strong> Click "Show more" to view detailed service information - 
              Same as our homepage flip cards
            </p>
          </div>
        </Container>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose-us">
        <Container>
          <h2 className="section-title text-center mb-5">Why Choose Our Academy?</h2>
          <Row className="g-4">
            <Col md={3} sm={6}>
              <div className="choose-card">
                <FaAward className="choose-icon" />
                <h4>Certified Courses</h4>
                <p>Industry recognized certification</p>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className="choose-card">
                <FaHandsHelping className="choose-icon" />
                <h4>Practical Training</h4>
                <p>100% hands-on experience</p>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className="choose-card">
                <FaUsers className="choose-icon" />
                <h4>Expert Trainers</h4>
                <p>Learn from industry professionals</p>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className="choose-card">
                <FaCertificate className="choose-icon" />
                <h4>Placement Support</h4>
                <p>Job assistance after completion</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default ServicesPage;