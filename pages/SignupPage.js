import React, { useState } from 'react';
import { Text, TextInput, ScrollView, Alert, TouchableOpacity, ImageBackground, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

import styles from '../styles'; 

export default function SignupPage() {
    const navigation = useNavigation();
  
    // --- State variables ---
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [course, setCourse] = useState("");
    const [yearLevel, setYearLevel] = useState("");
    const [section, setSection] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    // --- Signup API ---
    const handleSignup = async () => {
        if (!firstName || !lastName || !course || !yearLevel || !phoneNumber || !section || !email || !username || !password) {
            Alert.alert("Missing Fields", "Please fill in all required fields.");
            return;
        }

        setLoading(true);

        const userData = {
            first_name: firstName,
            last_name: lastName,
            email: email,
            username: username,
            password: password,
            course: course,
            year_level: yearLevel,
            section: section, 
            phone_number: phoneNumber,
        };

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/signup/', userData); 
            Alert.alert('Success', `Account created for ${response.data.username}. Please log in.`);
            navigation.navigate('Login'); 
        } catch (error) {
            let errorMessage = "An unknown error occurred during signup.";
            if (error.response?.data) {
                if (error.response.data.username) errorMessage = `Username: ${error.response.data.username[0]}`;
                else if (error.response.data.email) errorMessage = `Email: ${error.response.data.email[0]}`;
                else if (error.response.data.non_field_errors) errorMessage = error.response.data.non_field_errors[0];
            }
            Alert.alert('Signup Failed', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ImageBackground
            source={require('../assets/redox-01.png')}
            style={styles.bg}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.nobgcard}>
                    <Text style={styles.header}>Create an Account</Text>

                    <Text style={styles.subHeader}>Personal Details</Text>
                    <TextInput style={styles.input} placeholder="First Name" value={firstName} onChangeText={setFirstName} />
                    <TextInput style={styles.input} placeholder="Last Name" value={lastName} onChangeText={setLastName} />
                    <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
                    <TextInput style={styles.input} placeholder="Phone Number" value={phoneNumber} onChangeText={setPhoneNumber} keyboardType="phone-pad" />

                    <Text style={styles.subHeader}>Academic Details</Text>
                    <TextInput style={styles.input} placeholder="Course" value={course} onChangeText={setCourse} autoCapitalize="characters" />
                    <TextInput style={styles.input} placeholder="Year Level" value={yearLevel} onChangeText={setYearLevel} keyboardType="numeric" />
                    <TextInput style={styles.input} placeholder="Section" value={section} onChangeText={setSection} autoCapitalize="characters" />
                    
                    <Text style={styles.subHeader}>Account Credentials</Text>
                    <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} autoCapitalize="none" />
                    <TextInput style={styles.input} placeholder="Password" secureTextEntry={true} value={password} onChangeText={setPassword} />

                    {/* Centered Sign Up Button */}
                    <View style={styles.signupButtonContainer}>
                        <TouchableOpacity
                            style={styles.dashboardButton} 
                            onPress={handleSignup}
                            disabled={loading}
                        >
                            <Text style={styles.dashboardButtonText}>
                                {loading ? 'Registering...' : 'Sign Up'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.footerText}>
                        Already have an account?{' '}
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.linkText}>Log in here</Text>
                        </TouchableOpacity>
                    </Text>

                </View>
            </ScrollView>
        </ImageBackground>
    );
}
