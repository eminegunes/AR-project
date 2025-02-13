import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Audio } from 'expo-av';

const NotificationsScreen = () => {
  const [width, setWidth] = useState(0);
  const [length, setLength] = useState(0);
  const [area, setArea] = useState(0);
  const [options, setOptions] = useState([]);
  const [attempts, setAttempts] = useState(2);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [sound, setSound] = useState();

  useEffect(() => {
    generateNewProblem();
    return () => sound && sound.unloadAsync();
  }, []);

  const playSound = async (isCorrect) => {
    const soundFile = isCorrect
      ? require('./assets/correct.mp3')
      : require('./assets/wrong.mp3');
    const { sound } = await Audio.Sound.createAsync(soundFile);
    setSound(sound);
    await sound.playAsync();
  };

  const generateNewProblem = () => {
    const newWidth = Math.floor(Math.random() * 6 * level) + 3;
    const newLength = Math.floor(Math.random() * 6 * level) + 3;
    const actualArea = newWidth * newLength;

    setWidth(newWidth);
    setLength(newLength);
    setArea(actualArea);
    setAttempts(2);

    const optionsList = generateOptions(actualArea);
    setOptions(optionsList);
  };

  const generateOptions = (correctArea) => {
    const options = [correctArea];

    while (options.length < 4) {
      const variation = Math.floor(Math.random() * 15 * level) - 7;
      const newOption = correctArea + variation;

      if (newOption > 0 && !options.includes(newOption)) {
        options.push(newOption);
      }
    }

    return options.sort(() => Math.random() - 0.5);
  };

  const handleGuess = (selectedArea) => {
    if (selectedArea === area) {
      const pointsEarned = attempts === 2 ? 10 : 5;
      setScore(score + pointsEarned);
      setLevel(level + 1);
      playSound(true);
      Alert.alert(
        'Tebrikler!',
        `Doğru tahmin! ${pointsEarned} puan kazandınız!`,
        [{ text: 'Yeni Soru', onPress: generateNewProblem }]
      );
    } else {
      if (attempts > 1) {
        setAttempts(attempts - 1);
        playSound(false);
        Alert.alert('Yanlış', 'Bir deneme hakkınız daha var!');
      } else {
        Alert.alert(
          'Oyun Bitti',
          `Doğru cevap: ${area} m²`,
          [{ text: 'Yeni Soru', onPress: generateNewProblem }]
        );
        setLevel(1);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <MaterialCommunityIcons name="floor-plan" size={40} color="#6C63FF" />
          <Text style={styles.title}>Oda Tahmin</Text>
        </View>

        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>Puan: {score}</Text>
          <Text style={styles.levelText}>Seviye: {level}</Text>
          <TouchableOpacity
            style={styles.newGameButton}
            onPress={generateNewProblem}
          >
            <MaterialCommunityIcons name="refresh" size={24} color="white" />
            <Text style={styles.buttonText}>Yeni Soru</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.roomContainer}>
          <View style={styles.dimensionsContainer}>
            <MaterialCommunityIcons name="ruler" size={24} color="#4A5568" />
            <Text style={styles.dimensionsText}>
              En: {width}m × Boy: {length}m
            </Text>
          </View>
          <View style={styles.roomVisual}>
            <View style={[styles.room, { aspectRatio: width / length }]}>
              <Text style={styles.roomDimension}>?</Text>
            </View>
          </View>
        </View>

        <View style={styles.attemptsContainer}>
          <MaterialCommunityIcons 
            name={attempts === 2 ? "heart-multiple" : "heart"}
            size={24} 
            color="#FC8181"
          />
          <Text style={styles.attemptsText}>
            {attempts} Deneme Hakkı
          </Text>
        </View>

        <View style={styles.optionsContainer}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionButton}
              onPress={() => handleGuess(option)}
            >
              <Text style={styles.optionText}>{option} m²</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3748',
    marginLeft: 10,
  },
  scoreContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },
  scoreText: {
    fontSize: 20,
    color: '#48BB78',
  },
  levelText: {
    fontSize: 16,
    color: '#4A5568',
  },
  newGameButton: {
    backgroundColor: '#6C63FF',
    padding: 10,
    borderRadius: 8,
  },
  roomContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 2,
  },
  dimensionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  dimensionsText: {
    fontSize: 18,
    color: '#2D3748',
    marginLeft: 10,
  },
  roomVisual: {
    alignItems: 'center',
  },
  room: {
    width: '100%',
    backgroundColor: '#EDF2F7',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#6C63FF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  roomDimension: {
    fontSize: 36,
    color: '#6C63FF',
  },
  attemptsContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },
  attemptsText: {
    fontSize: 16,
    color: '#4A5568',
  },
    optionsContainer: {
      flexDirection: 'row'
    },
  });
  export default NotificationsScreen;