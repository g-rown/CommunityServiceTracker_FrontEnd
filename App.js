import {NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'

import LoginPage from './pages/LoginPage'

import AdminDashboard from './pages/AdminDashboard'
import ManageStudents from './pages/ManageStudents'
import ManagePrograms from './pages/ManagePrograms'
import ReviewSubmissions from './pages/ReviewSubmissions'

import StudentDashboard from './pages/StudentDashboard'
import ServiceHistory from './pages/ServiceHistory'
import LogService from './pages/LogService'
import CommunityPrograms from './pages/CommunityPrograms'



const Stack = createNativeStackNavigator(); 

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" component={LoginPage} />

                <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
                <Stack.Screen name="ManageStudents" component={ManageStudents} />
                <Stack.Screen name="ManagePrograms" component={ManagePrograms} />
                <Stack.Screen name="ReviewSubmissions" component={ReviewSubmissions} />

                <Stack.Screen name="StudentDashboard" component={StudentDashboard} />
                <Stack.Screen name="ServiceHistory" component={ServiceHistory} />
                <Stack.Screen name="LogService" component={LogService} />
                <Stack.Screen name="CommunityPrograms" component={CommunityPrograms} />
            </Stack.Navigator> 
        </NavigationContainer>
    )
}