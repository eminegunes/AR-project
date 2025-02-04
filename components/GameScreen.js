import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Dimensions,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');
const GRID_SIZE = 5;
const BOX_SIZE = (width - 60) / GRID_SIZE;

const GameScreen = () => {
  const [numbers, setNumbers] = useState([]);
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);

  useEffect(() => {
    generateNewGame(level);
  }, [level]);

  const generateNewGame = (level) => {
    const maxNumber = level * 100;
    const newNumbers = [];
    while (newNumbers.length < GRID_SIZE * GRID_SIZE) {
      const num = Math.floor(Math.random() * maxNumber) + 1;
      if (!newNumbers.includes(num)) {
        newNumbers.push(num);
      }
    }
    setNumbers(newNumbers);
    setSelectedNumbers([]);
    setScore(0);
  };

  const handleNumberPress = (number) => {
    if (selectedNumbers.includes(number)) {
      return;
    }

    if (number % 7 === 0) {
      setSelectedNumbers([...selectedNumbers, number]);
      setScore(score + 1);
      const divisibleCount = numbers.filter((n) => n % 7 === 0).length;
      if (selectedNumbers.length + 1 === divisibleCount) {
        Alert.alert(
          '🎉 Tebrikler!',
          `Tüm 7'ye bölünebilen sayıları buldunuz! Puanınız: ${score + 1}`,
          [
            {
              text: 'Sonraki Seviye',
              onPress: () => setLevel(level + 1),
            },
          ]
        );
      } else {
        Alert.alert('✨ Doğru!', '7\'ye bölünebilen bir sayı buldunuz!');
      }
    } else {
      Alert.alert('❌ Yanlış', 'Bu sayı 7\'ye bölünemiyor.');
      setScore(Math.max(0, score - 1));
    }
  };

  const renderNumber = (number, index) => {
    const isSelected = selectedNumbers.includes(number);
    const isDivisibleBySeven = number % 7 === 0;

    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.numberBox,
          isSelected && styles.selectedNumber,
          isDivisibleBySeven && isSelected && styles.correctNumber,
        ]}
        onPress={() => handleNumberPress(number)}
      >
        <Text
          style={[
            styles.numberText,
            isSelected && styles.selectedNumberText,
          ]}
        >
          {number}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons
          name="numeric-7-box-multiple"
          size={40}
          color="#6C63FF"
        />
        <Text style={styles.title}>7'ye Bölünebilen Sayıları Bul - Seviye {level}</Text>
      </View>

      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>Puan: {score}</Text>
        <TouchableOpacity
          style={styles.newGameButton}
          onPress={() => generateNewGame(level)}
        >
          <MaterialCommunityIcons name="refresh" size={24} color="white" />
          <Text style={styles.buttonText}>Yeni Oyun</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        {Array(GRID_SIZE)
          .fill()
          .map((_, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {Array(GRID_SIZE)
                .fill()
                .map((_, colIndex) =>
                  renderNumber(
                    numbers[rowIndex * GRID_SIZE + colIndex],
                    rowIndex * GRID_SIZE + colIndex
                  )
                )}
            </View>
          ))}
      </View>

      <View style={styles.rulesContainer}>
        <Text style={styles.rulesTitle}>
          <MaterialCommunityIcons name="information" size={20} color="#2D3748" />
          {' '}Nasıl Oynanır?
        </Text>
        <Text style={styles.rulesText}>
          • 7'ye bölünebilen sayıları bulun{'
'}
          • Doğru tahmin: +1 puan{'
'}
          • Yanlış tahmin: -1 puan{'
'}
          • Tüm sayıları bulduğunuzda sonraki seviyeye geçersiniz
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },
  scoreText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#48BB78',
  },
  newGameButton: {
    backgroundColor: '#6C63FF',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  grid: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  numberBox: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EDF2F7',
    borderRadius: 10,
    margin: 2,
  },
  selectedNumber: {
    backgroundColor: '#FC8181',
  },
  correctNumber: {
    backgroundColor: '#48BB78',
  },
  numberText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  selectedNumberText: {
    color: 'white',
  },
  rulesContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
    elevation: 2,
  },
  rulesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 10,
  },
  rulesText: {
    fontSize: 14,
    lineHeight: 24,
    color: '#4A5568',
  },
});

export default GameScreen;
