import React from 'react'; 
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import styles from '../styles';

export default function AdminDashboard() {
    const navigation = useNavigation();

    return (
        <ImageBackground
            source={require('../assets/redox-01.png')}
            style={styles.bg}
        >
            <View style={styles.container}>
                <Text style={styles.dashboardWelcome}>
                    Welcome, ADMIN!
                </Text>

                <TouchableOpacity
                    style={styles.dashboardButton}
                    onPress={() => navigation.navigate('ManageStudents')}
                >
                    <Text style={styles.dashboardButtonText}>
                        Manage Students
                    </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                    style={styles.dashboardButton}
                    onPress={() => navigation.navigate('ManagePrograms')}
                >
                    <Text style={styles.dashboardButtonText}>
                        Manage Programs
                    </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                    style={styles.dashboardButton}
                    onPress={() => navigation.navigate('ReviewSubmissions')}
                >
                    <Text style={styles.dashboardButtonText}>
                        Review Submissions
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.dashboardButton}
                    onPress={() => navigation.navigate('ServiceAccreditation')}
                >
                    <Text style={styles.dashboardButtonText}>
                        Service Accreditation
                    </Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
}
