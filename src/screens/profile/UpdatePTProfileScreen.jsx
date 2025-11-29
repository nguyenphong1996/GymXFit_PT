// 📁 src/screens/profile/UpdatePTProfileScreen.jsx
import React, { useEffect, useMemo, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  StatusBar,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import { PTContext } from '../../context/PTContext';
import {
  updateProfile as updateProfileApi,
  requestSkillUpdate,
  updateAvatar as updateAvatarApi,
} from '@api/ptApi';

const PRIMARY_COLOR = '#20B24A';
const LIGHT_GREEN = '#E8F9EF';
const SKILL_OPTIONS = [
  'Workout',
  'Cardio',
  'Stretching',
  'Nutrition',
  'Yoga',
  'Other',
];

const UpdatePTProfileScreen = ({ navigation }) => {
  const { ptInfo, fetchProfile } = useContext(PTContext);

  // 🧩 State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [initialSkills, setInitialSkills] = useState([]);
  const [avatar, setAvatar] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const skillStatusMessage = useMemo(() => {
    const req = ptInfo?.skillUpdateRequest;
    if (!req?.status) return null;
    if (req.status === 'pending') return 'Yêu cầu cập nhật kỹ năng đang chờ admin duyệt.';
    if (req.status === 'approved') return 'Kỹ năng mới đã được admin duyệt.';
    if (req.status === 'rejected') return 'Yêu cầu cập nhật kỹ năng đã bị từ chối.';
    return null;
  }, [ptInfo]);

  const normalizedSkillValues = useMemo(
    () => selectedSkills.map(s => s.toLowerCase()),
    [selectedSkills],
  );

  // 🚀 Load dữ liệu từ profile
  useEffect(() => {
    if (!ptInfo) return;
    setName(ptInfo.name || '');
    setEmail(ptInfo.email || '');
    setPhone(ptInfo.phone || '');
    setAvatar(ptInfo.avatar || null);
    setAvatarFile(null);

    const normalized = Array.isArray(ptInfo.skills)
      ? ptInfo.skills
          .filter(Boolean)
          .map(skill => {
            const lower = String(skill).toLowerCase();
            return lower.charAt(0).toUpperCase() + lower.slice(1);
          })
      : [];
    setSelectedSkills(normalized);
    setInitialSkills(
      Array.isArray(ptInfo.skills)
        ? ptInfo.skills.map(s => String(s).toLowerCase())
        : [],
    );
  }, [ptInfo]);

  // 🖼️ Chọn ảnh đại diện
  const handleChooseAvatar = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.7 })
      .then(result => {
        if (result.didCancel) return;
        const image = result.assets?.[0];
        if (!image) return;
        setAvatar(image.uri);
        setAvatarFile(image);
        Alert.alert('✅ Thành công', 'Ảnh đại diện đã được chọn.');
      })
      .catch(err => {
        console.warn('Lỗi chọn ảnh:', err);
      });
  };

  // 🧠 Toggle skill
  const handleToggleSkill = skill => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill],
    );
  };

  // 💾 Cập nhật hồ sơ
  const handleUpdate = async () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      Alert.alert('⚠️ Lỗi', 'Vui lòng nhập họ tên.');
      return;
    }

    const profilePayload = {};
    if (trimmedName !== (ptInfo?.name || '')) profilePayload.name = trimmedName;
    if (trimmedEmail !== (ptInfo?.email || '')) profilePayload.email = trimmedEmail || null;

    const skillChanged =
      JSON.stringify([...normalizedSkillValues].sort()) !==
      JSON.stringify([...initialSkills].sort());

    const avatarChanged = Boolean(avatarFile);

    if (
      Object.keys(profilePayload).length === 0 &&
      !skillChanged &&
      !avatarChanged
    ) {
      Alert.alert('Thông báo', 'Không có thay đổi để cập nhật.');
      return;
    }

    setLoading(true);
    try {
      let profileUpdated = false;
      let skillRequested = false;
      let avatarUpdated = false;

      if (Object.keys(profilePayload).length > 0) {
        await updateProfileApi(profilePayload);
        profileUpdated = true;
      }

      if (skillChanged) {
        const apiSkills = normalizedSkillValues;
        if (!apiSkills.length) {
          throw new Error('Vui lòng chọn ít nhất 1 kỹ năng.');
        }
        await requestSkillUpdate(apiSkills);
        skillRequested = true;
      }

      if (avatarChanged) {
        const formData = new FormData();
        const fileName =
          avatarFile.fileName ||
          `avatar_${Date.now()}.${(avatarFile.type || 'image/jpeg').split('/')[1] || 'jpg'}`;
        formData.append('avatar', {
          uri:
            Platform.OS === 'ios'
              ? avatarFile.uri.replace('file://', '')
              : avatarFile.uri,
          name: fileName,
          type: avatarFile.type || 'image/jpeg',
        });
        await updateAvatarApi(formData);
        avatarUpdated = true;
      }

      await fetchProfile();

      const messages = [];
      if (profileUpdated) messages.push('Hồ sơ đã được cập nhật.');
      if (skillRequested) messages.push('Yêu cầu cập nhật kỹ năng đã được gửi cho admin.');
      if (avatarUpdated) messages.push('Ảnh đại diện đã được cập nhật.');
      if (skillRequested && !profileUpdated && !avatarUpdated) {
        messages.push('Kỹ năng đang chờ admin duyệt.');
      }

      Alert.alert('✅ Thành công', messages.join('\n') || 'Đã lưu thay đổi.', [
        { text: 'OK', onPress: () => navigation.navigate('PTProfileScreen') },
      ]);
    } catch (error) {
      Alert.alert('Lỗi', error?.message || 'Cập nhật hồ sơ thất bại.');
    } finally {
      setLoading(false);
    }
  };

  const avatarSource = avatar
    ? { uri: avatar }
    : require('@assets/images/avt.png');

  // 📱 Giao diện (bố cục cũ, tinh gọn)
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar backgroundColor={PRIMARY_COLOR} barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Banner */}
        <View style={styles.banner}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('PTProfileScreen')}
          >
            <Icon name="arrow-back" size={28} color="#333" />
          </TouchableOpacity>

          <View style={styles.avatarContainer}>
            <Image source={avatarSource} style={styles.avatar} />
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={handleChooseAvatar}
            >
              <Icon name="photo-camera" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={styles.name}>{name || 'Chưa cập nhật họ tên'}</Text>
          <Text style={styles.email}>{email || 'Chưa có email'}</Text>
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

          <Text style={[styles.label, { marginBottom: 8 }]}>
            Kỹ năng chuyên môn
          </Text>
          <View style={styles.skillGrid}>
            {SKILL_OPTIONS.map(skill => {
              const selected = selectedSkills.includes(skill);
              return (
                <TouchableOpacity
                  key={skill}
                  style={[
                    styles.skillChip,
                    selected && styles.skillChipSelected,
                  ]}
                  onPress={() => handleToggleSkill(skill)}
                  activeOpacity={0.85}
                >
                  {selected && (
                    <Icon
                      name="check"
                      size={16}
                      color="#fff"
                      style={{ marginRight: 6 }}
                    />
                  )}
                  <Text
                    style={[
                      styles.skillText,
                      selected && styles.skillTextSelected,
                    ]}
                  >
                    {skill}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {skillStatusMessage ? (
            <Text style={styles.skillStatus}>{skillStatusMessage}</Text>
          ) : null}

          <TouchableOpacity
            style={[styles.saveButton, loading && { opacity: 0.8 }]}
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

/* === STYLES === */
const styles = StyleSheet.create({
  scrollContainer: { paddingBottom: 40 },

  banner: {
    backgroundColor: LIGHT_GREEN,
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    marginBottom: 15,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 15,
    left: 20,
    padding: 5,
  },
  avatarContainer: { position: 'relative', marginBottom: 10, marginTop: 10 },
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
  name: { fontSize: 20, fontWeight: '700', color: '#222', marginTop: 5 },
  email: { fontSize: 14, color: '#555', marginBottom: 10 },
  form: { paddingHorizontal: 20, marginTop: 10, gap: 12 },
  label: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
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

  skillGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  skillChipSelected: {
    backgroundColor: PRIMARY_COLOR,
    borderColor: PRIMARY_COLOR,
  },
  skillText: { color: '#222', fontSize: 14, fontWeight: '500' },
  skillTextSelected: { color: '#fff' },
  skillStatus: {
    marginTop: 6,
    color: '#666',
    fontSize: 13,
  },

  saveButton: {
    backgroundColor: PRIMARY_COLOR,
    marginHorizontal: 30,
    marginTop: 30,
    marginBottom: 40,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    elevation: 3,
    shadowColor: '#0F6427',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
