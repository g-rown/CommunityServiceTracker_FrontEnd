import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export default function ServiceAccreditation() {
    const [programs, setPrograms] = useState([]);
    const [expandedProgramId, setExpandedProgramId] = useState(null);
    const [expandedStudentId, setExpandedStudentId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch programs with service logs
    const fetchPrograms = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) {
                setError("You must be logged in to view service accreditation.");
                setLoading(false);
                return;
            }

            const response = await axios.get(`${API_BASE_URL}/logs/`, {
                headers: { Authorization: `Token ${token}` }
            });

            // response.data should be structured like: [{id, name, applicants: [{id, program, facilitator, date, status}]}]
            setPrograms(response.data);
        } catch (err) {
            console.error("Error fetching service logs:", err.response?.data || err.message);
            setError("Failed to load service accreditation records.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPrograms();
    }, []);

    const toggleProgram = (id) => {
        setExpandedProgramId(expandedProgramId === id ? null : id);
        setExpandedStudentId(null);
    };

    const toggleStudent = (id) => {
        setExpandedStudentId(expandedStudentId === id ? null : id);
    };

    const handleApprove = async (programId, studentId) => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) {
                Alert.alert("Error", "You must be logged in to approve.");
                return;
            }

            // Call backend API to update status
            await axios.patch(`${API_BASE_URL}/logs/${studentId}/`, { status: "completed" }, {
                headers: { Authorization: `Token ${token}` }
            });

            // Update local state
            setPrograms(prevPrograms =>
                prevPrograms.map(program => {
                    if (program.id === programId) {
                        return {
                            ...program,
                            applicants: program.applicants.map(student => {
                                if (student.id === studentId) {
                                    return { ...student, status: "Completed" };
                                }
                                return student;
                            })
                        };
                    }
                    return program;
                })
            );
        } catch (err) {
            console.error("Error approving service:", err.response?.data || err.message);
            Alert.alert("Error", "Failed to approve service.");
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
            </View>
        );
    }

    return (
        <View style={{ flex: 1, paddingTop: 40, backgroundColor: '#f0f0f0', alignItems: 'center' }}>
            <View style={{
                width: '50%',
                flex: 1,
                backgroundColor: '#fff',
                borderWidth: 1,
                borderColor: '#e0e0e0',
                borderRadius: 12,
                overflow: 'hidden'
            }}>
                {/* Header */}
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    backgroundColor: '#f0f0f0',
                    borderBottomWidth: 1,
                    borderBottomColor: '#e6e6e6'
                }}>
                    <Text style={{ fontSize: 26, fontWeight: 'bold' }}>Service Accreditation</Text>
                </View>

                <ScrollView style={{ flex: 1, paddingHorizontal: 20 }} contentContainerStyle={{ paddingVertical: 20 }}>
                    {programs.map((program) => (
                        <View key={program.id} style={{ marginBottom: expandedProgramId === program.id ? 0 : 20 }}>
                            {/* Program Card */}
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
                            </TouchableOpacity>

                            {/* Students Block */}
                            {expandedProgramId === program.id && (
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
                                    {program.applicants.map((student, index) => (
                                        <View key={student.id}>
                                            <TouchableOpacity
                                                onPress={() => toggleStudent(student.id)}
                                                style={{ padding: 10 }}
                                            >
                                                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                                                    {student.program} ({student.status})
                                                </Text>
                                            </TouchableOpacity>

                                            {/* Student Details */}
                                            {expandedStudentId === student.id && (
                                                <View style={{ paddingLeft: 10, paddingBottom: 10 }}>
                                                    <Text>Program: {student.program}</Text>
                                                    <Text>Facilitator: {student.facilitator}</Text>
                                                    <Text>Date: {student.date}</Text>
                                                    <Text>Status: {student.status}</Text>

                                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 }}>
                                                        <TouchableOpacity
                                                            style={{
                                                                paddingVertical: 6,
                                                                paddingHorizontal: 15,
                                                                borderRadius: 8,
                                                                backgroundColor: student.status === "Completed" ? "gray" : "green"
                                                            }}
                                                            disabled={student.status === "Completed"}
                                                            onPress={() => handleApprove(program.id, student.id)}
                                                        >
                                                            <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                                                                {student.status === "Completed" ? "Completed" : "Approve"}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            )}

                                            {index < program.applicants.length - 1 && (
                                                <View style={{ height: 1, backgroundColor: '#ccc', marginHorizontal: 10 }} />
                                            )}
                                        </View>
                                    ))}
                                </View>
                            )}
                        </View>
                    ))}
                </ScrollView>
            </View>
        </View>
    );
}
