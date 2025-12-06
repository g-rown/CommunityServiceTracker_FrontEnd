// pages/ProgramApplication.js
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage'; // 🔑 IMPORT ASYNC STORAGE

// *** 🔑 ACTUAL TOKEN RETRIEVAL FUNCTION ***
const getAuthToken = async () => {
    try {
        // Retrieve the token saved during the login process
        const token = await AsyncStorage.getItem('userToken');
        return token; // Returns the token string or null if not found
    } catch (e) {
        console.error("Failed to retrieve token from storage:", e);
        return null;
    }
};


export default function ProgramApplication({ route, navigation }) {
    const { program } = route.params;

    const API_URL = "http://127.0.0.1:8000/api/CSTracker/applications/";

    // 🔑 NEW STATE: To store the authentication token
    const [authToken, setAuthToken] = useState(null);

    // 🔑 NEW EFFECT: To load the authentication token when the component mounts
    useEffect(() => {
        const loadToken = async () => {
            const token = await getAuthToken();
            setAuthToken(token);
        };
        loadToken();
    }, []);

    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        course: "",
        year_level: "",
        emergency_contact_name: "",
        emergency_contact_phone: "",
    });

    const handleChange = (name, value) => {
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = () => {
        // 🛑 PREVENT SUBMISSION if token hasn't loaded (is null)
        if (!authToken) {
             Alert.alert("Error", "Authentication token is missing. Please log in again.");
             return;
        }

        const payload = {
            ...form,
            // 1. Correct Foreign Key Name
            program_id: program.id, 
        };

        fetch(API_URL, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                // 2. 🔑 CRUCIAL FIX for 403/401: Include the Authorization header with "Token " prefix
                "Authorization": `Token ${authToken}` 
            },
            body: JSON.stringify(payload)
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => {
                        throw new Error(JSON.stringify(err));
                    });
                }
                return response.json();
            })
            .then(data => {
                Alert.alert("Success", "Application Submitted!");
                navigation.goBack();
            })
            .catch(error => {
                console.log("Submission Error:", error);
                
                let errorMessage = "Failed to submit. Check server logs.";
                try {
                    const errorDetails = JSON.parse(error.message);
                    
                    if (errorDetails.detail && errorDetails.detail.includes("Student Profile")) {
                         errorMessage = "Permission Denied: Your account is missing a Student Profile.";
                    } else if (errorDetails.detail) {
                        // This handles 401 Unauthorized, 403 Forbidden, etc.
                        errorMessage = errorDetails.detail; 
                    } else {
                        // Show validation errors from the backend (e.g., missing required fields)
                        errorMessage = JSON.stringify(errorDetails, null, 2); 
                    }
                } catch (e) {
                    // Fallback to generic message
                }
                Alert.alert("Error", errorMessage);
            });
    };

    return (
        <ScrollView style={{ padding: 20 }}>
            <Text style={{ fontSize: 22, fontWeight: "bold" }}>
                Apply for: {program.name}
            </Text>

            {/* FORM FIELDS */}
            {Object.keys(form).map((key) => (
                <View key={key} style={{ marginTop: 15 }}>
                    <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
                        {key.replace(/_/g, " ").toUpperCase()}
                    </Text>
                    <TextInput
                        style={{
                            borderWidth: 1,
                            borderColor: "#ccc",
                            borderRadius: 5,
                            padding: 10
                        }}
                        value={form[key]}
                        onChangeText={(value) => handleChange(key, value)}
                    />
                </View>
            ))}

            <TouchableOpacity
                onPress={handleSubmit}
                style={{
                    marginTop: 30,
                    padding: 15,
                    backgroundColor: authToken ? "#28a745" : "#6c757d", 
                    borderRadius: 5
                }}
                disabled={!authToken} 
            >
                <Text style={{ color: "#fff", textAlign: "center", fontSize: 16 }}>
                    {authToken ? "Submit Application" : "Loading Authentication..."}
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
}