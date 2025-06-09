import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';
import '@fontsource/poppins/300.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';

const baseTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#2E7D32', // Forest green
            light: '#4CAF50',
            dark: '#1B5E20',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: '#795548', // Earth brown
            light: '#A1887F',
            dark: '#4E342E',
            contrastText: '#FFFFFF',
        },
        info: {
            main: '#42A5F5',
            light: '#64B5F6',
            dark: '#1976D2',
        },
        warning: {
            main: '#FFA726',
            light: '#FFB74D',
            dark: '#F57C00',
        },
        background: {
            default: '#F5F5F5',
            paper: '#FFFFFF',
        },
        success: {
            main: '#66BB6A',
            light: '#81C784',
            dark: '#388E3C',
        },
        error: {
            main: '#E57373',
            light: '#EF9A9A',
            dark: '#D32F2F',
        },
    },
    typography: {
        fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontSize: '2.5rem',
            fontWeight: 600,
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 600,
        },
        h3: {
            fontSize: '1.75rem',
            fontWeight: 600,
        },
        h4: {
            fontSize: '1.5rem',
            fontWeight: 500,
        },
        h5: {
            fontSize: '1.25rem',
            fontWeight: 500,
        },
        h6: {
            fontSize: '1rem',
            fontWeight: 500,
        },
        button: {
            textTransform: 'none',
            fontWeight: 500,
        },
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    scrollbarWidth: 'thin',
                    '&::-webkit-scrollbar': {
                        width: '8px',
                        height: '8px',
                    },
                    '&::-webkit-scrollbar-track': {
                        background: '#f1f1f1',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: '#c1c1c1',
                        borderRadius: '4px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                        background: '#a8a8a8',
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 25,
                    padding: '8px 24px',
                    fontSize: '1rem',
                    transition: 'all 0.2s ease-in-out',
                },
                contained: {
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        transform: 'translateY(-2px)',
                    },
                    '&:active': {
                        boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                        transform: 'translateY(0)',
                    },
                },
                outlined: {
                    borderWidth: '2px',
                    '&:hover': {
                        borderWidth: '2px',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    borderRadius: 16,
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    overflow: 'hidden',
                },
            },
        },
        MuiCardContent: {
            styleOverrides: {
                root: {
                    padding: '24px',
                    '&:last-child': {
                        paddingBottom: '24px',
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 8,
                        transition: 'box-shadow 0.2s ease-in-out, border-color 0.2s ease-in-out',
                        '&:hover': {
                            borderColor: '#2E7D32',
                        },
                        '&.Mui-focused': {
                            boxShadow: `0 0 0 2px ${alpha('#2E7D32', 0.2)}`,
                        },
                    },
                    '& .MuiInputLabel-root': {
                        fontWeight: 500,
                    },
                    '& .MuiInputBase-input': {
                        padding: '14px 16px',
                    },
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: '#2E7D32',
                    color: '#FFFFFF',
                    '& .MuiListItemIcon-root': {
                        color: '#FFFFFF',
                    },
                    '& .MuiListItemText-primary': {
                        color: '#FFFFFF',
                    },
                    '& .MuiTypography-root': {
                        color: '#FFFFFF',
                    },
                    '& .MuiListItem-root': {
                        margin: '4px 8px',
                        borderRadius: 8,
                        '&:hover': {
                            backgroundColor: alpha('#FFFFFF', 0.1),
                        },
                    },
                    '& .MuiListItemButton-root': {
                        borderRadius: 8,
                        '&.Mui-selected': {
                            backgroundColor: alpha('#FFFFFF', 0.15),
                            '&:hover': {
                                backgroundColor: alpha('#FFFFFF', 0.2),
                            },
                        },
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                },
                elevation1: {
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                },
                elevation2: {
                    boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
                },
                elevation3: {
                    boxShadow: '0 6px 12px rgba(0,0,0,0.05)',
                },
                elevation4: {
                    boxShadow: '0 8px 16px rgba(0,0,0,0.05)',
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    fontWeight: 500,
                    height: '32px',
                    fontSize: '0.875rem',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-1px)',
                    },
                },
                filled: {
                    '&.MuiChip-colorPrimary': {
                        backgroundColor: alpha('#2E7D32', 0.1),
                        color: '#2E7D32',
                    },
                    '&.MuiChip-colorSecondary': {
                        backgroundColor: alpha('#795548', 0.1),
                        color: '#795548',
                    },
                    '&.MuiChip-colorSuccess': {
                        backgroundColor: alpha('#66BB6A', 0.1),
                        color: '#388E3C',
                    },
                    '&.MuiChip-colorError': {
                        backgroundColor: alpha('#E57373', 0.1),
                        color: '#D32F2F',
                    },
                },
            },
        },
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 960,
            lg: 1280,
            xl: 1920,
        },
    },
});

// Apply responsive font sizes
export const theme = responsiveFontSizes(baseTheme);
