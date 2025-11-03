// 📁 src/screens/PT/UpdatePTProfileScreen.jsx
import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import { updatePTProfile, updateAvatar } from '@api/userApi';
import { UserContext } from '@context/UserContext';

const { width } = Dimensions.get('window');
const PRIMARY_COLOR = '#30C451';
const LIGHT_GREEN = '#E8F9EF';

const UpdatePTProfileScreen = ({ navigation }) => {
  const { user, refreshUser } = useContext(UserContext);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [experience, setExperience] = useState(
    user?.experience?.toString() || '',
  );
  const [specialty, setSpecialty] = useState(user?.specialty || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [loading, setLoading] = useState(false);

  const handleChooseAvatar = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.7,
    });
    if (result.didCancel) return;
    const image = result.assets?.[0];
    if (!image) return;
    setLoading(true);
    try {
      await updateAvatar(image);
      await refreshUser();
      Alert.alert('✅ Thành công', 'Ảnh đại diện đã được cập nhật!');
    } catch {
      Alert.alert('❌ Lỗi', 'Không thể cập nhật ảnh đại diện.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!name.trim()) {
      Alert.alert('⚠️ Thiếu thông tin', 'Vui lòng nhập họ và tên!');
      return;
    }
    setLoading(true);
    try {
      await updatePTProfile({
        name,
        email,
        experience: parseInt(experience) || 0,
        specialty,
        bio,
      });
      await refreshUser();
      Alert.alert('✅ Thành công', 'Hồ sơ huấn luyện viên đã được cập nhật.');
      navigation.goBack();
    } catch {
      Alert.alert('❌ Lỗi', 'Không thể cập nhật hồ sơ.');
    } finally {
      setLoading(false);
    }
  };

  const avatarSource = user?.avatar
    ? { uri: `${user.avatar}?timestamp=${Date.now()}` }
    : require('@assets/images/avt.png');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={26} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Profile</Text>
        </View>

        {/* Banner */}
        <View style={styles.banner}>
          <View style={styles.avatarContainer}>
            <Image source={avatarSource} style={styles.avatar} />
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={handleChooseAvatar}
            >
              <Icon name="photo-camera" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>{name || 'Huấn luyện viên'}</Text>
          <Text style={styles.email}>{email}</Text>
          <Text style={styles.subText}>
            Kinh nghiệm: {experience || '0'} năm
          </Text>

          <View style={styles.infoBox}>
            <View style={styles.infoItem}>
              <Text style={styles.infoValue}>{experience || '0'}</Text>
              <Text style={styles.infoLabel}>Năm KN</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoItem}>
              <Text style={styles.infoValue}>
                {specialty?.length ? specialty.split(',')[0] : '---'}
              </Text>
              <Text style={styles.infoLabel}>Chuyên môn</Text>
            </View>
          </View>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.label}>Họ và tên</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập họ và tên"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <Text style={styles.label}>Số điện thoại</Text>
          <TextInput
            style={[styles.input, { backgroundColor: '#F5F5F5' }]}
            value={phone}
            editable={false}
          />

          <Text style={styles.label}>Kinh nghiệm (năm)</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập số năm kinh nghiệm"
            value={experience}
            onChangeText={setExperience}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Chuyên môn</Text>
          <TextInput
            style={styles.input}
            placeholder="VD: Giảm cân, tăng cơ..."
            value={specialty}
            onChangeText={setSpecialty}
          />

          <Text style={styles.label}>Giới thiệu bản thân</Text>
          <TextInput
            style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
            placeholder="Hãy viết vài dòng về bản thân..."
            value={bio}
            onChangeText={setBio}
            multiline
          />

          <TouchableOpacity
            style={[styles.saveButton, loading && { opacity: 0.7 }]}
            onPress={handleUpdate}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Cập nhật hồ sơ</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UpdatePTProfileScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginLeft: 10,
  },
  banner: {
    backgroundColor: LIGHT_GREEN,
    alignItems: 'center',
    paddingVertical: 25,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    marginBottom: 10,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: PRIMARY_COLOR,
    backgroundColor: '#fff',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: PRIMARY_COLOR,
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: '#222',
    marginTop: 5,
  },
  email: {
    fontSize: 14,
    color: '#555',
  },
  subText: {
    fontSize: 14,
    color: '#777',
    marginBottom: 10,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 12,
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  infoItem: {
    alignItems: 'center',
    flex: 1,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: '#fff',
    marginHorizontal: 10,
  },
  infoValue: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  infoLabel: {
    color: '#fff',
    fontSize: 13,
  },
  form: {
    paddingHorizontal: 20,
    marginTop: 15,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginTop: 12,
    marginBottom: 5,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 15,
    color: '#222',
  },
  saveButton: {
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 30,
    marginTop: 25,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
