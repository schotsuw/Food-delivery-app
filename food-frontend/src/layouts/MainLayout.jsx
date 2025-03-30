import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container, useScrollTrigger, Zoom, Fab } from '@mui/material';
import { KeyboardArrowUp } from '@mui/icons-material';
import Navbar from '../components/Navbar';
import Promo from '../components/Promo';
import Footer from '../components/Footer';

// Scroll to top button component
function ScrollTop(props) {
    const { children } = props;
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 100,
    });

    const handleClick = (event) => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <Zoom in={trigger}>
            <Box
                onClick={handleClick}
                role="presentation"
                sx={{
                    position: 'fixed',
                    bottom: 16,
                    right: 16,
                    zIndex: 1000
                }}
            >
                {children}
            </Box>
        </Zoom>
    );
}

const MainLayout = () => {
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            overflow: 'hidden' // Prevent horizontal scroll
        }}>
            {/* Fixed position elements */}
            <Box sx={{ position: 'sticky', top: 0, zIndex: 1100, bgcolor: 'white' }}>
                <Promo />
                <Navbar />
            </Box>

            {/* Main content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    width: '100%',
                    pt: 2,
                    pb: 4
                }}
            >
                <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
                    <Outlet />
                </Container>
            </Box>

            {/* Footer */}
            <Footer />

            {/* Scroll to top button */}
            <ScrollTop>
                <Fab
                    color="primary"
                    size="small"
                    aria-label="scroll back to top"
                    sx={{
                        '&:hover': {
                            transform: 'scale(1.1)',
                            transition: 'transform 0.2s'
                        }
                    }}
                >
                    <KeyboardArrowUp />
                </Fab>
            </ScrollTop>
        </Box>
    );
};

export default MainLayout;