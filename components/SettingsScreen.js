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

const SettingsScreen = () => {
  const [gameBoard, setGameBoard] = useState([]);
  const [currentProblem, setCurrentProblem] = useState(null);
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [score, setScore] = useState(0);

  // Oyunu başlat
  useEffect(() => {
    startNewGame();
  }, []);

  // Yeni oyun başlat
  const startNewGame = () => {
    const numbers = generateGameBoard();
    setGameBoard(numbers);
    setSelectedNumbers([]);
    setScore(0);
    createNewProblem(numbers);
  };

  // Oyun tahtası oluştur
  const generateGameBoard = () => {
    const numbers = [];
    while (numbers.length < 16) {
      const num = Math.floor(Math.random() * 40) + 1;
      if (!numbers.includes(num)) {
        numbers.push(num);
      }
    }
    return numbers;
  };

  // Yeni problem oluştur
  const createNewProblem = (currentBoard) => {
    const availableNumbers = currentBoard.filter(num => !selectedNumbers.includes(num));
    
    if (availableNumbers.length === 0) {
      Alert.alert(
        '🎉 Tebrikler!',
        `Oyunu tamamladınız!\nToplam Puan: ${score}`,
        [{ text: 'Yeni Oyun', onPress: startNewGame }]
      );
      return;
    }

    const targetNumber = availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
    const operation = generateOperation(targetNumber);
    setCurrentProblem(operation);
  };

  // İşlem oluştur
  const generateOperation = (targetNumber) => {
    const operations = ['+', '-', '*'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    let num1, num2;

    switch (operation) {
      case '+':
        num2 = Math.floor(Math.random() * (targetNumber - 1)) + 1;
        num1 = targetNumber - num2;
        break;
      case '-':
        num1 = targetNumber + Math.floor(Math.random() * 5) + 1;
        num2 = num1 - targetNumber;
        break;
      case '*':
        const factors = getFactors(targetNumber);
        const factorPair = factors[Math.floor(Math.random() * factors.length)];
        [num1, num2] = factorPair;
        break;
    }

    return {
      num1,
      num2,
      operation,
      result: targetNumber
    };
  };

  // Sayının çarpanlarını bul
  const getFactors = (number) => {
    const factors = [];
    for (let i = 1; i <= Math.sqrt(number); i++) {
      if (number % i === 0) {
        factors.push([i, number / i]);
      }
    }
    return factors;
  };

  // Sayı seçildiğinde
  const handleNumberSelection = (number) => {
    if (selectedNumbers.includes(number)) {
      Alert.alert('⚠️ Uyarı', 'Bu sayı zaten seçildi!');
      return;
    }

    if (number === currentProblem.result) {
      setSelectedNumbers([...selectedNumbers, number]);
      setScore(score + 10);
      
      if (selectedNumbers.length + 1 === gameBoard.length) {
        Alert.alert(
          '🎉 Tebrikler!',
          `Oyunu tamamladınız!\nToplam Puan: ${score + 10}`,
          [{ text: 'Yeni Oyun', onPress: startNewGame }]
        );
      } else {
        Alert.alert('✨ Doğru!', '+10 puan kazandınız!');
        createNewProblem(gameBoard);
      }
    } else {
      Alert.alert('❌ Yanlış', 'Tekrar deneyin!');
      setScore(Math.max(0, score - 5));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <MaterialCommunityIcons name="calculator-variant" size={40} color="#6C63FF" />
          <Text style={styles.title}>Matematik Tombala</Text>
        </View>

        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>Puan: {score}</Text>
          <TouchableOpacity
            style={styles.newGameButton}
            onPress={startNewGame}
          >
            <MaterialCommunityIcons name="refresh" size={24} color="white" />
            <Text style={styles.buttonText}>Yeni Oyun</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.problemContainer}>
          <Text style={styles.problemText}>
            {currentProblem ? `${currentProblem.num1} ${currentProblem.operation} ${currentProblem.num2} = ?` : ''}
          </Text>
        </View>

        <View style={styles.gridContainer}>
          {Array(4).fill().map((_, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {Array(4).fill().map((_, colIndex) => {
                const number = gameBoard[rowIndex * 4 + colIndex];
                const isSelected = selectedNumbers.includes(number);
                
                return (
                  <TouchableOpacity
                    key={colIndex}
                    style=[
                      styles.numberBox,
                      isSelected && styles.selectedNumber,
                    ]
                    onPress={() => handleNumberSelection(number)}
                  >
                    <Text
                      style=[
                        styles.numberText,
                        isSelected && styles.selectedNumberText,
                      ]
                    >
                      {number}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>

        <View style={styles.rulesContainer}>
          <Text style={styles.rulesTitle}>
            <MaterialCommunityIcons name="information" size={20} color="#2D3748" />
            {' '}Nasıl Oynanır?
          </Text>
          <Text style={styles.rulesText}>
            • Verilen işlemi çözün{'
'}
            • Sonucu tabloda bulup tıklayın{'
'}
            • Doğru cevap: +10 puan{'
'}
            • Yanlış cevap: -5 puan{'
'}
            • Tüm sayıları bularak oyunu tamamlayın
          </Text>
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
  problemContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
    alignItems: 'center',
  },
  problemText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  gridContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  numberBox: {
    width: '23%',
    aspectRatio: 1,
    backgroundColor: '#EDF2F7',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
  },
  selectedNumber: {
    backgroundColor: '#6C63FF',
  },
  numberText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  selectedNumberText: {
    color: 'white',
  },
  rulesContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    elevation: 2,
  },
  rulesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 10,
  },
  rulesText: {
    fontSize: 16,
    color: '#4A5568',
    lineHeight: 24,
  },
});

export default SettingsScreen;
