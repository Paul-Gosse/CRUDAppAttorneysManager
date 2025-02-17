import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Box, Typography, Paper, CircularProgress, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import CreateIcon from '@mui/icons-material/Create';
import AddPopUp from '../../../components/AddPopUp';
import { attorneyStore } from '../../../stores/attorneyStore';
import AlertMessage from '../../../components/AlertMessage';
import LanguageSelector from '../../../components/LanguageSelector';
import translations from '../../../components/Translations';
import DeleteIcon from '@mui/icons-material/Delete';
import EditPopUp from '../../../components/EditPopUp';
import { useMediaQuery } from '@mui/material';
import DetailDashboard from '../../../components/DetailDashboard';

// Object containing styles for different law specialties
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


// Observer main component
const AttorneyList = observer(() => {
  const [openAddPopup, setOpenAddPopup] = useState(false);
  const [openEditPopup, setOpenEditPopup] = useState(false);
  const [selectedRow, setSelectedRow] = useState([]);
  const [alert, setAlert] = useState({ severity: '', message: '' });
  const [language, setLanguage] = useState('en');
  const [selectedAttorneyId, setSelectedAttorneyId] = useState(null);
  const [columnsDataGrid, setColumnsDataGrid] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState("");

  // Media query hooks to detect screen size and adjust the data grid columns accordingly
  const isMobile800 = useMediaQuery('(max-width:800px)');
  const isMobile500 = useMediaQuery('(max-width:500px)');

  // Adjust columns in the data grid based on screen size and language
  useEffect(() => {
    if (isMobile500) {
      setColumnsDataGrid(defaultColumns.filter(col => col.field !== 'phoneNumber' && col.field !== 'email' && col.field !== 'firstName'));
    } else if (isMobile800) {
      setColumnsDataGrid(defaultColumns.filter(col => col.field !== 'phoneNumber'));
    } else {
      setColumnsDataGrid(defaultColumns);
    }
  }, [isMobile800, isMobile500, language]);

  // Get the translation object for the selected language
  const translate = translations[language];

  // Load saved language preference from local storage on component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Handle click on the Edit button to open the Edit Popup with selected attorney data
  const handleEditClick = () => {
    if (selectedRow.length > 0) {
      setSelectedAttorneyId(selectedRow[0]);
      setOpenEditPopup(true);
    }
  };

  // Default column definitions for the data grid
  const defaultColumns = [
    { field: 'firstName', headerName: translate.datagridFirstName, flex: 1, headerAlign: 'center' },
    { field: 'lastName', headerName: translate.datagridLastName, flex: 1, headerAlign: 'center' },
    {
      field: 'specialty',
      headerName: translate.datagridSpecialty,
      flex: 1.5,
      headerAlign: 'center',
      renderCell: (params) => {
        const specialty = params.value || "default";
        const translatedSpecialty = translations[language]?.specialties[specialty] || specialty;
        const style = specialtyStyles[specialty] || specialtyStyles.default;

        return (
          <div style={{
            ...style,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "4px 8px",
            borderRadius: "8px",
            maxWidth: "fit-content",
            fontSize: "0.9rem",
            fontWeight: "500",
            alignSelf: "center",
            height: "60%"
          }}>
            {translatedSpecialty}
          </div>
        );
      }
    },
    { field: 'phoneNumber', headerName: translate.datagridPhoneNumber, flex: 1, headerAlign: 'center' },
    { field: 'email', headerName: translate.datagridEmail, flex: 1.5, headerAlign: 'center' },
  ];

  // Handle language change and update the localStorage for persistence
  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  // Fetch attorneys data when the component mounts
  useEffect(() => {
    attorneyStore.fetchAttorneys();
  }, []);

  return (
    <>
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        zIndex: 1000,
      }}>
        <LanguageSelector currentLang={language} onChange={handleLanguageChange} />
      </div>

      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: "15vh",
        paddingBottom: "5vh",
        margin: 0,
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
            {translate.homePageTitle}
          </Typography>

          {alert.message && <AlertMessage severity={alert.severity} message={alert.message} onClose={() => setAlert({ severity: '', message: '' })} />}

          {attorneyStore.isLoading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
              <CircularProgress />
            </div>
          ) : (
            <>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", marginBottom: 2 }}>
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel shrink>{translate.datagridSpecialty}</InputLabel>
                  <Select
                    label={translate.datagridSpecialty}
                    value={selectedSpecialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                    displayEmpty
                  >
                    <MenuItem value="">{translate.allSpecialties}</MenuItem>
                    {Object.keys(translations[language].specialties).map((key) => (
                      <MenuItem key={key} value={key}>
                        {translations[language].specialties[key]}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    variant="contained"
                    onClick={() => setOpenAddPopup(true)}
                    sx={{ borderRadius: "50%", minWidth: 0, height: "40px", width: "40px" }}
                  >
                    <AddIcon style={{ fontSize: 24 }} />
                  </Button>

                  <Button
                    variant="contained"
                    onClick={handleEditClick}
                    sx={{ borderRadius: "50%", minWidth: 0, height: "40px", width: "40px" }}
                    disabled={selectedRow.length === 0}
                  >
                    <CreateIcon style={{ fontSize: 24 }} />
                  </Button>

                  <Button
                    variant="contained"
                    onClick={() => {
                      if (selectedRow.length > 0) {
                        const attorneyId = selectedRow[0];
                        attorneyStore.deleteAttorney(attorneyId)
                          .then(() => {
                            setAlert({
                              severity: 'success',
                              message: translate.successDelete,
                            });
                          })
                          .catch(() => {
                            setAlert({
                              severity: 'error',
                              message: translate.failedDelete,
                            });
                          });
                      }
                    }}
                    sx={{ borderRadius: "50%", minWidth: 0, height: "40px", width: "40px" }}
                    disabled={selectedRow.length === 0}
                  >
                    <DeleteIcon style={{ fontSize: 24 }} />
                  </Button>
                </Box>
              </Box>

              <Paper sx={{ height: 400, width: "100%" }}>
                <DataGrid
                  rows={attorneyStore.attorneys.filter(attorney =>
                    selectedSpecialty ? attorney.specialty === selectedSpecialty : true
                  )}
                  columns={columnsDataGrid}
                  pageSize={5}
                  rowsPerPageOptions={[5, 10]}
                  sx={{
                    border: 0,
                    borderRadius: 10,
                    '& .MuiDataGrid-cell:focus': {
                      outline: 'none',
                    },
                    '& .MuiDataGrid-cell': {
                      cursor: 'default',
                      userSelect: 'none',
                      caretColor: 'transparent',
                    },
                  }}
                  rowSelectionModel={selectedRow}
                  onRowSelectionModelChange={(newSelection) => {
                    if (newSelection.length === 0) {
                      setSelectedRow([]);
                      setSelectedAttorneyId(null);
                    } else {
                      const selectedId = newSelection[0];
                      if (selectedRow.includes(selectedId)) {
                        setSelectedRow([]);
                        setSelectedAttorneyId(null);
                      } else {
                        setSelectedRow(newSelection);
                        setSelectedAttorneyId(selectedId);
                      }
                    }
                  }}

                />
              </Paper>

            </>
          )}
        </Box>
      </div >

      {selectedAttorneyId && attorneyStore.attorneys.find(attorney => attorney.id === selectedAttorneyId) && (
        <Box sx={{ marginTop: 1 }}>
          <DetailDashboard
            attorney={attorneyStore.attorneys.find(attorney => attorney.id === selectedAttorneyId)}
            language={language}
          />
        </Box>
      )}

      <AddPopUp
        open={openAddPopup}
        onClose={() => setOpenAddPopup(false)}
        onSave={() => setOpenAddPopup(false)}
        setAlert={setAlert}
        language={language}
      />
      <EditPopUp
        open={openEditPopup}
        onClose={() => setOpenEditPopup(false)}
        selectedId={selectedAttorneyId}
        setAlert={setAlert}
        language={language}
      />
    </>
  );
});

export default AttorneyList;