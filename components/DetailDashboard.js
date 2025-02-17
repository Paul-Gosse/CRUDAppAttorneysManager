import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import translations from './Translations';
import Grid from '@mui/material/Grid2';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from 'chart.js';
import { useMediaQuery } from '@mui/material';

// Register necessary Chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

// Define specialty styles for different types of law
const specialtyStyles = {
    "Personal Law": { backgroundColor: "#FAE3D9", color: "#E07A5F" },
    "Criminal Law": { backgroundColor: "#F7D6E0", color: "#D96B92" },
    "Family Law": { backgroundColor: "#C6E2E9", color: "#5A8A97" },
    "Real Estate Law": { backgroundColor: "#F9E5C0", color: "#D89B5E" },
    "Rural Law": { backgroundColor: "#F4E1C4", color: "#C28E44" },
    "Environmental Law": { backgroundColor: "#CDEAC0", color: "#6B8E4E" },
    "Public Law": { backgroundColor: "#FAD2E1", color: "#C56C86" },
    "Intellectual Property Law": { backgroundColor: "#D5C6E0", color: "#7A5FAE" },
    "Commercial Law": { backgroundColor: "#FBE4D8", color: "#E48F69" },
    "Corporate Law": { backgroundColor: "#E3D9FA", color: "#7B61A6" },
    "Tax Law": { backgroundColor: "#FFF1C9", color: "#D4A632" },
    "Social Law": { backgroundColor: "#B5EAD7", color: "#429E7D" },
    "Economic Law": { backgroundColor: "#E4D8C7", color: "#A07E5E" },
    "Enforcement Law": { backgroundColor: "#FFC5C5", color: "#C75D5D" },
    "Community Law": { backgroundColor: "#C7DFFC", color: "#5978A7" },
    "International Relations Law": { backgroundColor: "#E3C6F2", color: "#8B4FB1" },
    default: { backgroundColor: "#E0E0E0", color: "#7A7A7A" },
};

// Main component displaying attorney details with statistical insights
const DetailDashboard = ({ attorney, language }) => {
    const translate = translations[language];
    const isMobile800 = useMediaQuery('(max-width:800px)');
    const isMobile500 = useMediaQuery('(max-width:500px)');

    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: 0,
            paddingBottom: 20,
        }}>
            <Box sx={{
                maxWidth: 1100,
                width: "100%",
                padding: 3,
                borderRadius: 2,
                boxShadow: 3,
                backgroundColor: "#f5f5f5",
            }}>
                <Typography variant="h4" gutterBottom align="center">
                    {translate.detailDashboardTitle}
                </Typography>
                <Grid container spacing={2} justifyContent="center" direction="column" alignItems="center">
                    {/* Display general information about the attorney */}
                    <Grid size={isMobile800 ? 12 : 6}>
                        <Paper sx={{
                            padding: 2,
                            borderRadius: 2,
                            boxShadow: 2,
                            backgroundColor: "#ffffff",
                            marginBottom: 2,
                        }}>
                            <div style={{ textAlign: "center" }}>
                                <Typography variant="h6" sx={{ marginBottom: 2 }}>{translate.generalInformations}</Typography>
                            </div>
                            <Typography><strong>{translate.name}:</strong> {attorney.firstName} {attorney.lastName}</Typography>
                            <strong>{translate.datagridSpecialty}: </strong>
                            <Typography
                                sx={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    padding: "4px 8px",
                                    borderRadius: "8px",
                                    backgroundColor: specialtyStyles[attorney.specialty]?.backgroundColor || specialtyStyles.default.backgroundColor,
                                    color: specialtyStyles[attorney.specialty]?.color || specialtyStyles.default.color,
                                    fontSize: "0.9rem",
                                    fontWeight: "500",
                                }}
                            >
                                {translate.specialties[attorney.specialty] || attorney.specialty}
                            </Typography>

                            <Typography><strong>{translate.datagridDescription}:</strong> {attorney.description}</Typography>
                        </Paper>
                    </Grid>

                    {/* Display attorney case results using a pie chart */}
                    <Grid size={isMobile800 ? 12 : 6}>
                        <Paper sx={{
                            padding: 2,
                            borderRadius: 2,
                            boxShadow: 2,
                            backgroundColor: "#ffffff",
                            marginBottom: 2,
                        }}>
                            <div style={{ textAlign: "center" }}>
                                <Typography variant="h6" sx={{ marginBottom: 2 }}>{translate.resultAnalysis}</Typography>
                            </div>

                            <div style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: "20px"
                            }}>
                                <div style={{ width: "50%" }}>
                                    <Pie
                                        data={{
                                            labels: [translate.datagridWonCases, translate.datagridLostCases],
                                            datasets: [
                                                {
                                                    data: [attorney.wonCases, attorney.totalCases - attorney.wonCases],
                                                    backgroundColor: ['#4caf50', '#f44336'],
                                                    borderColor: ['#ffffff', '#ffffff'],
                                                    borderWidth: 2
                                                }
                                            ]
                                        }}
                                        options={{
                                            responsive: true,
                                            plugins: {
                                                legend: {
                                                    position: 'bottom',
                                                    labels: {
                                                        usePointStyle: true,
                                                        boxWidth: 10,
                                                    }
                                                },
                                                tooltip: {
                                                    callbacks: {
                                                        label: (tooltipItem) => {
                                                            const label = tooltipItem.label || '';
                                                            const value = tooltipItem.raw || 0;
                                                            return `${label}: ${value} (${((value / attorney.totalCases) * 100).toFixed(2)}%)`;
                                                        }
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                </div>

                                {!isMobile500 && (
                                    <div style={{ textAlign: "center" }}>
                                        <Typography variant="body1" sx={{ fontWeight: "500", color: "#333" }}>
                                            {translate.datagridTotalCases}
                                        </Typography>
                                        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#333" }}>
                                            {attorney.totalCases}
                                        </Typography>
                                    </div>
                                )}

                            </div>
                        </Paper>
                    </Grid>
                    <Grid size={isMobile800 ? 12 : 6}>
                        <Paper sx={{
                            padding: 2,
                            borderRadius: 2,
                            boxShadow: 2,
                            backgroundColor: "#ffffff",
                        }}>
                            <div style={{ textAlign: "center" }}>
                                <Typography variant="h6" sx={{ marginBottom: 2 }}>{translate.contact}</Typography>
                            </div>
                            <Typography>
                                <strong>{translate.datagridEmail}:</strong>{" "}
                                <a
                                    href={`mailto:${attorney.email}`}
                                    style={{ color: "#1976d2", textDecoration: "none", fontWeight: "bold", cursor: "pointer" }}
                                    onClick={(e) => {
                                        if (!attorney.email) {
                                            e.preventDefault();
                                            alert("Aucun email disponible");
                                        }
                                    }}
                                >
                                    {attorney.email}
                                </a>
                            </Typography>


                            <Typography>
                                <strong>{translate.phone}:</strong>{" "}
                                <a
                                    href={`tel:${attorney.phoneNumber}`}
                                    style={{ color: "#1976d2", textDecoration: "none", fontWeight: "bold", cursor: "pointer" }}
                                    onClick={(e) => {
                                        if (!attorney.phoneNumber) {
                                            e.preventDefault();
                                            alert("Aucun numéro disponible");
                                        }
                                    }}
                                >
                                    {attorney.phoneNumber}
                                </a>
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </div >
    );
};

export default DetailDashboard;
