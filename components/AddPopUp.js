import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import PhoneInput from 'react-phone-number-input';
import { attorneyStore } from '../stores/attorneyStore';
import 'react-phone-number-input/style.css';
import translations from './Translations';
import parsePhoneNumberFromString from 'libphonenumber-js';

// AddPopUp component: A modal dialog for adding a new attorney.
const AddPopUp = ({ open, onClose, onSave, setAlert, language }) => {

    // Translate process
    const translate = translations[language];

    const [phoneNumber, setPhoneNumber] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [email, setEmail] = useState('');
    const [indicator, setIndicator] = useState('');
    const [countryPhone, setCountryPhone] = useState('');
    const [description, setDescription] = useState('');
    const [totalCases, setTotalCases] = useState('');
    const [wonCases, setWonCases] = useState('');

    useEffect(() => {
        if (!open) {
            resetForm();
        }
    }, [open]);

    // Resets the form fields when the dialog closes
    const resetForm = () => {
        setFirstName('');
        setLastName('');
        setSpecialty('');
        setPhoneNumber('');
        setEmail('');
        setIndicator('');
        setCountryPhone('');
        setDescription('');
        setTotalCases('');
        setWonCases('');
    };

    // Validates email format
    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    // Handles form submission and validation
    const handleSave = async () => {
        if (!firstName || !lastName || !specialty || !phoneNumber || !email || !totalCases || !wonCases || !description) {
            setAlert({ severity: 'error', message: translate.fieldsRequired });
            return;
        }

        if (!isValidEmail(email)) {
            setAlert({ severity: 'error', message: translate.invalidEmail });
            return;
        }

        const parsedPhone = parsePhoneNumberFromString(phoneNumber);
        if (!parsedPhone || !parsedPhone.isValid()) {
            setAlert({ severity: 'error', message: translate.invalidPhoneNumber });
            return;
        }

        const totalCasesNumber = Number(totalCases);
        const wonCasesNumber = Number(wonCases);

        if (isNaN(totalCasesNumber) || isNaN(wonCasesNumber)) {
            setAlert({ severity: 'error', message: translate.invalidNumber });
            return;
        }

        const newAttorney = {
            id: Date.now(),
            firstName,
            lastName,
            specialty,
            phoneNumber,
            indicator,
            countryPhone,
            email,
            description,
            totalCases: totalCasesNumber,
            wonCases: wonCasesNumber,
        };

        try {
            const response = await fetch('/api/attorneys', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newAttorney),
            });

            if (!response.ok) {
                throw new Error(translate.saveFailed);
            }

            attorneyStore.addAttorney(newAttorney);
            attorneyStore.fetchAttorneys();
            onSave();
            setAlert({ severity: 'success', message: translate.attorneySaved });
        } catch (error) {
            setAlert({ severity: 'error', message: translate.saveFailed });
        }
    };

    // Handles phone number input and extracts country details
    const handlePhoneChange = (value) => {
        setPhoneNumber(value);
        const parsedPhone = parsePhoneNumberFromString(value);
        if (parsedPhone) {
            setIndicator("+" + parsedPhone.countryCallingCode);
            setCountryPhone(parsedPhone.country);
        }
    };

    return (
        <Dialog open={open} onClose={() => { resetForm(); onClose(); }} fullWidth maxWidth="sm">
            <DialogTitle>{translate.addNewAttorney}</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="firstName"
                    label={translate.datagridFirstName}
                    type="text"
                    fullWidth
                    variant="standard"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                />

                <TextField
                    margin="dense"
                    id="lastName"
                    label={translate.datagridLastName}
                    type="text"
                    fullWidth
                    variant="standard"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                />

                <FormControl fullWidth variant="standard" margin="dense" required>
                    <InputLabel>{translate.datagridSpecialty}</InputLabel>
                    <Select
                        value={specialty}
                        onChange={(e) => setSpecialty(e.target.value)}
                        label={translate.datagridSpecialty}
                    >
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
                            value={phoneNumber}
                            onChange={handlePhoneChange}
                            international
                            countryCallingCodeEditable={false}
                            required
                        />
                    </div>
                </DialogContent>

                <TextField
                    margin="dense"
                    id="email"
                    label={translate.datagridEmail}
                    type="email"
                    fullWidth
                    variant="standard"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <TextField
                    margin="dense"
                    id="description"
                    label={translate.datagridDescription}
                    type="text"
                    fullWidth
                    variant="standard"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    multiline
                    rows={4}
                />

                <TextField
                    margin="dense"
                    id="totalCases"
                    label={translate.datagridTotalCases}
                    type="number"
                    fullWidth
                    variant="standard"
                    value={totalCases}
                    onChange={(e) => setTotalCases(e.target.value)}
                    required
                />

                <TextField
                    margin="dense"
                    id="wonCases"
                    label={translate.datagridWonCases}
                    type="number"
                    fullWidth
                    variant="standard"
                    value={wonCases}
                    onChange={(e) => setWonCases(e.target.value)}
                    required
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => { resetForm(); onClose(); }} color="primary">
                    {translate.cancel}
                </Button>
                <Button onClick={handleSave} color="primary">
                    {translate.save}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddPopUp;
