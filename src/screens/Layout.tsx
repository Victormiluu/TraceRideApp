import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, Easing } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';


export type RootStackParamList = {
    Login: undefined;
    Vehicles: undefined;
    VehicleMap: { vehicleId: string };
    VehicleRegister: undefined
    Register: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;


const primaryColor = '#7CD4D9';
const screenWidth = Dimensions.get('window').width;

const Layout = ({ children }: { children: React.ReactNode },) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const slideAnim = React.useRef(new Animated.Value(screenWidth)).current;
    const navigation = useNavigation<NavigationProp>();
    const toggleMenu = () => {
        if (menuOpen) {
            Animated.timing(slideAnim, {
                toValue: screenWidth,
                duration: 400,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: false,
            }).start(() => setMenuOpen(false));
        } else {
            setMenuOpen(true);
            Animated.timing(slideAnim, {
                toValue: screenWidth - 250,
                duration: 400,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: false,
            }).start();
        }
    };

    const handleLogout = () => {

        setMenuOpen(false);
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>TraceRide</Text>
                </View>

                <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
                    <View style={styles.bar} />
                    <View style={styles.bar} />
                    <View style={styles.bar} />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>{children}</View>

            {menuOpen && (
                <TouchableOpacity
                    style={styles.overlay}
                    onPress={toggleMenu}
                    activeOpacity={1}
                />
            )}
            <Animated.View style={[styles.sideMenu, { left: slideAnim }]}>
                <View style={styles.menuItems}>
                    <TouchableOpacity style={styles.menuItem}>
                        <Text style={styles.optionText}>Dashboard</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem}>
                        <Text style={styles.optionText}>Minhas Corridas</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem}>
                        <Text style={styles.optionText}>Favoritos</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.userSection}>
                    <Text style={styles.userName}>Olá, João</Text>
                    <TouchableOpacity style={styles.userOption}>
                        <Text style={styles.optionText}>Configurações</Text>
                        <Feather name="settings" size={20} color="#333" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.userOption} onPress={handleLogout}>
                        <Text style={styles.optionText}>Sair</Text>
                        <Feather name="log-out" size={20} color="#d00" />
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    menuItems: {
        flexGrow: 1,
    },
    separator: {
        height: 1,
        backgroundColor: '#ccc',
        marginVertical: 10,
    },
    userSection: {
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        paddingTop: 10,
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    userOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    optionText: {
        fontSize: 16,
        color: '#333',
    },
    header: {
        height: 60,
        backgroundColor: primaryColor,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingTop: 15,
    },
    titleContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    menuButton: {
        marginLeft: 'auto',
        width: 30,
        justifyContent: 'space-between',
        height: 20,
    },
    bar: {
        height: 3,
        backgroundColor: 'white',
        borderRadius: 2,
    },
    content: {
        flex: 1,
        backgroundColor: '#fff',
    },
    sideMenu: {
        position: 'absolute',
        top: 60,
        width: 250,
        bottom: 0,
        backgroundColor: '#eee',
        padding: 20,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: { width: -3, height: 0 },
        shadowRadius: 5,
        elevation: 5,
    },
    menuItem: {
        fontSize: 18,
        marginVertical: 15,
    },
    overlay: {
        position: 'absolute',
        top: 60,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
});

export default Layout;
