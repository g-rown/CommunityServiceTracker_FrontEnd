import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles';
import { useNavigation } from '@react-navigation/native';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export default function ReviewSubmissions() {
    const navigation = useNavigation();

    const [programs, setPrograms] = useState([]);
    const [expandedProgramId, setExpandedProgramId] = useState(null);
    const [expandedStudentId, setExpandedStudentId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) {
                setError("You must be logged in to view submissions.");
                setLoading(false);
                return;
            }

            const response = await axios.get(`${API_BASE_URL}/programsubmissions/`, {
                headers: { Authorization: `Token ${token}` }
            });

            const data = response.data;
            console.log("Raw Submissions Data:", data); // 👈 ADD THIS LINE

            // Group submissions by program
            const grouped = {};
            data.forEach(sub => {
                if (!sub.application || !sub.application.program) return;
                const programId = sub.application.program.id;
                if (!grouped[programId]) {
                    grouped[programId] = {
                        ...sub.application.program,
                        submissions: []
                    };
                }
                grouped[programId].submissions.push(sub);
            });

            setPrograms(Object.values(grouped));
        } catch (err) {
            console.error("Error fetching submissions:", err.response?.data || err.message);
            let msg = "Failed to load submissions.";
            if (err.response && err.response.status === 401) msg = "Unauthorized. Please log in again.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const toggleProgram = (id) => {
        setExpandedProgramId(expandedProgramId === id ? null : id);
        setExpandedStudentId(null);
    };

    const toggleStudent = (id) => {
        setExpandedStudentId(expandedStudentId === id ? null : id);
    };

    const handleDecision = async (submissionId, studentName, programName, decision) => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) throw new Error("User not logged in");

            const response = await axios.post(
                `${API_BASE_URL}/programsubmissions/${submissionId}/decide/`,
                { status: decision.toLowerCase() },
                { headers: { Authorization: `Token ${token}` } }
            );

            Alert.alert(
                `${decision} Submission`,
                `${studentName}'s application for ${programName} has been ${decision.toLowerCase()}.`
            );

            fetchSubmissions();
        } catch (err) {
            console.error("Error updating submission:", err.response?.data || err.message);
            Alert.alert("Error", "Could not update submission status.");
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#007bff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={[styles.container, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: 'red', marginBottom: 10 }}>❌ {error}</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={{ color: '#007bff' }}>Go to Login</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={[styles.container, { flex: 1, paddingTop: 40, backgroundColor: '#f0f0f0', alignItems: 'center' }]}>
            <View style={{
                width: '50%',
                flex: 1,
                backgroundColor: '#fff',
                borderWidth: 1,
                borderColor: '#e0e0e0',
                borderRadius: 12,
                overflow: 'hidden'
            }}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    backgroundColor: '#f0f0f0',
                    elevation: 4,
                    zIndex: 10,
                    borderBottomWidth: 1,
                    borderBottomColor: '#e6e6e6'
                }}>
                    <Text style={{ fontSize: 26, fontWeight: 'bold' }}>Review Submissions</Text>
                </View>

                <ScrollView style={{ flex: 1, paddingHorizontal: 20 }} contentContainerStyle={{ padding: 20 }}>
                    {programs.map(program => (
                        <View key={program.id} style={{ marginBottom: expandedProgramId === program.id ? 0 : 20 }}>
                            <TouchableOpacity
                                onPress={() => toggleProgram(program.id)}
                                style={{
                                    backgroundColor: '#fff',
                                    padding: 15,
                                    borderRadius: 12,
                                    borderWidth: 1,
                                    borderColor: '#ececec',
                                    marginBottom: 0,
                                }}
                            >
                                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{program.name}</Text>
                                <Text style={{ marginTop: 5, fontSize: 14, color: '#555' }}>
                                    {program.description}{"\n"}
                                    Location: {program.location} | Facilitator: {program.facilitator}{"\n"}
                                    Date: {program.date} | Time: {program.time_start} - {program.time_end}{"\n"}
                                    Hours: {program.hours} | Slots: {program.slots} | Taken: {program.slots_taken} | Remaining: {program.slots_remaining ?? (program.slots - program.slots_taken)}
                                </Text>
                            </TouchableOpacity>

                            {expandedProgramId === program.id && program.submissions && (
                                <View style={{
                                    borderWidth: 1,
                                    borderColor: '#ccc',
                                    borderTopWidth: 0,
                                    borderBottomLeftRadius: 12,
                                    borderBottomRightRadius: 12,
                                    backgroundColor: '#f9f9f9',
                                    marginHorizontal: 10,
                                    marginBottom: 20,
                                }}>
                                    {program.submissions.map((submission, index) => {
                                        const student = submission.application.student;
                                        return (
                                            <View key={submission.id}>
                                                <TouchableOpacity
                                                    onPress={() => toggleStudent(submission.id)}
                                                    style={{ padding: 10 }}
                                                >
                                                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                                                        {student.user.full_name} - {student.CYS}
                                                    </Text>
                                                    <Text>Status: {submission.status}</Text>
                                                </TouchableOpacity>

                                                {expandedStudentId === submission.id && (
                                                    <View style={{ paddingLeft: 10, paddingBottom: 10 }}>
                                                        <Text>Emergency Contact: {submission.application.emergency_contact_name}</Text>
                                                        <Text>Phone: {submission.application.emergency_contact_phone}</Text>

                                                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                                            <TouchableOpacity
                                                                style={{ paddingVertical: 6, paddingHorizontal: 15, borderRadius: 8, backgroundColor: 'green' }}
                                                                onPress={() => handleDecision(submission.id, student.user.full_name, program.name, 'Approved')}
                                                            >
                                                                <Text style={{ color: '#fff', fontWeight: 'bold'}}>Accept</Text>
                                                            </TouchableOpacity>

                                                            <TouchableOpacity
                                                                style={{ paddingVertical: 6, paddingHorizontal: 15, borderRadius: 8, backgroundColor: 'red', marginLeft: 10 }}
                                                                onPress={() => handleDecision(submission.id, student.user.full_name, program.name, 'Rejected')}
                                                            >
                                                                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Reject</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                )}

                                                {index < program.submissions.length - 1 && (
                                                    <View style={{ height: 1, backgroundColor: '#ccc', marginHorizontal: 10 }} />
                                                )}
                                            </View>
                                        );
                                    })}
                                </View>
                            )}
                        </View>
                    ))}
                </ScrollView>
            </View>
        </View>
    );
}
