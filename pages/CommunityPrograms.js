// pages/CommunityPrograms.js
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function CommunityPrograms() {
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigation = useNavigation();

    const API_URL = "http://127.0.0.1:8000/api/CSTracker/programs/";

    useEffect(() => {
        fetch(API_URL)
            .then((response) => response.json())
            .then((data) => {
                setPrograms(data);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }, []);

    const renderProgram = ({ item }) => (
        <View style={{
            backgroundColor: "#fff",
            padding: 15,
            marginVertical: 10,
            borderRadius: 10,
            elevation: 3
        }}>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>{item.name}</Text>
            <Text>{item.description}</Text>
            <Text style={{ marginTop: 5 }}>Location: {item.location}</Text>
            <Text>Date: {item.date}</Text>
            <Text>Hours: {item.hours}</Text>
            <Text>Slots Remaining: {item.slots_remaining}</Text>

            <TouchableOpacity
                style={{
                    marginTop: 10,
                    padding: 10,
                    backgroundColor: "#0066cc",
                    borderRadius: 5
                }}
                onPress={() => navigation.navigate("ProgramApplication", { program: item })}
            >
                <Text style={{ color: "#fff", textAlign: "center" }}>Apply</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <Text style={{ fontSize: 26, fontWeight: "bold", marginBottom: 15 }}>Community Programs</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#000" />
            ) : (
                <FlatList
                    data={programs}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderProgram}
                />
            )}
        </View>
    );
}
