import React, { useState, useEffect } from 'react';
import { View, Text, Button, ImageBackground, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Progress from 'react-native-progress';
import { TouchableOpacity } from 'react-native';

import styles from '../styles';

const API_BASE_URL = 'http://127.0.0.1:8000/api/'; 
const PROGRESS_ENDPOINT = 'progress-summary/'

export default function StudentDashboard() {
    const navigation = useNavigation();

    // State to hold the progress data
    const [hoursCompleted, setHoursCompleted] = useState(0);
    const [totalRequiredHours, setTotalRequiredHours] = useState(80);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);

    // Fetch the progress data
    useEffect(() => {
        const fetchProgress = async () => {
            setIsLoading(true);
            setFetchError(null);

            try {
                // Get the stored authentication token
                const token = await AsyncStorage.getItem('userToken');
                if (!token) {
                    throw new Error("User not authenticated. No token found.");
                }

                // Make the authenticated GET request
                const response = await fetch(`${API_BASE_URL}${PROGRESS_ENDPOINT}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Token ${token}`, // Use Django Token Auth
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.detail || `Failed to fetch data: ${response.status}`);
                }

                // Parse and set the data
                const data = await response.json();
                
                setHoursCompleted(data.hours_completed || 0);
                setTotalRequiredHours(data.total_required_hours || 80);
                
            } catch (error) {
                console.error("API Error:", error.message);
                setFetchError(error.message);
                Alert.alert("Error", `Could not load progress: ${error.message}`);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProgress();
    }, []); 

    const progressPercentage = hoursCompleted / totalRequiredHours;
    const hoursRemaining = totalRequiredHours - hoursCompleted;

    if (isLoading) {
        return (
            <View style={[styles.container, localStyles.loadingContainer]}>
                <ActivityIndicator size="large" color="#007BFF" />
                <Text>Loading progress...</Text>
            </View>
        );
    }

    if (fetchError) {
        return (
            <View style={[styles.container, localStyles.loadingContainer]}>
                <Text style={localStyles.errorText}>Error: {fetchError}</Text>
                <Button title="Try Again" onPress={fetchProgress} />
            </View>
        );
    }

    return (
        <ImageBackground
            source={require('../assets/redox-01.png')}
            style={styles.bg}
        >
            <View style={[styles.container, localStyles.dashboardContent]}>
                <Text style={localStyles.welcomeText}>Welcome, Student!</Text>
                
                <View style={localStyles.summaryCard}>
                    <Text style={localStyles.summaryTitle}>Community Service Progress</Text>
                    
                    <Progress.Bar 
                        progress={progressPercentage} 
                        width={null} 
                        height={18}
                        color="#4CAF50" // Green
                        unfilledColor="#E0E0E0"
                        borderRadius={10}
                        borderWidth={0}
                        style={localStyles.progressBar}
                    /> 

                    <Text style={localStyles.hoursText}>
                        {hoursCompleted} / {totalRequiredHours} Hours Completed
                    </Text>
                    <Text style={localStyles.remainingText}>
                        {hoursRemaining}** Hours Remaining
                    </Text>
                </View>

                {/* View Programs Button */}
                <TouchableOpacity 
                    style={styles.dashboardButton}
                    onPress={() => navigation.navigate('CommunityPrograms')}
                >
                    <Text style={styles.dashboardButtonText}>
                        View Available Programs
                    </Text>
                </TouchableOpacity>

                {/* Service History Button */}
                <TouchableOpacity 
                    style={styles.dashboardButton}
                    onPress={() => navigation.navigate('ServiceHistory')}
                >
                    <Text style={styles.dashboardButtonText}>
                        Review Service History
                    </Text>
                </TouchableOpacity>

            </View>
        </ImageBackground>
    );
}
        
const localStyles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
    dashboardContent: {
        paddingTop: 50, 
        alignItems: 'center',
        flex: 1, 
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    summaryCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 15,
        padding: 20,
        width: '90%',
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    summaryTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 15,
        textAlign: 'center',
        color: '#333',
    },
    progressBar: {
        marginBottom: 10,
    },
    hoursText: {
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '500',
        marginVertical: 5,
    },
    remainingText: {
        fontSize: 14,
        textAlign: 'center',
        color: '#888',
        fontStyle: 'italic',
    },
});