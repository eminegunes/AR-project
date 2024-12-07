import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const GameScreen = () => {
  const [numbers, setNumbers] = useState([]);
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    generateNewGame();
  }, []);

  const generateNewGame = () => {
    const newNumbers = [];
    while (newNumbers.length < 25) {
      const num = Math.floor(Math.random() * 100) + 1;
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
      if (selectedNumbers.length + 1 === numbers.filter(n => n % 7 === 0).length) {
        Alert.alert(
          '🎉 Tebrikler!',
          `Tüm 7'ye bölünebilen sayıları buldunuz!\nPuanınız: ${score + 1}`,
          [{ text: 'Yeni Oyun', onPress: generateNewGame }]
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
        <MaterialCommunityIcons name="numeric-7-box-multiple" size={40} color="#6C63FF" />
        <Text style={styles.title}>7'ye Bölünebilen Sayıları Bul</Text>
      </View>

      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>Puan: {score}</Text>
        <TouchableOpacity
          style={styles.newGameButton}
          onPress={generateNewGame}
        >
          <MaterialCommunityIcons name="refresh" size={24} color="white" />
          <Text style={styles.buttonText}>Yeni Oyun</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        {Array(5).fill().map((_, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {Array(5).fill().map((_, colIndex) => (
              renderNumber(numbers[rowIndex * 5 + colIndex], rowIndex * 5 + colIndex)
            ))}
          </View>
        ))}
      </View>

      <View style={styles.rulesContainer}>
        <Text style={styles.rulesTitle}>
          <MaterialCommunityIcons name="information" size={20} color="#2D3748" />
          {' '}Nasıl Oynanır?
        </Text>
        <Text style={styles.rulesText}>
          • 7'ye bölünebilen sayıları bulun{'\n'}
          • Doğru tahmin: +1 puan{'\n'}
          • Yanlış tahmin: -1 puan{'\n'}
          • Tüm sayıları bulduğunuzda oyun biter
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
    width: 55,
    height: 55,
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
