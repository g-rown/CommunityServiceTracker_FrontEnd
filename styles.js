import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: { 
        flex: 1,
        justifyContent: 'center', 
        padding: 20, 
    },    

    card: {
        backgroundColor: "#fff",
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
        width: '40%',
        alignSelf: 'center',
    },
    
    header: {
        fontSize: 28,            
        fontWeight: '700',          
        marginBottom: 20,         
        textAlign: 'center',      
        paddingTop: 10,           
    },

    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 12,
        marginBottom: 15,
        borderRadius: 8,
        backgroundColor: "#fff",
    },

    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1, // Mimic the border of styles.input
        borderColor: '#ccc', // Use your input border color
        borderRadius: 5,     // Use your input border radius
        marginBottom: 10,
        height: 50, // Match styles.input height
    },
    passwordInput: {
        flex: 1, // Allows the input to take up most of the space
        height: '100%',
        paddingHorizontal: 10,
    },
    eyeIcon: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },

    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10
    }

});