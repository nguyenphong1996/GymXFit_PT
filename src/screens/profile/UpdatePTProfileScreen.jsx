// 📁 src/screens/PT/UpdatePTProfileScreen.jsx
import React, { useState } from 'react';
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
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary } from 'react-native-image-picker';

const PRIMARY_COLOR = '#30C451';
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
  // 🧩 State
  const [name, setName] = useState('Huấn luyện viên Nguyễn Văn Nam');
  const [email, setEmail] = useState('namfit@example.com');
  const [phone] = useState('0909 123 456');
  const [selectedSkills, setSelectedSkills] = useState(['Workout', 'Cardio']);
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🖼️ Chọn ảnh đại diện (phiên bản an toàn)
  const handleChooseAvatar = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.7 })
      .then(result => {
        if (result.didCancel) return;
        const image = result.assets?.[0];
        if (!image) return;
        setAvatar(image.uri);
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
  const handleUpdate = () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert('⚠️ Lỗi', 'Vui lòng nhập đầy đủ họ tên và email.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('✅ Thành công', 'Hồ sơ PT đã được cập nhật.', [
        { text: 'OK', onPress: () => navigation.navigate('PTProfileScreen') },
      ]);
    }, 1200);
  };

  const avatarSource = avatar
    ? { uri: avatar }
    : require('@assets/images/avt.png');

  // 📱 Giao diện
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar backgroundColor={PRIMARY_COLOR} barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* 🟢 Banner (kèm nút quay lại) */}
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

          <Text style={styles.name}>{name}</Text>
          <Text style={styles.email}>{email}</Text>

          <View style={styles.infoBox}>
            <Text style={styles.infoValue}>
              {selectedSkills[0] || 'Chưa có'}
            </Text>
            <Text style={styles.infoLabel}>Chuyên môn</Text>
          </View>
        </View>

        {/* 🧾 Form chỉnh sửa */}
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

          <Text style={styles.label}>Kỹ năng chuyên môn</Text>
          <View style={styles.checkboxContainer}>
            {SKILL_OPTIONS.map(skill => {
              const selected = selectedSkills.includes(skill);
              return (
                <TouchableOpacity
                  key={skill}
                  style={styles.checkboxItem}
                  onPress={() => handleToggleSkill(skill)}
                >
                  <View
                    style={[
                      styles.checkbox,
                      selected && { backgroundColor: PRIMARY_COLOR },
                    ]}
                  >
                    {selected && <Icon name="check" size={16} color="#fff" />}
                  </View>
                  <Text style={styles.checkboxLabel}>{skill}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

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
  avatarContainer: { position: 'relative', marginBottom: 10, marginTop: 20 },
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
  infoBox: {
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '85%',
    alignItems: 'center',
  },
  infoValue: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  infoLabel: {
    color: '#E8F9EF',
    fontSize: 13,
    marginTop: 3,
    textAlign: 'center',
  },
  form: { paddingHorizontal: 20, marginTop: 10 },
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
  checkboxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 5,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: PRIMARY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  checkboxLabel: { fontSize: 14, color: '#333' },
  saveButton: {
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 30,
    marginTop: 25,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
