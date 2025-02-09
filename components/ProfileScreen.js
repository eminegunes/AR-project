import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Canvas, Fill, RoundedRect } from '@shopify/react-native-skia';

const ProfileScreen = () => {
  const [carCounts, setCarCounts] = useState({
    blue: 0,
    green: 0,
    orange: 0,
  });
  const [guesses, setGuesses] = useState({
    blue: '',
    green: '',
    orange: '',
  });
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    generateNewGame();
  }, []);

  const generateNewGame = () => {
    const newCounts = {
      blue: Math.floor(Math.random() * 10) + 3,
      green: Math.floor(Math.random() * 10) + 3,
      orange: Math.floor(Math.random() * 10) + 3,
    };
    setCarCounts(newCounts);
    setGuesses({ blue: '', green: '', orange: '' });
    setSubmitted(false);
  };

  const calculatePercentage = (count) => {
    const total = carCounts.blue + carCounts.green + carCounts.orange;
    return ((count / total) * 100).toFixed(1);
  };

  const handleGuessChange = (color, value) => {
    if (value === '' || (parseFloat(value) >= 0 && parseFloat(value) <= 100)) {
      setGuesses({ ...guesses, [color]: value });
    }
  };

  const checkGuesses = () => {
    if (!guesses.blue || !guesses.green || !guesses.orange) {
      Alert.alert('⚠️ Uyarı', 'Lütfen tüm yüzdeleri girin!');
      return;
    }

    const guessSum = parseFloat(guesses.blue) + parseFloat(guesses.green) + parseFloat(guesses.orange);
    if (Math.abs(guessSum - 100) > 0.1) {
      Alert.alert('⚠️ Uyarı', 'Yüzdelerin toplamı 100 olmalıdır!');
      return;
    }

    let points = 0;
    let feedback = '';

    Object.keys(carCounts).forEach(color => {
      const actualPercentage = parseFloat(calculatePercentage(carCounts[color]));
      const guessedPercentage = parseFloat(guesses[color]);
      const difference = Math.abs(actualPercentage - guessedPercentage);

      if (difference < 0.1) {
        points += 10;
        feedback += `${color.charAt(0).toUpperCase() + color.slice(1)}: Tam isabet! (+10 puan)\n`;
      } else if (difference <= 5) {
        points += 5;
        feedback += `${color.charAt(0).toUpperCase() + color.slice(1)}: Çok yakın! (+5 puan)\n`;
      } else if (difference <= 10) {
        points += 2;
        feedback += `${color.charAt(0).toUpperCase() + color.slice(1)}: Yakın! (+2 puan)\n`;
      } else {
        feedback += `${color.charAt(0).toUpperCase() + color.slice(1)}: Uzak! (0 puan)\n`;
      }
    });

    setScore(score + points);
    setSubmitted(true);

    Alert.alert(
      '🎯 Sonuçlar',
      `${feedback}\nKazanılan Puan: ${points}\nToplam Puan: ${score + points}`,
      [{ text: 'Yeni Oyun', onPress: generateNewGame }]
    );
  };

  const renderCarCard = (color) => {
    const colorMap = {
      blue: '#4299E1',
      green: '#48BB78',
      orange: '#F6AD55',
    };

    const colorNames = {
      blue: 'Mavi',
      green: 'Yeşil',
      orange: 'Turuncu',
    };

    return (
      <View style={[styles.carCard, { borderColor: colorMap[color] }]}>        
        <Canvas style={{ width: 100, height: 100 }}>
          <Fill color={colorMap[color]} />
          <RoundedRect x={10} y={10} width={80} height={80} r={15} />
        </Canvas>
        <View style={styles.carHeader}>
          <MaterialCommunityIcons 
            name="car" 
            size={30} 
            color={colorMap[color]} 
          />
          <Text style={[styles.carTitle, { color: colorMap[color] }]}>            
            {colorNames[color]} Arabalar
          </Text>
        </View>

        <View style={styles.carInfo}>
          <Text style={styles.countText}>Sayı: {carCounts[color]}</Text>
          {submitted && (
            <Text style={styles.percentageText}>
              Gerçek: %{calculatePercentage(carCounts[color])}
            </Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            keyboardType="decimal-pad"
            value={guesses[color]}
            onChangeText={(value) => handleGuessChange(color, value)}
            placeholder="% Tahmin"
            placeholderTextColor="#A0AEC0"
            maxLength={5}
          />
          <Text style={styles.percentSymbol}>%</Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="car-multiple" size={40} color="#2B6CB0" />
        <Text style={styles.title}>Araba Yüzdeleri</Text>
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

      {renderCarCard('blue')}
      {renderCarCard('green')}
      {renderCarCard('orange')}

      <TouchableOpacity
        style={styles.checkButton}
        onPress={checkGuesses}
      >
        <MaterialCommunityIcons name="check-circle" size={24} color="white" />
        <Text style={styles.buttonText}>Tahminleri Kontrol Et</Text>
      </TouchableOpacity>
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
    backgroundColor: '#4299E1',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
  },
  carCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    borderLeftWidth: 5,
  },
  carHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  carTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  carInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  countText: {
    fontSize: 16,
    color: '#4A5568',
    fontWeight: 'bold',
  },
  percentageText: {
    fontSize: 16,
    color: '#48BB78',
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#EDF2F7',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: '#2D3748',
  },
  percentSymbol: {
    marginLeft: 8,
    fontSize: 16,
    color: '#4A5568',
    fontWeight: 'bold',
  },
  checkButton: {
    backgroundColor: '#48BB78',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 5,
  },
});

export default ProfileScreen;