import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Image, Alert, TouchableOpacity, Text } from 'react-native';

import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'

import AdminDashboard from './pages/AdminDashboard'
import ManageStudents from './pages/ManageStudents'
import ManagePrograms from './pages/ManagePrograms'
import AddProgram from './pages/AddProgram'
import EditProgram from './pages/EditProgram'
import ReviewSubmissions from './pages/ReviewSubmissions'
import ServiceAccreditation from './pages/ServiceAccreditation'

import StudentDashboard from './pages/StudentDashboard'
import CommunityPrograms from './pages/CommunityPrograms'
import ProgramApplication from './pages/ProgramApplication'
import ServiceHistory from './pages/ServiceHistory'
import EditStudent from './pages/EditStudent'

const Stack = createNativeStackNavigator(); 
const Tab = createBottomTabNavigator();

function StudentTabs() {

    const HomeIconActive = require('./assets/icons/dashboardactive.png');
    const HomeIconInactive = require('./assets/icons/dashboardinactive.png');
    const ProgramsIconActive = require('./assets/icons/programactive.png');
    const ProgramsIconInactive = require('./assets/icons/programinactive.png');
    const HistoryIconActive = require('./assets/icons/historyactive.png');
    const HistoryIconInactive = require('./assets/icons/historyinactive.png');
    
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let imageSource;
                    const iconSize = 30;

                    if (route.name === 'Dashboard') {
                        imageSource = focused ? HomeIconActive : HomeIconInactive;
                    } else if (route.name === 'Programs') {
                        imageSource = focused ? ProgramsIconActive : ProgramsIconInactive;
                    } else if (route.name === 'History') {
                        imageSource = focused ? HistoryIconActive : HistoryIconInactive;
                    } 
                    return (
                        <Image 
                            source={imageSource} 
                            style={{ 
                                    width: iconSize, 
                                    height: iconSize,
                                    tintColor: color
                                }}
                            />
                        );
                },

                tabBarStyle: {
                    height: 67,       
                    paddingVertical: 0, 
                    backgroundColor: '#f8f8f8', 
                },

                tabBarItemStyle: {
                    justifyContent: 'center', 
                    alignItems: 'center',
                    paddingTop: 8,
                },
                            
                tabBarLabelStyle: {
                    fontSize: 12,      
                    textAlign: 'center',
                    paddingTop: 2,
                },

                tabBarActiveTintColor: '#021c2eff', // Active icon color
                tabBarInactiveTintColor: 'gray', // Inactive icon color
                headerShown: false
            })}
        >
            <Tab.Screen 
                name="Dashboard" 
                component={StudentDashboard} 
                options={{ 
                    title: 'Dashboard',
                    headerShown: false
                 }}
            />
            <Tab.Screen 
                name="Programs" 
                component={CommunityPrograms} 
                options={{ title: 'Programs' }}
            />
            <Tab.Screen 
                name="History" 
                component={ServiceHistory} 
                options={{ title: 'History' }}
            />
            
        </Tab.Navigator>
    );
}

const LogoutIcon = require('./assets/icons/logout.png');

const LogoutButton = ({ navigation }) => {
    
    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('userToken');
            
            navigation.replace('Login'); 
            
        } catch (error) {
            console.error("Logout Error:", error);
            Alert.alert("Logout Failed", "Could not clear token.");
        }
    };

    return (
        <TouchableOpacity 
            onPress={handleLogout} 
            style={{ marginRight: 15 }}
        >
            <Image 
                source={LogoutIcon} 
                style={{ 
                    width: 24,
                    height: 24,
                }}
            />
        </TouchableOpacity>
    );
};

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen 
                    name="Login" 
                    component={LoginPage} 
                    options={{ headerShown: false }} 
                />
                <Stack.Screen 
                    name="Signup" 
                    component={SignupPage} 
                    options={{ title: 'Student Registration' }}
                />

                <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
                <Stack.Screen name="ManageStudents" component={ManageStudents} />
                <Stack.Screen name="ManagePrograms" component={ManagePrograms} />
                <Stack.Screen name="AddProgram" component={AddProgram} />
                <Stack.Screen name="EditProgram" component={EditProgram} />
                <Stack.Screen name="ReviewSubmissions" component={ReviewSubmissions} />

                {/* <Stack.Screen 
                    name="StudentDashboard" 
                    component={StudentDashboard} 
                    options={{
                        // Set a friendlier title
                        title: 'My Community Service Hub', 
                        
                        // 👈 THIS REMOVES THE BACK ARROW

                        // Customize styles (optional)
                        headerStyle: {
                        backgroundColor: '#007AFF', // Blue background
                        },
                        headerTintColor: '#fff', // White text color
                    }} 
                    /> */}

                <Stack.Screen 
                    name="StudentDashboard" 
                    component={StudentTabs} 
                    options={({ navigation }) => ({
                        headerShown: true,
                        title: 'UAct',
                        headerTitleStyle: {
                            color: '#021c2eff',
                            fontWeight: 'bold',
                            fontSize: 22,
                            marginLeft: 10,
                        },
                        headerLeft: () => null,

                        headerBackVisible: false,
                        headerRight: () => (
                            <LogoutButton navigation={navigation} />
                        ),
                        headerStyle: {
                            backgroundColor: '#FFFFFF',
                            elevation: 1,
                            shadowOpacity: 0.1,
                        },
                    })} 
                />

                <Stack.Screen name="ServiceHistory" component={ServiceHistory} />
                <Stack.Screen name="CommunityPrograms" component={CommunityPrograms} />
                <Stack.Screen name="ProgramApplication" component={ProgramApplication} />
                <Stack.Screen name="ServiceAccreditation" component={ServiceAccreditation} />
                <Stack.Screen name="EditStudent" component={EditStudent} />

            </Stack.Navigator> 
        </NavigationContainer>
    )
}