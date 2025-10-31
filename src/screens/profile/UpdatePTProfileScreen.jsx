import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { UserContext } from '@context/UserContext';
import { updatePTProfile, updateAvatar } from '@api/userApi';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';

const UpdatePTProfileScreen = ({ navigation }) => {
  const androidBehavior = Platform.OS === 'android' ? 'height' : undefined;
  const { user, refreshUser } = useContext(UserContext);

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    experience: '',
    specialty: '',
    bio: '',
  });

  const [avatarSource, setAvatarSource] = useState(
    require('@assets/images/avt.png'),
  );
  const [isFetching, setIsFetching] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        experience: user.experience ? String(user.experience) : '',
        specialty: user.specialty || '',
        bio: user.bio || '',
      });
      if (user.avatar) {
        setAvatarSource({ uri: `${user.avatar}?timestamp=${Date.now()}` });
      }
    }
    setIsFetching(false);
  }, [user]);

  const handleInputChange = (field, value) =>
    setProfileData(prev => ({ ...prev, [field]: value }));

  const handleAvatarChange = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.5 }, async response => {
      if (response.didCancel) return;
      const file = response.assets?.[0];
      if (!file?.uri) return;

      setAvatarSource({ uri: file.uri });
      setIsUploading(true);
      try {
        await updateAvatar({
          uri: file.uri,
          type: file.type,
          name: file.fileName || `pt_avatar_${Date.now()}.jpg`,
        });
        Alert.alert('Thành công', 'Cập nhật ảnh đại diện thành công!');
        await refreshUser();
      } catch (err) {
        Alert.alert('Lỗi', err.message);
      } finally {
        setIsUploading(false);
      }
    });
  };

  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    try {
      const updates = {
        name: profileData.name,
        email: profileData.email,
        experience: Number(profileData.experience) || 0,
        specialty: profileData.specialty,
        bio: profileData.bio,
      };
      const response = await updatePTProfile(updates);
      Alert.alert(
        'Thành công',
        response.message || 'Cập nhật thông tin thành công!',
      );
      await refreshUser();
      navigation.navigate('PTProfileScreen');
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      Alert.alert('Lỗi', errorMsg);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isFetching) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#30C451" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={androidBehavior}
      keyboardVerticalOffset={0}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('PTProfileScreen')}
          >
            <Icon name="arrow-back" size={26} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cập nhật hồ sơ PT</Text>
          <View style={{ width: 26 }} />
        </View>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <Image source={avatarSource} style={styles.avatarImage} />
            <TouchableOpacity
              style={styles.editAvatar}
              onPress={handleAvatarChange}
            >
              {isUploading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Icon name="edit" size={18} color="#fff" />
              )}
            </TouchableOpacity>
          </View>
          <Text style={styles.avatarName}>
            {profileData.name || 'Huấn luyện viên'}
          </Text>
          <Text style={styles.avatarEmail}>{profileData.email}</Text>
          <Text style={styles.avatarPhone}>📞 {profileData.phone}</Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Icon
              name="person"
              size={22}
              color="#30C451"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Họ tên"
              value={profileData.name}
              onChangeText={t => handleInputChange('name', t)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Icon
              name="email"
              size={22}
              color="#30C451"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={profileData.email}
              onChangeText={t => handleInputChange('email', t)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={[styles.inputGroup, { opacity: 0.7 }]}>
            <Icon
              name="phone"
              size={22}
              color="#30C451"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Số điện thoại"
              value={profileData.phone}
              editable={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Icon
              name="fitness-center"
              size={22}
              color="#30C451"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Kinh nghiệm (năm)"
              value={profileData.experience}
              onChangeText={t => handleInputChange('experience', t)}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Icon
              name="school"
              size={22}
              color="#30C451"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Chuyên môn"
              value={profileData.specialty}
              onChangeText={t => handleInputChange('specialty', t)}
            />
          </View>

          <View style={[styles.inputGroup, { alignItems: 'flex-start' }]}>
            <Icon
              name="info"
              size={22}
              color="#30C451"
              style={[styles.inputIcon, { marginTop: 10 }]}
            />
            <TextInput
              style={[styles.input, { height: 90, textAlignVertical: 'top' }]}
              placeholder="Giới thiệu ngắn về bản thân..."
              value={profileData.bio}
              onChangeText={t => handleInputChange('bio', t)}
              multiline
            />
          </View>
        </View>

        {/* Button */}
        <TouchableOpacity
          style={[styles.saveButton, isUpdating && styles.buttonDisabled]}
          onPress={handleUpdateProfile}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>💾 Lưu thông tin</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default UpdatePTProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 45,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212020',
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: 25,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarImage: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#E8F5E9',
  },
  editAvatar: {
    position: 'absolute',
    bottom: 0,
    right: 5,
    backgroundColor: '#30C451',
    borderRadius: 15,
    padding: 6,
  },
  avatarName: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 10,
    color: '#000',
  },
  avatarEmail: {
    color: '#666',
    marginTop: 2,
  },
  avatarPhone: {
    marginTop: 4,
    fontWeight: '500',
  },
  formContainer: {
    marginBottom: 30,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  saveButton: {
    backgroundColor: '#30C451',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 40,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});
