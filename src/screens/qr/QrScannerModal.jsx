import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const QrScannerModal = ({ visible, onClose }) => {
    const [scanned, setScanned] = useState(false);

    const handleScanQR = () => {
        if (!scanned) {
            setScanned(true);
            // Simulate QR scan result
            Alert.alert(
                'QR Code Scanned!',
                'Demo: QR Code phát hiện thành công!\n\nDữ liệu: gym_membership_12345',
                [
                    {
                        text: 'Quét lại',
                        onPress: () => setScanned(false),
                    },
                    {
                        text: 'Đóng',
                        onPress: onClose,
                    },
                ]
            );
        }
    };

    const handleClose = () => {
        setScanned(false);
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={false}
            onRequestClose={handleClose}
        >
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                        <Icon name="close" size={28} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Quét mã QR</Text>
                    <View style={styles.placeholder} />
                </View>

                {/* Camera Simulation */}
                <View style={styles.cameraContainer}>
                    {/* Background simulation */}
                    <View style={styles.cameraBackground}>
                        <Icon name="camera" size={100} color="rgba(255,255,255,0.3)" />
                        <Text style={styles.cameraText}>
                            Camera QRCode
                        </Text>
                    </View>

                    {/* Instruction Text */}
                    <View style={styles.topContent}>
                        <Text style={styles.instructionText}>
                            Đưa mã QR vào khung để quét
                        </Text>
                    </View>

                    {/* Scan Button */}
                    <TouchableOpacity style={styles.scanButton} onPress={handleScanQR}>
                        <Icon name="qrcode-scan" size={40} color="#fff" />
                        <Text style={styles.scanButtonText}>Nhấn để quét QR</Text>
                    </TouchableOpacity>

                    {/* Bottom Text */}
                    <View style={styles.bottomContent}>
                        <Text style={styles.bottomText}>
                            Giữ thiết bị ổn định và đảm bảo ánh sáng đủ
                        </Text>
                    </View>
                </View>

                {/* Instruction Text */}
                <View style={styles.topContent}>
                    <Text style={styles.instructionText}>
                        Đưa mã QR vào khung để quét
                    </Text>
                </View>

                {/* Bottom Text */}
                <View style={styles.bottomContent}>
                    <Text style={styles.bottomText}>
                        Giữ thiết bị ổn định và đảm bảo ánh sáng đủ
                    </Text>
                </View>

                {/* Scanner Frame Overlay */}
                <View style={styles.overlay}>
                    <View style={styles.scanFrame}>
                        <View style={[styles.corner, styles.topLeft]} />
                        <View style={[styles.corner, styles.topRight]} />
                        <View style={[styles.corner, styles.bottomLeft]} />
                        <View style={[styles.corner, styles.bottomRight]} />
                        <View style={[styles.corner, styles.topMiddle]} />
                        <View style={[styles.corner, styles.bottomMiddle]} />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: '#30C451',
    },
    closeButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    placeholder: {
        width: 38,
    },
    cameraContainer: {
        flex: 1,
        position: 'relative',
    },
    cameraBackground: {
        flex: 1,
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraText: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 16,
        marginTop: 20,
    },
    topContent: {
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 10,
    },
    instructionText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
    },
    scanButton: {
        position: 'absolute',
        bottom: 120,
        alignSelf: 'center',
        backgroundColor: '#30C451',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 50,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 5,
        zIndex: 10,
    },
    scanButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    bottomContent: {
        position: 'absolute',
        bottom: 50,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 10,
    },
    bottomText: {
        color: '#fff',
        fontSize: 14,
        textAlign: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 8,
    },
    permissionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
    },
    permissionText: {
        fontSize: 18,
        textAlign: 'center',
        marginVertical: 20,
        color: '#333',
    },
    permissionButton: {
        backgroundColor: '#30C451',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 10,
        marginBottom: 15,
    },
    permissionButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    closePermissionButton: {
        backgroundColor: '#666',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 10,
    },
    closePermissionButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        pointerEvents: 'none',
    },
    scanFrame: {
        width: 250,
        height: 250,
        position: 'relative',
    },
    corner: {
        position: 'absolute',
        width: 30,
        height: 30,
        borderColor: '#30C451',
        borderWidth: 4,
    },
    topLeft: {
        top: 0,
        left: 0,
        borderRightWidth: 0,
        borderBottomWidth: 0,
    },
    topRight: {
        top: 0,
        right: 0,
        borderLeftWidth: 0,
        borderBottomWidth: 0,
    },
    bottomLeft: {
        bottom: 0,
        left: 0,
        borderRightWidth: 0,
        borderTopWidth: 0,
    },
    bottomRight: {
        bottom: 0,
        right: 0,
        borderLeftWidth: 0,
        borderTopWidth: 0,
    },
    topMiddle: {
        top: 0,
        left: '50%',
        marginLeft: -15,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderBottomWidth: 0,
    },
    bottomMiddle: {
        bottom: 0,
        left: '50%',
        marginLeft: -15,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderTopWidth: 0,
    },
});

export default QrScannerModal;
