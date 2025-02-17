import React, { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import PhoneInput from "react-phone-number-input";
import { observer } from "mobx-react-lite";
import { attorneyStore } from "../stores/attorneyStore";
import "react-phone-number-input/style.css";
import translations from "./Translations";
import { parsePhoneNumberFromString } from 'libphonenumber-js';

const EditPopUp = observer(({ open, onClose, selectedId, setAlert, language }) => {
    const translate = translations[language];

    const [formData, setFormData] = useState({
        id: "",
        firstName: "",
        lastName: "",
        specialty: "",
        phoneNumber: "",
        email: "",
        indicator: "",
        countryPhone: "",
        description: "",
        totalCases: 0,
        wonCases: 0,
    });

    useEffect(() => {
        if (open && selectedId) {
            const fetchAttorney = async () => {
                try {
                    const response = await fetch(`/api/attorneys`);
                    const data = await response.json();
                    const attorney = data.find((att) => att.id === selectedId);

                    if (attorney) {
                        setFormData(attorney);

                        const parsedPhone = parsePhoneNumberFromString(attorney.phoneNumber);
                        if (parsedPhone) {
                            setFormData(prevData => ({
                                ...prevData,
                                phoneNumber: attorney.phoneNumber,
                                indicator: "+" + parsedPhone.countryCallingCode,
                                countryPhone: parsedPhone.country,
                            }));
                        }
                    } else {
                        setAlert({ severity: "error", message: translate.attorneyNotFound });
                    }
                } catch (error) {
                    setAlert({ severity: "error", message: translate.loadError });
                }
            };

            fetchAttorney();
        }
    }, [open, selectedId]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: name === "totalCases" || name === "wonCases" ? parseInt(value, 10) : value
        });
    };


    const handlePhoneChange = (value) => {
        setFormData({ ...formData, phoneNumber: value });
        const parsedPhone = parsePhoneNumberFromString(value);
        if (parsedPhone) {
            setFormData(prevData => ({
                ...prevData,
                indicator: "+" + parsedPhone.countryCallingCode,
                countryPhone: parsedPhone.country,
            }));
        }
    };

    const handleSave = async () => {
        if (!formData.firstName || !formData.lastName || !formData.specialty || !formData.phoneNumber || !formData.email || !formData.description || formData.totalCases === undefined || formData.wonCases === undefined) {
            setAlert({ severity: "error", message: translate.fieldsRequired });
            return;
        }

        try {
            const response = await fetch("/api/attorneys", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error(translate.saveFailed);
            }

            attorneyStore.fetchAttorneys();

            setAlert({ severity: "success", message: translate.attorneyUpdated });
            onClose();
        } catch (error) {
            setAlert({ severity: "error", message: translate.saveFailed });
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{translate.editAttorney}</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    name="firstName"
                    label={translate.datagridFirstName}
                    type="text"
                    fullWidth
                    variant="standard"
                    value={formData.firstName}
                    disabled
                    onChange={handleChange}
                    required
                />

                <TextField
                    margin="dense"
                    name="lastName"
                    label={translate.datagridLastName}
                    type="text"
                    fullWidth
                    variant="standard"
                    value={formData.lastName}
                    disabled
                    onChange={handleChange}
                    required
                />

                <FormControl fullWidth variant="standard" margin="dense" required>
                    <InputLabel>{translate.datagridSpecialty}</InputLabel>
                    <Select name="specialty" value={formData.specialty} onChange={handleChange}>
                        {Object.keys(translate.specialties).map((key) => (
                            <MenuItem key={key} value={key}>
                                {translate.specialties[key]}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <DialogContent
                    sx={{
                        '& .phone-input-container': {
                            marginTop: '16px',
                            marginBottom: '8px',
                            width: '100%',
                        },
                        '& .phone-input-container .PhoneInput': {
                            display: 'flex',
                            alignItems: 'center',
                            borderBottom: '1px solid #949494',
                            padding: '4px',
                            width: '100%',
                        },
                        '& .phone-input-container .PhoneInput input': {
                            flex: 1,
                            border: 'none',
                            outline: 'none',
                            fontSize: '16px',
                            padding: '8px',
                            background: 'none',
                            color: 'black !important',
                        },
                        '& .phone-input-container .PhoneInput select': {
                            fontSize: '16px',
                            padding: '8px',
                            borderRadius: '5px',
                            marginRight: '8px',
                        },
                        padding: 0,
                    }}
                >
                    <div className="phone-input-container">
                        <PhoneInput
                            defaultCountry="FR"
                            value={formData.phoneNumber}
                            onChange={handlePhoneChange}
                            international
                            countryCallingCodeEditable={false}
                            required
                        />
                    </div>
                </DialogContent>

                <TextField
                    margin="dense"
                    name="email"
                    label={translate.datagridEmail}
                    type="email"
                    fullWidth
                    variant="standard"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <TextField
                    margin="dense"
                    name="description"
                    label={translate.datagridDescription}
                    type="text"
                    fullWidth
                    variant="standard"
                    value={formData.description}
                    onChange={handleChange}
                    multiline
                    rows={4}
                />

                <TextField
                    margin="dense"
                    name="totalCases"
                    label={translate.datagridTotalCases}
                    type="number"
                    fullWidth
                    variant="standard"
                    value={formData.totalCases}
                    onChange={handleChange}
                />

                <TextField
                    margin="dense"
                    name="wonCases"
                    label={translate.datagridWonCases}
                    type="number"
                    fullWidth
                    variant="standard"
                    value={formData.wonCases}
                    onChange={handleChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    {translate.cancel}
                </Button>
                <Button onClick={handleSave} color="primary">
                    {translate.save}
                </Button>
            </DialogActions>
        </Dialog>
    );
});

export default EditPopUp;
