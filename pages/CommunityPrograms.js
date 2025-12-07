import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Needed for token

import styles from '../styles'; // Ensure this path is correct

// Replace with your actual base URL
const API_BASE_URL = 'http://127.0.0.1:8000/api'; 

export default function CommunityPrograms() {
    const navigation = useNavigation();

    // State for program data, loading status, and error messages
    const [programs, setPrograms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPrograms = async () => {
            setIsLoading(true);
            try {
                // 1. Retrieve the token from storage
                const token = await AsyncStorage.getItem('userToken');

                if (!token) {
                    setError("You must be logged in to view programs.");
                    setIsLoading(false);
                    return;
                }

                // 2. Fetch data using the token
                const response = await axios.get(
                    `${API_BASE_URL}/programs/`,
                    {
                        headers: {
                            'Authorization': `Token ${token}` // Authenticate the request
                        }
                    }
                );
                
                // Assuming the response data is an array of program objects
                setPrograms(response.data); 
                
            } catch (err) {
                console.error("Error fetching programs:", err.response?.data || err.message);
                
                let errorMessage = "Failed to load programs.";
                if (err.response && err.response.status === 401) {
                    errorMessage = "Unauthorized. Please log in again.";
                } else if (err.response) {
                    errorMessage = `Server Error (${err.response.status}): ${JSON.stringify(err.response.data)}`;
                }
                
                setError(errorMessage);
                
            } finally {
                setIsLoading(false);
            }
        };

        fetchPrograms();
    }, []); // Runs once on component mount

    // Helper function to render each program item
    const renderProgramItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.nameText}>{item.name}</Text>
            <Text style={styles.detailText}>Organization: {item.organization}</Text>
            <Text style={styles.detailText}>Required Hours: {item.hours}</Text>
            <Text style={styles.detailText}>
                Slots: {item.slots_taken} / {item.slots}
            </Text>
            <Button 
                title="Apply Now"
                onPress={() => navigation.navigate('ProgramApplication', { programId: item.id, programName: item.name })}
                disabled={item.slots_taken >= item.slots}
            />
        </View>
    );

    // --- RENDER LOGIC ---

    if (isLoading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading Community Programs...</Text>
            </View>
        );
    }
    
    if (error) {
        return (
            <View style={[styles.container, styles.center]}>
                <Text style={styles.errorText}>❌ Error: {error}</Text>
                <Button title="Go to Login" onPress={() => navigation.navigate('Login')} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Available Community Programs ({programs.length})</Text>
 <FlatList
                data={programs}
                keyExtractor={item => item.id.toString()}
                renderItem={renderProgramItem}
                ListEmptyComponent={<Text style={styles.emptyText}>No active programs found.</Text>}
            />
        </View>
    );
}